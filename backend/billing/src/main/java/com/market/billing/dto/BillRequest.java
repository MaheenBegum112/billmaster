package com.market.billing.dto;

import java.util.List;

public class BillRequest {
    private List<ItemDTO> items;
    private double discount;

    public static class ItemDTO {
        private Long productId;
        private int quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> items) { this.items = items; }
    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }
}