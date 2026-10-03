package com.market.billing.repository;

import com.market.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findAllByOrderByBillDateDesc();

    List<Bill> findByUserIdOrderByBillDateDesc(Long userId);

    Optional<Bill> findByBillNumber(String billNumber);

    List<Bill> findTop10ByOrderByBillDateDesc();

    List<Bill> findTop10ByUserIdOrderByBillDateDesc(Long userId);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.billDate BETWEEN :start AND :end")
    long countByBillDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.user.id = :userId AND b.billDate BETWEEN :start AND :end")
    long countByUserIdAndBillDateBetween(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.grandTotal), 0.0) FROM Bill b WHERE b.billDate BETWEEN :start AND :end")
    Double sumGrandTotalByBillDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.grandTotal), 0.0) FROM Bill b WHERE b.user.id = :userId AND b.billDate BETWEEN :start AND :end")
    Double sumGrandTotalByUserIdAndBillDateBetween(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(b.grandTotal), 0.0) FROM Bill b")
    Double sumAllGrandTotal();

    @Query("SELECT COALESCE(SUM(b.discount), 0.0) FROM Bill b")
    Double sumAllDiscount();

    @Query("SELECT COALESCE(SUM(b.discount), 0.0) FROM Bill b WHERE b.billDate BETWEEN :start AND :end")
    Double sumDiscountByBillDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT b FROM Bill b WHERE b.billDate BETWEEN :start AND :end ORDER BY b.billDate ASC")
    List<Bill> findByBillDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT b FROM Bill b WHERE b.user.id = :userId AND b.billDate BETWEEN :start AND :end ORDER BY b.billDate ASC")
    List<Bill> findByUserIdAndBillDateBetween(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
