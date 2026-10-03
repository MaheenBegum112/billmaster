package com.market.billing.dto;

public class TopProductReportDto {

    private String productName;
    private long unitsSold;
    private double revenue;

    public TopProductReportDto() {
    }

    public TopProductReportDto(String productName, long unitsSold, double revenue) {
        this.productName = productName;
        this.unitsSold = unitsSold;
        this.revenue = revenue;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public long getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(long unitsSold) {
        this.unitsSold = unitsSold;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }
}
