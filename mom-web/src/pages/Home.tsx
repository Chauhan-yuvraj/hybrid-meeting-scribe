import { RefreshCw, Sparkles } from "lucide-react";
import { Layout } from "../components/ui/Layout";
import { Button } from "../components/ui/Button";
import Header from "../components/Header";
import FileUploader from "../components/FileUploader";
import StatusCard from "../components/StatusCard";
import ResultCard from "../components/ResultCard";
import { useAudioProcessing } from "../hooks/useAudioProcessing";

function Home() {
  const {
    file,
    setFile,
    transcript,
    model,
    setModel,
    status,
    statusMessage,
    progress,
    momStatus,
    momResult,
    uploadFile,
    generateMOM,
    resetState,
  } = useAudioProcessing();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isProcessing = status === "uploading" || status === "processing";
  const hasResult = status === "completed";

  return (
    <Layout>
      <Header />

      {/* Main Control Card */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-100/50 border border-white/50 ring-1 ring-slate-100">
        <div className="flex flex-col gap-8">
          
          <div className="space-y-4">
            <div className="flex gap-2 justify-center pb-2">
              <button
                onClick={() => setModel("gemini")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  model === "gemini"
                    ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Gemini 2.0 Flash
              </button>
              <button
                onClick={() => setModel("whisper")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  model === "whisper"
                    ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                OpenAI Whisper
              </button>
            </div>

            <FileUploader 
              file={file} 
              onFileSelect={(f) => setFile(f)} 
              disabled={isProcessing} 
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={uploadFile}
                disabled={!file || isProcessing || hasResult}
                className="flex-1 h-12 text-base"
              >
                {status === "idle" || status === "error" 
                  ? "Start Transcription" 
                  : hasResult ? "Transcription Done" : "Processing Audio..."}
              </Button>

              {(hasResult || status === "error") && (
                <Button
                  variant="secondary"
                  onClick={resetState}
                  className="h-12"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <StatusCard 
            status={status} 
            progress={progress} 
            message={statusMessage} 
          />
        </div>
      </div>

      {/* Results Section - Conditionally Rendered */}
      <div className="w-full max-w-4xl space-y-8 pb-20">
        {transcript && (status === "completed" || status === "processing") && (
          <ResultCard
            title={status === "processing" ? "Transcribing..." : "Transcription Result"}
            type="transcript"
            content={transcript}
            onCopy={() => handleCopy(transcript)}
            actionButton={
              <Button
                onClick={generateMOM}
                isLoading={momStatus === "loading"}
                disabled={momStatus === "loading" || !!momResult || status !== "completed"}
                className="bg-violet-600 hover:bg-violet-700 h-9 text-xs"
              >
                {!momStatus && <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                Generate MOM
              </Button>
            }
          />
        )}

        {momResult && momStatus === "completed" && (
          <ResultCard
            title="Minutes of Meeting"
            type="mom"
            content={momResult}
            onCopy={() => handleCopy(momResult)}
          />
        )}
      </div>
    </Layout>
  );
}

export default Home;