import { html, render as LitRender, nothing } from 'lit-html';

// COMPONENT
  import Component, { RenderFunction } from '~/component';

// STYLES
  import './assets/scss/common.scss';

// INTERFACES
  interface ApplicationState {
    counter: number
  }

// COMPONENTS
  type ComponentKeys = 'MainBlock';

  import MainBlock from '~/blocks/main';

// MODULE
  export class Instance extends Component<ApplicationState, any, ComponentKeys> {

    private static update: RenderFunction;

    constructor() {

      const hooks = {
        onUpdate: Instance.updateRoot,
        onMount: () => this.notifyChildrens()
      }

      super({ hooks });

      Instance.update = () => this.render();

      this.registerComponent('MainBlock', MainBlock);

      Instance.updateRoot().then(() => this.mounthed.set(true));

    }   

    render() {
      return html`
        <div class="application" id="${ this.constructor.name }-${ this.hash }">
          ${ this.components.get('MainBlock')?.render() || nothing }
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

