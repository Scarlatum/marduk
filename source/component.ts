import type { TemplateResult } from 'lit-html';
import { atom, map as nanostoresMap } from 'nanostores';

// TYPES
  import type { MapStore, Atom  } from 'nanostores';

  export type RenderFunction = () => TemplateResult<1>;
  export type UpdateMethod   = () => Promise<void>;
  export type NotifyMethod   = () => void;

  export type Props = Map<string, any>

// DECORATORS
  export function reactive() {
    console.log('reactive decorator')
  }

// INTERFACES
  interface ComponentStruct<S> {
    state: MapStore<S>,
    mounthed: Atom<boolean>
  }

  export interface ComponentPayload<State,Props> {
    state?: State
    props?: Props 
    hooks: Partial<ComponentHooks>
  }

  interface ComponentConstructor<Props> {
    new (payload: ComponentPayload<any, Props>): Component<any,Props,any>
  }

  export interface ComponentHooks {
    onMount: () => void
    onUpdate: UpdateMethod
  }

// STORE
  import { globalStore } from '~/store'

// COMPONENT
  export default abstract class Component<State, Props, ComponentKeys> implements ComponentStruct<State> {

    protected hash: string;
    private onNextUpdate: any;

    protected globalStore = globalStore('global');

    protected components: Map<ComponentKeys, Component<any,any,any>> = new Map();
    protected hooks: Partial<ComponentHooks>;
    protected props?: Props;

    public state: MapStore<State>;
    public mounthed = atom(false);

    constructor(payload: ComponentPayload<State,Props>) {
      
      this.state          = nanostoresMap(payload.state);
      this.props          = payload.props;
      this.hooks          = this.hooksInit(payload.hooks);
      this.hash           = Math.random().toString(36).slice(-6).toUpperCase();

      this.onNextUpdate = () => this.notifyChildrens();

    }

    private hooksInit(hooks: Partial<ComponentHooks>): Partial<ComponentHooks> {

      this.mounthed.listen(() => { 

        if ( hooks.onMount !== undefined ) hooks.onMount()

        console.debug(`[Component mounth]: ID: ${ this.hash } | ${ this.constructor.name } was mounted`,);

        this.mounthed.off();

      })

      this.state.listen(async () => { 
        
        console.debug(`[Component update]: ID: ${ this.hash } | ${ this.constructor.name } was updated`);

        if ( hooks.onUpdate ) await hooks.onUpdate()

        if ( this.mounthed.get() === false ) {
          this.notifyChildrens(); this.mounthed.set(true)
        }

        if ( this.onNextUpdate ) {
          this.onNextUpdate(); this.onNextUpdate = null;
        }

      })

      return hooks

    }

    protected registerComponent<Props extends object>(alias: ComponentKeys, component: ComponentConstructor<Props>, props?: Props) {

      if ( this.hooks?.onUpdate ) {

        const payload: ComponentPayload<any, Props> = {
          state: null,
          props: props,
          hooks: this.hooks
        }

        this.components.set(alias, new component(payload)); 

        return this.components.get(alias);

      } else {
        throw new Error(`[Component Init]: У компонента не указана функции корневого обновления | onUpdate: ${ this.hooks?.onUpdate }`);
      }

    }

    // Notify children components about render cycle completion.
    protected notifyChildrens() {
      if ( this.components.size ) {
        this.components.forEach(component => {
          if ( component.mounthed.get() === false ) component.mounthed.set(true);
        })
      }
    } 

    abstract render(props?: any): TemplateResult<1>

  }