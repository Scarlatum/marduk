import { html } from 'lit-html';

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
  export default class Card extends Component<State, Props, any> {

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

    onMount() {

      const intersection = new IntersectionObserver((entry) => {
        this.animateCard(entry[0].target, entry[0].isIntersecting)
      }, { rootMargin: '-100px' })

      intersection.observe(document.getElementById(`${ this.constructor.name }-${ this.hash }`)!)

    }

    onUpdate() {
    }

    animateCard(element: Element, dir: boolean) {

      if ( element ) {
        const animation = element.animate([
          { opacity: 0 }, 
          { opacity: 1 }
        ], {
          delay: 250,
          duration: 1000,
          fill: 'both',
        })

        animation.pause();
        animation.playbackRate = dir ? 1 : -1;
        animation.play();

      }

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