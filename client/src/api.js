import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const testServerConnection = async () => {
  // ... (נשאר ללא שינוי)
};

export const sendMessage = async (message, settings) => {
  try {
    console.log('Sending to server:', { message, ...settings });
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      message,
      system: settings.system,
      maxTokens: settings.maxTokens,
      temperature: settings.temperature
    });
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.message, error.response?.data);
    throw error;
  }
};

// ... other API functions ...