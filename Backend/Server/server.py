from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import sys
import json

# Set up path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
sys.path.append(os.path.join(parent_dir, "Util"))

from Util.gemini import Manager, chat_with_gemini, chat_with_gemini_html

app = Flask(__name__)
CORS(app)

# Store conversation history
conversations = {}

@app.route("/")
@cross_origin(origins="*")
def home():
    """Root endpoint that returns a welcome message."""
    return "Welcome to the backend server!"

@app.route('/chat', methods=["POST"])
@cross_origin(origins="*")
def chatbot():
    """
    Endpoint to handle chat interactions with the Gemini model.
    Expects JSON with user_input, conversation_id, and html fields.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        user_input = data.get("user_input")
        conversation_id = data.get("conversation_id")
        html = data.get("html")

        if conversation_id not in conversations:
            conversations[conversation_id] = []

        response, history = chat_with_gemini_html(user_input, conversations[conversation_id], html)
        conversations[conversation_id] = history

        return jsonify({
            "status": "success",
            "output_dict": response
        })

    except Exception as e:
        return jsonify({"error": f"Error in chatbot: {str(e)}"}), 500

@app.route("/", methods=["POST"])
@cross_origin(origins="*")
def process_html():
    """
    Endpoint to process HTML content and generate summaries.
    Expects JSON with paragraphs field.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        paragraphs = data.get("paragraphs")
        if not paragraphs:
            return jsonify({"error": "Paragraphs not provided"}), 400

        manager = Manager()
        generation = manager.generate(paragraphs)

        return jsonify({
            "status": "success",
            "message": "Processed HTML page and paragraphs",
            "output_dict": generation
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5002)
