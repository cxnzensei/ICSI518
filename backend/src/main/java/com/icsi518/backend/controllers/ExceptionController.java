package com.icsi518.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.icsi518.backend.dtos.ErrorDto;
import com.icsi518.backend.exceptions.ApplicationException;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(value = { ApplicationException.class })
    @ResponseBody
    public ResponseEntity<ErrorDto> handleException(ApplicationException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ErrorDto.builder().message(ex.getMessage()).build());
    }

}
