// Phone validation regex (international format)
export const phoneRegex = /^[+]?[1-9]\d{0,15}$/;

// Strong password validation
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === "") return "Phone number is required";
  if (!phoneRegex.test(phone.trim())) {
    return "Please enter a valid phone number (e.g., +1234567890 or 1234567890)";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!passwordRegex.test(password)) {
    return "Password must contain at least one uppercase letter, lowercase letter, and number";
  }
  return "";
};

export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validateName = (name) => {
  if (!name || name.trim() === "") return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 100) return "Name cannot exceed 100 characters";
  return "";
};
