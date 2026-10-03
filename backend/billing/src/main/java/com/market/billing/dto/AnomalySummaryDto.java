package com.market.billing.dto;

import java.util.List;

public class AnomalySummaryDto {

    private long totalAnomalies;
    private long highSeverityCount;
    private long mediumSeverityCount;
    private long lowSeverityCount;
    private double thresholdSigma;
    private List<AnomalyItemDto> anomalies;

    public AnomalySummaryDto() {
    }

    public AnomalySummaryDto(long totalAnomalies, long highSeverityCount, long mediumSeverityCount,
                             long lowSeverityCount, double thresholdSigma, List<AnomalyItemDto> anomalies) {
        this.totalAnomalies = totalAnomalies;
        this.highSeverityCount = highSeverityCount;
        this.mediumSeverityCount = mediumSeverityCount;
        this.lowSeverityCount = lowSeverityCount;
        this.thresholdSigma = thresholdSigma;
        this.anomalies = anomalies;
    }

    public long getTotalAnomalies() {
        return totalAnomalies;
    }

    public void setTotalAnomalies(long totalAnomalies) {
        this.totalAnomalies = totalAnomalies;
    }

    public long getHighSeverityCount() {
        return highSeverityCount;
    }

    public void setHighSeverityCount(long highSeverityCount) {
        this.highSeverityCount = highSeverityCount;
    }

    public long getMediumSeverityCount() {
        return mediumSeverityCount;
    }

    public void setMediumSeverityCount(long mediumSeverityCount) {
        this.mediumSeverityCount = mediumSeverityCount;
    }

    public long getLowSeverityCount() {
        return lowSeverityCount;
    }

    public void setLowSeverityCount(long lowSeverityCount) {
        this.lowSeverityCount = lowStockSeverity(lowSeverityCount);
    }

    private long lowStockSeverity(long c) {
        return c;
    }

    public double getThresholdSigma() {
        return thresholdSigma;
    }

    public void setThresholdSigma(double thresholdSigma) {
        this.thresholdSigma = thresholdSigma;
    }

    public List<AnomalyItemDto> getAnomalies() {
        return anomalies;
    }

    public void setAnomalies(List<AnomalyItemDto> anomalies) {
        this.anomalies = anomalies;
    }
}
