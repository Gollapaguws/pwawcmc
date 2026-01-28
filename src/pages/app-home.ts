import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';
import { ApiService } from '../services/api-service';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  @state() private services: any[] = [];
  @state() private loading = true;
  @state() private error: string | null = null;

  static styles = [
    styles,
    css`
    #welcomeBar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    #welcomeCard,
    #infoCard {
      padding: 18px;
      padding-top: 0px;
    }

    sl-card::part(footer) {
      display: flex;
      justify-content: flex-end;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .service-card::part(base) {
      height: 100%;
    }

    .service-price {
      font-size: 1.5rem;
      color: var(--sl-color-primary-600);
      font-weight: bold;
    }

    @media(min-width: 750px) {
      sl-card {
        width: 70vw;
      }
    }


    @media (horizontal-viewport-segments: 2) {
      #welcomeBar {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }

      #welcomeCard {
        margin-right: 64px;
      }
    }
  `];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');
    await this.loadServices();
  }

  private async loadServices() {
    try {
      this.loading = true;
      this.error = null;
      
      const response = await ApiService.getServices();
      
      if (response.success) {
        this.services = response.data;
      } else {
        throw new Error(response.error || 'Failed to load services');
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      this.error = 'Unable to load services. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`
      <app-header></app-header>

      <main>
        <h1>Wescoast Motorcycles Services</h1>

        ${this.loading ? html`
          <div style="text-align: center; padding: 2rem;">
            <sl-spinner style="font-size: 3rem;"></sl-spinner>
            <p>Loading services...</p>
          </div>
        ` : ''}

        ${this.error ? html`
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong>Error</strong><br />
            ${this.error}
            <sl-button slot="actions" variant="primary" size="small" @click=${this.loadServices}>
              Retry
            </sl-button>
          </sl-alert>
        ` : ''}

        ${!this.loading && !this.error ? html`
          <div class="services-grid">
            ${this.services.map(service => html`
              <sl-card class="service-card">
                <div slot="header">
                  <strong>${service.name}</strong>
                </div>
                <p>${service.description}</p>
                <div slot="footer" style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="service-price">R${service.price}</span>
                  <sl-button variant="primary" size="small" href="${resolveRouterPath('booking')}?service=${service.id}">
                    Book Now
                  </sl-button>
                </div>
              </sl-card>
            `)}
          </div>
        ` : ''}

        <div id="welcomeBar" style="margin-top: 2rem;">
          <sl-card id="welcomeCard">
            <div slot="header">
              <h2>${this.message}</h2>
            </div>

            <p>
              For more information on the PWABuilder pwa-starter, check out the
              <a href="https://docs.pwabuilder.com/#/starter/quick-start">
                documentation</a>.
            </p>

            <p id="mainInfo">
              Welcome to the
              <a href="https://pwabuilder.com">PWABuilder</a>
              pwa-starter! Be sure to head back to
              <a href="https://pwabuilder.com">PWABuilder</a>
              when you are ready to ship this PWA to the Microsoft Store, Google Play
              and the Apple App Store!
            </p>

            ${'share' in navigator
              ? html`<sl-button slot="footer" variant="default" @click="${this.share}">
                        <sl-icon slot="prefix" name="share"></sl-icon>
                        Share this Starter!
                      </sl-button>`
              : null}
          </sl-card>

          <sl-card id="infoCard">
            <h2>Technology Used</h2>

            <ul>
              <li>
                <a href="https://www.typescriptlang.org/">TypeScript</a>
              </li>

              <li>
                <a href="https://lit.dev">lit</a>
              </li>

              <li>
                <a href="https://shoelace.style/">Shoelace</a>
              </li>

              <li>
                <a href="https://github.com/thepassle/app-tools/blob/master/router/README.md"
                  >App Tools Router</a>
              </li>
            </ul>
          </sl-card>

          <sl-button href="${resolveRouterPath('about')}" variant="primary">Navigate to About</sl-button>
        </div>
      </main>
    `;
  }
}
