import * as Comlink from "comlink";
import type { PhotoStore } from "../ports";

class OpfsPhotoStore implements PhotoStore {
  private dirPromise: Promise<FileSystemDirectoryHandle> | undefined;

  private dir(): Promise<FileSystemDirectoryHandle> {
    if (!this.dirPromise) {
      this.dirPromise = navigator.storage
        .getDirectory()
        .then((root) => root.getDirectoryHandle("photos", { create: true }));
    }
    return this.dirPromise;
  }

  async savePhoto(photoHash: string, blob: Blob): Promise<void> {
    const dir = await this.dir();
    const fh = await dir.getFileHandle(`${photoHash}.webp`, { create: true });
    const accessHandle = await fh.createSyncAccessHandle();

    try {
      const buffer = await blob.arrayBuffer();
      accessHandle.truncate(0);
      accessHandle.write(new Uint8Array(buffer));
      accessHandle.flush();
    } finally {
      accessHandle.close();
    }
  }

  async loadPhoto(photoHash: string): Promise<Blob> {
    const dir = await this.dir();
    const fh = await dir.getFileHandle(`${photoHash}.webp`);
    const file: Blob = await fh.getFile();

    return file;
  }

  async deletePhoto(photoHash: string): Promise<void> {
    const dir = await this.dir();
    await dir.removeEntry(`${photoHash}.webp`);
  }
}

Comlink.expose(new OpfsPhotoStore());
