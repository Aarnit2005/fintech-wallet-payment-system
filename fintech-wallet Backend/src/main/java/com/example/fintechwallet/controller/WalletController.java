package com.example.fintechwallet.controller;

import com.example.fintechwallet.entity.Transaction;
import com.example.fintechwallet.entity.Wallet;
import com.example.fintechwallet.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wallets")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getWallet(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                walletService.getWalletByUserId(userId)
        );
    }

    @PostMapping("/{userId}/add-money")
    public ResponseEntity<Wallet> addMoney(
            @PathVariable Long userId,
            @RequestBody Map<String, BigDecimal> request) {

        BigDecimal amount = request.get("amount");

        return ResponseEntity.ok(
                walletService.addMoney(userId, amount)
        );
    }

    @PostMapping("/{userId}/withdraw")
    public ResponseEntity<Wallet> withdraw(
            @PathVariable Long userId,
            @RequestBody Map<String, BigDecimal> request) {

        BigDecimal amount = request.get("amount");

        return ResponseEntity.ok(
                walletService.withdraw(userId, amount)
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @RequestBody Map<String, String> request) {

        Long senderUserId =
                Long.valueOf(request.get("senderUserId"));

        Long receiverUserId =
                Long.valueOf(request.get("receiverUserId"));

        BigDecimal amount =
                new BigDecimal(request.get("amount"));

        String referenceId =
                request.get("referenceId");

        walletService.transfer(
                senderUserId,
                receiverUserId,
                amount,
                referenceId
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Transfer successful",
                        "referenceId", referenceId
                )
        );
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactionHistory(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                walletService.getTransactionHistory(userId)
        );
    }
}