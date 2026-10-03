package com.market.billing.service;

import com.market.billing.model.*;
import com.market.billing.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BillRepository billRepository;
    private final StoreSettingRepository settingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProductRepository productRepository,
                           BillRepository billRepository,
                           StoreSettingRepository settingRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.billRepository = billRepository;
        this.settingRepository = settingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Initialize Store Settings
        if (settingRepository.count() == 0) {
            StoreSetting setting = new StoreSetting();
            setting.setStoreName("BillMaster Supermarket");
            setting.setStoreAddress("742 Evergreen Plaza, Market District");
            setting.setStorePhone("+1 (800) 555-BILL");
            setting.setCurrency("$");
            setting.setTaxRate(5.0);
            setting.setDefaultDiscount(0.0);
            setting.setRestockHorizonDays(3);
            setting.setAnomalyThresholdSigma(2.0);
            setting.setForecastPeriodDays(7);
            settingRepository.save(setting);
        }

        // 2. Initialize Users (Admin & Cashier)
        User admin = userRepository.findByEmail("admin@billmaster.com").orElse(null);
        if (admin == null) {
            admin = new User("System Admin", "admin@billmaster.com", passwordEncoder.encode("admin123"), User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
        } else if (!admin.isActive()) {
            admin.setActive(true);
            userRepository.save(admin);
        }

        User cashier = userRepository.findByEmail("cashier@billmaster.com").orElse(null);
        if (cashier == null) {
            cashier = new User("John Cashier", "cashier@billmaster.com", passwordEncoder.encode("cashier123"), User.Role.CASHIER);
            cashier.setActive(true);
            userRepository.save(cashier);
        } else if (!cashier.isActive()) {
            cashier.setActive(true);
            userRepository.save(cashier);
        }

        // 3. Initialize Products if empty
        // 3. Initialize Products
        ensureProduct("8901058852341", "Maggi 2-Minute Instant Noodles 280g", "Packaged Foods", 1.50, 45, 20);
        ensureProduct("8901262010012", "Fresh Whole Milk 1 Gallon", "Dairy & Eggs", 3.80, 8, 15);
        ensureProduct("8901030012345", "Whole Wheat Sandwich Bread 400g", "Bakery", 2.20, 0, 10);
        ensureProduct("8901725112233", "Premium Basmati Rice 5kg", "Grains & Staples", 12.50, 60, 15);
        ensureProduct("8901063110022", "Whole Wheat Flour (Atta) 10kg", "Grains & Staples", 9.00, 34, 10);
        ensureProduct("8902001004455", "Refined Pure Cane Sugar 2kg", "Grains & Staples", 2.80, 49, 15);
        ensureProduct("8901719101010", "Dark Chocolate Cream Biscuits 150g", "Snacks & Confectionery", 1.20, 80, 25);
        ensureProduct("8901030005511", "Antibacterial Bath Soap 4-Pack", "Personal Care", 3.50, 3, 12);
        ensureProduct("8901030778899", "Daily Herbal Care Shampoo 400ml", "Personal Care", 5.90, 25, 10);
        ensureProduct("8901314010101", "Complete Protection Toothpaste 150g", "Personal Care", 2.40, 39, 15);
        ensureProduct("8909990001111", "Royal Gala Red Apples 1kg", "Fresh Produce", 4.20, 28, 10);
        ensureProduct("8909990002222", "Fresh Valencia Juicing Oranges 1kg", "Fresh Produce", 3.60, 22, 10);
        ensureProduct("8908880003333", "100% Pure Raw Organic Honey 500g", "Packaged Foods", 7.50, 16, 5);

        // Department: Dairy & Eggs
        ensureProduct("890200000001", "Organic Greek Yogurt Vanilla 500g", "Dairy & Eggs", 3.99, 35, 10);
        ensureProduct("890200000002", "Salted Sweet Cream Butter 250g", "Dairy & Eggs", 2.89, 40, 15);
        ensureProduct("890200000003", "Large Brown Grade A Eggs (Dozen)", "Dairy & Eggs", 3.49, 8, 15);
        ensureProduct("890200000004", "Shredded Sharp Cheddar Cheese 200g", "Dairy & Eggs", 3.29, 28, 10);
        ensureProduct("890200000005", "Unsweetened Almond Milk 1L", "Dairy & Eggs", 2.99, 22, 10);
        ensureProduct("890200000006", "Heavy Whipping Cream 500ml", "Dairy & Eggs", 3.75, 15, 8);
        ensureProduct("890200000007", "Low-Fat Cottage Cheese 450g", "Dairy & Eggs", 2.69, 19, 8);

        // Department: Bakery & Breakfast
        ensureProduct("890200000008", "Artisan Sourdough Loaf 500g", "Bakery", 3.89, 6, 10);
        ensureProduct("890200000009", "Classic French Butter Croissants 4-Pack", "Bakery", 4.29, 18, 10);
        ensureProduct("890200000010", "Cinnamon Raisin Bagels 6-Pack", "Bakery", 3.49, 24, 8);
        ensureProduct("890200000011", "Whole Grain Rolled Oats 1kg", "Bakery & Breakfast", 4.19, 42, 12);
        ensureProduct("890200000012", "Honey Nut Toasted Cereal 450g", "Bakery & Breakfast", 4.59, 30, 10);
        ensureProduct("890200000013", "Belgian Buttermilk Pancake Mix 900g", "Bakery & Breakfast", 3.79, 25, 8);

        // Department: Fresh Produce
        ensureProduct("890200000014", "Organic Bananas Bunch 1kg", "Fresh Produce", 1.49, 55, 20);
        ensureProduct("890200000015", "Hass Avocados 4-Pack Bag", "Fresh Produce", 4.99, 14, 10);
        ensureProduct("890200000016", "Organic Baby Spinach Tub 300g", "Fresh Produce", 2.99, 5, 12);
        ensureProduct("890200000017", "Vine-Ripened Roma Tomatoes 1kg", "Fresh Produce", 2.49, 38, 15);
        ensureProduct("890200000018", "Crisp Broccoli Florets 500g", "Fresh Produce", 2.19, 26, 10);
        ensureProduct("890200000019", "Sweet California Strawberries 450g", "Fresh Produce", 3.99, 16, 8);
        ensureProduct("890200000020", "Seedless Red Grapes 1kg", "Fresh Produce", 4.49, 20, 10);
        ensureProduct("890200000021", "Russet Baking Potatoes 5kg Bag", "Fresh Produce", 5.99, 45, 15);
        ensureProduct("890200000022", "Yellow Cooking Onions 2kg Bag", "Fresh Produce", 2.89, 50, 15);

        // Department: Beverages
        ensureProduct("890200000023", "Sparkling Mineral Water Lime 12-Pack", "Beverages", 6.49, 32, 10);
        ensureProduct("890200000024", "100% Pure Squeezed Orange Juice 1.75L", "Beverages", 4.79, 22, 10);
        ensureProduct("890200000025", "Organic Japanese Green Tea 50 Bags", "Beverages", 5.29, 40, 10);
        ensureProduct("890200000026", "Colombian Medium Roast Whole Bean Coffee 500g", "Beverages", 9.99, 28, 8);
        ensureProduct("890200000027", "Natural Spring Water 24 x 500ml Pack", "Beverages", 4.99, 65, 20);
        ensureProduct("890200000028", "Craft Cold Brew Coffee 946ml", "Beverages", 5.49, 7, 10);
        ensureProduct("890200000029", "Lemonade Infused Iced Tea 1.5L", "Beverages", 2.69, 35, 10);

        // Department: Snacks & Confectionery
        ensureProduct("890200000030", "Kettle Cooked Sea Salt Chips 220g", "Snacks & Confectionery", 2.99, 48, 15);
        ensureProduct("890200000031", "White Corn Tortilla Chips Party Size 450g", "Snacks & Confectionery", 3.89, 42, 12);
        ensureProduct("890200000032", "Roasted Salted Almonds 400g", "Snacks & Confectionery", 6.99, 30, 10);
        ensureProduct("890200000033", "Cranberry Nut Antioxidant Trail Mix 350g", "Snacks & Confectionery", 5.49, 25, 8);
        ensureProduct("890200000034", "Dark Chocolate Almond Bark 180g", "Snacks & Confectionery", 3.79, 35, 10);
        ensureProduct("890200000035", "Sour Gummy Bears Family Pack 500g", "Snacks & Confectionery", 3.29, 50, 15);

        // Department: Meat, Poultry & Frozen
        ensureProduct("890200000036", "Boneless Skinless Chicken Breasts 1kg", "Meat & Poultry", 8.99, 20, 8);
        ensureProduct("890200000037", "Lean Ground Beef 85/15 500g", "Meat & Poultry", 5.99, 15, 8);
        ensureProduct("890200000038", "Wild Caught Atlantic Salmon Fillets 400g", "Meat & Poultry", 9.49, 12, 6);
        ensureProduct("890200000039", "Frozen Sweet Green Peas 1kg", "Frozen Foods", 2.49, 40, 12);
        ensureProduct("890200000040", "Stone-Baked Thin Crust Pepperoni Pizza 450g", "Frozen Foods", 6.29, 18, 8);
        ensureProduct("890200000041", "Homestyle French Vanilla Ice Cream 1.5L", "Frozen Foods", 4.99, 22, 8);

        // Department: Packaged Foods & Condiments
        ensureProduct("890200000042", "Italian Penne Rigate Pasta 500g", "Packaged Foods", 1.69, 75, 20);
        ensureProduct("890200000043", "Organic Roasted Garlic Tomato Marinara 680g", "Packaged Foods", 3.49, 45, 15);
        ensureProduct("890200000044", "All-Natural Creamy Peanut Butter 750g", "Packaged Foods", 4.29, 38, 12);
        ensureProduct("890200000045", "Seedless Strawberry Fruit Spread 450g", "Packaged Foods", 3.19, 32, 10);

        // Department: Household & Cleaning
        ensureProduct("890200000046", "Ultra Concentrated Liquid Laundry Detergent 2L", "Household & Cleaning", 11.99, 25, 8);
        ensureProduct("890200000047", "Antibacterial Multi-Surface Cleaner Spray 750ml", "Household & Cleaning", 3.89, 34, 10);
        ensureProduct("890200000048", "Ultra Absorbent 2-Ply Paper Towels 6-Pack", "Household & Cleaning", 7.99, 0, 10);
        ensureProduct("890200000049", "Heavy Duty Drawstring Trash Bags 50L 40-Pack", "Household & Cleaning", 8.49, 28, 10);
        ensureProduct("890200000050", "Citrus Grease-Cutting Dishwashing Liquid 900ml", "Household & Cleaning", 2.79, 44, 15);

        // 4. Seed realistic sales history if no bills exist (for AI and Reports demonstration)
        if (billRepository.count() == 0) {
            List<Product> allProducts = productRepository.findByIsDeletedFalseOrderByNameAsc();
            if (!allProducts.isEmpty()) {
                LocalDateTime now = LocalDateTime.now();
                int billCounter = 1;

                // Create historical bills over the last 14 days
                for (int dayOffset = 14; dayOffset >= 0; dayOffset--) {
                    LocalDateTime dayTime = now.minusDays(dayOffset).withHour(10).withMinute(30);

                    // Daily regular sales for Milk, Bread, Noodles, Apples
                    for (Product p : allProducts) {
                        int unitsSold;
                        if (p.getName().contains("Milk")) {
                            // Steady high volume: 6-10 units daily
                            unitsSold = 6 + (dayOffset % 4);
                        } else if (p.getName().contains("Bread")) {
                            // Steady 5-8 units daily
                            unitsSold = 5 + (dayOffset % 3);
                        } else if (p.getName().contains("Maggi")) {
                            // Normal 4-6, but day 3 has a huge promotional spike (anomaly demo!)
                            unitsSold = (dayOffset == 2) ? 28 : (4 + (dayOffset % 3));
                        } else if (p.getName().contains("Apples")) {
                            unitsSold = 3 + (dayOffset % 2);
                        } else if (p.getName().contains("Rice") && dayOffset % 3 == 0) {
                            unitsSold = 2;
                        } else {
                            continue;
                        }

                        if (unitsSold > 0) {
                            String billNum = String.format("BILL-%s-%03d",
                                    dayTime.toLocalDate().toString().replace("-", ""),
                                    billCounter++);
                            double subtotal = Math.round(unitsSold * p.getPrice() * 100.0) / 100.0;
                            double discount = 0.0;
                            double grandTotal = subtotal;

                            Bill bill = new Bill(
                                    billNum,
                                    (billCounter % 2 == 0) ? cashier : admin,
                                    dayTime.plusMinutes((long) (Math.random() * 300)),
                                    subtotal,
                                    discount,
                                    grandTotal,
                                    "Customer " + billCounter,
                                    "555-01" + (10 + billCounter % 80),
                                    (billCounter % 3 == 0) ? "CARD" : "CASH"
                            );

                            BillItem item = new BillItem(p, p.getName(), unitsSold, p.getPrice(), subtotal);
                            bill.addItem(item);
                            billRepository.save(bill);
                        }
                    }
                }
            }
        }
    }

    private void ensureProduct(String barcode, String name, String category, double price, int stock, int minStock) {
        if (!productRepository.existsByBarcodeAndIsDeletedFalse(barcode)) {
            productRepository.save(new Product(barcode, name, category, price, stock, minStock));
        }
    }
}
