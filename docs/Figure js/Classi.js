/* eslint-disable no-unused-vars */
// tracker.ottieniCoordinate().x




class Message_Screen {
    static activeMessages = [];
    
    constructor(text, options = {}) {
        this.text = text;
        this.duration = options.duration || 2000;
        this.fontSize = options.fontSize || 28;
        this.color = this.getRandomArcadeColor();
        this.element = null;
        this.rect = null;
        this.createMessage();
    }

    getRandomArcadeColor() {
        const colors = [
            '#FF0000', '#00FF00', '#FFFF00', 
            '#FF00FF', '#00FFFF', '#FF8000'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createMessage() {
        // Crea elemento temporaneo per il calcolo delle dimensioni
        const temp = document.createElement('div');
        temp.style.cssText = `
            position: absolute;
            visibility: hidden;
            font-family: 'Press Start 2P', cursive;
            font-size: ${this.fontSize}px;
            white-space: nowrap;
        `;
        temp.textContent = this.text;
        document.body.appendChild(temp);
        
        // Calcola dimensioni reali
        const rect = temp.getBoundingClientRect();
        this.rect = {
            width: rect.width,
            height: rect.height
        };
        document.body.removeChild(temp);

        // Posizione iniziale
        const mouseX = window.mouseX || tracker.ottieniCoordinate().x;
        const mouseY = window.mouseY || tracker.ottieniCoordinate().y;
        this.x = mouseX - this.rect.width/2;
        this.y = mouseY - 20;

        // Controlla sovrapposizioni e regola posizione
        this.adjustPosition();

        // Crea elemento finale
        this.element = document.createElement('div');
        this.element.textContent = this.text;
        
        Object.assign(this.element.style, {
            position: 'fixed',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: `${this.fontSize}px`,
            color: this.color,
            textShadow: '3px 3px #000',
            pointerEvents: 'none',
            zIndex: '99999',
            left: `${this.x}px`,
            top: `${this.y}px`,
            transition: 'opacity 0.4s ease',
            opacity: '1'
        });

        Message_Screen.activeMessages.push(this);
    }

    adjustPosition() {
        const padding = 10;
        let collision = true;
        let attempts = 0;

        while(collision && attempts < 10) {
            collision = false;
            
            for(const msg of Message_Screen.activeMessages) {
                const horizontalOverlap = 
                    this.x < msg.x + msg.rect.width && 
                    this.x + this.rect.width > msg.x;
                    
                const verticalOverlap = 
                    this.y < msg.y + msg.rect.height + padding && 
                    this.y + this.rect.height > msg.y;

                if(horizontalOverlap && verticalOverlap) {
                    this.y = msg.y + msg.rect.height + padding;
                    collision = true;
                    break;
                }
            }
            attempts++;
        }
    }

    show() {
        document.body.appendChild(this.element);
        
        setTimeout(() => {
            this.element.style.opacity = '0';
        }, this.duration - 500);

        setTimeout(() => this.destroy(), this.duration);
    }

    destroy() {
        if(this.element) {
            this.element.remove();
            Message_Screen.activeMessages = 
                Message_Screen.activeMessages.filter(msg => msg !== this);
        }
    }
}





class Alert {
  constructor(message, options = {}) {
    this.message = message;
    this.duration = options.duration || 2000; // Default 2 secondi
    this.element = null;
    this.backgroundColor = options.backgroundColor || '#333'; // Colore di default
    this.padding = options.padding || '15px 25px'; // Padding personalizzabile
  }

  show() {
    // Crea l'elemento alert
    this.element = document.createElement('div');
    this.element.innerHTML = this.message;
    
    // Stili ottimizzati
    Object.assign(this.element.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: this.backgroundColor,
      color: 'white',
      padding: this.padding,
      textAlign: 'center',
      zIndex: '9999',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      borderRadius: '8px',
      fontSize: '11px',
      display: 'inline-block',
      maxWidth: '90%',
      wordBreak: 'break-word',
      lineHeight: '1.4'
    });

    // Aggiungi alla pagina
    document.body.appendChild(this.element);

    // Rimuovi dopo il timeout
    setTimeout(() => this.hide(), this.duration);
  }

  hide() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  }
}


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

        // Aggiungi transizione CSS
        this.elemento.style.transition = 'stroke 0.5s ease';
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

    // Nuovo metodo per cambiare colore con animazione
    cambiaColoreConAnimazione(nuovoColore, durata = 500) {
        this.elemento.style.transition = `stroke ${durata}ms ease`;
        this.elemento.setAttribute('stroke', nuovoColore);
    }

    // Metodo per cambiare colore in modo intermittente
    lampeggia(colori, intervallo = 500) {
        if (this.lampeggioInterval) clearInterval(this.lampeggioInterval);

        let index = 0;
        this.lampeggioInterval = setInterval(() => {
            this.aggiornaColore(colori[index]);
            index = (index + 1) % colori.length;
        }, intervallo);
    }

    // Metodo per fermare il lampeggio
    fermaLampeggio() {
        if (this.lampeggioInterval) {
            clearInterval(this.lampeggioInterval);
            this.lampeggioInterval = null;
        }
    }
}

