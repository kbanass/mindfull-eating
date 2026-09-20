import {
  IMAGE_COMPRESSED,
  invalidImageMimeFormats,
  VALID_PHOTO,
} from "./constants";

export function bufferToHex(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  let hexbuffer = "";

  for (const b of uint8Array) {
    hexbuffer += b.toString(16).padStart(2, "0");
  }
  return hexbuffer;
}

export async function compressImage(file: File): Promise<Blob> {
  let source: ImageBitmap;

  try {
    source = await createImageBitmap(file);
  } catch (e) {
    const isHEIC =
      file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic";

    if (isHEIC) {
      console.warn("Native HEIC decoding failed. Loading polyfill...");

      const { default: heic2any } = await import("heic2any");

      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      const blob = Array.isArray(converted) ? converted[0] : converted;
      source = await createImageBitmap(blob);
    } else {
      throw new Error("Image could not be decoded", { cause: e });
    }
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = IMAGE_COMPRESSED.MAX_SIZE;
    canvas.height = IMAGE_COMPRESSED.MAX_SIZE;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Can't getContext of canvas");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scale = Math.max(
      IMAGE_COMPRESSED.MAX_SIZE / source.width,
      IMAGE_COMPRESSED.MAX_SIZE / source.height,
    );
    const scaledWidth = source.width * scale;
    const scaledHeight = source.height * scale;

    const offsetX = (scaledWidth - IMAGE_COMPRESSED.MAX_SIZE) / 2;
    const offsetY = (scaledHeight - IMAGE_COMPRESSED.MAX_SIZE) / 2;

    ctx.drawImage(source, -offsetX, -offsetY, scaledWidth, scaledHeight);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Error when generating Blob"));
        },
        "image/webp",
        IMAGE_COMPRESSED.QUALITY,
      );
    });
  } finally {
    source.close();
  }
}

export async function getPhotoHash(blob: Blob) {
  const fileBuffer = await blob.arrayBuffer();
  const fileHash = await crypto.subtle.digest("SHA-256", fileBuffer);
  const fileHashHex = bufferToHex(fileHash);

  return fileHashHex;
}

export function validatePhoto(file: File): ValidatePhotoResult {
  if (file.size > VALID_PHOTO.MAX_FILE_BYTES)
    return {
      success: false,
      error: "file-too-large",
    };

  if (
    !file.type.startsWith(VALID_PHOTO.ALLOWED_TYPES_PREFIX) ||
    invalidImageMimeFormats.includes(file.type)
  )
    return {
      success: false,
      error: "not-an-image",
    };

  if (file.size <= 0)
    return {
      success: false,
      error: "empty-file",
    };

  return {
    success: true,
  };
}

export type ValidatePhotoResult =
  | { success: true }
  | { success: false; error: ValidatePhotoError };

export type ValidatePhotoError =
  | "file-too-large"
  | "not-an-image"
  | "empty-file";
