package com.market.billing.service;

import com.market.billing.dto.AnomalyItemDto;
import com.market.billing.dto.AnomalySummaryDto;
import com.market.billing.model.Product;
import com.market.billing.model.StoreSetting;
import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.ProductRepository;
import com.market.billing.repository.StoreSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class AnomalyDetectionService {

    private final ProductRepository productRepository;
    private final BillItemRepository billItemRepository;
    private final StoreSettingRepository settingRepository;

    public AnomalyDetectionService(ProductRepository productRepository,
                                   BillItemRepository billItemRepository,
                                   StoreSettingRepository settingRepository) {
        this.productRepository = productRepository;
        this.billItemRepository = billItemRepository;
        this.settingRepository = settingRepository;
    }

    @Transactional(readOnly = true)
    public AnomalySummaryDto detectAnomalies() {
        double thresholdSigma = settingRepository.findAll().stream().findFirst()
                .map(StoreSetting::getAnomalyThresholdSigma)
                .orElse(2.0);

        List<Product> products = productRepository.findByIsDeletedFalseOrderByNameAsc();
        List<AnomalyItemDto> anomalyList = new ArrayList<>();

        long highCount = 0;
        long mediumCount = 0;
        long lowCount = 0;

        for (Product p : products) {
            List<Object[]> dailySales = billItemRepository.findDailySalesByProduct(p.getId());
            // Need at least 3 distinct days with recorded activity for variance calculation
            if (dailySales == null || dailySales.size() < 3) {
                continue;
            }

            int n = dailySales.size();
            double sum = 0.0;
            List<Double> quantities = new ArrayList<>(n);

            for (Object[] row : dailySales) {
                Number qtyNum = (Number) row[1];
                double qty = qtyNum != null ? qtyNum.doubleValue() : 0.0;
                quantities.add(qty);
                sum += qty;
            }

            double mean = sum / n;
            if (mean <= 0.0) continue;

            // Calculate sample standard deviation
            double varianceSum = 0.0;
            for (Double q : quantities) {
                varianceSum += Math.pow(q - mean, 2);
            }
            double stdDev = (n > 1) ? Math.sqrt(varianceSum / (n - 1)) : 0.0;

            // Inspect each recorded day
            for (Object[] row : dailySales) {
                Object dateObj = row[0];
                String dateStr = dateObj != null ? dateObj.toString() : "Unknown";
                Number qtyNum = (Number) row[1];
                double actual = qtyNum != null ? qtyNum.doubleValue() : 0.0;

                double difference = actual - mean;
                double zScore = (stdDev > 0) ? (difference / stdDev) : 0.0;
                double deviationPct = (difference / mean) * 100.0;

                // Anomaly triggered if Z exceeds threshold or large surge
                boolean isAnomaly = Math.abs(zScore) >= thresholdSigma ||
                        (actual >= 2.5 * mean && Math.abs(difference) >= 5);

                if (isAnomaly) {
                    String severity;
                    if (Math.abs(zScore) >= 3.0 || Math.abs(deviationPct) >= 200.0) {
                        severity = "HIGH";
                        highCount++;
                    } else if (Math.abs(zScore) >= 2.0 || Math.abs(deviationPct) >= 100.0) {
                        severity = "MEDIUM";
                        mediumCount++;
                    } else {
                        severity = "LOW";
                        lowCount++;
                    }

                    String type = (difference > 0) ? "SPIKE" : "DROP";
                    String explanation = String.format(
                            "Observed %s of %.0f units on %s vs historical baseline average of %.1f units (%.1f%% deviation, Z=%.2f). " +
                            "This represents an unusual variance in customer purchasing velocity compared with typical baseline trends.",
                            type.toLowerCase(), actual, dateStr, mean, deviationPct, zScore
                    );

                    anomalyList.add(new AnomalyItemDto(
                            p.getId(),
                            p.getName(),
                            p.getCategory(),
                            dateStr,
                            Math.round(actual * 10.0) / 10.0,
                            Math.round(mean * 10.0) / 10.0,
                            Math.round(difference * 10.0) / 10.0,
                            Math.round(deviationPct * 10.0) / 10.0,
                            Math.round(zScore * 100.0) / 100.0,
                            severity,
                            type,
                            explanation
                    ));
                }
            }
        }

        // Sort latest dates first
        anomalyList.sort(Comparator.comparing(AnomalyItemDto::getDate).reversed());

        return new AnomalySummaryDto(
                anomalyList.size(),
                highCount,
                mediumCount,
                lowCount,
                thresholdSigma,
                anomalyList
        );
    }
}
