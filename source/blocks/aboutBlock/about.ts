import { html } from 'lit-html';

// STYLES
  import './styles.scss'

// ASSETS
  // @ts-ignore
  import mechImage  from '~/assets/images/mech.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import akImage    from '~/assets/images/ak.jpg?w=1440;300&format=webp;avif';
  // @ts-ignore
  import motsar2    from '~/assets/images/motsar-2.jpg?w=1440;300&format=webp;avif';

// COMPONENT CLASS
  import EccheumaComponent, { ComponentPayload } from '~/component'

// COMPONENTS

  type ComponentsKeys = `AboutCard-${ number }` | `Button-${ TAB }`;

  import Card, { State as CardState, Props as CardProps } from '~/components/card/card';
  import Button from '~/components/button/button';

// INTERFACES'N'TYPES

  type TAB = 'BOB' | 'GOB' | 'LAB' | 'DAB';

  export interface State {
    cards: Array<EccheumaComponent<CardState,CardProps,any>>
    inViewPort: boolean
  }

  export interface Props {

  }

export default class AboutBlock extends EccheumaComponent<State,Props,ComponentsKeys> {

  private static CARD_DATA: Array<CardProps> = [
    {
      title: 'Test title FOR GOD OF MACHINE',
      image: {
        fullsize: {
          webp: mechImage[0],
          avif: mechImage[1],
        },
        preview: mechImage[2]
      }
    },
    {
      title: 'Test title for me',
      image: {
        fullsize: {
          webp: akImage[0],
          avif: akImage[1],
        },
        preview: akImage[2],
      }
    },
    {
      title: 'Test title for me',
      image: {
        fullsize: {
          webp: motsar2[0],
          avif: motsar2[1],
        },
        preview: motsar2[2],
      }
    },
  ]

  private TABS: Array<TAB> = ['BOB', 'GOB', 'LAB', 'DAB'];

  constructor(payload: ComponentPayload<State, Props>) { 

    super({ ...payload, state: {
      cards: new Array(),
      inViewPort: false,
    }});

    this.state.setKey('cards', Array.from(AboutBlock.CARD_DATA, (data, i) => {
      return this.registerComponent(`AboutCard-${ i }`, Card, data)!
    }))

    this.TABS.forEach(name => {
      this.registerComponent(`Button-${ name }`, Button, { 
        title: name,
        onClick() {
          console.log(name);
        }
      })
    })

  }

  onUpdate() {

  }

  onMount() {

    // const element = document.getElementById(`${ this.constructor.name }-${ this.hash }`);

    // if ( element ) {

    //   const ISO = new IntersectionObserver((entry) => {

    //     const inView = entry[0].isIntersecting;

    //     if ( inView ) {
    //       this.state.setKey('inViewPort', entry[0].isIntersecting); ISO.unobserve(element);
    //     }

    //   }, { rootMargin: '-1px' })

    //   ISO.observe(element);

    // }

  }

  render() {

    const TABS  = Array.from(this.TABS, (name) => this.components.get(`Button-${ name }`)?.render());
    const CARDS = this.state.get().cards.map(card => card.render())

    return html`
      <section class="about-container" id="${ this.elementID }">
        <h1>ABOUT THIS LANDING</h1>
        <hr>
        <div class="about-tabs">
          ${ TABS }
        </div>
        <hr>
        <div class="about-cards">
          ${ CARDS }
        </div>  
      </section>
    `
   
  }

}