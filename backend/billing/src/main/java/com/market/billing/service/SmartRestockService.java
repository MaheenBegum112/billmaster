package com.market.billing.service;

import com.market.billing.dto.SmartRestockItemDto;
import com.market.billing.dto.SmartRestockSummaryDto;
import com.market.billing.model.Product;
import com.market.billing.model.StoreSetting;
import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.ProductRepository;
import com.market.billing.repository.StoreSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SmartRestockService {

    private final ProductRepository productRepository;
    private final BillItemRepository billItemRepository;
    private final StoreSettingRepository settingRepository;

    public SmartRestockService(ProductRepository productRepository,
                               BillItemRepository billItemRepository,
                               StoreSettingRepository settingRepository) {
        this.productRepository = productRepository;
        this.billItemRepository = billItemRepository;
        this.settingRepository = settingRepository;
    }

    @Transactional(readOnly = true)
    public SmartRestockSummaryDto calculateSmartRestock() {
        int restockHorizon = settingRepository.findAll().stream().findFirst()
                .map(StoreSetting::getRestockHorizonDays)
                .orElse(3);

        List<Product> products = productRepository.findByIsDeletedFalseOrderByNameAsc();
        List<SmartRestockItemDto> items = new ArrayList<>();

        long needRestockCount = 0;
        long criticalCount = 0;
        long outOfStockCount = 0;

        for (Product p : products) {
            Long totalSold = billItemRepository.findTotalQuantitySoldByProduct(p.getId());
            Long salesDays = billItemRepository.findDistinctSalesDaysByProduct(p.getId());
            int currentStock = p.getQuantityInStock() != null ? p.getQuantityInStock() : 0;
            int minimumStock = p.getMinimumStock() != null ? p.getMinimumStock() : 0;

            if (totalSold == null || totalSold == 0 || salesDays == null || salesDays == 0) {
                // No sales history available
                String status;
                int recommended = 0;

                if (currentStock == 0) {
                    status = "OUT OF STOCK";
                    recommended = Math.max(minimumStock * 2, 10);
                    outOfStockCount++;
                    needRestockCount++;
                } else if (currentStock <= minimumStock) {
                    status = "CRITICAL";
                    recommended = Math.max(0, (minimumStock * 2) - currentStock);
                    criticalCount++;
                    needRestockCount++;
                } else {
                    status = "HEALTHY";
                }

                items.add(new SmartRestockItemDto(
                        p.getId(),
                        p.getBarcode(),
                        p.getName(),
                        p.getCategory(),
                        currentStock,
                        minimumStock,
                        0L,
                        0L,
                        0.0,
                        null,
                        0.0,
                        recommended,
                        status,
                        "No sales history available in database. Baseline recommendation relies strictly on static minimum safety buffer.",
                        false
                ));
            } else {
                // Real sales velocity calculation
                double avgDailySales = Math.round(((double) totalSold / salesDays) * 100.0) / 100.0;
                double smartRestockLevel = Math.round((avgDailySales * restockHorizon) * 100.0) / 100.0;
                double daysRemaining = (avgDailySales > 0)
                        ? Math.round(((double) currentStock / avgDailySales) * 10.0) / 10.0
                        : 999.0;

                int recommendedQuantity = (int) Math.ceil(Math.max(0.0, smartRestockLevel - currentStock));

                String status;
                if (currentStock == 0) {
                    status = "OUT OF STOCK";
                    recommendedQuantity = Math.max(recommendedQuantity, (int) Math.ceil(smartRestockLevel));
                    outOfStockCount++;
                    needRestockCount++;
                } else if (daysRemaining <= 2.0 || currentStock <= minimumStock) {
                    status = "CRITICAL";
                    criticalCount++;
                    needRestockCount++;
                } else if (currentStock <= smartRestockLevel) {
                    status = "RESTOCK SOON";
                    needRestockCount++;
                } else {
                    status = "HEALTHY";
                }

                String explanation = String.format(
                        "Observed sales velocity of %.2f units/day across %d recorded sales days. Target restock buffer: %.1f units for a %d-day lead horizon.",
                        avgDailySales, salesDays, smartRestockLevel, restockHorizon
                );

                items.add(new SmartRestockItemDto(
                        p.getId(),
                        p.getBarcode(),
                        p.getName(),
                        p.getCategory(),
                        currentStock,
                        minimumStock,
                        totalSold,
                        salesDays,
                        avgDailySales,
                        daysRemaining,
                        smartRestockLevel,
                        recommendedQuantity,
                        status,
                        explanation,
                        true
                ));
            }
        }

        return new SmartRestockSummaryDto(
                products.size(),
                needRestockCount,
                criticalCount,
                outOfStockCount,
                restockHorizon,
                items
        );
    }
}
