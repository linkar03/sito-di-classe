/* eslint-disable no-unused-vars */

class Cube {
    static nextId = 0;

    constructor(config) {
        this.id = Cube.nextId++;
        this.element = document.createElement('div');
        this.element.className = 'cube';
        this.element.id = `cube-${this.id}`;
        
        Object.assign(this, config);
        
        // Inizializzazione dimensioni
        this.size = config.size || getRandomFloat(dimensione_min, dimensione_max);
        this.element.style.setProperty('--size', `${this.size}px`);
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;

        // Posizione iniziale casuale
        this.x = Math.random() * (window.innerWidth - this.size);
        this.y = Math.random() * (window.innerHeight - this.size);
        
        // Inizializzazione velocità rotazione
        this.rotationX = 360;
        this.rotationY = 360;

        this.init();

        // Gestore eventi click aggiornato
        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            const event = new CustomEvent('cubeClick', { detail: { id: this.id } });
            document.dispatchEvent(event);
            
            if(stato_gioco != Stato.AVVIATO) {
                window.location.href = this.link;
            } else {
				
				if(cursole_morte == 2)
				{
				rimuoviCubo(this.id);
				}
				else
				{
                console.log("Cubo toccato ID:", this.id);
                perso();
				}
            }
        });
    }

    init() {
        const faces = [
            { class: 'front', type: 'image' },
            { class: 'back', type: 'image' },
            { class: 'right', type: 'text' },
            { class: 'left', type: 'text' },
            { class: 'top', type: 'text' },
            { class: 'bottom', type: 'text' }
        ];

        faces.forEach(({ class: faceClass, type }) => {
            const face = document.createElement('div');
            face.className = `face ${faceClass}`;

            if(type === 'image' && this.image) {
                face.classList.add('face-image');
                face.style.backgroundImage = `url('${this.image}')`;
            } else {
                face.style.backgroundColor = this.color;
                
                if(type === 'text') {
                    const textDiv = document.createElement('div');
                    textDiv.className = 'face-text';
                    textDiv.innerHTML = this.name;
                    face.appendChild(textDiv);
                }
            }
            this.element.appendChild(face);
        });
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x <= 0 || this.x >= window.innerWidth - this.size) {
            this.speedX *= -1;
        }
        if(this.y <= 0 || this.y >= window.innerHeight - this.size) {
            this.speedY *= -1;
        }

        this.element.style.transform = `
            translate(${this.x}px, ${this.y}px)
            rotateX(${this.rotationX}deg)
            rotateY(${this.rotationY}deg)`;

        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
    }
}

// Funzioni globali per la gestione dei cubi
const cubes = [];

function generaCuboCasuale() {
    const randomIndex = Math.floor(Math.random() * pages.length);
    const config = pages[randomIndex];
    
    const cube = new Cube({
        name: config[0],
        link: config[1],
        image: config[2],
        color: config[3],
        size: getRandomFloat(dimensione_min, dimensione_max),
        speedX: getRandomFloat(velocita_min_x, velocita_max_x),
        speedY: getRandomFloat(velocita_min_y, velocita_max_y),
        rotationSpeedX: getRandomFloat(velocita_rotazione_min_x, velocita_rotazione_max_x),
        rotationSpeedY: getRandomFloat(velocita_rotazione_min_y, velocita_rotazione_max_y)
    });
    
    cubes.push(cube);
    document.getElementById('cubeContainer').appendChild(cube.element);
}

function rimuoviCubo(id) {
    const index = cubes.findIndex(cube => cube.id === id);
    if (index !== -1) {
        const cube = cubes[index];
        cube.element.remove();
        cubes.splice(index, 1);
    }
}

