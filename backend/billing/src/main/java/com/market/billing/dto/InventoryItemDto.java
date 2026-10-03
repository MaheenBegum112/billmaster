package com.market.billing.dto;

public class InventoryItemDto {

    private Long id;
    private String barcode;
    private String name;
    private String category;
    private Double price;
    private Integer currentStock;
    private Integer minimumStock;
    private String status;
    private Long totalUnitsSold;
    private Double salesVelocityDaily;

    public InventoryItemDto() {
    }

    public InventoryItemDto(Long id, String barcode, String name, String category, Double price,
                            Integer currentStock, Integer minimumStock, String status,
                            Long totalUnitsSold, Double salesVelocityDaily) {
        this.id = id;
        this.barcode = barcode;
        this.name = name;
        this.category = category;
        this.price = price;
        this.currentStock = currentStock;
        this.minimumStock = minimumStock;
        this.status = status;
        this.totalUnitsSold = totalUnitsSold;
        this.salesVelocityDaily = salesVelocityDaily;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getTotalUnitsSold() {
        return totalUnitsSold;
    }

    public void setTotalUnitsSold(Long totalUnitsSold) {
        this.totalUnitsSold = totalUnitsSold;
    }

    public Double getSalesVelocityDaily() {
        return salesVelocityDaily;
    }

    public void setSalesVelocityDaily(Double salesVelocityDaily) {
        this.salesVelocityDaily = salesVelocityDaily;
    }
}
