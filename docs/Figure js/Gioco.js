let circlesDB = [];
let nextId = 0;
var punteggio = 0;

const probabilita = [
    ["rosso", 10],
    ["giallo", 90]
];

const cerchiConfig = {
    "rosso": {
        color: "#ff0000",
        points: 2,
        //onCreated: "aggiungi_punti",
        onDelete: "penalita", // <-- Nuova proprietà
        lifespan: 2,
        movement: {
            dx: 3,
            dy: 2,
            speed: 2
        }
    },
    "giallo": {
        color: "#ffff00",
        points: 1,
        //onCreated: "aggiungi_punti",
        onDelete: "bonus", // <-- Nuova proprietà
		lifespan: 10,
        movement: {
            dx: -0.5,
            dy: 1.5,
            speed: 2
        }
    }
};


let animationFrameId;
function globalAnimation() {
    circlesDB.forEach(circle => {
        if(circle.movement) {
            circle.xCenter += circle.movement.dx * circle.movement.speed;
            circle.yCenter += circle.movement.dy * circle.movement.speed;
            
            // Rimbalzo ai bordi
            if(circle.xCenter < 0 || circle.xCenter > window.innerWidth) 
                circle.movement.dx *= -1;
            if(circle.yCenter < 0 || circle.yCenter > window.innerHeight) 
                circle.movement.dy *= -1;
            
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
	
    vita: function(circle) {
        circle.element.style.transition = `opacity ${circle.lifespan}s linear`;
        setTimeout(() => {
            circle.element.style.opacity = '0';
            setTimeout(() => deleteCircle(circle.id), circle.lifespan * 1000);
        }, 100);
    }
	
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

    const newCircle = {
        id,
        name,
        type,
        points: config.points,
        xCenter,
        yCenter,
        radius,
        element: circleDiv,
        movement: config.movement,
        lifespan: config.lifespan,
		config: cerchiConfig[type]
    };

    // Gestione eventi personalizzati
    if(config.onCreated && eventiPersonalizzati[config.onCreated]) {
        eventiPersonalizzati[config.onCreated](newCircle);
    }
    
    // Gestione vita
    if(config.lifespan) {
        eventiPersonalizzati.vita(newCircle);
    }

    circlesDB.push(newCircle);
    
    // Avvia animazione globale se non è già attiva
    if(!animationFrameId) {
        globalAnimation();
    }
}

function deleteCircle(id) {
    const index = circlesDB.findIndex(c => c.id === id);
    if (index !== -1 && stato_gioco != Stato.PAUSA) {
        const circle = circlesDB[index];
        
        // Trigger evento OnDelete
        if(circle.config.onDelete && eventiPersonalizzati[circle.config.onDelete]) {
            eventiPersonalizzati[circle.config.onDelete](circle);
        } else {
            circle.element.remove(); // Rimozione standard se non c'è evento
        }
        
        circlesDB.splice(index, 1);
        
        if(stato_gioco != Stato.MENU && stato_gioco != Stato.PERSO) { 
            // Il punteggio ora viene gestito dagli eventi OnDelete
        }
        
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
            deleteCircle(c.id);
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

