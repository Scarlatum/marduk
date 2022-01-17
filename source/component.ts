
import { html, nothing, TemplateResult } from 'lit-html';
import { atom, map as nanostoresMap, MapStore } from 'nanostores';

// STORE
  import { globalStore } from '~/store'

// TYPES
  export type RenderFunction = () => TemplateResult<1>;
  export type UpdateMethod = () => Promise<void>;

  export type Props = Map<string, any>

// DECORATORS
  export function reactive() {
    console.log('reactive decorator')
  }

// INTERFACES
  interface ComponentStruct<S extends object> {
    state: MapStore<S>,
    render: () => TemplateResult<1>,
    renderFunction?: RenderFunction,
  }

  interface ComponentConstructor<Props> {
    new (upd: UpdateMethod, props?: any): Component<any,Props>
  }

  export interface ComponentHooks {
    onMount: () => void
    onUpdate: UpdateMethod
  }

export default class Component<State extends object, Props> implements ComponentStruct<State> {

  private hash: string;
  private hooks?: Partial<ComponentHooks>;
  private onNextUpdate: any;

  protected globalStore = globalStore('global');

  protected components: Map<string, Component<any,any>> = new Map();
  protected props?: Props;

  public state: MapStore<State>;
  public mounthed = atom(false);

  constructor(state: State, hooks?: Partial<ComponentHooks>) {
    
    this.state  = nanostoresMap(state);
    this.hash   = Math.random().toString(36).substring(7).toUpperCase();

    if ( hooks ) this.hooksInit(hooks);

  }

  protected notifyChildrens() {
    if ( this.components.size ) {
      this.components.forEach(component => {
        if ( component.mounthed.get() === false ) component.mounthed.set(true);
      })
    }
  } 

  private hooksInit(hooks: Partial<ComponentHooks>) {

    this.hooks = hooks;

    this.mounthed.listen(() => { 

      console.debug(`[Component mounth]: ${ this.constructor.name } was mounted | ID: ${ this.hash  }`);

      if ( hooks.onMount !== undefined ) {
        hooks.onMount(); this.notifyChildrens(); this.mounthed.off();
      }

    })
    
    this.state.listen(() => { 
      
      console.debug(`[Component update]: ${ this.constructor.name } was updated | ID: ${ this.hash  }`);

      if ( hooks.onUpdate ) hooks.onUpdate().then(() => {

        if ( this.mounthed.get() === false ) {
          this.notifyChildrens(); this.mounthed.set(true)
        }

        if ( this.onNextUpdate ) {
          this.onNextUpdate(); this.onNextUpdate = null;
        }

      });

    })

  }

  public getComponent<S extends object, P>(alias: string): Component<S,P> | undefined {

    if ( this.components.size === 0 ) return void 0;

    return this.components.get(alias);

  }

  protected registerComponent<ComponentProps>(alias: string, component: ComponentConstructor<ComponentProps>, props?: ComponentProps,) {

    if ( this.hooks?.onUpdate ) {

      this.components.set(alias, new component(this.hooks.onUpdate, props)); 
      
      this.onNextUpdate = this.notifyChildrens();

      return this.components.get(alias);

    } else {
      throw new Error(`[Component Init]: У компонента не указана функции корневого обновления | onUpdate: ${ this.hooks?.onUpdate }`);
    }

  }

  render() {
    return html`${ nothing }`;
  }

}