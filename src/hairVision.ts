import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

const WASM_ROOT = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
const HAIR_MODEL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite';

export type HairVisionStatus = 'loading' | 'ready' | 'error';

type MaskBuffer = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pixels: ImageData;
};

const maskBuffers = new WeakMap<HTMLCanvasElement, MaskBuffer>();

export async function createHairSegmenter(): Promise<ImageSegmenter> {
  const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
  const options = {
    baseOptions: { modelAssetPath: HAIR_MODEL },
    runningMode: 'VIDEO' as const,
    outputCategoryMask: true,
    outputConfidenceMasks: false,
  };
  try {
    return await ImageSegmenter.createFromOptions(vision, {
      ...options,
      baseOptions: { ...options.baseOptions, delegate: 'GPU' },
    });
  } catch {
    // Some browsers or devices do not support the GPU delegate; use CPU as a fallback.
    return ImageSegmenter.createFromOptions(vision, options);
  }
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
    context.drawImage(buffer.canvas, 0, 0, canvas.width, canvas.height);
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
