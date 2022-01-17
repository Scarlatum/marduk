import { mapTemplate } from 'nanostores';

declare global {
  interface globalStore {
    mainImage: string
  }
}

export const globalStore = mapTemplate<globalStore>();