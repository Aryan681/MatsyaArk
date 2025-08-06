from flask import Flask, render_template, Response, jsonify
import cv2
from ultralytics import YOLO
import threading
import time
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

app = Flask(__name__)
CORS(app)

# Load the YOLOv8 model
model = YOLO('best.pt')

# Use environment variable or default video path
VIDEO_PATH = os.getenv('VIDEO_PATH', 'This_the_fish_202507231344_tvan4.mp4')

# Shared data structure for latest detections
latest_detections = []
frame_lock = threading.Lock()

def process_video_and_detect():
    global latest_detections
    camera = cv2.VideoCapture(VIDEO_PATH)

    if not camera.isOpened():
        print(f"Error: Could not open video file: {VIDEO_PATH}")
        return

    while True:
        success, frame = camera.read()
        if not success:
            camera.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        results = model(frame, verbose=False)

        detections_for_frame = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                confidence = round(float(box.conf[0]), 2)
                class_id = int(box.cls[0])
                class_name = model.names[class_id]

                detections_for_frame.append({
                    "class_name": class_name,
                    "confidence": confidence,
                    "box": [x1, y1, x2, y2]
                })

            with frame_lock:
                global _latest_annotated_frame
                _latest_annotated_frame = r.plot()

        with frame_lock:
            latest_detections = detections_for_frame

        time.sleep(0.01)

_latest_annotated_frame = None

def generate_frames():
    while True:
        with frame_lock:
            if _latest_annotated_frame is None:
                continue
            ret, buffer = cv2.imencode('.jpg', _latest_annotated_frame)
            if not ret:
                continue
            frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.01)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detections')
def get_detections():
    with frame_lock:
        data = {"detections": latest_detections}
    return jsonify(data)

if __name__ == '__main__':
    processing_thread = threading.Thread(target=process_video_and_detect)
    processing_thread.daemon = True
    processing_thread.start()

    # Read from .env or use default
    port = int(os.getenv('PORT', 8000))
    debug_mode = os.getenv('DEBUG', 'True').lower() == 'true'

    app.run(host='0.0.0.0', port=port, debug=debug_mode, threaded=True)
