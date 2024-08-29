import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from controllers.chat_controller import send_message

class TestChatController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    @patch('controllers.chat_controller.anthropic')
    def test_send_message_with_system(self, mock_anthropic):
        mock_create = MagicMock()
        mock_create.return_value.content = [MagicMock(text="Hello, human!")]
        mock_anthropic.messages.create = mock_create

        with self.app.test_request_context('/api/chat', json={
            'message': 'Hello, AI!',
            'system': 'You are a helpful assistant.',
            'maxTokens': 100,
            'temperature': 0.5
        }):
            response = send_message()
            
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['reply'], "Hello, human!")
        mock_create.assert_called_with(
            model="claude-3-5-sonnet-20240620",
            max_tokens=100,
            temperature=0.5,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, AI!"}
            ]
        )

    @patch('controllers.chat_controller.anthropic')
    def test_send_message_without_system(self, mock_anthropic):
        mock_create = MagicMock()
        mock_create.return_value.content = [MagicMock(text="Hello, human!")]
        mock_anthropic.messages.create = mock_create

        with self.app.test_request_context('/api/chat', json={
            'message': 'Hello, AI!',
            'maxTokens': 100,
            'temperature': 0.5
        }):
            response = send_message()
            
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['reply'], "Hello, human!")
        mock_create.assert_called_with(
            model="claude-3-5-sonnet-20240620",
            max_tokens=100,
            temperature=0.5,
            messages=[
                {"role": "user", "content": "Hello, AI!"}
            ]
        )

if __name__ == '__main__':
    unittest.main()