import { AUTH_BASE_URL } from '../config';

const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async signup(email, password) {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  async confirmPassword(email, newPassword) {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/confirm-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error confirming password:', error);
      throw error;
    }
  }
};

export default authService;
