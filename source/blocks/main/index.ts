import { html } from 'lit-html';
import { ref, createRef, Ref } from 'lit-html/directives/ref.js';

// COMPONENT CLASS
  import EccheumaComponent, { ComponentPayload } from '~/component'

// STYLES
  import './styles.scss';

// COMPONENTS

  type ComponentsKeys = "Header" | `Card-${ number }` | 'FeedButton';

  import Header from '~/components/header';
  import Button from '~/components/button';
  import Card, { State as CardState, Props as CardProps } from '~/components/card';

// IMAGE

  // @ts-ignore
  import imagePath  from '~/assets/images/back.jpg?w=1440;300&format=webp';
  // @ts-ignore
  import frontImage from '~/assets/images/front.jpg?w=1440;300&format=webp';
  // @ts-ignore
  import shipImage  from '~/assets/images/ship.png?w=1440;300&format=webp';
  // @ts-ignore
  import mechImage  from `~/assets/images/mech.png?w=1440;300&format=webp`;
  // @ts-ignore
  import akImage    from `~/assets/images/ak.jpg?w=1440;300&format=webp`;
  // @ts-ignore
  import ak12Image  from `~/assets/images/ak12.jpg?w=1440;300&format=webp`;

// CARD DATA 
  const CARD_DATA: Array<CardProps> = [
    {
      title: 'Test title FOR GOD OF MACHINE',
      image: {
        full: ak12Image[0],
        preview: ak12Image[1]
      }
    },
    {
      title: 'Test title for me',
      image: {
        full: frontImage[0],
        preview: frontImage[1]
      }
    },
    {
      title: 'Test title for feed',
      image: {
        full: shipImage[0],
        preview: shipImage[1]
      }
    }
  ]

// INTERFACES'N'TYPES

  type ImageTransform = { x: number, y: number };
  type MaskParams     = { e: number, s: number };

  export interface State {
    imageShift: ImageTransform
    maskParams: MaskParams
    image: string,
    cards: Array<EccheumaComponent<CardState,CardProps,any>>
  }

  export interface Props {

  }

// MODULE
  export default class MainBlockComponent extends EccheumaComponent<State, Props, ComponentsKeys> {

    private static staticState: State = { 
      imageShift: { x: 0, y: 0 }, 
      maskParams: { e: 0, s: 0 }, 
      image: shipImage[0],
      cards: new Array(),
    }

    private ImageAnimation?: Animation;

    public textRef: Ref<HTMLElement> = createRef();

    public renderFunction = this.render;

    constructor({ hooks, props }: ComponentPayload<State, Props>) { 

      super({ hooks, props, state: { 
        ...MainBlockComponent.staticState
      }});

      // Set State
      this.state.setKey('cards', CARD_DATA.map((data, i) => this.registerComponent(`Card-${i}`, Card, data)!));

      // Component registration 
      this.registerComponent('Header', Header, { 
        title: 'Funny Title' 
      });

      this.registerComponent('FeedButton', Button, { 
        title: 'FeedButton',
        onClick: () => {
          this.pushNewCard(this.state.get())
        }
      });

      // ----------
      this.mounthed.listen(() => this.onMounth());

    }

    private onMounth() {

      // ---------- 
      window.addEventListener('mousemove', ({ x, y }) => {
        this.state.setKey('imageShift', MainBlockComponent.getNormilizedShift({x,y}, -15))
      })

      const image = document.getElementById('mainImage') as HTMLImageElement;

      this.animateAbout(this.textRef.value);

      this.ImageAnimation = image.animate([
        { opacity: 0.5 },
        { opacity: 0.0 },
      ], {
        fill: 'both',
        duration: 250,
      })

      this.ImageAnimation.pause(); 

      // Global state listener
      this.globalStore.listen((value, key) => {
        switch (key) {
          case 'mainImage': this.changeImage(value[key], image)
        }
      }) 

    }

    private static easeOutQuad(n: number) {
      return n * (2 - Math.abs(n));
    }

    private static getNormilizedShift(values: ImageTransform, maxShift: number): ImageTransform {

      return {
        x: maxShift * ( MainBlockComponent.easeOutQuad(values.x / (innerWidth  / 2) - 1)),
        y: maxShift * ( MainBlockComponent.easeOutQuad(values.y / (innerHeight / 2) - 1)),
      }

    }

    private changeImage(imagePath: string, image: HTMLImageElement) {

      const anim = this.ImageAnimation!; 

      anim.playbackRate = 1;
      anim.play();
      anim.onfinish = () => { 

        image.onload = () => anim.reverse(); 

        anim.onfinish = null;

        this.state.setKey('image', imagePath); 

      }

    }

    private animateAbout(element?: HTMLElement) {

      if ( element ) {
        Array.from(element.children).forEach((el, i) => {
          el.animate([
            { opacity: 0, transform: 'translateX(-25px)' },
            { opacity: 1, transform: 'translateX(0px)' }
          ], {
            delay: 500 + (250 * i),
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards',
          })
        })
      }

    }

    private pushNewCard(state: State) {

      const data: CardState = { 
        title: 'Autism is a cure', 
        image: {
          full: akImage[0],
          preview: akImage[1],
        }
      }

      const card = this.registerComponent(`Card-${ state.cards.length + 1 }`, Card, data)!

      if ( card ) {
        this.state.setKey('cards', [ ...state.cards, card ])
      }

    }

    

    render() {

      const state = this.state.get();

      const { x, y } = state.imageShift;
      const { s, e } = state.maskParams;

      return html`
        <section class="main-container" id="${ this.constructor.name }-${ this.hash }">
          ${ this.components.get('Header')?.render() }
          <picture class="main-image">
            <img src="${ state.image }" style="--x: ${ x.toFixed(3) }px; --y: ${ y.toFixed(3) }px;" id="mainImage">
          </picture>
          <div class="main-about" ${ ref(this.textRef) }>
            <h1>Anime girls as point of life</h1>
            <h5>Reputiamo ammirabile sempre viviamo oportune giudice i udita sua seguitando forse, nostro 'l cosa fosse medesimi dio seguitando della del, nel in cospetto lui oppinione e che, eterni etterno apparire giudice dallo durare apparire vostro alcun vita, transitorie pregator di.</h5>
          </div>
          <div id="CardContainer" 
            class="main-preview" 
            style="--e: ${ e }; --s: ${ s }"
            >

            ${ state.cards.map((card) => card.render()) }

            ${ this.components.get('FeedButton')?.render() };

          </div>
          <div class="main-footer">
            ${ Array(3).fill(true).map(() => html`<span>something</span>`) }
          </div>
        </section>
      `
      
    }

  }