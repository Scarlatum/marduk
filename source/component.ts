
import { html, nothing, TemplateResult } from 'lit-html';
import { atom, map as nanostoresMap, MapStore } from 'nanostores';

// TYPES
  type RenderFunction = () => TemplateResult<1>

// DECORATORS
  export function reactive() {
    console.log('reactive decorator')
  }

// INTERFACES
  interface ComponentConstructor<S> {
    state: MapStore<S>,
    render: () => TemplateResult<1>,
    renderFunction?: RenderFunction,
  }

  export interface ComponentHooks {
    onMount: () => void
    onUpdate: () => Promise<void>
  }

export default class Component<State, ComponentsKeys> implements ComponentConstructor<State> {

  public mounthed = atom(false);
  public state: MapStore<State>;

  public components: Map<ComponentsKeys, Component<any,any>> = new Map();

  constructor(state: State, hooks?: Partial<ComponentHooks>) {
    
    this.state = nanostoresMap(state);

    if ( hooks ) this.hooksInit(hooks);

  }

  public notifyChildrens() {
    this.components.forEach(component => {
      if ( component.mounthed.get() === false ) component.mounthed.set(true);
    })
  } 

  private hooksInit(hooks: Partial<ComponentHooks>) {

    this.mounthed.listen(() => { console.debug(`[Component mounth]: ${ this.constructor.name } was mounted`);
      if ( hooks.onMount !== undefined ) {
        hooks.onMount(); this.notifyChildrens(); this.mounthed.off();
      }
    })
    
    this.state.listen(() => { console.debug(`[Component update]: ${ this.constructor.name } was updated`);
      if ( hooks.onUpdate ) hooks.onUpdate().then(() => {
        if ( this.mounthed.get() === false ) {
          this.notifyChildrens(); this.mounthed.set(true)
        }
      });
    })

  }

  render() {
    return html`${ nothing }`;
  }

}