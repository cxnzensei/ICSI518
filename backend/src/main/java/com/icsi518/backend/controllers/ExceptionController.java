package com.icsi518.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.icsi518.backend.exceptions.ApplicationException;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<String> handleApplicationExceptions(ApplicationException e) {
        return new ResponseEntity<>(e.getMessage(), e.getStatus());
    }
}
