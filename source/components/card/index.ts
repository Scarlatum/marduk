import { html, TemplateResult } from 'lit-html';

// COMPONENT
  import Component, { UpdateMethod } from '~/component';

// STYLES
  import './styles.scss'

// ASSETS
  import placeholderImage from '~/assets/images/mech.png';

// INTERFACES

  export interface State {
    title: string
    image: string
  }

  export interface Props extends Partial<State> {

  }

// MODULE
  export default class CardComponent extends Component<State, Props> {
    
    constructor(updateMethod: UpdateMethod, props?: Props) {

      const state: State = {
        title: props?.title || 'Default title',
        image: props?.image || placeholderImage
      }

      super(state, { onUpdate: updateMethod });

    }

    setMainImage() {
      this.globalStore.setKey('mainImage', this.state.get().image);
    }

    render(): TemplateResult<1> {

      const { title, image } = this.state.get();

      return html`
        <div class="card-container" @click=${ () => this.setMainImage() }>
          <header>${ title }</header>
          <hr>
          <picture>
            <img src="${ image || placeholderImage }">
          </picture>
          <hr>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
            Accusamus a harum beatae ad perferendis, quo excepturi rem, vitae voluptas incidunt fugit debitis sit quae eligendi facere reiciendis at fuga unde.
          </p>
        </div>
      `
      
    }

  }