import * as Comlink from "comlink";
import type { PhotoStore } from "./ports";

const worker = new Worker(
  new URL("./workers/OpfsPhotoStore.worker.ts", import.meta.url),
  { type: "module" },
);

export const PhotoStoreClient: Comlink.Remote<PhotoStore> =
  Comlink.wrap<PhotoStore>(worker);
