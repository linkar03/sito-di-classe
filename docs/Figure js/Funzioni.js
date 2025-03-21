/* eslint-disable no-unused-vars */

function startgame()
	{ 	
		if(stato_gioco === Stato.MENU)
		{
		const myAlert = new Alert(
		`<strong>Attenzione!</strong> 
		<p>Non toccare le linee rosse
		<br>Non cliccare i Cubi
		<br>Non cliccare i pallini rossi</p>
		
		`, {duration: 3000, backgroundColor: '#ff4444' } );
		myAlert.show();
		}
		
		generaLineePericolose();
		stato_gioco = Stato.AVVIATO;
		para.updateContent(contents_avviato[0]);
		document.getElementById("punteggio").textContent = punteggio;
		console.log("Game started");
	}
	
// Funzione pausa
function pause()
	{	
	stato_gioco = Stato.PAUSA;
	para.updateContent(contents_avviato[1]);
	console.log("Game Paused");
	}
	
// Funzione perso
function perso() {
    if(stato_gioco === Stato.AVVIATO) {
        stato_gioco = Stato.PERSO;
    }
	
	document.body.style.backgroundColor = "red";
	console.log("Game Ended");
	para.updateContent(contents_perso[0]);
	document.getElementById("punteggio").textContent = punteggio;
	
	circlesDB.forEach(circle => {
		deleteCircle(circle.id," ");
	});
}

//Logica quando scrolli
function logic_scroll()
	{
		if(stato_gioco != Stato.MENU && stato_gioco != Stato.PERSO)	
		{
			if(stato_gioco == Stato.AVVIATO)
				{
				 pause();
				}
			else
				{
				 startgame();
				}
		}
	}
	
function anima_linee() {

	const coordinate = tracker.ottieniCoordinate();

	x_linea_crescente.aggiornaPosizione(coordinate.x-5, coordinate.y-5, coordinate.x + 5 ,coordinate.y+5);
	
	x_linea_decrescente.aggiornaPosizione(coordinate.x-5, coordinate.y+5, coordinate.x + 5 ,coordinate.y-5);
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
	

function checklivello()
{
	for(var i = 0;i < livelli.length;i ++)
		if(punteggio < livelli[i])
		{	
			if(max_level < i)
			{
			const myAlert = new Alert(
			`<strong>Nuovo Livello Raggiunto!</strong> 
			
			`, {duration: 2000, backgroundColor: "#9933ff"} );
			myAlert.show();	

			max_level = i;
			}
			
			livello = i;
			break;
		}
}


function get_random_movement(minDx, maxDx, minDy, maxDy, minSpeed, maxSpeed) {
    return {
        dx: Math.random() * (maxDx - minDx) + minDx,
        dy: Math.random() * (maxDy - minDy) + minDy,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed
    };
}

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
		circlesDB[index].element.remove();
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


function generaLineePericolose() {
	
    const numLinee = Math.floor(Math.random() * 10 ) + 1; // 1-5 linee
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





