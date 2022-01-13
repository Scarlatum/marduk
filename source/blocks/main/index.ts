import { html, TemplateResult } from 'lit-html';

  import Component, { ComponentHooks } from '~/component'

// STYLES
  import './styles.scss';

// COMPONENTS

  type ComponentNames = 'Header' | `Card-${ number }`;

  import Header from '~/components/header';
  import Card from '~/components/card'

  console.log(Card.name, Header.name);

// IMAGE
  import imagePath from '~/assets/images/back.jpg';

// INTERFACES'N'TYPES
  type ImageTransform = { x: number, y: number };
  type MaskParams = { e: number, s: number };

  interface State {
    imageShift: ImageTransform
    maskParams: MaskParams
  }

// MODULE
export default class MainBlockComponent extends Component<State, ComponentNames> {

  constructor(updateRoot: ComponentHooks['onUpdate']) { 

    super({ imageShift: { x: 0, y: 0 }, maskParams: { e: 0, s: 0 } }, {
      onMount: () => {

        this.animateAbout();

        document.getElementById('CardContainer')!.addEventListener('wheel', (event) => {
          this.calcFadeMask(event); console.log(this.state.get().maskParams)
        });

      },
      onUpdate: updateRoot
    });

    this.components.set('Header', new Header(() => updateRoot()));

    for ( let i = 0; i < 3; i++) {
      this.components.set(`Card-${ i }`, new Card(() => updateRoot()));
    }

    window.addEventListener('mousemove', ({ x, y }) => {
      this.state.setKey('imageShift', this.getNormilizedShift({x,y}, -15))
    })

  }

  private static easeOutQuad(n: number) {
    return n * (2 - Math.abs(n));
  }

  private getNormilizedShift(values: ImageTransform, maxShift: number): ImageTransform {
    return {
      x: maxShift * ( MainBlockComponent.easeOutQuad(values.x / (innerWidth  / 2) - 1)),
      y: maxShift * ( MainBlockComponent.easeOutQuad(values.y / (innerHeight / 2) - 1)),
    }
  }

  private animateAbout() {
    
    const element = document.getElementById('mainText');

    Array.from(element!.children).forEach((el, i) => {

      (el as HTMLElement).style.opacity = '0';

      el.animate([
        { opacity: 0, transform: 'translateX(-100px)' },
        { opacity: 1, transform: 'translateX(0px)' }
      ], {
        delay: 500 + (250 * i),
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards',
      })
    })

  }

  private calcFadeMask({ target }: WheelEvent) {

    const { scrollHeight, offsetHeight, scrollTop } = target as HTMLElement;

    console.log(scrollHeight,offsetHeight,scrollTop)

    this.state.setKey('maskParams', { e: 0, s: 0 });

  }

  render(): TemplateResult<1> {

    const { x, y } = this.state.get().imageShift;
    const { s, e } = this.state.get().maskParams;

    console.log(s,e,x,y);

    return html`
      <section class="main-container">
        ${ this.components.get('Header')?.render() }
        <picture class="main-image">
          <img src="${ imagePath }" style="--x: ${ x.toFixed(3) }px; --y: ${ y.toFixed(3) }px;">
        </picture>
        <div class="main-about" id="mainText">
          <h1>Anime girls as point of life</h1>
          <h5>Reputiamo ammirabile sempre viviamo oportune giudice i udita sua seguitando forse, nostro 'l cosa fosse medesimi dio seguitando della del, nel in cospetto lui oppinione e che, eterni etterno apparire giudice dallo durare apparire vostro alcun vita, transitorie pregator di.</h5>
        </div>
        <div id="CardContainer" class="main-preview" style="--e: ${ e }; --s: ${ s }">
          ${ this.components.get('Card-1')?.render() }
          ${ this.components.get('Card-2')?.render() }
          ${ this.components.get('Card-3')?.render() }
        </div>
        <div class="main-footer">
          ${ Array(3).fill(true).map(() => html`<span>something</span>`) }
        </div>
      </section>
    `
    
  }

}