package com.market.billing.repository;

import com.market.billing.model.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {

    List<BillItem> findByBillId(Long billId);

    // Top selling products overall: [productName, SUM(quantity), SUM(total)]
    @Query("SELECT bi.productName, SUM(bi.quantity), SUM(bi.total) " +
           "FROM BillItem bi GROUP BY bi.productName ORDER BY SUM(bi.quantity) DESC")
    List<Object[]> findTopSellingProducts();

    // Top selling products in date range
    @Query("SELECT bi.productName, SUM(bi.quantity), SUM(bi.total) " +
           "FROM BillItem bi JOIN bi.bill b " +
           "WHERE b.billDate BETWEEN :start AND :end " +
           "GROUP BY bi.productName ORDER BY SUM(bi.quantity) DESC")
    List<Object[]> findTopSellingProductsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Category revenue breakdown
    @Query("SELECT p.category, SUM(bi.total), SUM(bi.quantity) " +
           "FROM BillItem bi JOIN bi.product p " +
           "GROUP BY p.category ORDER BY SUM(bi.total) DESC")
    List<Object[]> findCategoryRevenueBreakdown();

    // Total quantity sold for a product
    @Query("SELECT COALESCE(SUM(bi.quantity), 0) FROM BillItem bi WHERE bi.product.id = :productId")
    Long findTotalQuantitySoldByProduct(@Param("productId") Long productId);

    // Distinct days on which a product was sold
    @Query("SELECT COUNT(DISTINCT DATE(b.billDate)) " +
           "FROM BillItem bi JOIN bi.bill b " +
           "WHERE bi.product.id = :productId")
    Long findDistinctSalesDaysByProduct(@Param("productId") Long productId);

    // Daily quantity sold for a product: [DATE(b.billDate), SUM(bi.quantity)]
    @Query("SELECT DATE(b.billDate), SUM(bi.quantity) " +
           "FROM BillItem bi JOIN bi.bill b " +
           "WHERE bi.product.id = :productId " +
           "GROUP BY DATE(b.billDate) ORDER BY DATE(b.billDate) ASC")
    List<Object[]> findDailySalesByProduct(@Param("productId") Long productId);

    // Daily total units sold across the whole store: [DATE(b.billDate), SUM(bi.quantity), SUM(bi.total)]
    @Query("SELECT DATE(b.billDate), SUM(bi.quantity), SUM(bi.total) " +
           "FROM BillItem bi JOIN bi.bill b " +
           "GROUP BY DATE(b.billDate) ORDER BY DATE(b.billDate) ASC")
    List<Object[]> findDailyStoreSales();
}
