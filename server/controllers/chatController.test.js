const { sendMessage } = require('./chatController');
const axios = require('axios');

jest.mock('axios');

describe('sendMessage', () => {
  let req, res;

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
    axios.post.mockResolvedValue({
      data: {
        content: [{ text: 'Hello, human!' }]
      }
    });

    await sendMessage(req, res);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 100,
        temperature: 0.5,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, AI!" }
        ]
      },
      expect.any(Object)
    );
  });

  it('should handle requests without system message', async () => {
    req.body.system = undefined;

    axios.post.mockResolvedValue({
      data: {
        content: [{ text: 'Hello, human!' }]
      }
    });

    await sendMessage(req, res);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 100,
        temperature: 0.5,
        messages: [
          { role: "user", content: "Hello, AI!" }
        ]
      },
      expect.any(Object)
    );
  });

  it('should use default values for maxTokens and temperature', async () => {
    req.body.maxTokens = undefined;
    req.body.temperature = undefined;

    axios.post.mockResolvedValue({
      data: {
        content: [{ text: 'Hello, human!' }]
      }
    });

    await sendMessage(req, res);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, AI!" }
        ]
      },
      expect.any(Object)
    );
  });

  it('should handle API errors', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: 'API Error'
    });
  });
});