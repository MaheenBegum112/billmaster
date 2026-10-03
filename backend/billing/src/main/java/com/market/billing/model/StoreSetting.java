package com.market.billing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "store_settings")
public class StoreSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_name", nullable = false)
    private String storeName = "BillMaster Supermarket";

    @Column(name = "store_address", nullable = false)
    private String storeAddress = "100 Market Boulevard, Metro City";

    @Column(name = "store_phone", nullable = false)
    private String storePhone = "+1 (800) 555-BILL";

    @Column(nullable = false)
    private String currency = "$";

    @Column(name = "tax_rate", nullable = false)
    private Double taxRate = 5.0;

    @Column(name = "default_discount", nullable = false)
    private Double defaultDiscount = 0.0;

    @Column(name = "restock_horizon_days", nullable = false)
    private Integer restockHorizonDays = 3;

    @Column(name = "anomaly_threshold_sigma", nullable = false)
    private Double anomalyThresholdSigma = 2.5;

    @Column(name = "forecast_period_days", nullable = false)
    private Integer forecastPeriodDays = 7;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StoreSetting() {
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getStoreAddress() {
        return storeAddress;
    }

    public void setStoreAddress(String storeAddress) {
        this.storeAddress = storeAddress;
    }

    public String getStorePhone() {
        return storePhone;
    }

    public void setStorePhone(String storePhone) {
        this.storePhone = storePhone;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Double getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(Double taxRate) {
        this.taxRate = taxRate;
    }

    public Double getDefaultDiscount() {
        return defaultDiscount;
    }

    public void setDefaultDiscount(Double defaultDiscount) {
        this.defaultDiscount = defaultDiscount;
    }

    public Integer getRestockHorizonDays() {
        return restockHorizonDays;
    }

    public void setRestockHorizonDays(Integer restockHorizonDays) {
        this.restockHorizonDays = restockHorizonDays;
    }

    public Double getAnomalyThresholdSigma() {
        return anomalyThresholdSigma;
    }

    public void setAnomalyThresholdSigma(Double anomalyThresholdSigma) {
        this.anomalyThresholdSigma = anomalyThresholdSigma;
    }

    public Integer getForecastPeriodDays() {
        return forecastPeriodDays;
    }

    public void setForecastPeriodDays(Integer forecastPeriodDays) {
        this.forecastPeriodDays = forecastPeriodDays;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
