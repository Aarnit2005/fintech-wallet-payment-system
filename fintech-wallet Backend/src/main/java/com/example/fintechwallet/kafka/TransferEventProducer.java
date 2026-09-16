package com.example.fintechwallet.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class TransferEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public TransferEventProducer(
            KafkaTemplate<String, String> kafkaTemplate) {

        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendTransferEvent(
            String referenceId,
            Long senderUserId,
            Long receiverUserId,
            String amount) {

        String message =
                "Transfer successful | " +
                        "Reference: " + referenceId +
                        " | Sender: " + senderUserId +
                        " | Receiver: " + receiverUserId +
                        " | Amount: ₹" + amount;

        kafkaTemplate.send(
                "wallet-transfers",
                referenceId,
                message
        );
    }
}