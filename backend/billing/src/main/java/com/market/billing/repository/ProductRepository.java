package com.market.billing.repository;

import com.market.billing.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByBarcode(String barcode);
    long countByQuantityInStockLessThan(int quantity);
}