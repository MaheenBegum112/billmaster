package com.market.billing.service;

import com.market.billing.dto.BillItemRequest;
import com.market.billing.dto.BillResponse;
import com.market.billing.dto.CreateBillRequest;
import com.market.billing.exception.BadRequestException;
import com.market.billing.exception.InsufficientStockException;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.Bill;
import com.market.billing.model.BillItem;
import com.market.billing.model.Product;
import com.market.billing.model.User;
import com.market.billing.repository.BillRepository;
import com.market.billing.repository.ProductRepository;
import com.market.billing.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public BillService(BillRepository billRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.billRepository = billRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BillResponse createBill(CreateBillRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated cashier not found"));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Cannot generate bill: cart is empty");
        }

        // Generate unique Bill Number: BILL-YYYYMMDD-XXXX
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String billNumber = String.format("BILL-%s-%s", datePart, uniqueSuffix);

        double calculatedSubtotal = 0.0;
        Bill bill = new Bill();
        bill.setBillNumber(billNumber);
        bill.setUser(user);
        bill.setBillDate(LocalDateTime.now());
        bill.setCustomerName(request.getCustomerName() != null ? request.getCustomerName().trim() : "Walk-in Customer");
        bill.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone().trim() : "");
        bill.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().toUpperCase() : "CASH");

        for (BillItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByIdAndIsDeletedFalse(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + itemReq.getProductId() + " not found or deleted"));

            // Stock validation
            if (product.getQuantityInStock() < itemReq.getQuantity()) {
                throw new InsufficientStockException(
                        String.format("Only %d units are available for '%s'. Requested: %d",
                                product.getQuantityInStock(), product.getName(), itemReq.getQuantity())
                );
            }

            // Decrement database stock atomically
            product.setQuantityInStock(product.getQuantityInStock() - itemReq.getQuantity());
            productRepository.save(product);

            // Calculate item total based on authoritative database price
            double itemTotal = Math.round(product.getPrice() * itemReq.getQuantity() * 100.0) / 100.0;
            calculatedSubtotal += itemTotal;

            BillItem billItem = new BillItem(
                    product,
                    product.getName(),
                    itemReq.getQuantity(),
                    product.getPrice(),
                    itemTotal
            );
            bill.addItem(billItem);
        }

        calculatedSubtotal = Math.round(calculatedSubtotal * 100.0) / 100.0;
        double discount = (request.getDiscount() != null && request.getDiscount() > 0)
                ? Math.min(request.getDiscount(), calculatedSubtotal)
                : 0.0;
        discount = Math.round(discount * 100.0) / 100.0;
        double grandTotal = Math.round((calculatedSubtotal - discount) * 100.0) / 100.0;

        bill.setSubtotal(calculatedSubtotal);
        bill.setDiscount(discount);
        bill.setGrandTotal(grandTotal);

        Bill saved = billRepository.save(bill);
        return BillResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getBills(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Bill> bills;
        if (user.getRole() == User.Role.ADMIN) {
            bills = billRepository.findAllByOrderByBillDateDesc();
        } else {
            bills = billRepository.findByUserIdOrderByBillDateDesc(user.getId());
        }

        return bills.stream().map(BillResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BillResponse getBillById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with ID: " + id));

        // Cashiers can only view their own bills; Admins can view any bill
        if (user.getRole() != User.Role.ADMIN && !bill.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to view bills created by other cashiers");
        }

        return BillResponse.fromEntity(bill);
    }

    @Transactional(readOnly = true)
    public BillResponse getBillByNumber(String billNumber, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Bill bill = billRepository.findByBillNumber(billNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with number: " + billNumber));

        if (user.getRole() != User.Role.ADMIN && !bill.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to view this bill");
        }

        return BillResponse.fromEntity(bill);
    }
}
