package com.market.billing.service;

import com.market.billing.dto.*;
import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AIInsightService {

    private final SmartRestockService smartRestockService;
    private final AnomalyDetectionService anomalyDetectionService;
    private final DemandForecastService demandForecastService;
    private final ProductRepository productRepository;
    private final BillItemRepository billItemRepository;

    public AIInsightService(SmartRestockService smartRestockService,
                            AnomalyDetectionService anomalyDetectionService,
                            DemandForecastService demandForecastService,
                            ProductRepository productRepository,
                            BillItemRepository billItemRepository) {
        this.smartRestockService = smartRestockService;
        this.anomalyDetectionService = anomalyDetectionService;
        this.demandForecastService = demandForecastService;
        this.productRepository = productRepository;
        this.billItemRepository = billItemRepository;
    }

    @Transactional(readOnly = true)
    public AISummaryDto getAISummary() {
        long productsCount = productRepository.countActiveProducts();
        long salesRecordsCount = billItemRepository.count();

        SmartRestockSummaryDto restockSummary = smartRestockService.calculateSmartRestock();
        AnomalySummaryDto anomalySummary = anomalyDetectionService.detectAnomalies();
        List<ProductForecastDto> forecasts = demandForecastService.getAllForecasts(7);

        long restockNeeded = restockSummary.getNeedRestockCount();
        long anomaliesCount = anomalySummary.getTotalAnomalies();

        long increasing = forecasts.stream().filter(f -> "INCREASING".equals(f.getTrend())).count();
        long decreasing = forecasts.stream().filter(f -> "DECREASING".equals(f.getTrend())).count();

        String restockText = restockNeeded > 0
                ? String.format("%d product%s require replenishment attention.", restockNeeded, restockNeeded > 1 ? "s" : "")
                : "All product inventory levels are currently in a healthy range.";

        String anomalyText = anomaliesCount > 0
                ? String.format("%d unusual sales pattern%s detected in recent transactions.", anomaliesCount, anomaliesCount > 1 ? "s" : "")
                : "No unusual sales variances detected in historical transactions.";

        String forecastText = increasing > 0
                ? String.format("Demand is projected to increase for %d product%s over the next 7 days.", increasing, increasing > 1 ? "s" : "")
                : "Demand trends across catalog are currently stable.";

        String quality = (salesRecordsCount > 20) ? "SUFFICIENT" : (salesRecordsCount > 5 ? "LIMITED" : "INSUFFICIENT");

        return new AISummaryDto(
                productsCount,
                salesRecordsCount,
                restockNeeded,
                anomaliesCount,
                increasing,
                decreasing,
                restockText,
                anomalyText,
                forecastText,
                quality,
                LocalDateTime.now()
        );
    }
}
