package com.market.billing.dto;

import com.market.billing.model.BillItem;

public class BillItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double priceAtSale;
    private Double total;

    public BillItemResponse() {
    }

    public BillItemResponse(Long id, Long productId, String productName, Integer quantity, Double priceAtSale, Double total) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.priceAtSale = priceAtSale;
        this.total = total;
    }

    public static BillItemResponse fromEntity(BillItem item) {
        return new BillItemResponse(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProductName(),
                item.getQuantity(),
                item.getPriceAtSale(),
                item.getTotal()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPriceAtSale() {
        return priceAtSale;
    }

    public void setPriceAtSale(Double priceAtSale) {
        this.priceAtSale = priceAtSale;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
