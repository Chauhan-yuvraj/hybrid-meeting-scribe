# AI Meeting Minutes Generator (MOM)

A powerful full-stack application designed to transcribe meeting audio and generate professional Minutes of the Meeting (MOM) using advanced AI models. This project supports both **Cloud-based** (Google Gemini) and **Local/Offline** (Whisper + Ollama) processing pipelines.

## 🚀 Features

*   **Dual Transcription Modes:**
    *   **Cloud:** Uses Google Gemini 2.0 Flash for fast, cloud-based transcription.
    *   **Local:** Uses OpenAI Whisper (via `faster-whisper`) running locally on your machine with **real-time streaming** feedback.
*   **Intelligent Summarization:**
    *   Generates structured Minutes of Meeting (MOM) including Executive Summary, Topic Analysis, Decisions, and Action Items.
    *   Supports **Google Gemini 1.5 Flash** (Cloud) or **Ollama Llama 3** (Local).
*   **Modern UI:** Built with React, Tailwind CSS, and Vite for a responsive and clean user experience.
*   **Privacy Focused:** Option to run entirely offline using local models.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React.
*   **Backend:** Node.js, Express, TypeScript.
*   **AI/ML:**
    *   Google Generative AI SDK.
    *   Python (for `faster-whisper`).
    *   Ollama (for local LLM inference).

## 📋 Prerequisites

*   **Node.js** (v18 or higher)
*   **Python** (3.8 or higher)
*   **Ollama** (installed and running for local mode)
*   **Google API Key** (for cloud mode)

## ⚙️ Installation & Setup

### 1. Backend Setup

Navigate to the backend folder:
```bash
cd mom-backend
```

**Install Node.js dependencies:**
```bash
npm install
```

**Setup Python Environment (for Whisper):**
```bash
cd python_core
python -m venv venv

# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `mom-backend` root:
```env
PORT=8000
GOOGLE_API_KEY=your_google_api_key_here
# Optional keys if you extend functionality
OPENAI_API_KEY=
SARVAM_AI=
```

**Start the Backend:**
```bash
# Make sure you are in mom-backend root
npm run dev
```

### 2. Frontend Setup

Open a new terminal and navigate to the frontend folder:
```bash
cd mom-web
```

**Install dependencies:**
```bash
npm install
```

**Start the Frontend:**
```bash
npm run dev
```

### 3. Local AI Setup (Ollama)

If you plan to use the "Whisper" / Local mode, you need Ollama running.

1.  Download and install [Ollama](https://ollama.com/).
2.  Pull the required model (Llama 3 is recommended for speed/quality balance):
    ```bash
    ollama pull llama3
    ```
3.  Ensure Ollama is running (`ollama serve` or just open the app).

## 🖥️ Usage

1.  Open your browser and go to `http://localhost:5173`.
2.  **Select Mode:**
    *   **Gemini 2.0 Flash:** Uploads audio to Google for transcription. Fast and accurate.
    *   **OpenAI Whisper:** Processes audio locally on your machine. Privacy-friendly.
3.  **Upload Audio:** Select an MP3, WAV, or M4A file.
4.  **Transcription:** Watch the text appear in real-time (Whisper mode) or wait for processing (Gemini mode).
5.  **Generate MOM:** Once transcription is done, click "Generate MOM" to create the summary.

## ⚠️ Troubleshooting

*   **Whisper is slow:** Local transcription depends heavily on your hardware. If you don't have a GPU, it will run on CPU which is slower.
*   **Ollama Error:** Ensure Ollama is running and you have pulled the `llama3` model.
*   **Google API 429/404:** Check your API key quota and ensure you are using a supported model version (currently configured to `gemini-1.5-flash` or `gemini-2.0-flash-lite`).

## 📄 License

MIT
