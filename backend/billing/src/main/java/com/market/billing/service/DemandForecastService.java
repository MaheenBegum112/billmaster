package com.market.billing.service;

import com.market.billing.dto.ForecastDataPointDto;
import com.market.billing.dto.ProductForecastDto;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.Product;
import com.market.billing.repository.BillItemRepository;
import com.market.billing.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandForecastService {

    private final ProductRepository productRepository;
    private final BillItemRepository billItemRepository;

    public DemandForecastService(ProductRepository productRepository, BillItemRepository billItemRepository) {
        this.productRepository = productRepository;
        this.billItemRepository = billItemRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductForecastDto> getAllForecasts(int days) {
        int horizon = (days == 14 || days == 30) ? days : 7;
        List<Product> products = productRepository.findByIsDeletedFalseOrderByNameAsc();

        return products.stream()
                .map(p -> calculateForecastForProduct(p, horizon))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductForecastDto getForecastForProduct(Long productId, int days) {
        int horizon = (days == 14 || days == 30) ? days : 7;
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        return calculateForecastForProduct(product, horizon);
    }

    private ProductForecastDto calculateForecastForProduct(Product product, int horizon) {
        List<Object[]> dailySales = billItemRepository.findDailySalesByProduct(product.getId());
        List<ForecastDataPointDto> timeline = new ArrayList<>();

        if (dailySales == null || dailySales.size() < 3) {
            // Insufficient data points for statistical projection
            if (dailySales != null) {
                for (Object[] row : dailySales) {
                    String date = row[0] != null ? row[0].toString() : "Recorded";
                    Number qty = (Number) row[1];
                    timeline.add(new ForecastDataPointDto(date, qty != null ? qty.doubleValue() : 0.0, null));
                }
            }

            return new ProductForecastDto(
                    product.getId(),
                    product.getName(),
                    product.getCategory(),
                    horizon,
                    0.0,
                    0.0,
                    0.0,
                    "INSUFFICIENT DATA",
                    "INSUFFICIENT",
                    0,
                    product.getMinimumStock(),
                    String.format("Insufficient historical data for forecasting. %d sales days recorded; at least 3 distinct days are required.",
                            dailySales != null ? dailySales.size() : 0),
                    timeline
            );
        }

        int n = dailySales.size();
        double sum = 0.0;
        List<Double> quantities = new ArrayList<>(n);

        for (Object[] row : dailySales) {
            String date = row[0] != null ? row[0].toString() : "Day";
            Number qtyNum = (Number) row[1];
            double qty = qtyNum != null ? qtyNum.doubleValue() : 0.0;
            quantities.add(qty);
            sum += qty;
            timeline.add(new ForecastDataPointDto(date, qty, null));
        }

        double historicalAvg = sum / n;

        // Recent average: last 3 records (weighted higher)
        int recentCount = Math.min(3, n);
        double recentSum = 0.0;
        for (int i = n - recentCount; i < n; i++) {
            recentSum += quantities.get(i);
        }
        double recentAvg = recentSum / recentCount;

        // Compute linear slope trend beta = Cov(x, y) / Var(x)
        double meanX = (n + 1.0) / 2.0;
        double num = 0.0;
        double den = 0.0;
        for (int i = 0; i < n; i++) {
            double x = i + 1;
            double y = quantities.get(i);
            num += (x - meanX) * (y - historicalAvg);
            den += Math.pow(x - meanX, 2);
        }
        double slope = (den > 0) ? (num / den) : 0.0;

        String trend;
        if (slope > 0.15) {
            trend = "INCREASING";
        } else if (slope < -0.15) {
            trend = "DECREASING";
        } else {
            trend = "STABLE";
        }

        // Weighted daily demand: 60% recent average + 40% overall average + mild trend momentum
        double weightedDailyDemand = Math.max(0.1, (0.6 * recentAvg) + (0.4 * historicalAvg) + (slope * 0.3));
        double forecastQuantity = Math.round(weightedDailyDemand * horizon * 10.0) / 10.0;

        String dataQuality = (n >= 7) ? "SUFFICIENT" : "LIMITED";
        int confidence = (n >= 7) ? Math.min(94, 80 + n) : (60 + n * 3);
        int safetyStock = (int) Math.ceil(weightedDailyDemand * 2.0);

        String reason = String.format(
                "Forecast derived from weighted moving average and linear regression slope (%.2f) over %d historical sales days.",
                slope, n
        );

        // Generate projected timeline days
        LocalDate lastDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Connect the bridge point
        if (!timeline.isEmpty()) {
            ForecastDataPointDto lastPoint = timeline.get(timeline.size() - 1);
            lastPoint.setProjectedDemand(lastPoint.getHistoricalDemand());
        }

        for (int d = 1; d <= horizon; d++) {
            LocalDate projDate = lastDate.plusDays(d);
            double projectedValue = Math.max(0.1, weightedDailyDemand + (d * slope * 0.05));
            timeline.add(new ForecastDataPointDto(
                    projDate.format(formatter),
                    null,
                    Math.round(projectedValue * 10.0) / 10.0
            ));
        }

        return new ProductForecastDto(
                product.getId(),
                product.getName(),
                product.getCategory(),
                horizon,
                forecastQuantity,
                Math.round(historicalAvg * 10.0) / 10.0,
                Math.round(recentAvg * 10.0) / 10.0,
                trend,
                dataQuality,
                confidence,
                safetyStock,
                reason,
                timeline
        );
    }
}
