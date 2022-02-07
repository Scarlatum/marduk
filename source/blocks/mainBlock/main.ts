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
  import part0   from '~/assets/images/0.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part1   from '~/assets/images/1.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part2   from '~/assets/images/2.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part3   from '~/assets/images/3.png?w=1440;300&format=webp;avif';

// CARD DATA 
  const CARD_DATA: Array<CardProps> = [
    {
      title: 'MACHINE',
      body: 'In sunt minim deserunt in mollit ullamco ut laboris ut id nisi officia sunt nisi occaecat. Eu proident est consequat ad elit cupidatat elit do aliqua in amet in veniam elit in laboris anim anim officia in incididunt sunt velit.',
      image: {
        fullsize: {
          webp: part0[0],
          avif: part0[1],
        },
        preview: part0[2],
      }
    },
    {
      title: 'Test title FOR GOD OF MACHINE',
      body: 'Fugiat occaecat laborum nisi elit velit officia ut amet nisi ad minim do reprehenderit in eu minim eiusmod ea adipisicing ea cillum ut cillum excepteur irure commodo quis laboris amet voluptate cupidatat aliquip cupidatat deserunt cillum dolore ullamco consectetur ad anim sit eiusmod voluptate reprehenderit sint aliqua ad incididunt anim eu deserunt ex qui cillum esse eu adipisicing excepteur voluptate laboris aliquip commodo non adipisicing in labore veniam dolore in esse adipisicing consectetur irure reprehenderit esse officia in sit et consequat proident adipisicing ullamco minim laboris irure non fugiat nulla veniam dolore commodo dolor dolore ea commodo velit ea fugiat id do elit sunt incididunt ea ut cillum elit ad velit consequat incididunt occaecat adipisicing deserunt aute sit duis pariatur in labore cillum nulla duis sed ut incididunt duis in ea eu culpa dolore nulla irure laboris amet ut non qui sit nulla laborum.',
      image: {
        fullsize: {
          webp: part1[0],
          avif: part1[1],
        },
        preview: part1[2],
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
    text: {
      title: string,
      body: string,
    }
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
        webp: part0[0],
        avif: part0[1],
      },
      text: {
        title: 'TEST',
        body: 'Reputiamo ammirabile sempre viviamo oportune giudice i udita sua seguitando forse'
      },
      cards: new Array(),
    }

    private ImageAnimation?: Animation;

    private textRef: Ref<HTMLElement> = createRef();
    private feedRef: Ref<HTMLElement> = createRef();

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
        title: 'Load more',
        onClick: () => {
          this.pushNewCard(this.state.get())
        }
      });

    }

    protected onMount() {

      new IntersectionObserver((entry) => {
        this.inViewPort = entry[0].isIntersecting;
      }, { rootMargin: '-1px' }).observe(document.getElementById(this.elementID)!);

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
          case 'mainImage': this.changeImage(value[key], image); break;
          case 'mainText': this.state.setKey('text', value[key]); break;
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
        body: 'Lorem ipsum do aute id sit aliqua irure cillum mollit laborum laborum amet exercitation dolor dolore incididunt elit  sit adipisicing elit laboris eiusmod qui pariatur fugiat mollit sit est sit fugiat officia culpa adipisicing amet sit sed occaecat ex est magna ullamco reprehenderit laboris fugiat cupidatat ut mollit dolor commodo excepteur sunt deserunt cillum ullamco laboris sit nostrud id nisi velit duis cillum esse nisi pariatur veniam dolor ex in quis in dolor eu anim voluptate dolore consequat et consectetur ut reprehenderit ea commodo in id reprehenderit anim eiusmod cillum adipisicing duis id mollit culpa sed adipisicing enim ullamco dolore do minim do anim dolore sunt cupidatat ut laboris ut amet ad quis quis fugiat laboris dolore mollit in ut cillum cupidatat labore.',
        image: {
          fullsize: {
            webp: part3[0],
            avif: part3[1],
          },
          preview: part3[2],
        }
      }

      const card = this.registerComponent(`Card-${ state.cards.length + 1 }`, Card, data)

      if ( card === undefined ) return;

        this.state.setKey('cards', [ ...state.cards, card ])

      if ( this.feedRef.value === undefined ) return;

        const { scrollHeight } = this.feedRef.value;

        this.feedRef.value.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });

    }

    render() {

      const state = this.state.get();

      const { s, e } = state.maskParams;
      const { x, y } = state.imageShift;

      return html`
        <section class="main-container" id="${ this.elementID }">
          
          ${ this.components.get('Header')?.render() }

          <picture class="main-image">
            <source type="image/avif" srcset="${ state.image.avif }">
            <img src="${ state.image.webp }" style="--x: ${ x.toFixed(3) }px; --y: ${ y.toFixed(3) }px;" id="mainImage">
          </picture>
          <div class="main-about" ${ ref(this.textRef) }>
            <h1>${ state.text.title }</h1>
            <h5>${ state.text.body }</h5>
          </div>
          <div id="CardContainer" 
            class="main-preview" 
            style="--s: ${ s }; --e: ${ e }"
            ${ ref(this.feedRef) }
            >

            <header>
              Last released chapters
            </header>

            ${ state.cards.map((card) => card?.render()) }

            ${ this.components.get('FeedButton')?.render() }

          </div>
          <div class="main-footer">
            ${ Array(3).fill(true).map(() => html`<span>something</span>`) }
          </div>
        </section>
      `
      
    }

  }