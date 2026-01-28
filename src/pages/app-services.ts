import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';
import { ApiService } from '../services/api-service';
import type { Service } from '../types/api-types';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-services')
export class AppServices extends LitElement {
  @state() private services: Service[] = [];
  @state() private loading = true;
  @state() private selectedCategory: string = 'all';

  static styles = [
    styles,
    css`
      main {
        padding: 16px;
      }

      .category-filter {
        margin-bottom: 2rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .service-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `
  ];

  async firstUpdated() {
    try {
      const response = await ApiService.getServices();
      if (response.success) {
        this.services = response.data;
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      this.loading = false;
    }
  }

  private get categories() {
    return ['all', ...new Set(this.services.map(s => s.category).filter((c): c is string => Boolean(c)))];
  }

  private get filteredServices() {
    if (this.selectedCategory === 'all') return this.services;
    return this.services.filter(s => s.category === this.selectedCategory);
  }

  render() {
    return html`
      <app-header></app-header>
      
      <main>
        <h1>Our Services</h1>
        
        <div class="category-filter">
          ${this.categories.map(cat => html`
            <sl-button
              variant=${this.selectedCategory === cat ? 'primary' : 'default'}
              size="small"
              @click=${() => this.selectedCategory = cat}
            >
              ${cat}
            </sl-button>
          `)}
        </div>

        ${this.loading ? html`<sl-spinner></sl-spinner>` : html`
          <div class="service-list">
            ${this.filteredServices.map(service => html`
              <sl-card>
                <div slot="header">
                  <strong>${service.name}</strong>
                  ${service.category ? html`
                    <sl-badge variant="neutral">${service.category}</sl-badge>
                  ` : ''}
                </div>
                <p>${service.description}</p>
                ${service.duration ? html`<p><small>Duration: ${service.duration}</small></p>` : ''}
                <div slot="footer" style="display: flex; justify-content: space-between; align-items: center;">
                  <strong>From R${service.price}</strong>
                  <sl-button variant="primary" size="small" href="${resolveRouterPath('booking')}?service=${service.id}">
                    Book Now
                  </sl-button>
                </div>
              </sl-card>
            `)}
          </div>
        `}
      </main>
    `;
  }
}
