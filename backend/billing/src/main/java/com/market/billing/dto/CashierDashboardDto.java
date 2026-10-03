package com.market.billing.dto;

import java.util.List;

public class CashierDashboardDto {

    private long todayBillsCount;
    private double todayRevenue;
    private long totalBillsCount;
    private double totalRevenue;
    private List<BillResponse> recentBills;

    public CashierDashboardDto() {
    }

    public CashierDashboardDto(long todayBillsCount, double todayRevenue, long totalBillsCount, double totalRevenue, List<BillResponse> recentBills) {
        this.todayBillsCount = todayBillsCount;
        this.todayRevenue = todayRevenue;
        this.totalBillsCount = totalBillsCount;
        this.totalRevenue = totalRevenue;
        this.recentBills = recentBills;
    }

    public long getTodayBillsCount() {
        return todayBillsCount;
    }

    public void setTodayBillsCount(long todayBillsCount) {
        this.todayBillsCount = todayBillsCount;
    }

    public double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public long getTotalBillsCount() {
        return totalBillsCount;
    }

    public void setTotalBillsCount(long totalBillsCount) {
        this.totalBillsCount = totalBillsCount;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<BillResponse> getRecentBills() {
        return recentBills;
    }

    public void setRecentBills(List<BillResponse> recentBills) {
        this.recentBills = recentBills;
    }
}
