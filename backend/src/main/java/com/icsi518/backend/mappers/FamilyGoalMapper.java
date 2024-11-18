package com.icsi518.backend.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.icsi518.backend.dtos.FamilyGoalDto;
import com.icsi518.backend.entities.FamilyGoal;

@Mapper(componentModel = "spring", uses = { IndividualGoalMapper.class })
public interface FamilyGoalMapper {

    FamilyGoalDto toDto(FamilyGoal familyGoal);

    @Mapping(target = "family", ignore = true)
    FamilyGoal toEntity(FamilyGoalDto familyGoalDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "family", ignore = true)
    void updateEntityFromDto(FamilyGoalDto familyGoalDto, @MappingTarget FamilyGoal familyGoal);
}
