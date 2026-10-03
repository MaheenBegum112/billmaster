package com.market.billing.dto;

public class AnomalyItemDto {

    private Long productId;
    private String productName;
    private String category;
    private String date;
    private double actualSales;
    private double expectedSales;
    private double difference;
    private double deviationPercentage;
    private double zScore;
    private String severity; // LOW, MEDIUM, HIGH
    private String anomalyType; // SPIKE, DROP
    private String explanation;

    public AnomalyItemDto() {
    }

    public AnomalyItemDto(Long productId, String productName, String category, String date,
                          double actualSales, double expectedSales, double difference,
                          double deviationPercentage, double zScore, String severity,
                          String anomalyType, String explanation) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.date = date;
        this.actualSales = actualSales;
        this.expectedSales = expectedSales;
        this.difference = difference;
        this.deviationPercentage = deviationPercentage;
        this.zScore = zScore;
        this.severity = severity;
        this.anomalyType = anomalyType;
        this.explanation = explanation;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getActualSales() {
        return actualSales;
    }

    public void setActualSales(double actualSales) {
        this.actualSales = actualSales;
    }

    public double getExpectedSales() {
        return expectedSales;
    }

    public void setExpectedSales(double expectedSales) {
        this.expectedSales = expectedSales;
    }

    public double getDifference() {
        return difference;
    }

    public void setDifference(double difference) {
        this.difference = difference;
    }

    public double getDeviationPercentage() {
        return deviationPercentage;
    }

    public void setDeviationPercentage(double deviationPercentage) {
        this.deviationPercentage = deviationPercentage;
    }

    public double getzScore() {
        return zScore;
    }

    public void setzScore(double zScore) {
        this.zScore = zScore;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getAnomalyType() {
        return anomalyType;
    }

    public void setAnomalyType(String anomalyType) {
        this.anomalyType = anomalyType;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
