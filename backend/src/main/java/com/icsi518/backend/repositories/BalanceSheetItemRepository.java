package com.icsi518.backend.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icsi518.backend.entities.BalanceSheetItem;
import com.icsi518.backend.entities.BalanceSheetItem.BalanceSheetItemView;

@Repository
public interface BalanceSheetItemRepository extends JpaRepository<BalanceSheetItem, UUID> {
    List<BalanceSheetItemView> findByAccount_AccountIdIn(List<UUID> accountIds);
}
