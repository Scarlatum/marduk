import { html } from 'lit-html';

// Application Components
  import Component, { ComponentPayload } from '~/component';

// STYLES
  import './styles.scss';

// COMPONENTS
  import Button from '~/components/button/button'

// ASSETS
  // @ts-ignore
  import Icon  from '~/assets/images/ic_launcher.png';

// TYPES
  type HeaderLink = { link: string, title: string };

// INTERFACES
  interface State {
  }

  interface Props {
  }

// MODULE
export default class Header extends Component<State, Props, any> {

  private static NAVIGATION_LINKS: Array<HeaderLink> = [
    { link: './', title: 'Home' },
    { link: './', title: 'Service' },
    { link: './', title: 'Prices' },
    { link: './', title: 'Abouts Us' },
  ];

  protected onMount() {}

  protected onUpdate() {}

  constructor({ state, props, hooks }: ComponentPayload<State, Props>) { 

    super({ state, props, hooks });

    const buttonComponent = this.registerComponent('CommonButton', Button, {
      title: 'Something',
      onClick: () => {
        buttonComponent!.state.setKey('title', `Number-${ Math.trunc(100 * Math.random()) }`);
      }
    })

  }

  render() {
    return html`
      <nav class="navigation-container" id="${ this.constructor.name }-${ this.hash }">
        <span style="--logoPath: url(${ Icon })"></span>
        <div class=navigation-links>
          ${ Array.from(Header.NAVIGATION_LINKS, ref => html`<a href="${ ref.link }">${ ref.title }</a>`) }
        </div>
        ${ this.components.get('CommonButton')?.render() }
      </nav>
    `
  }

}


