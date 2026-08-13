package com.market.billing.service;

import com.market.billing.dto.BillRequest;
import com.market.billing.model.*;
import com.market.billing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BillService {

    @Autowired private ProductRepository productRepository;
    @Autowired private BillRepository billRepository;

    public Bill createBill(BillRequest request) {
        List<BillItem> billItems = new ArrayList<>();
        double total = 0;

        Bill bill = new Bill();

        for (BillRequest.ItemDTO dto : request.getItems()) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantityInStock() < dto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            product.setQuantityInStock(product.getQuantityInStock() - dto.getQuantity());
            productRepository.save(product);

            BillItem item = new BillItem();
            item.setBill(bill);
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setQuantity(dto.getQuantity());
            item.setPriceAtSale(product.getPrice());
            billItems.add(item);

            total += product.getPrice() * dto.getQuantity();
        }

        double grandTotal = total - request.getDiscount();

        bill.setItems(billItems);
        bill.setTotalAmount(total);
        bill.setDiscount(request.getDiscount());
        bill.setGrandTotal(grandTotal);

        return billRepository.save(bill);
    }
}