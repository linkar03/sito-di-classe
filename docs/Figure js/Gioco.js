let circlesDB = [];
let nextId = 0;
var punteggio = 0;
let cerchiTimers = new Map();
let pausaStartTime = 0;
let timeInPausa = 0;

const probabilita = [
    ["rosso", 50],
    ["giallo", 100],
	["verde", 20],
	["azzurro", 20]
];

const cerchiConfig = {
    "rosso": {
        color: "#ff0000",
        points: 100,
        //onCreated: "aggiungi_punti",
        onDelete: "penalita",
		onGoing: "movimentoSpeciale",
		//onDie: "penalita",
        lifespan: 20
    },
	
    "giallo": {
        color: "#ffff00",
        points: 1,
        //onCreated: "aggiungi_punti",
        onDelete: "bonus",
		onDie: "penalita",
		onGoing: "movimentoSpeciale",
		onDie: "penalita",
		lifespan: 100
    },
	
	"verde": {
        color: "#00ff2f",
        points: 2,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "bonus",
		onDie: "penalita",
		lifespan: 100
    },
	
	"azzurro": {
        color: "#00ffee",
        points: 10,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "bonus",
		onDie: "penalita",
		lifespan: 100
    }
};

function get_random_movement(minDx, maxDx, minDy, maxDy, minSpeed, maxSpeed) {
    return {
        dx: Math.random() * (maxDx - minDx) + minDx,
        dy: Math.random() * (maxDy - minDy) + minDy,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed
    };
}

let animationFrameId;
function globalAnimation() {
    circlesDB.forEach(circle => {
		
		if(circle.config.onGoing && eventiPersonalizzati[circle.config.onGoing]) {
            eventiPersonalizzati[circle.config.onGoing](circle);
        }
		
        if(circle.movement) {
            circle.xCenter += circle.movement.dx * circle.movement.speed;
            circle.yCenter += circle.movement.dy * circle.movement.speed;
            
            // Rimbalzo ai bordi
            if(circle.xCenter < circle.radius + 5 || circle.xCenter > window.innerWidth -circle.radius - 5 ) 
                circle.movement.dx *= -0.9;
            if(circle.yCenter < circle.radius + 5  || circle.yCenter > window.innerHeight -circle.radius - 5 ) 
                circle.movement.dy *= -0.9;
            
            circle.element.style.left = `${circle.xCenter - circle.radius}px`;
            circle.element.style.top = `${circle.yCenter - circle.radius}px`;
        }
    });
}

const eventiPersonalizzati = {
    // Eventi OnCreated
    aggiungi_punti: function(circle) {
        punteggio += circle.points;
        document.getElementById("punteggio").textContent = punteggio;
    },
    
    // Eventi OnDelete
    penalita: function(circle) {
        punteggio -= circle.points * 2;
        document.getElementById("punteggio").textContent = punteggio;
        circle.element.style.transform = 'scale(1.5)';
        circle.element.style.backgroundColor = '#ff000055';
        setTimeout(() => circle.element.remove(), 300);
    },
    
    bonus: function(circle) {
        punteggio += circle.points * 1;
        document.getElementById("punteggio").textContent = punteggio;
        circle.element.style.transform = 'scale(0.5)';
        circle.element.style.opacity = '0.5';
        setTimeout(() => circle.element.remove(), 500);
    },
	
	 movimentoSpeciale: function(circle) {
	 
	 circle.lifespan -= 0.1;
	  
	 if(circle.lifespan < 0)
	 {
		deleteCircle(circle.id,"vita")
	 }
    },
	
	
};


function selectCircleType() {
    const total = probabilita.reduce((sum, [, prob]) => sum + prob, 0);
    const random = Math.random() * total;
    let cumulative = 0;
    
    for (const [type, prob] of probabilita) {
        cumulative += prob;
        if (random <= cumulative) {
            return type;
        }
    }
    return probabilita[0][0];
}

const Stato = Object.freeze({
    MENU: 0,
    AVVIATO: 1,
    PAUSA: 2,
	PERSO: 3,
});

var stato_gioco = Stato.MENU;

// Reset stili del body
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

