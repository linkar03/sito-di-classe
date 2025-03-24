/* eslint-disable no-unused-vars */




function immortale(stato_cursore)
{
	cursole_morte = stato_cursore;
}

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
		
		rimuoviTuttiCubi();
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
	
	rimuoviTuttiCubi();
	document.body.style.backgroundColor = "red";
	console.log("Game Ended");
	para.updateContent(contents_perso[0]);
	document.getElementById("punteggio").textContent = punteggio;
	
	while(circlesDB.length > 0) {
        deleteCircle(circlesDB[0].id, "endgame");
    }
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
	
	if(cursole_morte == 0)
	{
		x_linea_crescente.cambiaColoreConAnimazione('#bfbfbf', 1000);
		x_linea_decrescente.cambiaColoreConAnimazione('#bfbfbf', 1000);
		x_linea_crescente.aggiornaPosizione(coordinate.x-10, coordinate.y-10, coordinate.x + 10 ,coordinate.y+ 10);
		x_linea_decrescente.aggiornaPosizione(coordinate.x-10, coordinate.y+10, coordinate.x +  10 ,coordinate.y- 10);
	}
	else if( cursole_morte == 1)
	{
		x_linea_crescente.cambiaColoreConAnimazione('#ffffff', 1000); 
		x_linea_decrescente.cambiaColoreConAnimazione('#ffffff', 1000); 
		x_linea_crescente.aggiornaPosizione(coordinate.x-5, coordinate.y-5, coordinate.x + 5 ,coordinate.y+5);
		x_linea_decrescente.aggiornaPosizione(coordinate.x-5, coordinate.y+5, coordinate.x + 5 ,coordinate.y-5);
	}
	if( cursole_morte == 2)
	{
		x_linea_crescente.cambiaColoreConAnimazione('#ffae00', 1000); 
		x_linea_decrescente.cambiaColoreConAnimazione('#ffae00', 1000); 
		x_linea_crescente.aggiornaPosizione(coordinate.x-5, coordinate.y-5, coordinate.x + 5 ,coordinate.y+5);
		x_linea_decrescente.aggiornaPosizione(coordinate.x-5, coordinate.y+5, coordinate.x + 5 ,coordinate.y-5);
	}
}

function generaPuntiLatiDiversi() {
    const lati = ['top', 'bottom', 'left', 'right'];
    const MIN_LUNGHEZZA = 100;
    let start, end, latoStart, latoEnd;
    let tentativi = 0;
	
	var dx;
	var dy;
	
    do {
        // Seleziona lati diversi
        latoStart = lati[Math.floor(Math.random() * 4)];
        latoEnd = lati[Math.floor(Math.random() * 4)];
        while(latoEnd === latoStart) {
            latoEnd = lati[Math.floor(Math.random() * 4)];
        }

        // Genera coordinate con posizioni casuali sui lati
        const getCoords = (lato) => {
            const rangeMin = MIN_LUNGHEZZA;
            const rangeMax = lato === 'top' || lato === 'bottom' ? 
                window.innerWidth - MIN_LUNGHEZZA : 
                window.innerHeight - MIN_LUNGHEZZA;

            switch(lato) {
                case 'top': 
                    return {
                        x: Math.random() * (window.innerWidth - rangeMin) + rangeMin/2,
                        y: 0
                    };
                case 'bottom': 
                    return {
                        x: Math.random() * (window.innerWidth - rangeMin) + rangeMin/2,
                        y: window.innerHeight
                    };
                case 'left': 
                    return {
                        x: 0,
                        y: Math.random() * (window.innerHeight - rangeMin) + rangeMin/2
                    };
                case 'right': 
                    return {
                        x: window.innerWidth,
                        y: Math.random() * (window.innerHeight - rangeMin) + rangeMin/2
                    };
            }
        };

        start = getCoords(latoStart);
        end = getCoords(latoEnd);

        // Calcola distanza
        dx = end.x - start.x;
        dy = end.y - start.y;
        tentativi++;

    } while ((Math.sqrt(dx*dx + dy*dy) < MIN_LUNGHEZZA) && tentativi < 100);

    return [start, end];
}
	

