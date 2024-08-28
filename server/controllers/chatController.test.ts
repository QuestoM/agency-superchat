import { sendMessage } from './chatController';
import { Anthropic } from '@anthropic-ai/sdk';
import { Request, Response } from 'express';

jest.mock('@anthropic-ai/sdk');

describe('sendMessage', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        message: 'Hello, AI!',
        system: 'You are a helpful assistant.',
        maxTokens: 100,
        temperature: 0.5
      }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  it('should send correct request to Anthropic API', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      content: [{ text: 'Hello, human!' }]
    });
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => ({
      messages: { create: mockCreate },
    } as unknown as Anthropic));

    await sendMessage(req as Request, res as Response);

    expect(mockCreate).toHaveBeenCalledWith({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 100,
      temperature: 0.5,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, AI!" }
      ]
    });
  });

  it('should handle requests without system message', async () => {
    req.body.system = undefined;

    const mockCreate = jest.fn().mockResolvedValue({
      content: [{ text: 'Hello, human!' }]
    });
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => ({
      messages: { create: mockCreate },
    } as unknown as Anthropic));

    await sendMessage(req as Request, res as Response);

    expect(mockCreate).toHaveBeenCalledWith({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 100,
      temperature: 0.5,
      messages: [
        { role: "user", content: "Hello, AI!" }
      ]
    });
  });

  it('should use default values for maxTokens and temperature', async () => {
    req.body.maxTokens = undefined;
    req.body.temperature = undefined;

    const mockCreate = jest.fn().mockResolvedValue({
      content: [{ text: 'Hello, human!' }]
    });
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => ({
      messages: { create: mockCreate },
    } as unknown as Anthropic));

    await sendMessage(req as Request, res as Response);

    expect(mockCreate).toHaveBeenCalledWith({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      temperature: 0.7,
      system: "You are a helpful assistant.",
      messages: [
        { role: "user", content: "Hello, AI!" }
      ]
    });
  });

  it('should handle API errors', async () => {
    const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'));
    (Anthropic as jest.MockedClass<typeof Anthropic>).mockImplementation(() => ({
      messages: { create: mockCreate },
    } as unknown as Anthropic));

    await sendMessage(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: 'API Error'
    });
  });
});