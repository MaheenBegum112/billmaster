package com.market.billing.dto;

import java.util.List;

public class SmartRestockSummaryDto {

    private long productsAnalyzed;
    private long needRestockCount;
    private long criticalCount;
    private long outOfStockCount;
    private int configuredRestockHorizonDays;
    private List<SmartRestockItemDto> items;

    public SmartRestockSummaryDto() {
    }

    public SmartRestockSummaryDto(long productsAnalyzed, long needRestockCount, long criticalCount,
                                 long outOfStockCount, int configuredRestockHorizonDays,
                                 List<SmartRestockItemDto> items) {
        this.productsAnalyzed = productsAnalyzed;
        this.needRestockCount = needRestockCount;
        this.criticalCount = criticalCount;
        this.outOfStockCount = outOfStockCount;
        this.configuredRestockHorizonDays = configuredRestockHorizonDays;
        this.items = items;
    }

    public long getProductsAnalyzed() {
        return productsAnalyzed;
    }

    public void setProductsAnalyzed(long productsAnalyzed) {
        this.productsAnalyzed = productsAnalyzed;
    }

    public long getNeedRestockCount() {
        return needRestockCount;
    }

    public void setNeedRestockCount(long needRestockCount) {
        this.needRestockCount = needRestockCount;
    }

    public long getCriticalCount() {
        return criticalCount;
    }

    public void setCriticalCount(long criticalCount) {
        this.criticalCount = criticalCount;
    }

    public long getOutOfStockCount() {
        return outOfStockCount;
    }

    public void setOutOfStockCount(long outOfStockCount) {
        this.outOfStockCount = outOfStockCount;
    }

    public int getConfiguredRestockHorizonDays() {
        return configuredRestockHorizonDays;
    }

    public void setConfiguredRestockHorizonDays(int configuredRestockHorizonDays) {
        this.configuredRestockHorizonDays = configuredRestockHorizonDays;
    }

    public List<SmartRestockItemDto> getItems() {
        return items;
    }

    public void setItems(List<SmartRestockItemDto> items) {
        this.items = items;
    }
}
