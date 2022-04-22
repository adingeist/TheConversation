package io.adingeist.userservice.requests;

public class ResetPasswordRequest {
    private String resetToken;
    private String newPassword;

    public ResetPasswordRequest(String resetToken, String newPassword) {
        this.resetToken = resetToken;
        this.newPassword = newPassword;
    }

    // Explicit default constructor needed to map request
    public ResetPasswordRequest() {}

    public String getResetToken() {
        return resetToken;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
