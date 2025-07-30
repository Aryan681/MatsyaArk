from flask import Flask, render_template, Response
import cv2
from ultralytics import YOLO

app = Flask(__name__)

# Load the YOLOv8 model
model = YOLO('best.pt')

def generate_frames():
    """Generator function to read frames from a video file, process them, and yield them."""
    
    # --- CHANGE IS HERE ---
    # Open the video file instead of the webcam
    video_path = 'This_the_fish_202507231344_tvan4.mp4'
    camera = cv2.VideoCapture(video_path)
    
    if not camera.isOpened():
        raise RuntimeError(f"Could not open video file: {video_path}")

    while True:
        # Read a frame from the video
        success, frame = camera.read()
        
        # --- LOGIC FOR LOOPING ---
        if not success:
            # If the video has ended, reset to the first frame
            camera.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue # Skip the rest of the loop to read the new frame

        # Perform YOLOv8 inference on the frame
        results = model(frame, stream=True)

        # Loop through the results and draw boxes
        for r in results:
            annotated_frame = r.plot()

        # Encode the annotated frame into JPEG format
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        if not ret:
            continue
        
        frame_bytes = buffer.tobytes()

        # Yield the frame for the multipart response
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)