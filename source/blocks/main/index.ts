import { html, TemplateResult } from 'lit-html';

// COMPONENT CLASS
  import EccheumaComponent, { ComponentHooks } from '~/component'

// STYLES
  import './styles.scss';
  import commonUtilStyles from '~/assets/scss/utils.module.scss'

// COMPONENTS
  import Header from '~/components/header';
  import Card, { State as CardState, Props as CardProps } from '~/components/card'

  console.log(Card.name, Header.name);

// IMAGE
  import imagePath  from '~/assets/images/back.jpg';
  import frontImage from '~/assets/images/front.jpg';
  import shipImage  from '~/assets/images/ship.png';

// INTERFACES'N'TYPES

  type ImageTransform = { x: number, y: number };
  type MaskParams     = { e: number, s: number };

  export interface ComponentState {
    imageShift: ImageTransform
    maskParams: MaskParams
    image: string,
    cards: Array<EccheumaComponent<CardState,CardProps>>
  }

  export interface ComponentProps {

  }

// MODULE
  export default class MainBlockComponent extends EccheumaComponent<ComponentState, ComponentProps> {

    private static STATE: ComponentState = { 
      imageShift: { x: 0, y: 0 }, 
      maskParams: { e: 0, s: 0 }, 
      image: shipImage,
      cards: new Array(),
    }

    constructor(updateRoot: ComponentHooks['onUpdate']) { 

      super(MainBlockComponent.STATE,{
        onMount: () => {
          this.animateAbout();
        },
        onUpdate: updateRoot
      });

      this.globalStore.listen((value, key) => {
        switch (key) {
          case 'mainImage': this.state.setKey('image', value.mainImage)
        }
      })      

      this.registerComponent('HeaderComponent', Header, { title: 'Funny Title' });

      this.state.get().cards = [
        this.registerComponent('Card-0', Card, { title: 'Shiiiiiip',        image: shipImage })!,
        this.registerComponent('Card-1', Card, { title: 'Maid title',       image: imagePath })!,
        this.registerComponent('Card-2', Card, { title: 'Autism is a cure', image: frontImage})!,
      ]

      window.addEventListener('mousemove', ({ x, y }) => {
        this.state.setKey('imageShift', MainBlockComponent.getNormilizedShift({x,y}, -15))
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

    private animateAbout() {
      
      const element = document.getElementById('MainDescription');

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

    private calcFadeMask({ target }: WheelEvent) {
      // const { scrollHeight, offsetHeight, scrollTop } = target as HTMLElement;
      // this.state.setKey('maskParams', { e: 0, s: 0 });
    }

    private pushNewCard(state: ComponentState) {

      const card = this.registerComponent(`Card-${ state.cards.length + 1 }`, Card, { title: 'Autism is a cure', image: frontImage})!

      if ( card ) {
        this.state.setKey('cards', [ ...state.cards, card ])
      }

    }

    render(): TemplateResult<1> {

      const state = this.state.get();

      const { x, y } = state.imageShift;
      const { s, e } = state.maskParams;

      return html`
        <section class="main-container">
          ${ this.components.get('HeaderComponent')?.render() }
          <picture class="main-image">
            <img src="${ state.image }" style="--x: ${ x.toFixed(3) }px; --y: ${ y.toFixed(3) }px;">
          </picture>
          <div id="MainDescription" class="main-about">
            <h1>Anime girls as point of life</h1>
            <h5>Reputiamo ammirabile sempre viviamo oportune giudice i udita sua seguitando forse, nostro 'l cosa fosse medesimi dio seguitando della del, nel in cospetto lui oppinione e che, eterni etterno apparire giudice dallo durare apparire vostro alcun vita, transitorie pregator di.</h5>
          </div>
          <div id="CardContainer" 
            class="main-preview" 
            style="--e: ${ e }; --s: ${ s }" 
            @wheel="${ (event: WheelEvent) => this.calcFadeMask(event) }"
            >

            ${ state.cards.map((card) => card.render()) }

            <button class="${ commonUtilStyles.commonButton }" @click="${ () => this.pushNewCard(state) }">
              Добавить ещё
            </button>

          </div>
          <div class="main-footer">
            ${ Array(3).fill(true).map(() => html`<span>something</span>`) }
          </div>
        </section>
      `
      
    }

  }