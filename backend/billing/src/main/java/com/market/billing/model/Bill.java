package com.market.billing.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", nullable = false, unique = true)
    private String billNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "bill_date", nullable = false)
    private LocalDateTime billDate;

    @Column(nullable = false)
    private Double subtotal;

    @Column(nullable = false)
    private Double discount = 0.0;

    @Column(name = "grand_total", nullable = false)
    private Double grandTotal;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "payment_method")
    private String paymentMethod = "CASH";

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<BillItem> items = new ArrayList<>();

    public Bill() {
    }

    public Bill(String billNumber, User user, LocalDateTime billDate, Double subtotal, Double discount, Double grandTotal, String customerName, String customerPhone, String paymentMethod) {
        this.billNumber = billNumber;
        this.user = user;
        this.billDate = billDate;
        this.subtotal = subtotal;
        this.discount = discount;
        this.grandTotal = grandTotal;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.paymentMethod = paymentMethod;
    }

    @PrePersist
    protected void onCreate() {
        if (this.billDate == null) {
            this.billDate = LocalDateTime.now();
        }
    }

    public void addItem(BillItem item) {
        items.add(item);
        item.setBill(this);
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public List<BillItem> getItems() {
        return items;
    }

    public void setItems(List<BillItem> items) {
        this.items = items;
    }
}
