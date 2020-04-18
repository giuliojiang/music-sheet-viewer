import {render, html} from 'lit-html';

var defineViewport = () => {
    window.customElements.define('app-viewport', class extends HTMLElement {

        currentRotation: number = 0;

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
            render(html`
            
                <style>
                    .viewport-common {
                        position: fixed;
                        overflow: hidden;
                        background-color: #555555;
                        width: 100vw;
                        height: 100vh;
                        z-index: 100;
                    }

                    .viewport-common-0 {
                    }

                    .viewport-common-90 {
                        transform: rotate(90deg);
                        transform-origin: center center;
                    }

                    .viewport-common-180 {
                        transform: rotate(180deg);
                        transform-origin: center center;
                    }

                    .viewport-common-270 {
                        transform: rotate(270deg);
                        transform-origin: center center;
                    }

                    .viewport-column {
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: space-between;
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
                </style>

                <div data-app-viewport-main class="viewport-common ${this.getViewportClass()}">
                    <div class="viewport-column">
                        <div class="viewport-row">
                            <div>top left</div>
                            <div>top right</div>
                        </div>
                        <div class="viewport-row">
                            <div>bottom left</div>
                            <div>bottom right</div>
                        </div>
                    </div>
                </div>

            `, this);
        }
    });
};

export {
    defineViewport
}