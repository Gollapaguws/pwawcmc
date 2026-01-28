import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';

import { styles } from '../styles/shared-styles';

@customElement('app-booking')
export class AppBooking extends LitElement {
  static styles = [
    styles,
    css`
      main {
        padding: 16px;
      }
    `
  ];

  render() {
    return html`
      <app-header></app-header>
      
      <main>
        <h1>Book a Service</h1>
        <sl-card>
          <p>Booking functionality coming soon...</p>
        </sl-card>
      </main>
    `;
  }
}
