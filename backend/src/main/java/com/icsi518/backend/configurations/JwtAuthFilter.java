package com.icsi518.backend.configurations;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.icsi518.backend.exceptions.ApplicationException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthProvider userAuthProvider;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    try {
                        SecurityContextHolder.getContext()
                                .setAuthentication(userAuthProvider.validateToken(cookie.getValue()));
                    } catch (Exception e) {
                        SecurityContextHolder.clearContext();
                        throw new ApplicationException("Unauthorized token", HttpStatus.UNAUTHORIZED);
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }

}
