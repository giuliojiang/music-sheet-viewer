import {render, html} from 'lit-html';

export class ViewerElement extends HTMLElement {

    static defineElement(): void {
        window.customElements.define('app-viewer', ViewerElement);
    }

    currentPage: number = 0;
    document: DocumentModel = null;

    setDocument(document: DocumentModel): void {
        this.document = document;
        this.renderImages();
    }

    connectedCallback(): void {
        let handleUp = () => {
            var event = new CustomEvent('viewerup', {
                bubbles: true
            });
            this.dispatchEvent(event);
        };

        let handleLeft = () => {
            this.setNewIndex(this.currentPage - 1);
        };

        let handleRight = () => {
            this.setNewIndex(this.currentPage + 1);
        };

        render(html`
            <style>
                .viewer-image {
                    z-index: 200;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    object-fit: contain;
                    background-color: white;
                }

                .viewer-image-hidden {
                    opacity: 0;
                }

                .viewer-control-layer {
                    z-index: 300;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .viewer-control-row-top {
                    width: 100%;
                    height: 30%;
                    flex-grow: 0;
                    flex-shrink: 0;
                }

                .viewer-control-row-bottom {
                    width: 100%;
                    height: 70%;
                    flex-grow: 0;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: row;
                }

                .viewer-control-row-bottom-item {
                    width: 50%;
                    height: 100%;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
            </style>

            <div class="viewer-control-layer">
                <div class="viewer-control-row-top" @click=${handleUp} @touchstart=${handleUp}></div>
                <div class="viewer-control-row-bottom">
                    <div class="viewer-control-row-bottom-item" @click=${handleLeft} @touchstart=${handleLeft}></div>
                    <div class="viewer-control-row-bottom-item" @click=${handleRight} @touchstart=${handleRight}></div>
                </div>
            </div>
        `, this);
    }

    setNewIndex(index: number): void {
        if (index < 0 || index >= this.document.pages) {
            return;
        }
        this.currentPage = index;
        this.renderImages();
    }

    renderImages(): void {
        let previousIndex = this.currentPage - 1;
        let nextIndex = this.currentPage + 1;

        this.loadImage(this.currentPage);
        // Make the current page visible
        let currentImageElement = this.findMatchingChild(this.currentPage);
        currentImageElement.classList.remove('viewer-image-hidden');

        this.loadImage(previousIndex);
        this.loadImage(nextIndex);

        // Remove images that should be unloaded
        let loadedIndexes = [previousIndex, this.currentPage, nextIndex];
        let children = this.children;
        for (let i = 0; i < children.length; i++) {
            let child = children.item(i);
            let childIndex = parseInt(child.getAttribute('data-viewer-index'));
            if (!isNaN(childIndex) && !loadedIndexes.includes(childIndex)) {
                console.info(`Unloading image ${childIndex}`);
                child.remove();
            }
        }
    }

    private findMatchingChild(index: number): HTMLElement {
        let children = this.children;
        for (let i = 0; i < children.length; i++) {
            let child = children.item(i);
            if (parseInt(child.getAttribute('data-viewer-index')) == index) {
                return child as HTMLElement;
            }
        }
        return null;
    }

    loadImage(index: number): void {
        if (index < 0 || index >= this.document.pages) {
            return;
        }

        // Find an already loaded image
        let matchingChild = this.findMatchingChild(index);
        if (matchingChild != null) {
            // Hide it
            matchingChild.classList.add('viewer-image-hidden');
            return;
        }

        // This image isn't already loaded, so add it to DOM
        let img = document.createElement('img');
        img.classList.add('viewer-image');
        img.classList.add('viewer-image-hidden');
        img.setAttribute('data-viewer-index', index.toString());
        img.setAttribute('src', `/api/documents/${this.document.id}/${index}`);
        this.appendChild(img);
    }


}