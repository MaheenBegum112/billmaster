package com.market.billing.controller;

import com.market.billing.dto.*;
import com.market.billing.service.AIInsightService;
import com.market.billing.service.AnomalyDetectionService;
import com.market.billing.service.DemandForecastService;
import com.market.billing.service.SmartRestockService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@PreAuthorize("hasRole('ADMIN')")
public class AIController {

    private final AIInsightService aiInsightService;
    private final SmartRestockService smartRestockService;
    private final AnomalyDetectionService anomalyDetectionService;
    private final DemandForecastService demandForecastService;

    public AIController(AIInsightService aiInsightService,
                        SmartRestockService smartRestockService,
                        AnomalyDetectionService anomalyDetectionService,
                        DemandForecastService demandForecastService) {
        this.aiInsightService = aiInsightService;
        this.smartRestockService = smartRestockService;
        this.anomalyDetectionService = anomalyDetectionService;
        this.demandForecastService = demandForecastService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AISummaryDto> getAISummary() {
        return ResponseEntity.ok(aiInsightService.getAISummary());
    }

    @GetMapping("/smart-restock")
    public ResponseEntity<SmartRestockSummaryDto> getSmartRestock() {
        return ResponseEntity.ok(smartRestockService.calculateSmartRestock());
    }

    @GetMapping("/anomalies")
    public ResponseEntity<AnomalySummaryDto> getAnomalies() {
        return ResponseEntity.ok(anomalyDetectionService.detectAnomalies());
    }

    @GetMapping("/forecast")
    public ResponseEntity<List<ProductForecastDto>> getAllForecasts(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(demandForecastService.getAllForecasts(days));
    }

    @GetMapping("/forecast/{productId}")
    public ResponseEntity<ProductForecastDto> getProductForecast(@PathVariable Long productId,
                                                                 @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(demandForecastService.getForecastForProduct(productId, days));
    }
}
