// pdftoimg.ts
export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

/**
 * Load pdf.js dynamically (Vite-friendly with worker import)
 */
async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = import("pdfjs-dist").then(async (lib) => {
    // Import worker URL (Vite resolves it at build)
    
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    lib.GlobalWorkerOptions.workerSrc = worker.default;

    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}


export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    console.log("Loading pdf.js...");
    const lib = await loadPdfJs();
    console.log("pdf.js loaded:", lib.version);

    const arrayBuffer = await file.arrayBuffer();
    console.log("PDF file size:", arrayBuffer.byteLength);

    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF loaded, total pages:", pdf.numPages);

    const page = await pdf.getPage(1); 
    const viewport = page.getViewport({ scale: 2 }); 

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    await page.render({ canvasContext: context!, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            console.error("Failed to create image blob");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("PDF Conversion Error:", err);
    return {
      imageUrl: "",
      file: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
