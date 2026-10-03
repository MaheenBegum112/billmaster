package com.market.billing.dto;

public class ForecastDataPointDto {

    private String date;
    private Double historicalDemand; // null if projected
    private Double projectedDemand;  // null if historical

    public ForecastDataPointDto() {
    }

    public ForecastDataPointDto(String date, Double historicalDemand, Double projectedDemand) {
        this.date = date;
        this.historicalDemand = historicalDemand;
        this.projectedDemand = projectedDemand;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Double getHistoricalDemand() {
        return historicalDemand;
    }

    public void setHistoricalDemand(Double historicalDemand) {
        this.historicalDemand = historicalDemand;
    }

    public Double getProjectedDemand() {
        return projectedDemand;
    }

    public void setProjectedDemand(Double projectedDemand) {
        this.projectedDemand = projectedDemand;
    }
}
