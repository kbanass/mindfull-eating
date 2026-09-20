import { describe, expect, it } from "vitest";
import { bufferToHex, getPhotoHash, validatePhoto } from "./photos";
import { VALID_PHOTO } from "./constants";

describe("bufferToHex", () => {
  it("Converts bytes from buffer to hex format", () => {
    const buffer = new Uint8Array([0, 15, 255, 16]).buffer;
    expect(bufferToHex(buffer)).toBe("000fff10");
  });
});

describe("getPhotoHash", () => {
  it("Returns valid SHA-256 hash from blob", async () => {
    const blob = new Blob("15a0f0ab8f18b74076ad51aa637590a7".split(""));
    const hash = await getPhotoHash(blob);
    expect(hash).toBe(
      "399c796ecaf82ddf01f51e1f8e8333bfefade482872921b8b2d0d4f8077e06ce",
    );
  });
});

describe("validatePhoto", () => {
  it.each([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
  ])("Returns success for valid image: %s", async (input) => {
    const blob = "15a0f0ab8f18b74076ad51aa637590a7".split("");
    const file = new File(blob, "photo311431412", { type: input });

    const res = await validatePhoto(file);
    expect(res).toEqual({ success: true });
  });

  it.each([
    "video/mp4",
    "video/mpeg",
    "audio/wav",
    "application/pdf",
    "text/javascript",
    "image/svg+xml",
    "text/html",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
  ])(
    "Returns error if MIME type is not an image or image type is not supported: %s",
    async (input) => {
      const blob = "15a0f0ab8f18b74076ad51aa637590a7".split("");
      const file = new File(blob, "photo311431412", { type: input });

      const res = await validatePhoto(file);
      expect(res).toEqual({ success: false, error: "not-an-image" });
    },
  );

  it("Returns error if file is empty", async () => {
    const blob = "".split("");
    const file = new File(blob, "photo311431412", { type: "image/png" });

    const res = await validatePhoto(file);
    expect(res).toEqual({ success: false, error: "empty-file" });
  });

  it("Returns error if file is too large", async () => {
    const file = {
      size: VALID_PHOTO.MAX_FILE_BYTES + 1,
      type: "image/jpeg",
    } as File;

    const res = await validatePhoto(file);
    expect(res).toEqual({ success: false, error: "file-too-large" });
  });
});
