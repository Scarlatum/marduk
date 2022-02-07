import { html } from 'lit-html';

// STYLES
  import './styles.scss'

// ASSETS
  // @ts-ignore
  import part0   from '~/assets/images/2.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part1   from '~/assets/images/1.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part2   from '~/assets/images/0.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part3   from '~/assets/images/3.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part4   from '~/assets/images/4.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import part5   from '~/assets/images/5.png?w=1440;300&format=webp;avif';

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
      title: String('Title about manga'),
      image: {
        fullsize: {
          webp: part0[0],
          avif: part0[1],
        },
        preview: part0[2]
      }
    },
    {
      title: String('Title about manga'),
      image: {
        fullsize: {
          webp: part1[0],
          avif: part1[1],
        },
        preview: part1[2],
      }
    },
    {
      title: String('Title about manga'),
      image: {
        fullsize: {
          webp: part2[0],
          avif: part2[1],
        },
        preview: part2[2],
      }
    },
    {
      title: String('Title about manga'),
      image: {
        fullsize: {
          webp: part3[0],
          avif: part3[1],
        },
        preview: part3[2],
      }
    },
    {
      title: String('Title about manga'),
      image: {
        fullsize: {
          webp: part4[0],
          avif: part4[1],
        },
        preview: part4[2],
      }
    },
    {
      title: String('Title about manga'),
      image: {
        fullsize: {
          webp: part5[0],
          avif: part5[1],
        },
        preview: part5[2],
      }
    },
  ]

  private TABS: Array<TAB> = ['BOB', 'GOB', 'LAB'];

  constructor(payload: ComponentPayload<State, Props>) { 

    super({ ...payload, state: {
      cards: new Array(),
      inViewPort: false,
    }});

    this.state.setKey('cards', Array.from(AboutBlock.CARD_DATA, (data, i) => {
      return this.registerComponent(`AboutCard-${ i }`, Card, data)!
    }))

    this.TABS.forEach(name => {
      const button = this.registerComponent(`Button-${ name }`, Button, { 
        title: name,
        onClick() {
          button!.state.setKey('title', Math.random().toString(36).slice(-8).toUpperCase())
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
        <header>
          <h1>CHAPTERS</h1>
          <p>
            Lorem ipsum qui ea fugiat aliquip sit sit dolor in enim minim voluptate reprehenderit sunt veniam deserunt amet adipisicing fugiat esse ullamco ad tempor laboris sunt aute culpa.
          <p>          
        </header>
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