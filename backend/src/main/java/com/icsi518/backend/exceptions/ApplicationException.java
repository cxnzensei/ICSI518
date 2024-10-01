package com.icsi518.backend.exceptions;

import java.io.Serial;

import org.springframework.http.HttpStatus;

public class ApplicationException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    private HttpStatus status;

    public ApplicationException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

}
