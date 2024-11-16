package com.icsi518.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.icsi518.backend.dtos.BalanceSheetItemDto;
import com.icsi518.backend.entities.BalanceSheetItem;

@Mapper(componentModel = "spring")
public interface BalanceSheetItemMapper {

    @Mapping(source = "account.accountId", target = "accountId")
    BalanceSheetItemDto toDto(BalanceSheetItem balanceSheetItem);

    @Mapping(target = "account", ignore = true)
    BalanceSheetItem toEntity(BalanceSheetItemDto balanceSheetItemDto);

    @Mapping(target = "account", ignore = true)
    void updateEntityFromDto(BalanceSheetItemDto balanceSheetItemDto, @MappingTarget BalanceSheetItem balanceSheetItem);
}
