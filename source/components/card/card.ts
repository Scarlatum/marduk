import { html } from 'lit-html';

// COMPONENT
  import Component, { ComponentPayload } from '~/component';

  import Button from '~/components/button/button';

// STYLES
  import './styles.scss'

// ASSETS

  // @ts-ignore
  import placeholderImageWEBP from '~/assets/images/0.png?format=webp&w=1440';
  // @ts-ignore
  import placeholderImageAVIF from '~/assets/images/0.png?format=avif&w=1440';
  // @ts-ignore
  import placeholderImageHOLD from '~/assets/images/0.png?format=webp&w=300';

// SVG
  //@ts-ignore
  import LinkIcon from '~/assets/svg/arrow-up-right-from-square-solid.svg?raw'

// TEXT
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
  export default class Card extends Component<State, Props, 'Button'> {

    static placeholderImage: ImageStruct = {
      webp: placeholderImageWEBP,
      avif: placeholderImageAVIF,
    }

    private rotateStyle: string;
    private scaleStyle: string;

    constructor({ props, hooks }: ComponentPayload<State, Props>) {

      super({ props, hooks, state: {
        title: props?.title || 'Default title',
        body: props?.body || placeholderText.trim(),
        image: props?.image || {
          fullsize: Card.placeholderImage,
          preview: placeholderImageHOLD,
        }
      }});


      this.registerComponent('Button', Button, { 
        title: String('See full article'), 
        onClick() {
          console.log('click on button')
        },
        icon: LinkIcon
      })

      this.rotateStyle  = `${ this.getRandomAngle() }deg`;
      this.scaleStyle   = `${ this.getRandomSize() }`;

    }

    private setMain() {

      const { image, title, body } = this.state.get();

      this.store.setKey('mainImage', image.fullsize);
      this.store.setKey('mainText', { title, body });

    }

    protected onMount(): void {

      const cardElement = document.getElementById(this.elementID);

      if ( cardElement === null ) return;

      const intersection = new IntersectionObserver((entry) => {
        this.animateCard(cardElement, entry[0].isIntersecting)
      }, { rootMargin: '-100px' })
      
      intersection.observe(cardElement)

    }

    protected onUpdate() {
    }

    private animateCard(element: Element, dir: boolean) {

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

    private getRandomAngle() {
      return Math.trunc(360 * Math.random())
    }

    private getRandomSize() {
      return parseFloat((1 + (1 * Math.random())).toPrecision(3))
    }

    render() {

      const { title, body, image } = this.state.get();

      return html`
        <div class="card-wrapper">
          <article 
            class="card-container web-pattern" 
            id="${ this.elementID }" 
            style="--r: ${ this.rotateStyle }; --s: ${ this.scaleStyle }" 
            @click="${ () => this.setMain() }"
            >
            <header class="card-header">
              <h3>${ title }<h3>
              <h4>Kumo to Shoujo to Ryouki Satsujin<h4>
            </header>
            <picture class="card-picture">
              <img src="${ image.preview || placeholderImageHOLD }">
            </picture>
            <p class="card-body">
              ${ body }
            </p>
            ${ this.components.get('Button')?.render() }
          </article>
        </div>
      `
      
    }

  }