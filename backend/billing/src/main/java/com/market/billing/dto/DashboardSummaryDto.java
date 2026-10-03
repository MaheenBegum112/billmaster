package com.market.billing.dto;

public class DashboardSummaryDto {

    private long totalProducts;
    private long totalBills;
    private double todayRevenue;
    private double totalRevenue;
    private long todaySalesUnits;
    private long lowStockCount;
    private long outOfStockCount;
    private double totalDiscounts;
    private long todayBillsCount;

    public DashboardSummaryDto() {
    }

    public DashboardSummaryDto(long totalProducts, long totalBills, double todayRevenue, double totalRevenue,
                               long todaySalesUnits, long lowStockCount, long outOfStockCount,
                               double totalDiscounts, long todayBillsCount) {
        this.totalProducts = totalProducts;
        this.totalBills = totalBills;
        this.todayRevenue = todayRevenue;
        this.totalRevenue = totalRevenue;
        this.todaySalesUnits = todaySalesUnits;
        this.lowStockCount = lowStockCount;
        this.outOfStockCount = outOfStockCount;
        this.totalDiscounts = totalDiscounts;
        this.todayBillsCount = todayBillsCount;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalBills() {
        return totalBills;
    }

    public void setTotalBills(long totalBills) {
        this.totalBills = totalBills;
    }

    public double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTodaySalesUnits() {
        return todaySalesUnits;
    }

    public void setTodaySalesUnits(long todaySalesUnits) {
        this.todaySalesUnits = todaySalesUnits;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getOutOfStockCount() {
        return outOfStockCount;
    }

    public void setOutOfStockCount(long outOfStockCount) {
        this.outOfStockCount = outOfStockCount;
    }

    public double getTotalDiscounts() {
        return totalDiscounts;
    }

    public void setTotalDiscounts(double totalDiscounts) {
        this.totalDiscounts = totalDiscounts;
    }

    public long getTodayBillsCount() {
        return todayBillsCount;
    }

    public void setTodayBillsCount(long todayBillsCount) {
        this.todayBillsCount = todayBillsCount;
    }
}
