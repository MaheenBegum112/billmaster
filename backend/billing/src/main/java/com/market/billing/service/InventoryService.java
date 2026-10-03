package com.market.billing.service;

import com.market.billing.dto.InventoryItemDto;
import com.market.billing.dto.InventorySummaryDto;
import com.market.billing.dto.ProductResponse;
import com.market.billing.dto.RestockRequest;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.Product;
import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final BillItemRepository billItemRepository;

    public InventoryService(ProductRepository productRepository, BillItemRepository billItemRepository) {
        this.productRepository = productRepository;
        this.billItemRepository = billItemRepository;
    }

    @Transactional(readOnly = true)
    public InventorySummaryDto getInventorySummary() {
        List<Product> products = productRepository.findByIsDeletedFalseOrderByNameAsc();

        long totalProducts = products.size();
        long inStock = 0;
        long lowStock = 0;
        long outOfStock = 0;
        long totalStockUnits = 0;
        double totalValue = 0.0;

        for (Product p : products) {
            int qty = p.getQuantityInStock() != null ? p.getQuantityInStock() : 0;
            totalStockUnits += qty;
            totalValue += qty * p.getPrice();

            if (qty == 0) {
                outOfStock++;
            } else if (qty <= p.getMinimumStock()) {
                lowStock++;
            } else {
                inStock++;
            }
        }

        totalValue = Math.round(totalValue * 100.0) / 100.0;
        return new InventorySummaryDto(totalProducts, inStock, lowStock, outOfStock, totalStockUnits, totalValue);
    }

    @Transactional(readOnly = true)
    public List<InventoryItemDto> getInventoryItems() {
        List<Product> products = productRepository.findByIsDeletedFalseOrderByNameAsc();

        return products.stream().map(p -> {
            Long totalSold = billItemRepository.findTotalQuantitySoldByProduct(p.getId());
            Long salesDays = billItemRepository.findDistinctSalesDaysByProduct(p.getId());

            double velocity = 0.0;
            if (salesDays != null && salesDays > 0 && totalSold != null) {
                velocity = Math.round(((double) totalSold / salesDays) * 10.0) / 10.0;
            }

            return new InventoryItemDto(
                    p.getId(),
                    p.getBarcode(),
                    p.getName(),
                    p.getCategory(),
                    p.getPrice(),
                    p.getQuantityInStock(),
                    p.getMinimumStock(),
                    p.getStockStatus(),
                    totalSold != null ? totalSold : 0L,
                    velocity
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse restockProduct(RestockRequest request) {
        Product product = productRepository.findByIdAndIsDeletedFalse(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        int newStock = product.getQuantityInStock() + request.getQuantity();
        product.setQuantityInStock(newStock);
        Product saved = productRepository.save(product);

        return ProductResponse.fromEntity(saved);
    }
}
