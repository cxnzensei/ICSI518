package com.icsi518.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icsi518.backend.dtos.TransactionDto;
import com.icsi518.backend.entities.Transaction;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "accountId", source = "account.accountId")
    TransactionDto toTransactionDto(Transaction transaction);
    
    @Mapping(target = "account", ignore = true)
    Transaction toEntity(TransactionDto transactionDto);
}
