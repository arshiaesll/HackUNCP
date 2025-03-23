
from flask import Flask
from flask_cors import CORS
import os
import sys


current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
sys.path.append(os.path.join(parent_dir, "Util"))


from Util.Test import test


app = Flask(__name__)
CORS(app)

@app.route("/test")
def test():
    return test()



if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)