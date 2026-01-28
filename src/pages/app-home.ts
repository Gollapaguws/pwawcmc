import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';
import { ApiService } from '../services/api-service';
import type { Service } from '../api-types';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {
  @state() private services: Service[] = [];
  @state() private loading = true;
  @state() private error: string | null = null;

  static styles = [
    styles,
    css`
      main {
        padding: 16px;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
      }

      sl-card::part(base) {
        height: 100%;
      }

      .service-price {
        font-size: 1.5rem;
        color: var(--sl-color-primary-600);
        font-weight: bold;
      }
    `
  ];

  async firstUpdated() {
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
              <sl-card>
                <div slot="header">
                  <strong>${service.name}</strong>
                </div>
                <p>${service.description}</p>
                <div slot="footer" style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="service-price">R${service.price}</span>
                  <sl-button variant="primary" size="small" href="${resolveRouterPath('booking')}?service=${encodeURIComponent(service.id)}">
                    Book Now
                  </sl-button>
                </div>
              </sl-card>
            `)}
          </div>
        ` : ''}
      </main>
    `;
  }
}
