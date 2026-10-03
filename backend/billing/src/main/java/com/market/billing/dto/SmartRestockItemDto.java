package com.market.billing.dto;

public class SmartRestockItemDto {

    private Long productId;
    private String barcode;
    private String productName;
    private String category;
    private Integer currentStock;
    private Integer minimumStock;
    private Long totalQuantitySold;
    private Long salesDays;
    private Double averageDailySales;
    private Double daysRemaining;
    private Double smartRestockLevel;
    private Integer recommendedRestockQuantity;
    private String status; // CRITICAL, RESTOCK SOON, HEALTHY, OUT OF STOCK
    private String explanation;
    private boolean hasSalesHistory;

    public SmartRestockItemDto() {
    }

    public SmartRestockItemDto(Long productId, String barcode, String productName, String category,
                               Integer currentStock, Integer minimumStock, Long totalQuantitySold,
                               Long salesDays, Double averageDailySales, Double daysRemaining,
                               Double smartRestockLevel, Integer recommendedRestockQuantity,
                               String status, String explanation, boolean hasSalesHistory) {
        this.productId = productId;
        this.barcode = barcode;
        this.productName = productName;
        this.category = category;
        this.currentStock = currentStock;
        this.minimumStock = minimumStock;
        this.totalQuantitySold = totalQuantitySold;
        this.salesDays = salesDays;
        this.averageDailySales = averageDailySales;
        this.daysRemaining = daysRemaining;
        this.smartRestockLevel = smartRestockLevel;
        this.recommendedRestockQuantity = recommendedRestockQuantity;
        this.status = status;
        this.explanation = explanation;
        this.hasSalesHistory = hasSalesHistory;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(Integer minimumStock) {
        this.minimumStock = minimumStock;
    }

    public Long getTotalQuantitySold() {
        return totalQuantitySold;
    }

    public void setTotalQuantitySold(Long totalQuantitySold) {
        this.totalQuantitySold = totalQuantitySold;
    }

    public Long getSalesDays() {
        return salesDays;
    }

    public void setSalesDays(Long salesDays) {
        this.salesDays = salesDays;
    }

    public Double getAverageDailySales() {
        return averageDailySales;
    }

    public void setAverageDailySales(Double averageDailySales) {
        this.averageDailySales = averageDailySales;
    }

    public Double getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(Double daysRemaining) {
        this.daysRemaining = daysRemaining;
    }

    public Double getSmartRestockLevel() {
        return smartRestockLevel;
    }

    public void setSmartRestockLevel(Double smartRestockLevel) {
        this.smartRestockLevel = smartRestockLevel;
    }

    public Integer getRecommendedRestockQuantity() {
        return recommendedRestockQuantity;
    }

    public void setRecommendedRestockQuantity(Integer recommendedRestockQuantity) {
        this.recommendedRestockQuantity = recommendedRestockQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public boolean isHasSalesHistory() {
        return hasSalesHistory;
    }

    public void setHasSalesHistory(boolean hasSalesHistory) {
        this.hasSalesHistory = hasSalesHistory;
    }
}
