package com.market.billing.service;

import com.market.billing.dto.ContactRequest;
import com.market.billing.dto.MessageResponse;
import com.market.billing.model.ContactMessage;
import com.market.billing.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactService {

    private final ContactMessageRepository repository;

    public ContactService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public MessageResponse saveMessage(ContactRequest request) {
        ContactMessage message = new ContactMessage(
                request.getName().trim(),
                request.getEmail().trim(),
                request.getSubject().trim(),
                request.getMessage().trim()
        );
        repository.save(message);
        return MessageResponse.ok("Thank you! Your message has been received and our team will get back to you shortly.");
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAllMessages() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
