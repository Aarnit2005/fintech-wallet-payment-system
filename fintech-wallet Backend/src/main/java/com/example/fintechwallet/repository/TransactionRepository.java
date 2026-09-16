package com.example.fintechwallet.repository;

import com.example.fintechwallet.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderWalletIdOrReceiverWalletId(
            Long senderWalletId,
            Long receiverWalletId
    );

    Optional<Transaction> findByReferenceId(String referenceId);
}