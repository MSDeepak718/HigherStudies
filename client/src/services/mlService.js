import { API_BASE_URL, ML_BASE_URL } from '../config';

const mlService = {
  async getRecommendations(studentData) {
    try {
      const response = await fetch(`${ML_BASE_URL}/predict-eligible-colleges/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  async startStreamlit() {
    try {
      const response = await fetch(`${API_BASE_URL}/start-streamlit`);
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Error starting Streamlit:', error);
      throw error;
    }
  }
};

export default mlService;
