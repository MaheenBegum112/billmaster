package com.market.billing.dto;

public class InventorySummaryDto {

    private long totalProducts;
    private long inStockCount;
    private long lowStockCount;
    private long outOfStockCount;
    private long totalStockUnits;
    private double totalInventoryValue;

    public InventorySummaryDto() {
    }

    public InventorySummaryDto(long totalProducts, long inStockCount, long lowStockCount,
                               long outOfStockCount, long totalStockUnits, double totalInventoryValue) {
        this.totalProducts = totalProducts;
        this.inStockCount = inStockCount;
        this.lowStockCount = lowStockCount;
        this.outOfStockCount = outOfStockCount;
        this.totalStockUnits = totalStockUnits;
        this.totalInventoryValue = totalInventoryValue;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getInStockCount() {
        return inStockCount;
    }

    public void setInStockCount(long inStockCount) {
        this.inStockCount = inStockCount;
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

    public long getTotalStockUnits() {
        return totalStockUnits;
    }

    public void setTotalStockUnits(long totalStockUnits) {
        this.totalStockUnits = totalStockUnits;
    }

    public double getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(double totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }
}
