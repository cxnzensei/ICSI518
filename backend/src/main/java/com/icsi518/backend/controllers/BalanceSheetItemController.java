package com.icsi518.backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.icsi518.backend.dtos.BalanceSheetItemDto;
import com.icsi518.backend.services.BalanceSheetItemService;

@RestController
@RequestMapping("/api/v1/balance-sheet-items")
public class BalanceSheetItemController {

    @Autowired
    private BalanceSheetItemService balanceSheetItemService;

    @GetMapping(path = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BalanceSheetItemDto>> getBalanceSheetItemsByUserId(@PathVariable UUID userId) {
        List<BalanceSheetItemDto> items = balanceSheetItemService.getBalanceSheetItemsByUserId(userId);
        return ResponseEntity.ok(items);
    }

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BalanceSheetItemDto> createBalanceSheetItem(
            @RequestBody BalanceSheetItemDto balanceSheetItemDto) {
        BalanceSheetItemDto savedItem = balanceSheetItemService.createBalanceSheetItem(balanceSheetItemDto);
        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping(path = "/delete/{itemId}")
    public ResponseEntity<Void> deleteBalanceSheetItem(@PathVariable UUID itemId) {
        balanceSheetItemService.deleteBalanceSheetItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(path = "/update/{itemId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BalanceSheetItemDto> updateBalanceSheetItem(@PathVariable UUID itemId,
            @RequestBody BalanceSheetItemDto balanceSheetItemDto) {
        BalanceSheetItemDto updatedBalanceSheetItem = balanceSheetItemService.updateBalanceSheetItem(itemId,
                balanceSheetItemDto);
        return ResponseEntity.ok(updatedBalanceSheetItem);
    }
}
