import os
from uuid import uuid4
from datetime import datetime
from anthropic import Anthropic
from flask import request, jsonify

anthropic = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def send_message():
    try:
        data = request.json
        message = data.get('message')
        system = data.get('system')
        max_tokens = data.get('maxTokens', 1024)
        temperature = data.get('temperature', 0.7)

        print('Received from client:', {'message': message, 'system': system, 'maxTokens': max_tokens, 'temperature': temperature})

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": message})

        msg = anthropic.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=max_tokens,
            temperature=temperature,
            messages=messages
        )

        print('Anthropic response:', msg)

        formatted_response = {
            "reply": msg.content[0].text,
            "id": str(uuid4()),
            "isUser": False,
            "timestamp": datetime.now().isoformat()
        }

        print('Sending to client:', formatted_response)
        return jsonify(formatted_response)

    except Exception as error:
        print('Error in send_message:', str(error))
        return jsonify({"error": 'Internal server error', "details": str(error)}), 500