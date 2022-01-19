import { html, TemplateResult } from 'lit-html';

// COMPONENT
  import Component, { ComponentPayload } from '~/component';

// STYLES
  import './styles.scss'

// ASSETS
  import placeholderImage from '~/assets/images/mech.png';

// INTERFACES

  export interface State {
    title: string
    image: {
      full: string,
      preview: string,
    }
  }

  export interface Props extends Partial<State> {

  }

// MODULE
  export default class Card extends Component<State, Props,any> {

    public renderFunction = this.render;
    
    constructor({ props, hooks }: ComponentPayload<State, Props>) {

      super({ props, hooks, state: {
        title: props?.title || 'Default title',
        image: props?.image || {
          full: placeholderImage,
          preview: placeholderImage,
        }
      }});

    }

    setMainImage() {
      this.globalStore.setKey('mainImage', this.state.get().image.full);
    }

    render() {

      const { title, image } = this.state.get();

      return html`
        <div class="card-container" id="${ this.constructor.name }-${ this.hash }" @click=${ () => this.setMainImage() }>
          <header class="card-header">${ title }</header>
          <picture class="card-picture">
            <img src="${ image.preview || placeholderImage }">
          </picture>
          <article class="card-body">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Accusamus a harum beatae ad perferendis, quo excepturi rem, vitae voluptas incidunt fugit debitis sit quae eligendi facere reiciendis at fuga unde.
          </article>
        </div>
      `
      
    }

  }