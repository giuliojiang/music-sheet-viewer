import {render, html} from 'lit-html';

export class DoclistElement extends HTMLElement {

    static defineElement(): void {
        window.customElements.define('app-doclist', DoclistElement);
    }

    connectedCallback(): void {
        this.render();
    }

    async render(): Promise<void> {
        let response = await fetch(`/api/documents`, {
            method: 'GET'
        });
        let documents: DocumentModel[] = await response.json();

        render(html`
            <style>
                .doclist-column {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                }

                .doclist-item {
                    padding: 10px;
                    cursor: pointer;
                }
            </style>

            <div class="doclist-column">
                ${documents.map(document => {
                    let documentClick = () => {
                        let event = new CustomEvent('docselected', {
                            detail: document.id, 
                            bubbles: true
                        });
                        this.dispatchEvent(event);
                    };
                    return html`
                        <div class="doclist-item" @click=${documentClick}>${document.name}</div>
                    `;
                })}
            </div>
        `, this);
    }

}