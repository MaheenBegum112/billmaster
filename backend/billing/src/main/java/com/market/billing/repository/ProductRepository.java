package com.market.billing.repository;

import com.market.billing.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsDeletedFalseOrderByNameAsc();

    Optional<Product> findByIdAndIsDeletedFalse(Long id);

    Optional<Product> findByBarcodeAndIsDeletedFalse(String barcode);

    boolean existsByBarcodeAndIsDeletedFalse(String barcode);

    boolean existsByBarcodeAndIdNotAndIsDeletedFalse(String barcode, Long id);

    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.barcode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProducts(@Param("query") String query);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.isDeleted = false AND p.quantityInStock <= p.minimumStock AND p.quantityInStock > 0")
    long countLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.isDeleted = false AND p.quantityInStock = 0")
    long countOutOfStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.isDeleted = false")
    long countActiveProducts();

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.isDeleted = false ORDER BY p.category ASC")
    List<String> findDistinctCategories();
}
