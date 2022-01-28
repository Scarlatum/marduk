import { mapTemplate } from 'nanostores';

import type { ImageStruct } from '~/types/common'

declare global {
  interface store {
    mainImage: ImageStruct
  }
}

export const globalStore = mapTemplate<store>();