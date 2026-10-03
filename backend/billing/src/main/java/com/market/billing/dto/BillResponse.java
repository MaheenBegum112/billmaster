package com.market.billing.dto;

import com.market.billing.model.Bill;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BillResponse {

    private Long id;
    private String billNumber;
    private Long cashierId;
    private String cashierName;
    private LocalDateTime billDate;
    private Double subtotal;
    private Double discount;
    private Double grandTotal;
    private String customerName;
    private String customerPhone;
    private String paymentMethod;
    private List<BillItemResponse> items;

    public BillResponse() {
    }

    public BillResponse(Long id, String billNumber, Long cashierId, String cashierName,
                        LocalDateTime billDate, Double subtotal, Double discount, Double grandTotal,
                        String customerName, String customerPhone, String paymentMethod,
                        List<BillItemResponse> items) {
        this.id = id;
        this.billNumber = billNumber;
        this.cashierId = cashierId;
        this.cashierName = cashierName;
        this.billDate = billDate;
        this.subtotal = subtotal;
        this.discount = discount;
        this.grandTotal = grandTotal;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.paymentMethod = paymentMethod;
        this.items = items;
    }

    public static BillResponse fromEntity(Bill bill) {
        List<BillItemResponse> itemResponses = bill.getItems().stream()
                .map(BillItemResponse::fromEntity)
                .collect(Collectors.toList());

        return new BillResponse(
                bill.getId(),
                bill.getBillNumber(),
                bill.getUser() != null ? bill.getUser().getId() : null,
                bill.getUser() != null ? bill.getUser().getName() : "Unknown",
                bill.getBillDate(),
                bill.getSubtotal(),
                bill.getDiscount(),
                bill.getGrandTotal(),
                bill.getCustomerName(),
                bill.getCustomerPhone(),
                bill.getPaymentMethod(),
                itemResponses
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
    }

    public Long getCashierId() {
        return cashierId;
    }

    public void setCashierId(Long cashierId) {
        this.cashierId = cashierId;
    }

    public String getCashierName() {
        return cashierName;
    }

    public void setCashierName(String cashierName) {
        this.cashierName = cashierName;
    }

    public LocalDateTime getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDateTime billDate) {
        this.billDate = billDate;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Double grandTotal) {
        this.grandTotal = grandTotal;
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

    public List<BillItemResponse> getItems() {
        return items;
    }

    public void setItems(List<BillItemResponse> items) {
        this.items = items;
    }
}
