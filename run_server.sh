#!/bin/bash
export FLASK_APP=server/app.py
export FLASK_ENV=development
export ANTHROPIC_API_KEY=your_api_key_here
flask run --port=5000