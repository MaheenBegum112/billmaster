package com.market.billing.dto;

import java.time.LocalDateTime;

public class AISummaryDto {

    private long productsAnalyzed;
    private long salesRecordsAnalyzed;
    private long restockNeededCount;
    private long anomaliesDetectedCount;
    private long increasingDemandCount;
    private long decreasingDemandCount;
    private String restockInsightText;
    private String anomalyInsightText;
    private String forecastInsightText;
    private String overallDataQuality;
    private LocalDateTime lastAnalysisTime;

    public AISummaryDto() {
    }

    public AISummaryDto(long productsAnalyzed, long salesRecordsAnalyzed, long restockNeededCount,
                        long anomaliesDetectedCount, long increasingDemandCount, long decreasingDemandCount,
                        String restockInsightText, String anomalyInsightText, String forecastInsightText,
                        String overallDataQuality, LocalDateTime lastAnalysisTime) {
        this.productsAnalyzed = productsAnalyzed;
        this.salesRecordsAnalyzed = salesRecordsAnalyzed;
        this.restockNeededCount = restockNeededCount;
        this.anomaliesDetectedCount = anomaliesDetectedCount;
        this.increasingDemandCount = increasingDemandCount;
        this.decreasingDemandCount = decreasingDemandCount;
        this.restockInsightText = restockInsightText;
        this.anomalyInsightText = anomalyInsightText;
        this.forecastInsightText = forecastInsightText;
        this.overallDataQuality = overallDataQuality;
        this.lastAnalysisTime = lastAnalysisTime;
    }

    public long getProductsAnalyzed() {
        return productsAnalyzed;
    }

    public void setProductsAnalyzed(long productsAnalyzed) {
        this.productsAnalyzed = productsAnalyzed;
    }

    public long getSalesRecordsAnalyzed() {
        return salesRecordsAnalyzed;
    }

    public void setSalesRecordsAnalyzed(long salesRecordsAnalyzed) {
        this.salesRecordsAnalyzed = salesRecordsAnalyzed;
    }

    public long getRestockNeededCount() {
        return restockNeededCount;
    }

    public void setRestockNeededCount(long restockNeededCount) {
        this.restockNeededCount = restockNeededCount;
    }

    public long getAnomaliesDetectedCount() {
        return anomaliesDetectedCount;
    }

    public void setAnomaliesDetectedCount(long anomaliesDetectedCount) {
        this.anomaliesDetectedCount = anomaliesDetectedCount;
    }

    public long getIncreasingDemandCount() {
        return increasingDemandCount;
    }

    public void setIncreasingDemandCount(long increasingDemandCount) {
        this.increasingDemandCount = increasingDemandCount;
    }

    public long getDecreasingDemandCount() {
        return decreasingDemandCount;
    }

    public void setDecreasingDemandCount(long decreasingDemandCount) {
        this.decreasingDemandCount = decreasingDemandCount;
    }

    public String getRestockInsightText() {
        return restockInsightText;
    }

    public void setRestockInsightText(String restockInsightText) {
        this.restockInsightText = restockInsightText;
    }

    public String getAnomalyInsightText() {
        return anomalyInsightText;
    }

    public void setAnomalyInsightText(String anomalyInsightText) {
        this.anomalyInsightText = anomalyInsightText;
    }

    public String getForecastInsightText() {
        return forecastInsightText;
    }

    public void setForecastInsightText(String forecastInsightText) {
        this.forecastInsightText = forecastInsightText;
    }

    public String getOverallDataQuality() {
        return overallDataQuality;
    }

    public void setOverallDataQuality(String overallDataQuality) {
        this.overallDataQuality = overallDataQuality;
    }

    public LocalDateTime getLastAnalysisTime() {
        return lastAnalysisTime;
    }

    public void setLastAnalysisTime(LocalDateTime lastAnalysisTime) {
        this.lastAnalysisTime = lastAnalysisTime;
    }
}
