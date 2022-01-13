import { html, TemplateResult } from 'lit-html';

// COMPONENT
  import Component, { ComponentHooks } from '~/component';

// STYLES
  import './styles.scss'

// ASSETS
  import imagePath from '~/assets/images/mech.png';

// INTERFACES
  interface State {
    title: string
  }

// MODULE
  export default class CardComponent extends Component<State, unknown> {
    
    constructor(updateMethod: ComponentHooks['onUpdate']) {

      super({ title: 'Title example' }, {
        onUpdate: updateMethod
      })

    }

    render(): TemplateResult<1> {
      return html`
        <div class="card-container">
          <header>${ this.state.get().title }</header>
          <picture>
            <img src="${ imagePath }">
          </picture>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus a harum beatae ad perferendis, quo excepturi rem, vitae voluptas incidunt fugit debitis sit quae eligendi facere reiciendis at fuga unde.
          </p>
        </div>
      `
    }

  }