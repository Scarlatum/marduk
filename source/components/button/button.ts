// LIT HTML
  import { html } from 'lit-html';
  import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js'

// COMPONENT
  import Component, { ComponentPayload } from '~/component';

// STYLES
  import style from './styles.module.scss'

// INTERFACES

  export interface State {
    title: string
  }

  export interface Props extends Partial<State> {
    onClick(): any
    icon: string
  }

// MODULE
  export default class Button extends Component<State, Props, null> {

    private static staticState: State = {
      title: 'button'
    }

    constructor({ hooks, props }: ComponentPayload<State, Props>) {

      super({ hooks, props, state: {
        title: props?.title || Button.staticState.title
      }});

    }

    protected onMount() {}

    protected onUpdate() {}

    render() {

      const state = this.state?.get();
      const props = this.props;

      const onClick = props?.onClick;

      return html`
        <button class="${ style.button }" id="${ this.elementID }" @click="${ () => { onClick ? onClick() : null } }">
          ${ state.title }
          ${ unsafeSVG(props?.icon) }
        </button>
      `

    }
  }