import { html } from 'lit-html';

// STYLES
  import './styles.scss'

// COMPONENT CLASS
  import EccheumaComponent from '~/component'

// COMPONENTS

// INTERFACES'N'TYPES
  export interface State {
  }

  export interface Props {
  }

// MODULE
  export default class FooterBlock extends EccheumaComponent<State,Props,any> {

    onUpdate() {
    }

    onMount() {
    }

    render() {

      return html`
        <footer class="footer-container web-pattern" id="${ this.elementID }">
          <h1>Is not the end</h1>
        </footer>
      `
      
    }

  }