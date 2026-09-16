package com.example.fintechwallet.service;

import com.example.fintechwallet.entity.Transaction;
import com.example.fintechwallet.entity.Wallet;
import com.example.fintechwallet.kafka.TransferEventProducer;
import com.example.fintechwallet.repository.TransactionRepository;
import com.example.fintechwallet.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final TransferEventProducer transferEventProducer;

    public WalletService(
            WalletRepository walletRepository,
            TransactionRepository transactionRepository,
            TransferEventProducer transferEventProducer) {

        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.transferEventProducer = transferEventProducer;
    }

    public Wallet getWalletByUserId(Long userId) {

        return walletRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));
    }

    @Transactional
    public Wallet addMoney(Long userId, BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero");
        }

        Wallet wallet = walletRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        wallet.setBalance(
                wallet.getBalance().add(amount)
        );

        Wallet savedWallet =
                walletRepository.save(wallet);

        Transaction transaction = new Transaction(
                null,
                wallet.getId(),
                amount,
                "ADD_MONEY",
                "SUCCESS",
                UUID.randomUUID().toString(),
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return savedWallet;
    }

    @Transactional
    public Wallet withdraw(Long userId, BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero");
        }

        Wallet wallet = walletRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        if (wallet.getBalance().compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Insufficient balance");
        }

        wallet.setBalance(
                wallet.getBalance().subtract(amount)
        );

        Wallet savedWallet =
                walletRepository.save(wallet);

        Transaction transaction = new Transaction(
                wallet.getId(),
                null,
                amount,
                "WITHDRAW",
                "SUCCESS",
                UUID.randomUUID().toString(),
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        return savedWallet;
    }

    @Transactional
    public void transfer(
            Long senderUserId,
            Long receiverUserId,
            BigDecimal amount,
            String referenceId) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero");
        }

        if (senderUserId.equals(receiverUserId)) {

            throw new RuntimeException(
                    "Sender and receiver cannot be the same");
        }

        if (referenceId == null ||
                referenceId.isBlank()) {

            throw new RuntimeException(
                    "Reference ID is required");
        }

        if (transactionRepository
                .findByReferenceId(referenceId)
                .isPresent()) {

            throw new RuntimeException(
                    "Transaction already processed");
        }

        Wallet sender = walletRepository
                .findByUserId(senderUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sender wallet not found"));

        Wallet receiver = walletRepository
                .findByUserId(receiverUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Receiver wallet not found"));

        if (sender.getBalance().compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Insufficient balance");
        }

        sender.setBalance(
                sender.getBalance().subtract(amount)
        );

        receiver.setBalance(
                receiver.getBalance().add(amount)
        );

        walletRepository.save(sender);
        walletRepository.save(receiver);

        Transaction transaction = new Transaction(
                sender.getId(),
                receiver.getId(),
                amount,
                "TRANSFER",
                "SUCCESS",
                referenceId,
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);

        transferEventProducer.sendTransferEvent(
                referenceId,
                senderUserId,
                receiverUserId,
                amount.toString()
        );
    }

    public List<Transaction> getTransactionHistory(Long userId) {

        Wallet wallet = walletRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Wallet not found"));

        return transactionRepository
                .findBySenderWalletIdOrReceiverWalletId(
                        wallet.getId(),
                        wallet.getId()
                );
    }
}