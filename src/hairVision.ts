import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

const WASM_ROOT = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
const HAIR_MODEL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite';

export type HairVisionStatus = 'loading' | 'ready' | 'error';

export async function createHairSegmenter(): Promise<ImageSegmenter> {
  const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
  return ImageSegmenter.createFromOptions(vision, {
    baseOptions: { modelAssetPath: HAIR_MODEL, delegate: 'GPU' },
    runningMode: 'VIDEO',
    outputCategoryMask: true,
    outputConfidenceMasks: false,
  });
}

/**
 * Recolors pixels classified as hair by MediaPipe's hair segmentation model.
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
  const mask = result.categoryMask;
  if (!mask) {
    result.close();
    return;
  }

  const maskWidth = mask.width;
  const maskHeight = mask.height;
  const categories = mask.getAsUint8Array();
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = maskWidth;
  maskCanvas.height = maskHeight;
  const maskContext = maskCanvas.getContext('2d');
  const context = canvas.getContext('2d');
  if (!maskContext || !context) {
    result.close();
    return;
  }

  const pixels = new ImageData(maskWidth, maskHeight);
  for (let i = 0; i < categories.length; i++) {
    const offset = i * 4;
    const isHair = categories[i] === 1;
    pixels.data[offset] = 255;
    pixels.data[offset + 1] = 255;
    pixels.data[offset + 2] = 255;
    pixels.data[offset + 3] = isHair ? 118 : 0;
  }
  maskContext.putImageData(pixels, 0, 0);

  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'source-in';
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'source-over';
  result.close();
}

export function clearHairOverlay(canvas: HTMLCanvasElement | null): void {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  context?.clearRect(0, 0, canvas.width, canvas.height);
}
