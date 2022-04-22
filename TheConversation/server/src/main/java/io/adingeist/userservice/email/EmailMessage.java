package io.adingeist.userservice.email;

import org.springframework.context.annotation.Configuration;

import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;

@Configuration // Says this class can be used to configure parts of our backend. In this case, configure the verification email.
public class EmailMessage {
    private String ip = null;

    private String getIp() throws IOException {
        if (ip != null) return ip;

        Socket socket = new Socket();
        socket.connect(new InetSocketAddress("google.com", 80));
        this.ip = socket.getLocalAddress().toString().substring(1);
        socket.close();

        return this.ip;
    }

    public MimeMultipart buildEmail(String code) throws MessagingException, IOException {
        MimeMultipart multipart = new MimeMultipart("related");

        // Create the HTML body part
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        String htmlText =
            "<html>" +
              "<body" +
                    "style=\"" +
                    "font-family: arial, 'helvetica neue', helvetica, sans-serif;" +
                    "\"" +
              ">" +
                "<h3>Let's get you back into your account.</h3>" +
                "<div style=\"height: 5px; width: 50%; background-color: gray\"></div>" +
                "<p>Please use this link to reset your password: " +
                "<a href=\"http://" + this.getIp() + ":3000/resetpassword?t=" + code + "\">Reset password.</a>" +

                "<p style=\"max-width: 300px\">" +
                    "This code will expire in 15 minutes." +
                "</p>" +
              "</body>" +
            "</html>";
        messageBodyPart.setContent(htmlText, "text/html"); // Say what content is in this body part
        multipart.addBodyPart(messageBodyPart); // Add the HTML part into the multipart

        return multipart; // Return the finished email containing HTML and image data
    }
}
