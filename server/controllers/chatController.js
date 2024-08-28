const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

exports.sendMessage = async (req, res) => {
  try {
    const { message, system, maxTokens, temperature } = req.body;
    console.log('Received from client:', { message, system, maxTokens, temperature });

    const messages = [];
    if (system) {
      messages.push({ role: "system", content: system });
    }
    messages.push({ role: "user", content: message });

    const requestBody = {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: maxTokens || 1024,
      temperature: temperature || 0.7,
      messages: messages
    };

    console.log('Sending to Anthropic:', requestBody);

    const response = await axios.post(
      ANTHROPIC_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('Anthropic response:', response.data);

    const aiResponse = response.data.content[0].text;

    const formattedResponse = {
      reply: aiResponse,
      id: uuidv4(),
      isUser: false,
      timestamp: new Date().toISOString()
    };

    console.log('Sending to client:', formattedResponse);
    res.json(formattedResponse);
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getConversationHistory = async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  try {
    // Here you would typically fetch the conversation history from a database
    // For now, we'll just return a placeholder response
    res.json({
      conversationId,
      messages: [
        { role: 'user', content: 'This is a placeholder for conversation history' },
        { role: 'assistant', content: 'Actual implementation would fetch real messages' }
      ]
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
};