package com.icsi518.backend.controllers;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icsi518.backend.dtos.BalanceSheetItemDto;
import com.icsi518.backend.entities.BalanceSheetItem.BalanceSheetItemView;
import com.icsi518.backend.services.BalanceSheetItemService;

@RestController
@RequestMapping("/api/v1/balance-sheet-items")
public class BalanceSheetItemController {

    @Autowired
    private BalanceSheetItemService balanceSheetItemService;

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BalanceSheetItemView>> getBalanceSheetItemsByUserId(@RequestParam UUID userId) {
        return ResponseEntity.ok(balanceSheetItemService.getBalanceSheetItemsByUserId(userId));
    }

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BalanceSheetItemDto> createBalanceSheetItem(@RequestParam UUID accountId,
            @RequestBody BalanceSheetItemDto balanceSheetItemDto) {
        BalanceSheetItemDto savedItem = balanceSheetItemService.createBalanceSheetItem(accountId, balanceSheetItemDto);
        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping(path = "/delete/{itemId}")
    public ResponseEntity<Void> deleteBalanceSheetItem(@PathVariable UUID itemId) {
        balanceSheetItemService.deleteBalanceSheetItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(path = "/update/{itemId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BalanceSheetItemDto> updateBalanceSheetItem(@PathVariable UUID itemId,
            @RequestBody Map<String, String> updates) {
        BalanceSheetItemDto updatedBalanceSheetItem = balanceSheetItemService.updateBalanceSheetItem(itemId, updates);
        return ResponseEntity.ok(updatedBalanceSheetItem);
    }
}
