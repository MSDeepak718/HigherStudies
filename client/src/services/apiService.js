import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiService = {
  async fetchStudents() {
    try {
      const response = await axios.get(`${API_BASE_URL}/data`,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  async addStudent(studentData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/data`, studentData ,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  async updateStudent(id, studentData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/data/${id}`, studentData ,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  async deleteStudent(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/data/${id}` ,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
};

export default apiService;
