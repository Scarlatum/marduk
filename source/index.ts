import { html, render as LitRender } from 'lit-html';

// COMPONENT
  import Component, { RenderFunction, ComponentHooks } from '~/component';

// STYLES
  import './assets/scss/common.scss';

// INTERFACES
  interface ApplicationState {
    counter: number
  }

// COMPONENTS
  type ComponentKeys = `MainBlock` | `AboutBlock` | `FooterBlock`;

  import MainBlock from '~/blocks/mainBlock/main';
  import AboutBlock from '~/blocks/aboutBlock/about';
  import FooterBlock from '~/blocks/footerBlock/footer';

// MODULE
  export class Instance extends Component<ApplicationState, any, ComponentKeys> {

    private static update: RenderFunction;

    constructor() {

      const hooks: ComponentHooks = {
        onUpdate: Instance.updateRoot,
        onMount: () => this.notifyChildrens()
      }

      super({ hooks });

      Instance.update = () => this.render();

      this.registerComponent('MainBlock', MainBlock);
      this.registerComponent('AboutBlock', AboutBlock);
      this.registerComponent('FooterBlock', FooterBlock);

      Instance.updateRoot().then(() => this.mounthed.set(true));

    }

    onMount() {
      console.log('onMount');
    } 

    onUpdate() {
      console.log('onUpdate');
    }  

    render() {
      return html`
        <div class="application" id="${ this.constructor.name }-${ this.hash }">
          ${ this.components.get('MainBlock')?.render() }
          ${ this.components.get('AboutBlock')?.render() }
          ${ this.components.get('FooterBlock')?.render() }
        </div>
      `
    }

    static updateRoot(): Promise<void> {
      return new Promise((res) => {
        LitRender(Instance.update(), document.body); res()
      })
    }

  }



// INIT INSTANCE
  export default new Instance();

