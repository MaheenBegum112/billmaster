package com.market.billing.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.BillRepository;
import com.market.billing.repository.ProductRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReportController {

    @Autowired private ProductRepository productRepository;
    @Autowired private BillRepository billRepository;
    @Autowired private BillItemRepository billItemRepository;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        long totalProducts = productRepository.count();
        long lowStockCount = productRepository.countByQuantityInStockLessThan(5);
        long totalBills = billRepository.count();
        double todayRevenue = billRepository.getTodayRevenue();
        double totalRevenue = billRepository.findAll()
                .stream().mapToDouble(b -> b.getGrandTotal()).sum();
        double totalDiscount = billRepository.findAll()
                .stream().mapToDouble(b -> b.getDiscount()).sum();

        return Map.of(
            "totalProducts", totalProducts,
            "lowStockCount", lowStockCount,
            "totalBills", totalBills,
            "todayRevenue", todayRevenue,
            "totalRevenue", totalRevenue,
            "totalDiscount", totalDiscount
        );
    }

    @GetMapping("/recent-bills")
    public Object getRecentBills() {
        return billRepository.findTop5ByOrderByIdDesc();
    }

    @GetMapping("/all-bills")
    public Object getAllBills() {
        return billRepository.findAllByOrderByIdDesc();
    }

    @GetMapping("/daily")
    public List<Map<String, Object>> getDailySales() {
        List<Object[]> rows = billRepository.getDailySalesLast7Days();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("date", row[0].toString());
            map.put("billCount", row[1]);
            map.put("revenue", row[2]);
            result.add(map);
        }
        return result;
    }

    @GetMapping("/monthly")
    public List<Map<String, Object>> getMonthlySales() {
        List<Object[]> rows = billRepository.getMonthlySales();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("month", row[0].toString());
            map.put("monthLabel", row[1].toString());
            map.put("billCount", row[2]);
            map.put("revenue", row[3]);
            map.put("grossAmount", row[4]);
            map.put("totalDiscount", row[5]);
            result.add(map);
        }
        return result;
    }

    @GetMapping("/yearly")
    public List<Map<String, Object>> getYearlySales() {
        List<Object[]> rows = billRepository.getYearlySales();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("year", row[0].toString());
            map.put("billCount", row[1]);
            map.put("revenue", row[2]);
            map.put("grossAmount", row[3]);
            map.put("totalDiscount", row[4]);
            result.add(map);
        }
        return result;
    }

    @GetMapping("/weekly")
    public List<Map<String, Object>> getWeeklyTrend() {
        List<Object[]> rows = billRepository.getWeeklyTrend();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("week", row[0].toString());
            map.put("weekLabel", row[1].toString());
            map.put("billCount", row[2]);
            map.put("revenue", row[3]);
            result.add(map);
        }
        return result;
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        List<Object[]> rows = billItemRepository.getTopProducts();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("name", row[0].toString());
            map.put("totalSold", row[1]);
            map.put("totalRevenue", row[2]);
            result.add(map);
        }
        return result;
    }
}