// Mock upload service — handles file reading and image compression.
// In production, replace with Firebase Storage or Wix Media uploads.

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const uploadService = {
  async fileToDataUrl(file: File): Promise<{ dataUrl: string; compressedSize: number }> {
    if (file.type.startsWith('image/')) {
      return this.compressImage(file);
    }
    // For non-image files (PDF, DOC), return empty dataUrl with file size
    return { dataUrl: '', compressedSize: file.size };
  },

  async compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<{ dataUrl: string; compressedSize: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const compressedSize = Math.round((dataUrl.length * 3) / 4);
          resolve({ dataUrl, compressedSize });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async uploadProgress(): Promise<number> {
    // Simulates upload progress for the progress bar
    await delay(300);
    return 100;
  },
};
