package com.icsi518.backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.entities.BalanceSheetItem;
import com.icsi518.backend.exceptions.ApplicationException;
import com.icsi518.backend.services.BalanceSheetItemService;

@RestController
@RequestMapping("/api/v1/balance-sheet-items")
public class BalanceSheetItemController {

    @Autowired
    private BalanceSheetItemService balanceSheetItemService;

    @GetMapping(path = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BalanceSheetItem>> getBalanceSheetItemsByUserId(@PathVariable UUID userId) {
        List<BalanceSheetItem> items = balanceSheetItemService.getBalanceSheetItemsByUserId(userId);
        if (items.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(items);
        }
    }

    @PostMapping(path = "/create/{accountId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BalanceSheetItem> createBalanceSheetItem(@PathVariable UUID accountId,
            @RequestBody BalanceSheetItem balanceSheetItem) {
        try {
            BalanceSheetItem savedItem = balanceSheetItemService.createBalanceSheetItem(accountId, balanceSheetItem);
            return ResponseEntity.ok(savedItem);
        } catch (ApplicationException e) {
            throw new ApplicationException(e.getMessage(), e.getStatus());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(path = "/delete/{itemId}")
    public ResponseEntity<Void> deleteBalanceSheetItem(@PathVariable UUID itemId) {
        try {
            balanceSheetItemService.deleteBalanceSheetItem(itemId);
            return ResponseEntity.noContent().build();
        } catch (ApplicationException e) {
            throw new ApplicationException(e.getMessage(), e.getStatus());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/update/{itemId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BalanceSheetItem> updateBalanceSheetItem(@PathVariable UUID itemId,
            @RequestBody BalanceSheetItem balanceSheetItemDetails) {
        try {
            BalanceSheetItem updatedBalanceSheetItem = balanceSheetItemService.updateBalanceSheetItem(itemId,
                    balanceSheetItemDetails);
            return ResponseEntity.ok(updatedBalanceSheetItem);
        } catch (ApplicationException e) {
            throw new ApplicationException(e.getMessage(), e.getStatus());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
