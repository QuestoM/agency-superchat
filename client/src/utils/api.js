import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const sendMessage = async (message, settings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, ...settings }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getCharacters = async () => {
  const response = await axios.get(`${API_BASE_URL}/characters`);
  return response.data;
};

export const exportChat = async (messages) => {
  const response = await axios.post(`${API_BASE_URL}/export`, { messages });
  const blob = new Blob([response.data], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'chat_export.txt';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};