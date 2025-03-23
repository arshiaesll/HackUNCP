from flask import Flask
from flask_cors import CORS
import os
import sys


current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
sys.path.append(os.path.join(parent_dir, "Util"))


from Util.Test import test
from Util.gemini import generate_paragraph_summary

app = Flask(__name__)
CORS(app)

@app.route("/test")
def function():
    return test()

@app.route("/")
def home():
    return "Welcome to the backend server!"

@app.route("/process_html", methods=["POST"])
def process_html():
    from flask import request, jsonify
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        html_page = data.get("html_page")
        paragraphs = data.get("paragraphs")
        
        if not html_page:
            return jsonify({"error": "HTML page not provided"}), 400
        if not paragraphs:
            return jsonify({"error": "Paragraphs not provided"}), 400

        for paragraph in paragraphs:
            summary = generate_paragraph_summary(paragraph)
            print(summary)
        # Process the HTML and paragraphs here
        # This is where you'd add your business logic
        
        return jsonify({
            "status": "success",
            "message": "Received HTML page and paragraphs",
            "paragraphs_count": len(paragraphs)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)