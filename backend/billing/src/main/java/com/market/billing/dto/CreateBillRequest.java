package com.market.billing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CreateBillRequest {

    @NotEmpty(message = "Cart cannot be empty")
    @Valid
    private List<BillItemRequest> items;

    @DecimalMin(value = "0.0", message = "Discount cannot be negative")
    private Double discount = 0.0;

    private String customerName;
    private String customerPhone;
    private String paymentMethod = "CASH";

    public CreateBillRequest() {
    }

    public CreateBillRequest(List<BillItemRequest> items, Double discount, String customerName, String customerPhone, String paymentMethod) {
        this.items = items;
        this.discount = discount;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.paymentMethod = paymentMethod;
    }

    public List<BillItemRequest> getItems() {
        return items;
    }

    public void setItems(List<BillItemRequest> items) {
        this.items = items;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
