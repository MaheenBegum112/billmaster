package com.market.billing.controller;

import com.market.billing.model.StoreSetting;
import com.market.billing.repository.StoreSettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final StoreSettingRepository settingRepository;

    public SettingsController(StoreSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @GetMapping
    public ResponseEntity<StoreSetting> getSettings() {
        StoreSetting setting = settingRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    StoreSetting s = new StoreSetting();
                    return settingRepository.save(s);
                });
        return ResponseEntity.ok(setting);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreSetting> updateSettings(@RequestBody StoreSetting updated) {
        StoreSetting current = settingRepository.findAll().stream().findFirst()
                .orElseGet(StoreSetting::new);

        if (updated.getStoreName() != null) current.setStoreName(updated.getStoreName().trim());
        if (updated.getStoreAddress() != null) current.setStoreAddress(updated.getStoreAddress().trim());
        if (updated.getStorePhone() != null) current.setStorePhone(updated.getStorePhone().trim());
        if (updated.getCurrency() != null) current.setCurrency(updated.getCurrency().trim());
        if (updated.getTaxRate() != null) current.setTaxRate(updated.getTaxRate());
        if (updated.getDefaultDiscount() != null) current.setDefaultDiscount(updated.getDefaultDiscount());
        if (updated.getRestockHorizonDays() != null && updated.getRestockHorizonDays() > 0) {
            current.setRestockHorizonDays(updated.getRestockHorizonDays());
        }
        if (updated.getAnomalyThresholdSigma() != null && updated.getAnomalyThresholdSigma() > 0) {
            current.setAnomalyThresholdSigma(updated.getAnomalyThresholdSigma());
        }
        if (updated.getForecastPeriodDays() != null && updated.getForecastPeriodDays() > 0) {
            current.setForecastPeriodDays(updated.getForecastPeriodDays());
        }

        StoreSetting saved = settingRepository.save(current);
        return ResponseEntity.ok(saved);
    }
}
