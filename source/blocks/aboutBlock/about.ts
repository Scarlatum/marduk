import { html } from 'lit-html';

// STYLES
  import './styles.scss'

// ASSETS
  // @ts-ignore
  import mechImage  from '~/assets/images/mech.png?w=1440;300&format=webp;avif';
  // @ts-ignore
  import akImage    from '~/assets/images/ak.jpg?w=1440;300&format=webp;avif';

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