from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from ultralytics import YOLO
import cv2
import base64
import io
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Load model only once
model = YOLO('yolov8n.pt')  # or your custom model

def read_image_from_base64(base64_string):
    image_data = base64.b64decode(base64_string.split(',')[-1])
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        base64_image = data['image']
        image_data = base64.b64decode(base64_image.split(',')[-1])
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        image_path = "/tmp/i.jpg"
        image.save(image_path)

        results = model(image_path)
        names = model.names

        detections = []
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                detections.append({
                    'class': names[class_id],
                    'confidence': round(conf, 2)
                })

        return jsonify({'detections': detections})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
