import { html, nothing } from 'lit-html';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js'

// Application Components
  import Component, { ComponentPayload } from '~/component';

// STYLES
  import './styles.scss';

// ASSETS
  // @ts-ignore
  import Icon  from '~/assets/images/spider-web-red.svg';

// SVG
  //@ts-ignore
  import homeIcon from '~/assets/svg/house-solid.svg?raw';
  import bookIcon from '~/assets/svg/book-open-solid.svg?raw';
  import infoIcon from '~/assets/svg/circle-info-solid.svg?raw';
  import yenIcon  from '~/assets/svg/yen-sign-solid.svg?raw';

// TYPES
  type HeaderLink = { link: string, title: string, rawSVG?: string };

// INTERFACES
  interface State {
    curentTab: string
  }

  interface Props {
  }

// MODULE
export default class Header extends Component<State, Props, any> {

  private static NAVIGATION_LINKS: Array<HeaderLink> = [
    { link: './', title: 'Home', rawSVG: homeIcon },
    { link: './', title: 'Chapters', rawSVG: bookIcon },
    { link: './', title: 'Prices', rawSVG: yenIcon },
    { link: './', title: 'Abouts Us', rawSVG: infoIcon },
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
        ${ ref.rawSVG ? unsafeSVG(ref.rawSVG) : nothing }
        ${ ref.title }
      </span>
    `)

    return html`
      <nav class="navigation-container web-pattern" id="${ this.elementID }">
        <span style="--logoPath: url(${ Icon })">
          Kumo to Shoujo
        </span>
        <div class=navigation-links>
          ${ LinkElements }
        </div>
      </nav>
    `
  }

}