class TriangoloFluttuante {
    constructor() {
        this.element = document.createElement('div');
        this.size = Math.random() * 50 + 30;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.x = Math.random() * (window.innerWidth - this.size);
        this.y = Math.random() * (window.innerHeight - this.size);

        this.initStyles();
        document.body.appendChild(this.element);
        triangoliAttivi.push(this);
    }

    initStyles() {
        Object.assign(this.element.style, {
            position: 'fixed',
            width: `${this.size}px`,
            height: `${this.size}px`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            transformOrigin: '50% 50%',
            pointerEvents: 'none',
            transition: 'transform 0.1s linear'
        });
    }

    update() {
        // Calcola distanza dal cursore
        const mouseX = tracker.ottieniCoordinate().x;
        const mouseY = tracker.ottieniCoordinate().y;
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distanza = Math.sqrt(dx * dx + dy * dy);

        // Movimento verso il cursore se vicino (entro 200px)
        if(distanza < 200) {
            const angolo = Math.atan2(dy, dx);
            this.speedX = Math.cos(angolo) * VELOCITA_TRIANGOLO * 100;
            this.speedY = Math.sin(angolo) * VELOCITA_TRIANGOLO * 100;
        } else {
            // Movimento casuale con attrito
            this.speedX *= 0.99;
            this.speedY *= 0.99;
        }

        // Aggiorna posizione
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Rimbalzo bordi
        if(this.x <= 0 || this.x >= window.innerWidth - this.size) this.speedX *= -0.8;
        if(this.y <= 0 || this.y >= window.innerHeight - this.size) this.speedY *= -0.8;

        // Applica trasformazioni
        this.element.style.transform = `
            translate(${this.x}px, ${this.y}px)
            rotate(${this.rotation}rad)
        `;
    }

    distruggi() {
        this.element.remove();
        const index = triangoliAttivi.indexOf(this);
        if(index !== -1) triangoliAttivi.splice(index, 1);
    }
}

// Comandi globali
function creaTriangolo() {
    new TriangoloFluttuante();
}

function rimuoviTriangoli() {
    triangoliAttivi.forEach(triangolo => triangolo.distruggi());
    triangoliAttivi.length = 0;
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


function generaTuttiCubi() {
    pages.forEach(page => {
        const cube = new Cube({
            name: page[0],
            link: page[1],
            image: page[2],
            color: page[3],
            size: getRandomFloat(dimensione_min, dimensione_max),
            speedX: getRandomFloat(velocita_min_x, velocita_max_x),
            speedY: getRandomFloat(velocita_min_y, velocita_max_y),
            rotationSpeedX: getRandomFloat(velocita_rotazione_min_x, velocita_rotazione_max_x),
            rotationSpeedY: getRandomFloat(velocita_rotazione_min_y, velocita_rotazione_max_y)
        });
        cubes.push(cube);
        document.getElementById('cubeContainer').appendChild(cube.element);
    });
}

// Rimuovi tutti i cubi
function rimuoviTuttiCubi() {
    cubes.forEach(cube => cube.element.remove());
    cubes.length = 0;
}