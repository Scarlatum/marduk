import type { TemplateResult } from 'lit-html';
import { atom, map as nanostoresMap } from 'nanostores';

// TYPES
  import type { MapStore, WritableAtom  } from 'nanostores';

  export type RenderFunction = () => TemplateResult<1>;
  export type UpdateMethod   = () => Promise<void>;
  export type NotifyMethod   = () => void;

  export type Props = Map<string, any>

// DECORATORS
  export function reactive() {
    console.log('reactive decorator')
  }

// INTERFACES
  // interface ComponentStruct<S> {
  // }

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
  export default abstract class Component<State, Props, ComponentKeys> {

    // COMPONENT HASH ID
    protected readonly hash: string = Math.random().toString(36).slice(-6).toUpperCase();

    // STATE OF COMPONENT AND GLOBAL STATE
    protected readonly globalStore = globalStore('global');
    protected readonly state: MapStore<State>;

    // CHILD COMPONENTS
    protected readonly components: Map<ComponentKeys, Component<any,any,any>> = new Map();

    // PROPS'N'HOOKS
    protected readonly hooks: Partial<ComponentHooks>;
    protected readonly props?: Props;

    // MOUNT STATE
    protected readonly mounthed: WritableAtom<boolean> = atom(false);

    //
    constructor(payload: ComponentPayload<State,Props>) {

      if ( payload?.hooks?.onUpdate === undefined ) {
        throw new Error(`[Component Init]: У компонента не указана функции корневого обновления | onUpdate: ${ payload.hooks.onUpdate }`);
      }

      this.state = nanostoresMap(payload.state);
      this.props = payload.props;
      this.hooks = this.hooksInit(payload.hooks);

    }

    //
    private hooksInit(hooks: Partial<ComponentHooks>): Partial<ComponentHooks> {

      this.mounthed.listen(() => { 

        // Run parent mouth hook
        if ( hooks.onMount ) hooks.onMount()

        // Notify childrens about end of render cycle 
        this.notifyChildrens();

        // OnMount
        if ( this.onMount ) this.onMount();

        // DEBUG
        console.debug(`[Component mounth]: ID: ${ this.hash } | ${ this.constructor.name } was mounted`,);

      })

      this.state.listen(async () => { 
        
        // Await render
        if ( hooks.onUpdate ) await hooks.onUpdate();

        // After render
        this.notifyChildrens();

        // OnUpdate
        if ( this.onUpdate ) this.onUpdate();

        // DEBUG
        console.debug(`[Component update]: ID: ${ this.hash } | ${ this.constructor.name } was updated`);

      })

      return hooks

    }

    //
    protected registerComponent<Props extends object>(alias: ComponentKeys, component: ComponentConstructor<Props>, props?: Props) {

      const payload: ComponentPayload<unknown, Props> = {
        state: null,
        props: props,
        hooks: this.hooks
      }

      this.components.set(alias, new component(payload));

      return this.components.get(alias);

    }

    // Notify children components about render cycle completion.
    protected notifyChildrens() {
      if ( this.components.size ) {
        this.components.forEach(component => {
          if ( component.mounthed.get() === false ) component.mounthed.set(true);
        })
      }
    } 

    abstract render(props?: object): TemplateResult<1>

    // Lifecycle methods declaration
    protected abstract onMount(): void;
    protected abstract onUpdate(): void;

  }