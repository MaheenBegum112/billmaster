package com.market.billing.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RestockRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity to add is required")
    @Min(value = 1, message = "Added quantity must be at least 1")
    private Integer quantity;

    public RestockRequest() {
    }

    public RestockRequest(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
