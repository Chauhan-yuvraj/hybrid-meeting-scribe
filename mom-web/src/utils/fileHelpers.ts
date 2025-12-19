export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // 100MB limit
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "File is too large. Maximum size is 100MB." };
  }

  // Allowed types
  const allowedTypes = [
    "audio/mp3",
    "audio/mpeg",
    "audio/wav",
    "audio/x-m4a",
    "audio/ogg",
  ];
  
  // Check if type matches allowed list
  const isTypeValid = allowedTypes.some((type) => 
    file.type.includes(type.split("/")[1]) || file.type === type
  );

  if (!isTypeValid) {
    return { valid: false, error: "Please select a valid audio file (MP3, WAV, M4A, OGG)" };
  }

  return { valid: true };
};