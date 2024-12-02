package com.icsi518.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail,
                                String subject,
                                String body) 
    {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("wealthwiseteams@gmail.com");
            message.setTo(toEmail);
            message.setText(body);
            message.setSubject(subject);
            mailSender.send(message);
        } catch(Exception e) {
            System.out.println("Error in sending email");
        }


    }

    }