package com.market.billing.dto;

public class CategoryRevenueDto {

    private String category;
    private double revenue;
    private long unitsSold;

    public CategoryRevenueDto() {
    }

    public CategoryRevenueDto(String category, double revenue, long unitsSold) {
        this.category = category;
        this.revenue = revenue;
        this.unitsSold = unitsSold;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public long getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(long unitsSold) {
        this.unitsSold = unitsSold;
    }
}
