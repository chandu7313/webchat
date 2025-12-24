package com.nexuschat.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateProfileRequest {
    private String profilePic;
    @NotBlank
    private String fullName;
    @NotBlank
    private String bio;

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}

