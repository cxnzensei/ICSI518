package com.icsi518.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.icsi518.backend.dtos.FamilyDto;
import com.icsi518.backend.dtos.FamilyMinimalDto;
import com.icsi518.backend.entities.Family;

@Mapper(componentModel = "spring")
public interface FamilyMapper {

    @Mapping(target = "members", ignore = true)
    FamilyDto toFamilyDto(Family family);

    FamilyMinimalDto toFamilyMinimalDto(Family family);

}
