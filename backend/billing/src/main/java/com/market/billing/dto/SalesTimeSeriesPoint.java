package com.market.billing.dto;

public class SalesTimeSeriesPoint {

    private String label;
    private double revenue;
    private long billsCount;
    private long unitsSold;

    public SalesTimeSeriesPoint() {
    }

    public SalesTimeSeriesPoint(String label, double revenue, long billsCount, long unitsSold) {
        this.label = label;
        this.revenue = revenue;
        this.billsCount = billsCount;
        this.unitsSold = unitsSold;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public long getBillsCount() {
        return billsCount;
    }

    public void setBillsCount(long billsCount) {
        this.billsCount = billsCount;
    }

    public long getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(long unitsSold) {
        this.unitsSold = unitsSold;
    }
}
