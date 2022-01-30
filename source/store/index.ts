import { mapTemplate } from 'nanostores';

import type { ImageStruct } from '~/types/common'

declare global {
  interface store {
    mainImage: ImageStruct,
    mainText: {
      title: string,
      body: string,
    }
  }
}

export const globalStore = mapTemplate<store>();