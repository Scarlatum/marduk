// LIBS
  import { TemplateResult } from 'lit-html';
  import { atom, map as nanostoresMap } from 'nanostores';

// import { ref, createRef, Ref } from 'lit-html/directives/ref.js';

// TYPES
  import type { MapStore, WritableAtom  } from 'nanostores';

  export type RenderFunction = () => TemplateResult<1>;
  export type UpdateMethod   = () => Promise<void>;
  export type NotifyMethod   = () => void;

  export type Props = Map<string, any>;

  type ElementID = `${ string }-${ string }`;

// INTERFACES
  export interface ComponentPayload<State,Props> {
    state?: State
    props?: Partial<Props>
    hooks: Partial<ComponentHooks>
  }

  interface ComponentConstructor<State, Props> {
    new (payload: ComponentPayload<State, Props>): Component<State,Props,any>
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
    protected readonly id: string = Math.random().toString(36).slice(-6).toUpperCase();

    // STATE OF COMPONENT AND GLOBAL STATE
    public readonly store = globalStore('global');
    public readonly state: MapStore<State>;

    // CHILD COMPONENTS
    protected readonly components: Map<ComponentKeys, Component<any,any,any>> = new Map();

    // PROPS'N'HOOKS
    protected readonly hooks: Partial<ComponentHooks>;
    protected readonly props?: Partial<Props>;

    // MOUNT STATE
    protected readonly mounthed: WritableAtom<boolean> = atom(false);
    protected unmountedComponents: Array<Component<any,any,any>> = new Array();

    // // CONTAINER REFERENCE
    // protected containerRef: Ref<HTMLElement> = createRef();

    //
    constructor(payload: ComponentPayload<State,Props>) {

      if ( payload?.hooks?.onUpdate === undefined ) {
        throw new Error(`[Component Init]: У компонента не указана функции корневого обновления | onUpdate: ${ payload.hooks.onUpdate }`);
      }

      this.state = nanostoresMap(payload.state);
      this.props = payload.props;
      this.hooks = this.hooksInit(payload.hooks);

    }

    get elementID(): ElementID {
      return `${ this.constructor.name }-${ this.id }`;
    }

    //
    private hooksInit(hooks: Partial<ComponentHooks>): Partial<ComponentHooks> {

      this.mounthed.listen(() => { 

        // Notify childrens about end of render cycle.
        this.notifyChildrens();

        // 
        if ( this.hooks.onMount ) this.hooks.onMount();

        // Fire onMount method.
        if ( this.onMount ) this.onMount();

        // // DEBUG
        // console.debug(`[Component mounth]: ID: ${ this.id } | ${ this.constructor.name } was mounted `);

      })

      this.state.listen(async () => { 

        if ( this.mounthed.get() === false ) return;

        // Await render.
        if ( hooks.onUpdate ) await hooks.onUpdate();

        // Notify children components about update of parent element, and update their mount state.
        this.notifyChildrens();

        // Fire OnUpdate method.
        if ( this.onUpdate ) this.onUpdate();

        // // DEBUG
        // console.debug(`[Component update]: ID: ${ this.id } | ${ this.constructor.name } was updated `);

      })

      return hooks

    }

    // Get element from DOM
    protected getElement({ constructor, id }: Component<any,any,any>) {
      return document.getElementById(`${ constructor.name }-${ id }`)
    }

    // Notify children components about render cycle completion.
    protected notifyChildrens(): void {

      if ( this.components.size === 0 ) return;

      if ( this.unmountedComponents.length === 0 ) return;

      this.unmountedComponents.forEach(comp => {
        if ( comp.mounthed.get() === false ) {
          comp.mounthed.set(true);
        }
      })

      this.unmountedComponents = new Array(0);

    } 

    //
    protected registerComponent<State,Props>(alias: ComponentKeys, component: ComponentConstructor<State,Props>, props?: Partial<Props>) {

      const payload: ComponentPayload<State,Props> = {
        state: undefined,
        props: props,
        hooks: this.hooks
      }

      this.components.set(alias, new component(payload));

      this.unmountedComponents.push(this.components.get(alias)!)

      return (this.components.get(alias) as Component<State,Props,any>)

    }

    abstract render(props?: object): TemplateResult<1>

    // Lifecycle methods declaration.
    protected abstract onMount(): void;
    protected abstract onUpdate(): void;

  }