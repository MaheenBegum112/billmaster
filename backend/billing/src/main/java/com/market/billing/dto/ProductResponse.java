package com.market.billing.dto;

import com.market.billing.model.Product;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String barcode;
    private String name;
    private String category;
    private Double price;
    private Integer quantityInStock;
    private Integer minimumStock;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponse() {
    }

    public ProductResponse(Long id, String barcode, String name, String category, Double price,
                           Integer quantityInStock, Integer minimumStock, String status,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.barcode = barcode;
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantityInStock = quantityInStock;
        this.minimumStock = minimumStock;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ProductResponse fromEntity(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getBarcode(),
                p.getName(),
                p.getCategory(),
                p.getPrice(),
                p.getQuantityInStock(),
                p.getMinimumStock(),
                p.getStockStatus(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
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

    public Integer getQuantityInStock() {
        return quantityInStock;
    }

    public void setQuantityInStock(Integer quantityInStock) {
        this.quantityInStock = quantityInStock;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
