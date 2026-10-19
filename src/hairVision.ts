import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

const WASM_ROOTS = [
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm',
  'https://unpkg.com/@mediapipe/tasks-vision@0.10.22/wasm',
] as const;
const HAIR_MODEL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite';
const MODEL_DOWNLOAD_TIMEOUT_MS = 25_000;

export type HairVisionStatus = 'loading' | 'ready' | 'error';

type MaskBuffer = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pixels: ImageData;
};

const maskBuffers = new WeakMap<HTMLCanvasElement, MaskBuffer>();

async function downloadHairModel(): Promise<Uint8Array> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), MODEL_DOWNLOAD_TIMEOUT_MS);
  try {
    const response = await fetch(HAIR_MODEL, {
      mode: 'cors',
      credentials: 'omit',
      cache: 'force-cache',
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Server model mengembalikan HTTP ${response.status}.`);
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength < 100_000) {
      throw new Error('File model yang diterima terlalu kecil atau bukan file model yang valid.');
    }
    return bytes;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Unduhan model AI melewati batas waktu 25 detik.');
    }
    if (error instanceof TypeError) {
      throw new Error('Model AI tidak dapat diunduh. Periksa koneksi internet, VPN, firewall, atau pemblokir konten.');
    }
    throw error instanceof Error ? error : new Error('Unduhan model AI gagal.');
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function createHairSegmenter(): Promise<ImageSegmenter> {
  let modelBuffer: Uint8Array;
  try {
    modelBuffer = await downloadHairModel();
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'kesalahan unduhan tidak diketahui';
    throw new Error(`Model AI rambut gagal dimuat: ${detail}`);
  }

  const failures: string[] = [];
  for (const wasmRoot of WASM_ROOTS) {
    try {
      const vision = await FilesetResolver.forVisionTasks(wasmRoot);
      const options = {
        baseOptions: { modelAssetBuffer: modelBuffer },
        runningMode: 'VIDEO' as const,
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      };

      try {
        return await ImageSegmenter.createFromOptions(vision, {
          ...options,
          baseOptions: { ...options.baseOptions, delegate: 'GPU' },
        });
      } catch (gpuError) {
        // GPU is not supported consistently across browsers/devices; retry on CPU.
        try {
          return await ImageSegmenter.createFromOptions(vision, options);
        } catch (cpuError) {
          const detail = cpuError instanceof Error ? cpuError.message : String(cpuError);
          failures.push(`${new URL(wasmRoot).hostname}: ${detail}`);
          // Continue to the alternate WASM CDN if this runtime cannot initialize.
          void gpuError;
        }
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      failures.push(`${new URL(wasmRoot).hostname}: ${detail}`);
    }
  }

  throw new Error(`Runtime AI tidak dapat dijalankan pada perangkat ini. ${failures.join(' | ')}`);
}

function getMaskBuffer(
  outputCanvas: HTMLCanvasElement,
  width: number,
  height: number,
): MaskBuffer | null {
  const cached = maskBuffers.get(outputCanvas);
  if (cached && cached.canvas.width === width && cached.canvas.height === height) return cached;

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const context = maskCanvas.getContext('2d');
  if (!context) return null;

  const buffer = { canvas: maskCanvas, context, pixels: new ImageData(width, height) };
  maskBuffers.set(outputCanvas, buffer);
  return buffer;
}

/**
 * Recolors pixels classified as hair by MediaPipe's hair segmentation model.
 * Reuses mask buffers between frames to reduce allocations during live preview.
 * Inference and image processing run in the browser; camera frames are not uploaded.
 */
export function renderHairColor(
  segmenter: ImageSegmenter,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  color: string,
  timestamp: number,
): void {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth || !video.videoHeight) return;

  const result = segmenter.segmentForVideo(video, timestamp);
  try {
    const mask = result.categoryMask;
    if (!mask) return;

    const maskWidth = mask.width;
    const maskHeight = mask.height;
    const categories = mask.getAsUint8Array();
    const buffer = getMaskBuffer(canvas, maskWidth, maskHeight);
    const context = canvas.getContext('2d');
    if (!buffer || !context) return;

    const pixels = buffer.pixels.data;
    for (let i = 0; i < categories.length; i++) {
      const offset = i * 4;
      const isHair = categories[i] === 1;
      pixels[offset] = 255;
      pixels[offset + 1] = 255;
      pixels[offset + 2] = 255;
      pixels[offset + 3] = isHair ? 118 : 0;
    }
    buffer.context.putImageData(buffer.pixels, 0, 0);

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.filter = 'blur(0.7px)';
    context.drawImage(buffer.canvas, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
  } finally {
    result.close();
  }
}

export function clearHairOverlay(canvas: HTMLCanvasElement | null): void {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  context?.clearRect(0, 0, canvas.width, canvas.height);
}
