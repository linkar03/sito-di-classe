/* eslint-disable no-unused-vars */

class TrackerMouse {
		constructor() {
			this.x = 0;
			this.y = 0;
			this.inizializza();
		}

		inizializza() {
			// Aggiorna le coordinate quando il mouse si muove
			document.addEventListener('mousemove', (event) => {
				this.x = event.clientX; // Coordinata X rispetto alla finestra
				this.y = event.clientY; // Coordinata Y rispetto alla finestra
				console.log(`X: ${this.x}, Y: ${this.y}`); // Stampa le coordinate in console
			});
		}

		// Metodo per ottenere le coordinate attuali
		ottieniCoordinate() {
			return { x: this.x, y: this.y };
		}
	}
	
class LineaPersonalizzata {
		constructor(x1, y1, x2, y2, width = 2, colore = '#ffffff') {
			// Crea elemento SVG
			this.elemento = document.createElementNS("http://www.w3.org/2000/svg", "line");
			
			// Imposta attributi della linea
			this.elemento.setAttribute('x1', x1);
			this.elemento.setAttribute('y1', y1);
			this.elemento.setAttribute('x2', x2);
			this.elemento.setAttribute('y2', y2);
			this.elemento.setAttribute('stroke', colore);
			this.elemento.setAttribute('stroke-width', width);
			this.elemento.setAttribute('stroke-linecap', 'round'); // Estremità arrotondate
		}

		// Metodo per aggiungere la linea al DOM
		aggiungiA(parent = document.body) {
			// Crea contenitore SVG se necessario
			if (!parent.querySelector('svg')) {
				this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				this.svg.style.position = 'fixed';
				this.svg.style.top = '0';
				this.svg.style.left = '0';
				this.svg.style.width = '100%';
				this.svg.style.height = '100%';
				this.svg.style.pointerEvents = 'none';
				parent.appendChild(this.svg);
			} else {
				this.svg = parent.querySelector('svg');
			}
			
			this.svg.appendChild(this.elemento);
			return this;
		}

		// Metodi per modificare le proprietà
		aggiornaPosizione(x1, y1, x2, y2) {
			this.elemento.setAttribute('x1', x1);
			this.elemento.setAttribute('y1', y1);
			this.elemento.setAttribute('x2', x2);
			this.elemento.setAttribute('y2', y2);
		}

		aggiornaLarghezza(width) {
			this.elemento.setAttribute('stroke-width', width);
		}

		aggiornaColore(colore) {
			this.elemento.setAttribute('stroke', colore);
		}
	}