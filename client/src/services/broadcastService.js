import { API_BASE_URL } from '../config';

const broadcastService = {
  async sendBroadcast(subject, message, recipients) {
    try {
      const response = await fetch(`${API_BASE_URL}/broadcast`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, recipients }),
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error sending broadcast:', error);
      throw error;
    }
  },

  async getStudentEmails() {
    try {
      const response = await fetch(`${API_BASE_URL}/broadcast/emails`, {
        credentials: "include"
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }
};

export default broadcastService;
