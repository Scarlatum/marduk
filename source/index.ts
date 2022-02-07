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

  import MainBlock   from '~/blocks/mainBlock/main';
  import AboutBlock  from '~/blocks/aboutBlock/about';
  import FooterBlock from '~/blocks/footerBlock/footer';

// MODULE
  export class Instance extends Component<ApplicationState, null, ComponentKeys> {

    private static update: RenderFunction;

    constructor() {

      const hooks: Partial<ComponentHooks> = {
        onUpdate: Instance.updateRoot,
      }

      super({ hooks });

      Instance.update = () => this.render();

      this.registerComponent('MainBlock', MainBlock);
      this.registerComponent('AboutBlock', AboutBlock);
      this.registerComponent('FooterBlock', FooterBlock);

      const mutObserver = new MutationObserver(() => {
        this.mounthed.set(true); mutObserver.disconnect();
      })

      mutObserver.observe(document.body, { childList: true });

      Instance.updateRoot();

    }

    onMount() {
      console.log(document.getElementById(this.elementID),'onMount');
    } 

    onUpdate() {
    }  

    render() {
      return html`
        <div class="application" id="${ this.elementID }">
          ${ this.components.get('MainBlock')?.render() }
          ${ this.components.get('AboutBlock')?.render() }
          ${ this.components.get('FooterBlock')?.render() }
        </div>
      `
    }

    static updateRoot(): Promise<void> {

      return new Promise((res) => {
        LitRender(Instance.update(), document.body, {  }); res()
      })

    }

  }



// INIT INSTANCE
  export default new Instance();

