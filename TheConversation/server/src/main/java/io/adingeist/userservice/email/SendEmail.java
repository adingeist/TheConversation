package io.adingeist.userservice.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.Properties;

@Service
public class SendEmail {
    // Strings used to connect to the Gmail API
    final String senderEmailID = "YOUR_EMAIL@gmail.com"; // REPLACE WITH YOUR GMAIL ACCOUNT
    final String senderPassword = "XXXX XXXX XXXX XXXX"; // REPLACE WITH YOUR GMAIL APP PASSWORD
    final String emailSMTPserver = "smtp.gmail.com";
    final String emailServerPort = "465";
    // Logs to the console in more detail than console.log.
    private final static Logger LOGGER = LoggerFactory.getLogger(SendEmail.class);

    // Method to send an email
    public void send(String receiverEmail, MimeMultipart emailBody) throws MessagingException {
        Properties props = new Properties(); // Configuration to send an email
        props.put("mail.smtp.user", senderEmailID); // Account sending the email
        props.put("mail.smtp.host", emailSMTPserver); // Uses the standard Simple Mail Transfer Protocol port 465
        props.put("mail.smtp.port", emailServerPort); // Sending from Gmail's server
        props.put("mail.smtp.starttls.enable", "true"); // Upgrade from insecure to an encrypted mail transfer
        props.put("mail.smtp.auth", "true"); // Authorize the receiver to access the email
        props.put("mail.smtp.socketFactory.port", emailServerPort); // Standard SMTP port 465
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory"); // Class that extends the javax.net.ssl.SSLSocketFactory class
        props.put("mail.smtp.socketFactory.fallback", "false"); // Throw an exception if the message fails to create

        // May throw a MessagingException where Gmail fails to connect or send the mail
        Authenticator auth = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(senderEmailID, senderPassword); // Authorize to send mail from adingeist.ag@gmail.com
            }
        };
        Session session = Session.getInstance(props, auth); // Connect to Gmail
        LOGGER.info("Connected to mailing service.");
        MimeMessage msg = new MimeMessage(session); // Create a new email message
        msg.setContent(emailBody); // Set the content to the email body passed as a function argument
        msg.setSubject("Adin's Site Login Link"); // Subject of email
        msg.setFrom(new InternetAddress(senderEmailID)); // Sender
        msg.addRecipient(Message.RecipientType.TO, // Recipient
                new InternetAddress(receiverEmail));
        LOGGER.info("Email sending...");
        Transport.send(msg); // Send the constructed email
        LOGGER.info("Email successfully sent to: " + receiverEmail);
    }
}

