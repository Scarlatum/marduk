import { html } from 'lit-html';

// COMPONENT
  import Component, { ComponentPayload } from '~/component';

// STYLES
  import './styles.scss'

// ASSETS

  // @ts-ignore
  import placeholderImageWEBP from '~/assets/images/mech.png?format=webp';
  // @ts-ignore
  import placeholderImageAVIF from '~/assets/images/mech.png?format=avif';
  // @ts-ignore
  import placeholderImageHOLD from '~/assets/images/mech.png?format=webp&w=300';

  const placeholderText = `
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
    Accusamus a harum beatae ad perferendis, quo excepturi rem, vitae voluptas incidunt fugit debitis sit quae eligendi facere reiciendis at fuga unde.
  `

// INTERFACES

  import type { ImageStruct } from '~/types/common';

  export interface State {
    title: string
    body: string
    image: {
      fullsize: ImageStruct,
      preview: string,
    }
  }

  export interface Props extends Partial<State> {

  }

// MODULE
  export default class Card extends Component<State, Props, any> {

    static placeholderImage: ImageStruct = {
      webp: placeholderImageWEBP,
      avif: placeholderImageAVIF,
    }

    constructor({ props, hooks }: ComponentPayload<State, Props>) {

      super({ props, hooks, state: {
        title: props?.title || 'Default title',
        body: props?.body || placeholderText.trim(),
        image: props?.image || {
          fullsize: Card.placeholderImage,
          preview: placeholderImageHOLD,
        }
      }});

    }

    setMain() {

      const { image, title, body } = this.state.get();

      this.store.setKey('mainImage', image.fullsize);
      this.store.setKey('mainText', { title, body })
    }

    onMount(): void {

      const cardElement = document.getElementById(`${ this.constructor.name }-${ this.hash }`);

      if ( cardElement === null ) return;

      const intersection = new IntersectionObserver((entry) => {
        this.animateCard(cardElement, entry[0].isIntersecting)
      }, { rootMargin: '-100px' })
      
      intersection.observe(cardElement)

    }

    onUpdate() {
    }

    animateCard(element: Element, dir: boolean) {

      if ( element ) {
        const animation = element.animate([
          { opacity: 0 }, 
          { opacity: 1 }
        ], {
          delay: 500,
          duration: 1000,
          fill: 'both',
        })

        animation.pause();
        animation.playbackRate = dir ? 1 : -1;
        animation.play();

      }

    }

    render() {

      const { title, body, image } = this.state.get();

      return html`
        <article class="card-container" id="${ this.elementID }" @click=${ () => this.setMain() }>
          <header class="card-header">
            ${ title }
          </header>
          <picture class="card-picture">
            <img src="${ image.preview || placeholderImageHOLD }">
          </picture>
          <p class="card-body">
            ${ body }
          </p>
        </article>
      `
      
    }

  }