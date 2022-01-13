import { html } from 'lit-html';


// Application Components
  import Component, { ComponentHooks } from '~/component';

// STYLES
  import './styles.scss';

// TYPES
  type HeaderLink = { link: string, title: string };

// INTERFACES
  interface HeaderState {
    buttonTitle: string
  }

// MODULE
export default class Header extends Component<HeaderState, unknown> {

  static NAVIGATION_LINKS: Array<HeaderLink> = [
    { link: './', title: 'Home' },
    { link: './', title: 'Service' },
    { link: './', title: 'Prices' },
    { link: './', title: 'Abouts Us' },
  ];

  constructor(updateRootMethod: ComponentHooks['onUpdate']) { 

    super({ buttonTitle: 'Work with us!' }, {
      onUpdate: updateRootMethod
    });

  }

  render() {
    return html`
      <nav class="navigation-container" id="navigation">
        <span></span>
        <div class=navigation-links>
          ${ Array.from(Header.NAVIGATION_LINKS, ref => html`<a href="${ ref.link }">${ ref.title }</a>`) }
        </div>
        <button @click="${ () => this.state.setKey('buttonTitle', `Number:  ${ Math.trunc(100 * Math.random())}`) }">
          ${ this.state.get().buttonTitle }
        </button>
      </nav>
    `
  }

}


