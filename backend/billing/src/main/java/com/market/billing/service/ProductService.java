package com.market.billing.service;

import com.market.billing.dto.MessageResponse;
import com.market.billing.dto.ProductRequest;
import com.market.billing.dto.ProductResponse;
import com.market.billing.exception.BadRequestException;
import com.market.billing.exception.ConflictException;
import com.market.billing.exception.ResourceNotFoundException;
import com.market.billing.model.Product;
import com.market.billing.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findByIsDeletedFalseOrderByNameAsc().stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductResponse.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcodeAndIsDeletedFalse(barcode.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));
        return ProductResponse.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(query.trim()).stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse addProduct(ProductRequest request) {
        if (productRepository.existsByBarcodeAndIsDeletedFalse(request.getBarcode().trim())) {
            throw new ConflictException("Product already exists with barcode: " + request.getBarcode());
        }

        if (request.getPrice() < 0) {
            throw new BadRequestException("Product price cannot be negative");
        }

        if (request.getQuantityInStock() < 0) {
            throw new BadRequestException("Product stock cannot be negative");
        }

        Product product = new Product(
                request.getBarcode().trim(),
                request.getName().trim(),
                request.getCategory().trim(),
                request.getPrice(),
                request.getQuantityInStock(),
                request.getMinimumStock()
        );

        Product saved = productRepository.save(product);
        return ProductResponse.fromEntity(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (productRepository.existsByBarcodeAndIdNotAndIsDeletedFalse(request.getBarcode().trim(), id)) {
            throw new ConflictException("Another product already exists with barcode: " + request.getBarcode());
        }

        if (request.getPrice() < 0) {
            throw new BadRequestException("Product price cannot be negative");
        }

        if (request.getQuantityInStock() < 0) {
            throw new BadRequestException("Product stock cannot be negative");
        }

        product.setBarcode(request.getBarcode().trim());
        product.setName(request.getName().trim());
        product.setCategory(request.getCategory().trim());
        product.setPrice(request.getPrice());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setMinimumStock(request.getMinimumStock());

        Product updated = productRepository.save(product);
        return ProductResponse.fromEntity(updated);
    }

    @Transactional
    public MessageResponse deleteProductSafely(Long id) {
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Soft deletion guarantees historical invoice integrity and bill items remain intact
        product.setDeleted(true);
        productRepository.save(product);
        return MessageResponse.ok("Product safely deleted from catalog. Historical billing records remain intact.");
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }
}
