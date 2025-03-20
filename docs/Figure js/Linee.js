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
				//console.log(`X: ${this.x}, Y: ${this.y}`); // Stampa le coordinate in console
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
	
	
class LineaCurva {
    constructor(punti, color = '#ff00ff', spessore = 1) {
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.element.setAttribute('stroke', color);
        this.element.setAttribute('fill', 'none');
        this.element.setAttribute('stroke-width', spessore);
        this.update(punti);
    }

    update(punti) {
        const path = punti.map((p, i) => 
            `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
        ).join(' ') + ' Z';
        this.element.setAttribute('d', path);
    }

    aggiungiA(parent) {
        if (!this.element.parentElement) {
            parent.appendChild(this.element);
        }
        return this;
    }
}




const tracker = new TrackerMouse();

// Anima una linea
const x_linea_crescente = new LineaPersonalizzata(100, 100, 100, 100, 3, '#ffffff').aggiungiA();
const x_linea_decrescente = new LineaPersonalizzata(100, 100, 100, 100, 3, '#ffffff').aggiungiA();

function anima_linee() {

	const coordinate = tracker.ottieniCoordinate();

	x_linea_crescente.aggiornaPosizione(coordinate.x-10, coordinate.y-10, coordinate.x + 10 ,coordinate.y+10);
	
	x_linea_decrescente.aggiornaPosizione(coordinate.x-10, coordinate.y+10, coordinate.x + 10 ,coordinate.y-10);
	
	requestAnimationFrame(anima_linee);
}

function generaPuntiLatiDiversi() {
        const lati = ['top', 'bottom', 'left', 'right'];
        const latoStart = lati[Math.floor(Math.random() * 4)];
        let latoEnd = lati[Math.floor(Math.random() * 4)];
        
        // Assicura che i lati siano diversi
        while(latoEnd === latoStart) {
            latoEnd = lati[Math.floor(Math.random() * 4)];
        }

        const getCoords = (lato) => {
            switch(lato) {
                case 'top': return {x: Math.random() * window.innerWidth/10 + window.innerWidth*8/10, y: 0};
                case 'bottom': return {x: window.innerWidth/10 + Math.random() * window.innerWidth*8/10, y: window.innerHeight};
                case 'left': return {x: 0, y: window.innerHeight/10 + Math.random() * window.innerHeight*8/10};
                case 'right': return {x: window.innerWidth, y: window.innerHeight/10 + Math.random() * window.innerHeight*8/10};
            }
        };

        return [getCoords(latoStart), getCoords(latoEnd)];
    }
	
class LineaPericolosa extends LineaPersonalizzata {
    
	constructor() {
        // Genera punti casuali su lati diversi
        const [start, end] = generaPuntiLatiDiversi();
        super(start.x, start.y, end.x, end.y);
        
        this.fase = 0;
        this.attiva = false;
        this.aggiungiA();
        this.avviaTransizioni();
    }
	
    avviaTransizioni() {
        // Fase 1: Spessore 2, giallo (1 secondo)
        this.aggiornaLarghezza(2);
        this.aggiornaColore('#ffff00');
        
        // Fase 2: Spessore 5, arancione (1 secondo)
        setTimeout(() => {
            this.fase = 1;
            this.aggiornaLarghezza(5);
            this.aggiornaColore('#ffa500');
        }, 500);

        // Fase 3: Spessore 100, rosso (3 secondi)
        setTimeout(() => {
            this.fase = 2;
			this.attiva = true;
            this.aggiornaLarghezza(30);
            this.aggiornaColore('#ff0000');
        }, 500);

        // Rimozione dopo 5 secondi totali
        setTimeout(() => {
            this.elemento.remove();
			this.attiva = false;
        }, 1000);
    }
}