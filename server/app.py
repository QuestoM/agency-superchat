from flask import Flask
from flask_cors import CORS
from controllers.chat_controller import send_message

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    return send_message()

if __name__ == '__main__':
    app.run(debug=True, port=5000)