from flask import Flask, render_template, Response, jsonify
import cv2
from ultralytics import YOLO
import threading
import time
from flask_cors import CORS
import torch # Import torch to check for CUDA availability

app = Flask(__name__)
CORS(app)

# --- MODIFICATION START ---
# Load the YOLOv8 model
# Check if CUDA (GPU) is available and set the device accordingly
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}") # Print which device is being used
model = YOLO('best.pt')

# Ensure the model uses the specified device
# This is typically done automatically if `torch.cuda.is_available()` is true
# but you can explicitly set it for clarity or if you have multiple GPUs
# (e.g., device='cuda:0', 'cuda:1' etc.)
model.to(device)
# --- MODIFICATION END ---

# Shared data structure for latest detections
latest_detections = []
frame_lock = threading.Lock() # To protect shared data

# Thread for continuously processing video frames and updating detections
def process_video_and_detect():
    global latest_detections
    video_path = 'This_the_fish_202507231344_tvan5.mp4'
    camera = cv2.VideoCapture(video_path)

    if not camera.isOpened():
        print(f"Error: Could not open video file: {video_path}")
        return

    while True:
        success, frame = camera.read()
        if not success:
            camera.set(cv2.CAP_PROP_POS_FRAMES, 0) # Loop video
            continue

        # --- MODIFICATION START ---
        # Pass the 'device' argument to the model's predict method
        results = model(frame, verbose=False, device=device)
        # --- MODIFICATION END ---
        
        detections_for_frame = []
        for r in results:
            # Get bounding box coordinates, class, and confidence
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
            
            # This is where the annotated frame is generated for the video feed
            # Ensure 'annotated_frame' is available for generate_frames
            with frame_lock: # Protect shared frame update
                # Store the latest annotated frame for video_feed
                global _latest_annotated_frame
                _latest_annotated_frame = r.plot() 
        
        with frame_lock: # Protect shared detection data
            latest_detections = detections_for_frame

        time.sleep(0.01) # Small delay to prevent 100% CPU usage if processing is very fast

_latest_annotated_frame = None # Global to hold the last processed frame for video_feed

def generate_frames():
    """Generator function to yield annotated frames."""
    while True:
        with frame_lock:
            if _latest_annotated_frame is None:
                continue # Wait until the first frame is processed

            ret, buffer = cv2.imencode('.jpg', _latest_annotated_frame)
            if not ret:
                continue
            frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\r' + frame_bytes + b'\r\n')
        time.sleep(0.01) # Add a small delay for stream stability

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detections')
def get_detections():
    """API endpoint to get the latest object detection data."""
    with frame_lock: # Read shared data safely
        data = {"detections": latest_detections}
    return jsonify(data)

if __name__ == '__main__':
    # Start the video processing and detection in a separate thread
    processing_thread = threading.Thread(target=process_video_and_detect)
    processing_thread.daemon = True # Allow the main program to exit even if thread is running
    processing_thread.start()

    app.run(debug=True, threaded=True,port=8000) # Ensure Flask runs in threaded mode