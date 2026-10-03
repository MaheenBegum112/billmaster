package com.market.billing.dto;

import java.util.List;

public class ProductForecastDto {

    private Long productId;
    private String productName;
    private String category;
    private int forecastPeriodDays;
    private double forecastQuantity;
    private double historicalDailyAverage;
    private double recentDailyAverage;
    private String trend; // INCREASING, DECREASING, STABLE, INSUFFICIENT DATA
    private String dataQuality; // SUFFICIENT, LIMITED, INSUFFICIENT
    private int confidenceScorePercent;
    private int recommendedSafetyInventory;
    private String reason;
    private List<ForecastDataPointDto> timeline;

    public ProductForecastDto() {
    }

    public ProductForecastDto(Long productId, String productName, String category, int forecastPeriodDays,
                              double forecastQuantity, double historicalDailyAverage, double recentDailyAverage,
                              String trend, String dataQuality, int confidenceScorePercent,
                              int recommendedSafetyInventory, String reason, List<ForecastDataPointDto> timeline) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.forecastPeriodDays = forecastPeriodDays;
        this.forecastQuantity = forecastQuantity;
        this.historicalDailyAverage = historicalDailyAverage;
        this.recentDailyAverage = recentDailyAverage;
        this.trend = trend;
        this.dataQuality = dataQuality;
        this.confidenceScorePercent = confidenceScorePercent;
        this.recommendedSafetyInventory = recommendedSafetyInventory;
        this.reason = reason;
        this.timeline = timeline;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public int getForecastPeriodDays() {
        return forecastPeriodDays;
    }

    public void setForecastPeriodDays(int forecastPeriodDays) {
        this.forecastPeriodDays = forecastPeriodDays;
    }

    public double getForecastQuantity() {
        return forecastQuantity;
    }

    public void setForecastQuantity(double forecastQuantity) {
        this.forecastQuantity = forecastQuantity;
    }

    public double getHistoricalDailyAverage() {
        return historicalDailyAverage;
    }

    public void setHistoricalDailyAverage(double historicalDailyAverage) {
        this.historicalDailyAverage = historicalDailyAverage;
    }

    public double getRecentDailyAverage() {
        return recentDailyAverage;
    }

    public void setRecentDailyAverage(double recentDailyAverage) {
        this.recentDailyAverage = recentDailyAverage;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public String getDataQuality() {
        return dataQuality;
    }

    public void setDataQuality(String dataQuality) {
        this.dataQuality = dataQuality;
    }

    public int getConfidenceScorePercent() {
        return confidenceScorePercent;
    }

    public void setConfidenceScorePercent(int confidenceScorePercent) {
        this.confidenceScorePercent = confidenceScorePercent;
    }

    public int getRecommendedSafetyInventory() {
        return recommendedSafetyInventory;
    }

    public void setRecommendedSafetyInventory(int recommendedSafetyInventory) {
        this.recommendedSafetyInventory = recommendedSafetyInventory;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<ForecastDataPointDto> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<ForecastDataPointDto> timeline) {
        this.timeline = timeline;
    }
}
