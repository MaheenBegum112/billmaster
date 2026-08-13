package com.market.billing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.market.billing.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {

    @Query("SELECT COALESCE(SUM(b.grandTotal), 0) FROM Bill b WHERE DATE(b.billDate) = CURRENT_DATE")
    double getTodayRevenue();

    List<Bill> findTop5ByOrderByIdDesc();
    List<Bill> findAllByOrderByIdDesc();

    // Daily sales last 7 days
    @Query(value = """
        SELECT DATE(bill_date) as date,
               COUNT(*) as billCount,
               SUM(grand_total) as revenue
        FROM bills
        WHERE bill_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(bill_date)
        ORDER BY DATE(bill_date) ASC
        """, nativeQuery = true)
    List<Object[]> getDailySalesLast7Days();

    // Monthly sales last 12 months
    @Query(value = """
        SELECT DATE_FORMAT(bill_date, '%Y-%m') as month,
               DATE_FORMAT(bill_date, '%b %Y') as monthLabel,
               COUNT(*) as billCount,
               SUM(grand_total) as revenue,
               SUM(total_amount) as grossAmount,
               SUM(discount) as totalDiscount
        FROM bills
        WHERE bill_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(bill_date, '%Y-%m'), DATE_FORMAT(bill_date, '%b %Y')
        ORDER BY month ASC
        """, nativeQuery = true)
    List<Object[]> getMonthlySales();

    // Yearly sales
    @Query(value = """
        SELECT YEAR(bill_date) as year,
               COUNT(*) as billCount,
               SUM(grand_total) as revenue,
               SUM(total_amount) as grossAmount,
               SUM(discount) as totalDiscount
        FROM bills
        GROUP BY YEAR(bill_date)
        ORDER BY year ASC
        """, nativeQuery = true)
    List<Object[]> getYearlySales();

    // Weekly trend (last 4 weeks)
    @Query(value = """
        SELECT WEEK(bill_date) as week,
               CONCAT('Week ', WEEK(bill_date)) as weekLabel,
               COUNT(*) as billCount,
               SUM(grand_total) as revenue
        FROM bills
        WHERE bill_date >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
        GROUP BY WEEK(bill_date)
        ORDER BY week ASC
        """, nativeQuery = true)
    List<Object[]> getWeeklyTrend();
}