package com.market.billing.controller;

import com.market.billing.dto.*;
import com.market.billing.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardSummaryDto> getAdminSummary() {
        return ResponseEntity.ok(reportService.getAdminDashboardSummary());
    }

    @GetMapping("/cashier-summary")
    @PreAuthorize("hasAnyRole('CASHIER', 'ADMIN')")
    public ResponseEntity<CashierDashboardDto> getCashierSummary(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reportService.getCashierDashboard(userDetails.getUsername()));
    }

    @GetMapping("/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SalesTimeSeriesPoint>> getDailyReport(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(reportService.getDailySales(days));
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SalesTimeSeriesPoint>> getMonthlyReport(@RequestParam(defaultValue = "6") int months) {
        return ResponseEntity.ok(reportService.getMonthlySales(months));
    }

    @GetMapping("/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TopProductReportDto>> getTopProducts(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(reportService.getTopProducts(limit));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategoryRevenueDto>> getCategoryBreakdown() {
        return ResponseEntity.ok(reportService.getCategoryBreakdown());
    }
}
