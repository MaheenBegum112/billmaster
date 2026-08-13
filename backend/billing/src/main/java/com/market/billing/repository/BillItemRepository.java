package com.market.billing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.market.billing.model.BillItem;

public interface BillItemRepository extends JpaRepository<BillItem, Long> {

    // Top 5 most sold products
    @Query(value = """
        SELECT product_name,
               SUM(quantity) as totalSold,
               SUM(quantity * price_at_sale) as totalRevenue
        FROM bill_items
        GROUP BY product_name
        ORDER BY totalSold DESC
        LIMIT 5
        """, nativeQuery = true)
    List<Object[]> getTopProducts();
}