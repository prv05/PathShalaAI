export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return { isValid: false, error: "Password must be at least 8 characters long." };
    }
    if (!hasUpperCase) {
        return { isValid: false, error: "Password must contain at least one uppercase letter." };
    }
    if (!hasLowerCase) {
        return { isValid: false, error: "Password must contain at least one lowercase letter." };
    }
    if (!hasNumber) {
        return { isValid: false, error: "Password must contain at least one number." };
    }
    if (!hasSpecialChar) {
        return { isValid: false, error: "Password must contain at least one special character." };
    }

    return { isValid: true, error: "" };
};
