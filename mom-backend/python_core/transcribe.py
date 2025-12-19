import sys
import json
import os
import multiprocessing
from faster_whisper import WhisperModel

# --- OPTIMIZATION 1: Use the Turbo model ---
# This model is optimized for speed but keeps multilingual support (Hindi/Gujarati).
# If this fails to download, run: pip install --upgrade faster-whisper
model_size = "deepdml/faster-whisper-large-v3-turbo-ct2"

device = "cuda"

def transcribe(audio_path):
    try:
        # --- OPTIMIZATION 2: Maximize CPU Threads ---
        # Use 75% of available cores. 
        # If you have 8 cores, this uses 6.
        threads = max(1, int(multiprocessing.cpu_count() * 0.75))
        
        # print(f"Loading model with {threads} threads...", file=sys.stderr)
        
        model = WhisperModel(
            model_size, 
            device=device, 
            compute_type="float16", 
            cpu_threads=threads,
            num_workers=1
        )

        segments, info = model.transcribe(
            audio_path,
            # --- OPTIMIZATION 3: Greedy Search ---
            # beam_size=1 is 2x-3x faster than beam_size=5.
            # It is slightly less accurate for very mumbled speech, but worth the speed.
            beam_size=1, 
            vad_filter=True, # Skips silence
            initial_prompt="This is a business meeting in India involving English, Hindi, and Gujarati speakers."
        )

        # Send Meta Data
        print(json.dumps({
            "type": "meta",
            "language": info.language,
            "probability": info.language_probability
        }), flush=True)

        # Stream Segments
        for segment in segments:
            data = {
                "type": "segment",
                "start": segment.start,
                "end": segment.end,
                "text": segment.text
            }
            print(json.dumps(data), flush=True) 

    except Exception as e:
        print(json.dumps({"type": "error", "message": str(e)}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')

    if len(sys.argv) < 2:
        sys.exit(1)
    
    audio_path = sys.argv[1]
    if not os.path.exists(audio_path):
        print(json.dumps({"type": "error", "message": "File not found"}))
        sys.exit(1)

    transcribe(audio_path)