import { html } from 'lit-html';

// STYLES
  import './styles.scss'

// ASSETS
  // @ts-ignore
  import mechImage  from `~/assets/images/mech.png?w=1440;300&format=webp`;
  // @ts-ignore
  import akImage  from `~/assets/images/ak.jpg?w=1440;300&format=webp`;

// COMPONENT CLASS
  import EccheumaComponent, { ComponentPayload } from '~/component'

// COMPONENTS
  import Card, { State as CardState, Props as CardProps } from '~/components/card/card';

// INTERFACES'N'TYPES
  export interface State {
    cards: Array<EccheumaComponent<CardState,CardProps,any>>
  }

  export interface Props {

  }

export default class AboutBlock extends EccheumaComponent<State,Props,any> {

  private static CARD_DATA: Array<CardProps> = [
    {
      title: 'Test title FOR GOD OF MACHINE',
      image: {
        full: mechImage[0],
        preview: mechImage[1]
      }
    },
    {
      title: 'Test title for me',
      image: {
        full: akImage[0],
        preview: akImage[1]
      }
    },
  ]

  constructor(payload: ComponentPayload<State, Props>) { 

    super({ ...payload, state: {
      cards: new Array()
    }});

    this.state.setKey('cards', Array.from(AboutBlock.CARD_DATA, (data, i) => {
      return this.registerComponent(`AboutCard-${ i }`, Card, data)!
    }))

  }

  onUpdate() {

  }

  onMount() {

  }

  render() {
    return html`
      <section class="about-container" id="${ this.constructor.name }-${ this.hash }">
        <h1>ABOUT THIS LANDING</h1>
        <div class="about-cards-container">
          ${ this.state.get().cards.map(card => card.render()) }
        </div>
      </section>
    `
  }

}