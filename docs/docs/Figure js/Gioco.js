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
        points: 1000,
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
        punteggio += circle.points * 3;
        document.getElementById("punteggio").textContent = punteggio;
        circle.element.style.transform = 'scale(0.5)';
        circle.element.style.opacity = '0.5';
        setTimeout(() => circle.element.remove(), 500);
    },
	
	 movimentoSpeciale: function(circle) {
	 
	 circle.lifespan -= 0.1;
	 
	 console.log( circle.lifespan ) ;
	 
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

