import {render, html} from 'lit-html';
import { ViewerElement } from './viewer';

export class ViewportElement extends HTMLElement {

    static defineElement(): void {
        window.customElements.define('app-viewport', ViewportElement);
    }

    currentRotation: number = 0;
    selectedDocument: DocumentModel = null;

    getViewportClass(): string {
        if (this.currentRotation == 0) {
            return 'viewport-common-0';
        } else if (this.currentRotation == 90) {
            return 'viewport-common-90';
        } else if (this.currentRotation == 180) {
            return 'viewport-common-180';
        } else {
            return 'viewport-common-270';
        }
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {

        let handleRotate0 = () => {
            this.currentRotation = 0;
            this.render();
        };

        let handleRotate90 = () => {
            this.currentRotation = 90;
            this.render();
        };

        let handleRotate180 = () => {
            this.currentRotation = 180;
            this.render();
        };

        let handleRotate270 = () => {
            this.currentRotation = 270;
            this.render();
        };

        let handleDocSelected = (event: CustomEvent) => {
            console.info(`Selected doc ${event.detail}`);
            this.selectedDocument = event.detail;
            this.render();
        };

        render(html`
        
            <style>
                .viewport-common {
                    position: fixed;
                    overflow: hidden;
                    z-index: 100;
                }

                .viewport-common-0 {
                    width: 100vw;
                    height: 100vh;
                }

                .viewport-common-90 {
                    width: 100vh;
                    height: 100vw;
                    transform: rotate(90deg);
                    transform-origin: bottom left;
                    top: -100vw;
                    left: 0;
                }

                .viewport-common-180 {
                    width: 100vw;
                    height: 100vh;
                    transform: rotate(180deg);
                    transform-origin: center center;
                }

                .viewport-common-270 {
                    width: 100vh;
                    height: 100vw;
                    transform: rotate(270deg);
                    transform-origin: top left;
                    top: 100vh;
                    left: 0;
                }

                .viewport-column {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    width: 100%;
                    height: 100%;
                }

                .viewport-row {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    width: 100%;
                }

                .viewport-button {
                    padding: 10px;
                    cursor: pointer;
                }

                .viewport-doclist {
                    width: 100%;
                    height: 0;
                    flex-grow: 2;
                }

                .viewport-viewer {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: 200;
                    top: 0;
                    left: 0;
                }
            </style>

            <div data-app-viewport-main class="viewport-common ${this.getViewportClass()}">
                <div class="viewport-column">
                    <div class="viewport-row">
                        <div class="viewport-button" @click=${handleRotate0}>0</div>
                        <div class="viewport-button" @click=${handleRotate90}>90</div>
                        <div class="viewport-button" @click=${handleRotate180}>180</div>
                        <div class="viewport-button" @click=${handleRotate270}>270</div>
                    </div>
                    <app-doclist class="viewport-doclist" @docselected=${handleDocSelected}></app-doclist>
                </div>

                ${this.selectedDocument != null
                    ? html`
                        <app-viewer data-viewport-viewer class="viewport-viewer"></app-viewer>
                    `
                    : html``}
            </div>
        `, this);

        let viewer = this.querySelector('[data-viewport-viewer]') as ViewerElement;
        if (viewer != null) {
            viewer.setDocument(this.selectedDocument);
        }
    }
}
