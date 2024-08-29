import { Anthropic } from '@anthropic-ai/sdk';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, system, maxTokens, temperature } = req.body;
    console.log('Received from client:', { message, system, maxTokens, temperature });

    const messages = [];
    if (system) {
      messages.push({ role: "system", content: system });
      console.log('System prompt:', system);  // Added log
    }
    messages.push({ role: "user", content: message });

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: maxTokens || 1024,
      temperature: temperature || 0.7,
      messages: messages
    });

    console.log('Anthropic response:', msg);  // Added log

    const formattedResponse = {
      reply: msg.content[0].text,
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