function Configurazione_del_livello()
{
	var lengh_max = configurazione.length - 1;
			
	var conf;
			
	if(lengh_max >= max_level - 1)
		conf = configurazione[max_level-1];
	else 
		conf = configurazione[lengh_max];
			
	linee_rosse = conf[0];
	tempo_linee = conf[1];
	probabilita = conf[2];
			
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
			Configurazione_del_livello();
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
		
		if(circle.config.onGoing) {
            const events = circle.config.onGoing.split(',').map(e => e.trim());
            events.forEach(eventName => {
                if(eventiPersonalizzati[eventName]) {
                    eventiPersonalizzati[eventName](circle);
                }
            });
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
function globalAnimation() {
    circlesDB.forEach(circle => {
        // Gestione eventi multipli onGoing
        if(circle.config.onGoing) {
            const events = circle.config.onGoing.split(',').map(e => e.trim());
            events.forEach(eventName => {
                if(eventiPersonalizzati[eventName]) {
                    eventiPersonalizzati[eventName](circle);
                }
            });
        }

        if(circle.movement) {
            circle.xCenter += circle.movement.dx * circle.movement.speed;
            circle.yCenter += circle.movement.dy * circle.movement.speed;
            
            // Rimbalzo ai bordi
            if(circle.xCenter < circle.radius + 5 || circle.xCenter > window.innerWidth - circle.radius - 5) 
                circle.movement.dx *= -0.9;
            if(circle.yCenter < circle.radius + 5 || circle.yCenter > window.innerHeight - circle.radius - 5) 
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
    
    if(evento == "endgame") {
        if(index !== -1) {
            circlesDB[index].element.remove();
            circlesDB.splice(index, 1);
        }
        return;
    }
    
    if(index !== -1 && stato_gioco != Stato.PAUSA) {
        const circle = circlesDB[index];
        let hasEvents = false;

        // Funzione per processare multipli eventi
        const processEvents = (eventString) => {
            if(!eventString) return false;
            let foundValid = false;
            eventString.split(',').map(e => e.trim()).forEach(eventName => {
                if(eventiPersonalizzati[eventName]) {
                    eventiPersonalizzati[eventName](circle);
                    foundValid = true;
                }
            });
            return foundValid;
        };
	
		
		
        if(evento == "vita") {
            hasEvents = processEvents(circle.config.onDie);
        }
		
        else if(evento == "click") {
			sommacombo++;
			lastime = 25;
            hasEvents = processEvents(circle.config.onDelete);
			
        }
		
		else if(evento == "esplosione") {
			sommacombo++;
			lastime = 25;
            hasEvents = processEvents(circle.config.onExplosion);
        }
			
		if(lastime < 0)
			sommacombo = 0;
		
		if(evento != "vita")
		{
			if( sommacombo >= 100)
				new Message_Screen(sommacombo+" IPER COMBO!", {fontSize: 40,duration: 1000}).show()
			else if( sommacombo >= 25)
				new Message_Screen(sommacombo+" ULTRA COMBO!", {fontSize: 25,duration: 1000}).show()
			else if( sommacombo >= 5)
				new Message_Screen(sommacombo+" COMBO!", {fontSize: 20,duration: 1000}).show()
		}
		
        // Rimozione solo se nessun evento è stato processato
        //if(!hasEvents) {
            circle.element.remove();
        //}

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
	
    const numLinee =  linee_rosse; // 1-5 linee
	if( stato_gioco != Stato.PAUSA && stato_gioco != Stato.MENU && stato_gioco != Stato.PERSO )
    for(let i = 0; i < numLinee; i++) {
        setTimeout(() => {
            const linea = new LineaPericolosa();
            lineeAttive.push(linea);
        }, Math.random() * 100); // Piccolo delay casuale
    }
    
    // Programma la prossima generazione
	setTimeout(generaLineePericolose, Math.random() * tempo_linee + tempo_linee); // 3-10 secondi
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

        if(d < 15 && cursole_morte) {
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





