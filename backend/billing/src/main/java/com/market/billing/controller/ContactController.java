package com.market.billing.controller;

import com.market.billing.dto.ContactRequest;
import com.market.billing.dto.MessageResponse;
import com.market.billing.model.ContactMessage;
import com.market.billing.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<MessageResponse> submitContactForm(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(contactService.saveMessage(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }
}
