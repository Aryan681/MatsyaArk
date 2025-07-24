from flask import Flask, request, jsonify, render_template, url_for
from PIL import Image
import os
import torch
import torchvision.transforms as transforms
from torchvision import models
import torch.nn as nn
from datetime import datetime
import requests
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load model
device = torch.device("cpu")
from torchvision.models import MobileNet_V2_Weights
model = models.mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, 2)
model.load_state_dict(torch.load("coral_bleaching_lightweight.pt", map_location=device))
model.eval()

# Image transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

@app.route("/predict", methods=["POST"])
def predict_api():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded!"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    try:
        # Load and transform image
        img = Image.open(file).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(device)

        # Predict
        with torch.no_grad():
            output = model(img_tensor)
            pred = torch.argmax(output, dim=1).item()
            label = "Bleached" if pred == 0 else "Healthy"

        # Save image temporarily with correct extension
        original_ext = os.path.splitext(file.filename)[1].lower() or '.jpg'
        temp_filename = f"temp{original_ext}"
        temp_image_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
        img.save(temp_image_path)

        # Send image file to Node server
        with open(temp_image_path, 'rb') as img_file:
            files = {'image': (temp_filename, img_file, f'image/{original_ext.strip(".")}')}
            gemini_response = requests.post("http://localhost:3000/api/gemini", files=files)

        if gemini_response.status_code != 200:
            gemini_text = "Gemini explanation failed."
        else:
            gemini_text = gemini_response.json().get("result", "No response.")

        return jsonify({
            "prediction": label,
            "class_index": pred,
            "gemini_explanation": gemini_text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    image_url = None

    if request.method == "POST":
        if "image" not in request.files:
            return "No image uploaded!"
        file = request.files["image"]
        if file.filename == "":
            return "No file selected."

        filename = datetime.now().strftime("%Y%m%d_%H%M%S_") + file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        img = Image.open(filepath).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            pred = torch.argmax(output, dim=1).item()
            prediction = "Bleached" if pred == 0 else "Healthy"
            image_url = url_for('static', filename='uploads/' + filename)

    return render_template("index.html", prediction=prediction, image_url=image_url)

if __name__ == "__main__":
    app.run(debug=True)
