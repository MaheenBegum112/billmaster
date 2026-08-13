package com.market.billing.controller;

import com.market.billing.dto.BillRequest;
import com.market.billing.model.Bill;
import com.market.billing.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping
    public Bill createBill(@RequestBody BillRequest request) {
        return billService.createBill(request);
    }
}