// CRUD Functions
function createCircle(name, xStart, yStart, xCenter, yCenter, step) {
    const type = selectCircleType();
    const config = cerchiConfig[type];
    
    const id = nextId++;
    const radius = Math.hypot(xCenter - xStart, yCenter - yStart);
    
    const circleDiv = document.createElement('div');
    circleDiv.style.position = 'absolute';
    circleDiv.style.left = `${xCenter - radius}px`;
    circleDiv.style.top = `${yCenter - radius}px`;
    circleDiv.style.width = `${radius * 2}px`;
    circleDiv.style.height = `${radius * 2}px`;
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.backgroundColor = config.color;
    circleDiv.style.cursor = 'pointer';
    circleDiv.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(circleDiv);
	
	random_movement = get_random_movement(-1, 1, -1, 1, -1, 1);
	
    const newCircle = {
        id,
        name,
        type,
        points: config.points,
        xCenter,
        yCenter,
        radius,
        element: circleDiv,
        movement: random_movement,
        lifespan: config.lifespan,
		config: cerchiConfig[type]
    };

    // Gestione eventi personalizzati
    if(config.onCreated && eventiPersonalizzati[config.onCreated]) {
        eventiPersonalizzati[config.onCreated](newCircle);
    }

    circlesDB.push(newCircle);
    
    // Avvia animazione globale se non è già attiva
    if(!animationFrameId) {
        globalAnimation();
    }
}
// "vita" "click"
function deleteCircle(id, evento) {
    const index = circlesDB.findIndex(c => c.id === id);
	
	
	if(evento == " ")
	{
		circle.element.remove();
		return;
	}
	
    if (index !== -1 && stato_gioco != Stato.PAUSA) {
        const circle = circlesDB[index];
        
        // Trigger evento OnDelete
		if(evento == "vita")
        if(circle.config.onDie && eventiPersonalizzati[circle.config.onDie]) {
            eventiPersonalizzati[circle.config.onDie](circle);
        } else {
            circle.element.remove(); // Rimozione standard se non c'è evento
        }
        
		if(evento == "click")
		if(circle.config.onDelete && eventiPersonalizzati[circle.config.onDelete]) {
            eventiPersonalizzati[circle.config.onDelete](circle);
        } else {
            circle.element.remove(); // Rimozione standard se non c'è evento
        }
		
        circlesDB.splice(index, 1);
                
        if(circlesDB.length === 0) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
}

// Click Handler
document.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    for (let i = circlesDB.length - 1; i >= 0; i--) {
        const c = circlesDB[i];
        const dx = x - c.xCenter;
        const dy = y - c.yCenter;
        if (dx*dx + dy*dy <= c.radius*c.radius) {
            deleteCircle(c.id,"click");
            break;
        }
    }
});

// Inizializzazione cerchi casuali
function initRandomCircles() {
    const getRandomPos = (max, size) => Math.random() * (max - size * 2) + size;
    
    for (let i = 0; i < 1; i++) {
        const radius = 30;
        const xCenter = getRandomPos(window.innerWidth, radius);
        const yCenter = getRandomPos(window.innerHeight, radius);
        const xStart = xCenter + radius;
        const yStart = yCenter;
        
        createCircle(`Circle ${i + 1}`, xStart, yStart, xCenter, yCenter, 8);
    }
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
                case 'top': return {x: Math.random() * window.innerWidth, y: 0};
                case 'bottom': return {x: Math.random() * window.innerWidth, y: window.innerHeight};
                case 'left': return {x: 0, y: Math.random() * window.innerHeight};
                case 'right': return {x: window.innerWidth, y: Math.random() * window.innerHeight};
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
        }, 1000);

        // Fase 3: Spessore 100, rosso (3 secondi)
        setTimeout(() => {
            this.fase = 2;
			this.attiva = true;
            this.aggiornaLarghezza(30);
            this.aggiornaColore('#ff0000');
        }, 1000);

        // Rimozione dopo 5 secondi totali
        setTimeout(() => {
            this.elemento.remove();
			this.attiva = false;
        }, 2000);
    }
}

// Gestione delle linee pericolose
let lineeAttive = [];
let mousePos = {x: 0, y: 0};

function generaLineePericolose() {
	
    const numLinee = Math.floor(Math.random() * 50 ) + 1; // 1-5 linee
	if( stato_gioco != Stato.PAUSA && stato_gioco != Stato.MENU && stato_gioco != Stato.PERSO )
    for(let i = 0; i < numLinee; i++) {
        setTimeout(() => {
            const linea = new LineaPericolosa();
            lineeAttive.push(linea);
        }, Math.random() * 100); // Piccolo delay casuale
    }
    
    // Programma la prossima generazione
	setTimeout(generaLineePericolose, Math.random() * 2000 + 2000); // 3-10 secondi
}

// Funzione di collisione
function checkCollisionWithLines() {
    if(stato_gioco !== Stato.AVVIATO) return;

    for(let linea of lineeAttive) {
        if(linea.attiva == false) continue; // Salta la fase non attiva
        
        // Calcola distanza dalla linea
        const d = distanzaDaLinea(
            mousePos.x, mousePos.y,
            parseFloat(linea.elemento.getAttribute('x1')),
            parseFloat(linea.elemento.getAttribute('y1')),
            parseFloat(linea.elemento.getAttribute('x2')),
            parseFloat(linea.elemento.getAttribute('y2'))
        );

        if(d < 15) {
            perso();
            return;
        }
    }
}

// Funzione matematica per distanza punto-linea
function distanzaDaLinea(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if(lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if(param < 0) {
        xx = x1;
        yy = y1;
    }
    else if(param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    return Math.sqrt((x - xx) ** 2 + (y - yy) ** 2);
}

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

