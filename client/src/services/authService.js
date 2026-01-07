import { API_BASE_URL } from '../config';

const authService = {
  async fetchUser() {
    const res = await fetch(`${API_BASE_URL}/auth`, {
      credentials: "include"
    });
    if(res.status===401) return null;
    return await res.json();
  }
  ,
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
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
      const response = await fetch(`${API_BASE_URL}/signup`, {
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

  async logout() {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });
  },

  async confirmPassword(newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/pwd-reset`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
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
