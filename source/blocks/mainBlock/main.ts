import { html } from 'lit-html';
import { ref, createRef, Ref } from 'lit-html/directives/ref.js';

// COMPONENT CLASS
  import EccheumaComponent, { ComponentPayload } from '~/component'

// STYLES
  import './styles.scss';

// COMPONENTS

  type ComponentsKeys = "Header" | `Card-${ number }` | 'FeedButton';

  import Header from '~/components/header/header';
  import Button from '~/components/button/button';
  import Card, { State as CardState, Props as CardProps } from '~/components/card/card';

// IMAGE

  // @ts-ignore
  import motsar1    from '~/assets/images/motsar-1.jpg?w=1440;300&format=webp;avif';
  // @ts-ignore
  import motsar2    from '~/assets/images/motsar-2.jpg?w=1440;300&format=webp;avif';
  // @ts-ignore
  import shipImage  from '~/assets/images/ship.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import mechImage  from '~/assets/images/mech.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import akImage    from '~/assets/images/ak.jpg?w=1440;300&format=webp;avif';

// CARD DATA 
  const CARD_DATA: Array<CardProps> = [
    {
      title: 'Test title FOR GOD OF MACHINE',
      image: {
        fullsize: {
          webp: motsar1[0],
          avif: motsar1[1],
        },
        preview: motsar1[2],
      }
    },
    {
      title: 'Test title FOR GOD OF MACHINE',
      image: {
        fullsize: {
          webp: motsar2[0],
          avif: motsar2[1],
        },
        preview: motsar2[2],
      }
    },
    {
      title: 'Test title FOR GOD OF MACHINE',
      image: {
        fullsize: {
          webp: shipImage[0],
          avif: shipImage[1],
        },
        preview: shipImage[2],
      }
    },
  ]

// INTERFACES'N'TYPES

  import type { ImageStruct } from '~/types/common';

  type ImageTransform = { x: number, y: number };
  type MaskParams     = { e: number, s: number };

  export interface State {
    imageShift: ImageTransform
    maskParams: MaskParams
    image: ImageStruct,
    cards: Array<EccheumaComponent<CardState,CardProps,any>>
  }

  export interface Props {

  }

// MODULE
  export default class MainBlock extends EccheumaComponent<State, Props, ComponentsKeys> {

    private static staticState: State = { 
      imageShift: { x: 0, y: 0 }, 
      maskParams: { e: 0, s: 0 }, 
      image: {
        webp: motsar1[0],
        avif: motsar1[1],
      },
      cards: new Array(),
    }

    private ImageAnimation?: Animation;

    public textRef: Ref<HTMLElement> = createRef();

    private inViewPort = false;

    constructor({ hooks, props }: ComponentPayload<State, Props>) { 

      super({ hooks, props, state: { 
        ...MainBlock.staticState
      }});
        
      // Set State
      this.state.setKey('cards', Array.from(CARD_DATA, (data, i) => {
        return this.registerComponent(`Card-${i}`, Card, data)!
      }));

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

    }

    protected onMount() {

      new IntersectionObserver((entry) => {
        this.inViewPort = entry[0].isIntersecting;
      }, { rootMargin: '-1px' }).observe(document.getElementById(`${ this.constructor.name }-${ this.hash }`)!);

      // ---------- 
      window.addEventListener('mousemove', ({ x, y,  }) => {
        if ( this.inViewPort ) {
          this.state.setKey('imageShift', this.getNormilizedShift({x,y}, -15))
        }
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

      // Global store listener
      this.store.listen((value, key) => {
        switch (key) {
          case 'mainImage': this.changeImage(value[key], image)
        }
      }) 

    }

    protected onUpdate() {
    }

    private easeOutQuad(n: number) {
      return n * (2 - Math.abs(n));
    }

    private getNormilizedShift(values: ImageTransform, maxShift: number): ImageTransform {

      return {
        x: maxShift * ( this.easeOutQuad(values.x / (innerWidth  / 2) - 1)),
        y: maxShift * ( this.easeOutQuad(values.y / (innerHeight / 2) - 1)),
      }

    }

    private changeImage(imagePath: ImageStruct, image: HTMLImageElement) {

      const anim = this.ImageAnimation; 

      if ( anim ) {

        anim.playbackRate = 1;
        anim.play();
        anim.onfinish = () => { 

          image.onload = () => anim.reverse(); 

          anim.onfinish = null;

          this.state.setKey('image', imagePath); 

        }

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
          fullsize: {
            webp: akImage[0],
            avif: akImage[1],
          },
          preview: akImage[2],
        }
      }

      const card = this.registerComponent(`Card-${ state.cards.length + 1 }`, Card, data)!

      if ( card ) {
        this.state.setKey('cards', [ ...state.cards, card ])
      }

    }

    render() {

      const state = this.state.get();

      const { s, e } = state.maskParams;
      const { x, y } = state.imageShift;

      return html`
        <section class="main-container" id="${ this.constructor.name }-${ this.hash }">
          
          ${ this.components.get('Header')?.render() }

          <picture class="main-image">
            <source type="image/avif" srcset="${ state.image.avif }">
            <img src="${ state.image.webp }" style="--x: ${ x.toFixed(3) }px; --y: ${ y.toFixed(3) }px;" id="mainImage">
          </picture>
          <div class="main-about" ${ ref(this.textRef) }>
            <h1>Anime girls as point of life</h1>
            <h5>Reputiamo ammirabile sempre viviamo oportune giudice i udita sua seguitando forse, nostro 'l cosa fosse medesimi dio seguitando della del, nel in cospetto lui oppinione e che, eterni etterno apparire giudice dallo durare apparire vostro alcun vita, transitorie pregator di.</h5>
          </div>
          <div id="CardContainer" 
            class="main-preview" 
            style="--s: ${ s }; --e: ${ e }"
            >

            ${ state.cards.map((card) => card?.render()) }

            ${ this.components.get('FeedButton')?.render() };

          </div>
          <div class="main-footer">
            ${ Array(3).fill(true).map(() => html`<span>something</span>`) }
          </div>
        </section>
      `
      
    }

  }