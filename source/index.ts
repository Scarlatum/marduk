import { html, render, nothing } from 'lit-html';

// COMPONENT
  import Component   from '~/component';

// STYLES
  import './assets/scss/common.scss';

// STATE
  interface ApplicationState {
    counter: number
  }

// INNER COMPONENTS
  type ComponentsKeys = 'MainBlock'

  import MainBlockComponent from '~/blocks/main';

// MODULE
  export class Instance extends Component<ApplicationState, ComponentsKeys> {

    constructor() {

      super({ counter: 0 });

      this.components.set('MainBlock', new MainBlockComponent(() => this.updateRoot()));

      this.state.subscribe(() => this.updateRoot().then(() => this.notifyChildrens()));

    }
    
    render() {
      return html`
        <div id="application">
          ${ this.components.get('MainBlock')!.render() || nothing }
        </div>
      `
    }

    public async updateRoot(): Promise<void> {
      return new Promise((res) => {
        render(this.render(), document.body); res()
      })
    }

  }

// INIT INSTANCE
  export default new Instance();

