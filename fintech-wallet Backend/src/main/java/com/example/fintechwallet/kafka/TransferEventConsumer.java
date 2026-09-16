package com.example.fintechwallet.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TransferEventConsumer {

    @KafkaListener(
            topics = "wallet-transfers",
            groupId = "fintech-wallet-group"
    )
    public void consumeTransferEvent(String message) {

        System.out.println(
                "KAFKA EVENT RECEIVED: " + message
        );
    }
}