let circlesDB = [];
let nextId = 0;
var punteggio = 0;

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
    const id = nextId++;
    const radius = Math.hypot(xCenter - xStart, yCenter - yStart);
    
    // Creazione elemento div per il cerchio
    const circleDiv = document.createElement('div');
    circleDiv.style.position = 'absolute';
    circleDiv.style.left = `${xCenter - radius}px`;
    circleDiv.style.top = `${yCenter - radius}px`;
    circleDiv.style.width = `${radius * 2}px`;
    circleDiv.style.height = `${radius * 2}px`;
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.backgroundColor = '#ff00ff';
    circleDiv.style.cursor = 'pointer';
    
    document.body.appendChild(circleDiv);

    circlesDB.push({
        id,
        name,
        xCenter,
        yCenter,
        radius,
        element: circleDiv
    });
}

function deleteCircle(id) {
    const index = circlesDB.findIndex(c => c.id === id);
    if (index !== -1 && stato_gioco != Stato.PAUSA) {
        circlesDB[index].element.remove();
        circlesDB.splice(index, 1);
		
		if(stato_gioco != Stato.MENU && stato_gioco != Stato.PERSO)	
			{ 
			punteggio += 1;
			document.getElementById("punteggio").textContent = punteggio;
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
    
    for (let i = 0; i < 10; i++) {
        const radius = 30;
        const xCenter = getRandomPos(window.innerWidth, radius);
        const yCenter = getRandomPos(window.innerHeight, radius);
        const xStart = xCenter + radius;
        const yStart = yCenter;
        
        createCircle(`Circle ${i + 1}`, xStart, yStart, xCenter, yCenter, 8);
    }
}

