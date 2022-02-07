import { html } from 'lit-html';

// Application Components
  import Component, { ComponentPayload } from '~/component';

// STYLES
  import './styles.scss';

// ASSETS
  // @ts-ignore
  import Icon  from '~/assets/images/ic_launcher.png';

// TYPES
  type HeaderLink = { link: string, title: string };

// INTERFACES
  interface State {
    curentTab: string
  }

  interface Props {
  }

// MODULE
export default class Header extends Component<State, Props, any> {

  private static NAVIGATION_LINKS: Array<HeaderLink> = [
    { link: './', title: 'Home' },
    { link: './', title: 'Chapters' },
    { link: './', title: 'Prices' },
    { link: './', title: 'Abouts Us' },
  ];

  constructor({ props, hooks }: ComponentPayload<State, Props>) { 

    const state: State = {
      curentTab: 'Home'
    }

    super({ props, hooks, state });

    this.state.setKey('curentTab', Header.NAVIGATION_LINKS[0].title);

  }

  onMount() {

  };
  
  onUpdate() {

  };

  render() {

    const { curentTab } = this.state.get();

    const LinkElements = Array.from(Header.NAVIGATION_LINKS, (ref) => html`
      <span 
        data-active="${ ref.title === curentTab }" 
        @click="${ () => this.state.setKey('curentTab', ref.title) }">
        ${ ref.title }
      </span>
    `)

    return html`
      <nav class="navigation-container web-pattern" id="${ this.elementID }">
        <span style="--logoPath: url(${ Icon })"></span>
        <div class=navigation-links>
          ${ LinkElements }
        </div>
      </nav>
    `
  }

}


