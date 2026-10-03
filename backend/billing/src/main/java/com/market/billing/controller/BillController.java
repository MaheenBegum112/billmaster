package com.market.billing.controller;

import com.market.billing.dto.BillResponse;
import com.market.billing.dto.CreateBillRequest;
import com.market.billing.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<BillResponse> createBill(@Valid @RequestBody CreateBillRequest request,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(billService.createBill(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<BillResponse>> getBills(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(billService.getBills(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(billService.getBillById(id, userDetails.getUsername()));
    }

    @GetMapping("/number/{billNumber}")
    public ResponseEntity<BillResponse> getBillByNumber(@PathVariable String billNumber,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(billService.getBillByNumber(billNumber, userDetails.getUsername()));
    }
}
