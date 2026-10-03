package com.market.billing.service;

import com.market.billing.dto.*;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.Bill;
import com.market.billing.model.User;
import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.BillRepository;
import com.market.billing.repository.ProductRepository;
import com.market.billing.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReportService(BillRepository billRepository,
                         BillItemRepository billItemRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.billRepository = billRepository;
        this.billItemRepository = billItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getAdminDashboardSummary() {
        long totalProducts = productRepository.countActiveProducts();
        long lowStock = productRepository.countLowStockProducts();
        long outOfStock = productRepository.countOutOfStockProducts();
        long totalBills = billRepository.count();

        Double totalRevenue = billRepository.sumAllGrandTotal();
        Double totalDiscounts = billRepository.sumAllDiscount();

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        long todayBills = billRepository.countByBillDateBetween(startOfToday, endOfToday);
        Double todayRevenue = billRepository.sumGrandTotalByBillDateBetween(startOfToday, endOfToday);

        // Count today units sold
        List<Bill> todaysBills = billRepository.findByBillDateBetween(startOfToday, endOfToday);
        long todaySalesUnits = todaysBills.stream()
                .flatMap(b -> b.getItems().stream())
                .mapToLong(item -> item.getQuantity() != null ? item.getQuantity() : 0)
                .sum();

        return new DashboardSummaryDto(
                totalProducts,
                totalBills,
                todayRevenue != null ? Math.round(todayRevenue * 100.0) / 100.0 : 0.0,
                totalRevenue != null ? Math.round(totalRevenue * 100.0) / 100.0 : 0.0,
                todaySalesUnits,
                lowStock,
                outOfStock,
                totalDiscounts != null ? Math.round(totalDiscounts * 100.0) / 100.0 : 0.0,
                todayBills
        );
    }

    @Transactional(readOnly = true)
    public CashierDashboardDto getCashierDashboard(String cashierEmail) {
        User user = userRepository.findByEmail(cashierEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Cashier not found"));

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);

        long todayBillsCount = billRepository.countByUserIdAndBillDateBetween(user.getId(), startOfToday, endOfToday);
        Double todayRevenue = billRepository.sumGrandTotalByUserIdAndBillDateBetween(user.getId(), startOfToday, endOfToday);

        List<Bill> userBills = billRepository.findByUserIdOrderByBillDateDesc(user.getId());
        long totalBillsCount = userBills.size();
        double totalRevenue = userBills.stream().mapToDouble(Bill::getGrandTotal).sum();

        List<BillResponse> recent = userBills.stream()
                .limit(5)
                .map(BillResponse::fromEntity)
                .collect(Collectors.toList());

        return new CashierDashboardDto(
                todayBillsCount,
                todayRevenue != null ? Math.round(todayRevenue * 100.0) / 100.0 : 0.0,
                totalBillsCount,
                Math.round(totalRevenue * 100.0) / 100.0,
                recent
        );
    }

    @Transactional(readOnly = true)
    public List<SalesTimeSeriesPoint> getDailySales(int days) {
        if (days <= 0) days = 7;
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        List<Bill> bills = billRepository.findByBillDateBetween(start, end);

        Map<LocalDate, List<Bill>> grouped = bills.stream()
                .collect(Collectors.groupingBy(b -> b.getBillDate().toLocalDate()));

        List<SalesTimeSeriesPoint> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<Bill> dayBills = grouped.getOrDefault(date, Collections.emptyList());
            double rev = dayBills.stream().mapToDouble(Bill::getGrandTotal).sum();
            long billsCount = dayBills.size();
            long units = dayBills.stream().flatMap(b -> b.getItems().stream()).mapToLong(i -> i.getQuantity() != null ? i.getQuantity() : 0).sum();

            result.add(new SalesTimeSeriesPoint(
                    date.format(formatter),
                    Math.round(rev * 100.0) / 100.0,
                    billsCount,
                    units
            ));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<SalesTimeSeriesPoint> getMonthlySales(int months) {
        if (months <= 0) months = 6;
        LocalDate now = LocalDate.now();
        LocalDate startMonth = now.minusMonths(months - 1).withDayOfMonth(1);

        LocalDateTime start = startMonth.atStartOfDay();
        LocalDateTime end = now.atTime(LocalTime.MAX);

        List<Bill> bills = billRepository.findByBillDateBetween(start, end);

        Map<String, List<Bill>> grouped = bills.stream()
                .collect(Collectors.groupingBy(b -> b.getBillDate().format(DateTimeFormatter.ofPattern("yyyy-MM"))));

        List<SalesTimeSeriesPoint> result = new ArrayList<>();
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = months - 1; i >= 0; i--) {
            LocalDate m = now.minusMonths(i);
            String key = m.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            List<Bill> monthBills = grouped.getOrDefault(key, Collections.emptyList());

            double rev = monthBills.stream().mapToDouble(Bill::getGrandTotal).sum();
            long billsCount = monthBills.size();
            long units = monthBills.stream().flatMap(b -> b.getItems().stream()).mapToLong(it -> it.getQuantity() != null ? it.getQuantity() : 0).sum();

            result.add(new SalesTimeSeriesPoint(
                    m.format(labelFormatter),
                    Math.round(rev * 100.0) / 100.0,
                    billsCount,
                    units
            ));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<TopProductReportDto> getTopProducts(int limit) {
        List<Object[]> raw = billItemRepository.findTopSellingProducts();
        int max = limit > 0 ? limit : 5;

        return raw.stream().limit(max).map(arr -> {
            String name = (String) arr[0];
            Number qty = (Number) arr[1];
            Number rev = (Number) arr[2];

            return new TopProductReportDto(
                    name,
                    qty != null ? qty.longValue() : 0L,
                    rev != null ? Math.round(rev.doubleValue() * 100.0) / 100.0 : 0.0
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryRevenueDto> getCategoryBreakdown() {
        List<Object[]> raw = billItemRepository.findCategoryRevenueBreakdown();

        return raw.stream().map(arr -> {
            String cat = (String) arr[0];
            Number rev = (Number) arr[1];
            Number qty = (Number) arr[2];

            return new CategoryRevenueDto(
                    cat != null ? cat : "General",
                    rev != null ? Math.round(rev.doubleValue() * 100.0) / 100.0 : 0.0,
                    qty != null ? qty.longValue() : 0L
            );
        }).collect(Collectors.toList());
    }
}
