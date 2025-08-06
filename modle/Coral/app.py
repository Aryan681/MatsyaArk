import os
from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS
from PIL import Image
from io import BytesIO
from datetime import datetime
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
from torchvision.models import MobileNet_V2_Weights
import requests
from dotenv import load_dotenv

# Load environment variables from .env (for local dev)
load_dotenv()

app = Flask(__name__)

# CORS settings: allow frontend on Vercel and local dev
CORS(app, origins=[
    "https://matsya-ark.vercel.app",
    "http://localhost:3000"
])

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# URL of React/Node Gemini backend API
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:3000")

# Device setup
device = torch.device("cpu")

# Load the trained model
model = models.mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, 2)
model.load_state_dict(torch.load("coral_bleaching_lightweight.pt", map_location=device))
model.eval()

# Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def process_and_predict(image_stream):
    img = Image.open(image_stream).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        pred_index = torch.argmax(output, dim=1).item()
        label = "Bleached" if pred_index == 0 else "Healthy"

    return label, pred_index, img

@app.route("/predict", methods=["POST"])
def predict_api():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    try:
        label, pred_index, img = process_and_predict(file.stream)

        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        files = {'image': ('image.png', img_byte_arr, 'image/png')}
        try:
            gemini_response = requests.post(f"{BACKEND_URL}/api/gemini", files=files)
            if gemini_response.status_code == 200:
                gemini_text = gemini_response.json().get("result", "No explanation.")
            else:
                gemini_text = "Gemini explanation failed."
        except Exception as e:
            print(f"Gemini request failed: {e}")
            gemini_text = "Gemini backend error."

        return jsonify({
            "prediction": label,
            "class_index": pred_index,
            "gemini_explanation": gemini_text
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Internal server error."}), 500

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    image_url = None
    error = None

    if request.method == "POST":
        if "image" not in request.files or request.files["image"].filename == "":
            error = "Please upload an image."
        else:
            try:
                file = request.files["image"]
                prediction, _, img = process_and_predict(file.stream)

                filename = datetime.now().strftime("%Y%m%d_%H%M%S_") + file.filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                img.save(filepath)
                image_url = url_for('static', filename='uploads/' + filename)

            except Exception as e:
                error = "Invalid image uploaded."
                print(f"Index error: {e}")

    return render_template("index.html", prediction=prediction, image_url=image_url, error=error)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Used by Render
    app.run(host="0.0.0.0", port=port, debug=True)
