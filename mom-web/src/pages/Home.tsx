import { RefreshCw, Sparkles } from "lucide-react";
import { Layout } from "../components/ui/Layout";
import { Button } from "../components/ui/Button";
import Header from "../components/Header";
import FileUploader from "../components/FileUploader";
import StatusCard from "../components/StatusCard";
import ResultCard from "../components/ResultCard";
import { useAudioProcessing } from "../hooks/useAudioProcessing";
import { ModelSelector } from "../components/ModelSelector";
import { cn } from "../lib/utils";

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
  const isIncognito = model === "whisper";

  return (
    <Layout mode={isIncognito ? "incognito" : "light"}>
      <Header isIncognito={isIncognito} />

      {/* Main Control Card */}
      <div className={cn(
        "w-full h-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border transition-all duration-500",
        isIncognito 
          ? "glass-dark border-emerald-900/30 shadow-[0_0_50px_-10px_rgba(16,185,129,0.1)]" 
          : "glass border-white/40 shadow-xl shadow-indigo-500/10"
      )}>
        <div className="flex flex-col gap-8">
          
          <div className="space-y-4">
            <ModelSelector 
              model={model} 
              setModel={setModel} 
              disabled={isProcessing} 
            />

            <FileUploader 
              file={file} 
              onFileSelect={(f) => setFile(f)} 
              disabled={isProcessing}
              isIncognito={isIncognito}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={uploadFile}
                disabled={!file || isProcessing || hasResult}
                className={cn(
                  "flex-1 h-12 text-base transition-all duration-300 shadow-lg",
                  isIncognito 
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 hover:shadow-emerald-500/30" 
                    : "shadow-indigo-500/20 hover:shadow-indigo-500/40"
                )}
              >
                {status === "idle" || status === "error" 
                  ? "Start Transcription" 
                  : hasResult ? "Transcription Done" : "Processing Audio..."}
              </Button>

              {(hasResult || status === "error") && (
                <Button
                  variant="secondary"
                  onClick={resetState}
                  className={cn(
                    "h-12",
                    isIncognito ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700" : ""
                  )}
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
            isIncognito={isIncognito}
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
            isIncognito={isIncognito}
            actionButton={
              <Button
                onClick={generateMOM}
                isLoading={momStatus === "loading"}
                disabled={momStatus === "loading" || !!momResult || status !== "completed"}
                className={cn(
                  "h-9 text-xs shadow-md",
                  isIncognito 
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20" 
                    : "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20"
                )}
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
            isIncognito={isIncognito}
          />
        )}
      </div>
    </Layout>
  );
}

export default Home;