package com.market.billing.controller;

import com.market.billing.dto.InventoryItemDto;
import com.market.billing.dto.InventorySummaryDto;
import com.market.billing.dto.ProductResponse;
import com.market.billing.dto.RestockRequest;
import com.market.billing.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/summary")
    public ResponseEntity<InventorySummaryDto> getSummary() {
        return ResponseEntity.ok(inventoryService.getInventorySummary());
    }

    @GetMapping("/items")
    public ResponseEntity<List<InventoryItemDto>> getItems() {
        return ResponseEntity.ok(inventoryService.getInventoryItems());
    }

    @PostMapping("/restock")
    public ResponseEntity<ProductResponse> restockProduct(@Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(inventoryService.restockProduct(request));
    }
}
