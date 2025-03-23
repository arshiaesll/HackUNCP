from flask import Flask
from flask_cors import CORS, cross_origin
import os
import sys
import json

from flask import request, jsonify
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
sys.path.append(os.path.join(parent_dir, "Util"))


from Util.gemini import Manager, chat_with_gemini

app = Flask(__name__)
CORS(app)

conversations = {

}


@app.route("/")
@cross_origin(origins="*")
def home():
    return "Welcome to the backend server!"


@app.route('/chat', methods=["POST"])
@cross_origin(origins="*")
def chatbot():
    
    try:
        data = request.get_json()
        user_input = data.get("user_input")
        conversation_id = data.get("conversation_id")
        if not data:
            return jsonify({"error": "No data provided"}), 400

        paragraphs = data.get("paragraphs")

        if not paragraphs:
            return jsonify({"error": "Paragraphs not provided"}), 400

        if conversation_id not in conversations.keys():
            conversations[conversation_id] = []
        # print(conversations)
        response, history = chat_with_gemini(user_input, conversations[conversation_id], paragraphs)
        print(history)
        conversations[conversation_id] = history

        return jsonify({
            "status": "success",
            "message": "Processed HTML page and paragraphs",
            "output_dict": response
        })
    except Exception as e:
        print(e)
        return jsonify({"error": "Error in chatbot"}), 500
        
@app.route("/", methods=["POST"])
@cross_origin(origins="*")
def process_html():
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # html_page = data.get("html_page")
        paragraphs = data.get("paragraphs")
        
        if not paragraphs:
            return jsonify({"error": "Paragraphs not provided"}), 400
        manager = Manager()
        
        # Create a list to store paragraph data
        paragraph_data = []
        # print(paragraphs)
        # for paragraph in paragraphs:
        # summaries = manager.generate_paragraph_summary(paragraphs)

        # definitions = manager.generate_technical_words(paragraphs)
        generation=manager.generate(paragraphs)
        # Add each paragraph's data to the list
        # for summary in summaries:
        #     id = summary["id"]
        #     paragraph_data.append({
        #         "id": id,
        #         "summary": summary,
        #         "technical_definitions": definitions[id]
        #     
        
        # Process the HTML and paragraphs here
        # This is where you'd add your business logic
        
        return jsonify({
            "status": "success",
            "message": "Processed HTML page and paragraphs",
            "output_dict": generation
        })
        
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    # port = int(input("Enter the port number: "))
    app.run(host="0.0.0.0", debug=True, port=5002)
