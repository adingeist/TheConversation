package io.adingeist.userservice.requests;

public class ForgotPasswordRequest {
    private String email;

    ForgotPasswordRequest(String email) {
        this.email = email;
    }

    // Explicit default constructor needed to map request
    public ForgotPasswordRequest() {}

    public String getEmail() { return email; }
}
