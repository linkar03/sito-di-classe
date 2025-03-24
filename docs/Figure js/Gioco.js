const Stato = Object.freeze({
    MENU: 0,
    AVVIATO: 1,
    PAUSA: 2,
	PERSO: 3,
});

var stato_gioco = Stato.MENU;

let circlesDB = [];
let nextId = 0;
var punteggio = 0;
var max_level = 1;
var livello = 1;

var livelli = [
 -1,250,500,1000,2000,3000,5000,10000,15000,25000,10000000
]

var cursole_morte = 1;

const configurazione = [
  // Livello 1
  [
    1,   // Linee rosse
    4000, // Tempo tra le linee (ms)
    [
      ["giallo", 400],    // 40% - Comune
      ["verde", 350],     // 35% - Comune
      ["azzurro", 150],   // 15% - Non comune
      ["arancione", 80],  // 8% - Raro
      ["viola", 10],      // 1% - Rarissimo
      ["grigio", 10]      // 1% - Rarissimo
    ]
  ],
  // Livello 2
  [
    3,
    3500,
    [
      ["giallo", 350],
      ["verde", 300],
      ["azzurro", 200],
      ["arancione", 120],
      ["viola", 15],
      ["grigio", 15]
    ]
  ],
  // Livello 3
  [
    5,
    2000,
    [
      ["giallo", 300],
      ["verde", 250],
      ["azzurro", 250],
      ["arancione", 150],
      ["viola", 25],
      ["grigio", 25]
    ]
  ],
  // Livello 4
  [
    7,
    1000,
    [
      ["giallo", 250],
      ["verde", 200],
      ["azzurro", 300],
      ["arancione", 200],
      ["viola", 35],
      ["grigio", 35]
    ]
  ],
  // Livello 5
  [
    9,
    800,
    [
      ["giallo", 200],
      ["verde", 150],
      ["azzurro", 350],
      ["arancione", 250],
      ["viola", 50],
      ["grigio", 50]
    ]
  ],
  // Livello 6
  [
    11,
    600,
    [
      ["giallo", 150],
      ["verde", 100],
      ["azzurro", 400],
      ["arancione", 300],
      ["viola", 70],
      ["grigio", 70]
    ]
  ],
  // Livello 7
  [
    13,
    500,
    [
      ["giallo", 100],
      ["verde", 50],
      ["azzurro", 450],
      ["arancione", 350],
      ["viola", 100],
      ["grigio", 100]
    ]
  ],
  // Livello 8
  [
    15,
    300,
    [
      ["giallo", 50],
      ["verde", 30],
      ["azzurro", 500],
      ["arancione", 400],
      ["viola", 150],
      ["grigio", 150]
    ]
  ],
  // Livello 9
  [
    17,
    200,
    [
      ["azzurro", 550],
      ["arancione", 450],
      ["viola", 200],
      ["grigio", 200]
    ]
  ],
  // Livello 10
  [
    20,
    100,
    [
      ["azzurro", 600],
      ["arancione", 500],
      ["viola", 300],
      ["grigio", 300]
    ]
  ]
];

var probabilita = [
    ["rosso", 50],
    ["giallo", 100],
	["verde", 20],
	["azzurro", 20],
	["viola", 20],
	["grigio", 100],
	["arancione", 1000]
];

var linee_rosse = 0;
var tempo_linee = 5000;

let pausaStartTime = 0;
let timeInPausa = 0;

const tracker = new TrackerMouse();

// Anima una linea
const x_linea_crescente = new LineaPersonalizzata(100, 100, 100, 100, 3, '#ffffff').aggiungiA();
const x_linea_decrescente = new LineaPersonalizzata(100, 100, 100, 100, 3, '#ffffff').aggiungiA();
let animationFrameId;

// Gestione delle linee pericolose
let lineeAttive = [];
let mousePos = {x: 0, y: 0};


const contents_menu = [
		
		`<div class="content" style = "text-align: center;">
        <h1 style="color: white; font-size: 2.5rem; text-align: center; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); margin-bottom: 20px;">
			MiniGame ITS
		</h1>
        <div id="contenuto_gioco">
            <button id="start" onclick="startgame()" style = "width: 140px;height: 60px; font-size: 18px" >Avvia Minigame</button>
        </div>
		</div>
		`,
		
		'<div class="content"><h2 style="color:white">Regole del gioco</h2><p>Clicca i cerchi, non cliccare i cubi</p></div>',
	];
	
const contents_avviato = [
		`<div class="content"  style = "text-align: center;">
		<h1 style="color:white">Punteggio Attuale</h1><div id="contenuto_gioco" ><p id ="punteggio" style="color:white">0</p></div>
		<h1 style="color:white">Livello Attuale</h1><div id="contenuto_gioco" ><p id ="livello" style="color:white">1</p></div>
		</div>`
		,
		'<div class="content"  style = "text-align: center;" ><h2 style="color:white">Gioco in pausa</h2></div>',
	];
		

const contents_perso = [
		'<div class="content"  style = "text-align: center;"><h1 style="color:white">Hai perso</h1><div id="contenuto_gioco" ></div><p id ="punteggio" style="color:white">0</p></div>',
		'<div class="content"  style = "text-align: center;" ><h2 style="color:white">Consiglio, impara a giocare</h2></div>',
	];
	

const para = new Parallelepiped({
        width: 100,
        height: 100,
        depth: 1,
        color: 'rgba(255, 255, 255, 0.2)',
        customFace: {
            face: 'front',
            html: contents_menu[0]
        },
    });
	
document.body.appendChild(para.element);



const cerchiConfig = {
    "rosso": {
        color: "#ff0000",
        points: 50,
        //onCreated: "aggiungi_punti",
        onDelete: "penalita,shake",
		onGoing: "movimentoSpeciale",
		onExplosion: "bonus",
		//onDie: "penalita",
        lifespan: 20
    },
	
    "giallo": {
        color: "#ffff00",
        points: 5,
        //onCreated: "aggiungi_punti",
        onDelete: "bonus",
		onDie: "penalita",
		onGoing: "movimentoSpeciale",
		onDie: "penalita",
		onExplosion: "bonus",
		lifespan: 100
    },
	
	"verde": {
        color: "#00ff2f",
        points: 10,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "bonus",
		onDie: "penalita",
		onExplosion: "bonus",
		lifespan: 100
    },
	
	"azzurro": {
        color: "#00ffee",
        points: 20,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "bonus",
		onDie: "bonus",
		onExplosion: "bonus",
		lifespan: 100
    },
	
	"viola": {
        color: "#9900cc",
        points: 25,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "esplosione",
		onDie: "penalita",
		onExplosion: "bonus",
		lifespan: 100
    },
	
	"grigio": {
        color: "#bfbfbf",
        points: 5,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "bonus,immortale_laser",
		onDie: "penalita",
		onExplosion: "bonus",
		lifespan: 100
    },
	
	"arancione": {
        color: "#F75E25",
        points: 100,
        //onCreated: "aggiungi_punti",
		onGoing: "movimentoSpeciale",
        onDelete: "bonus,distruggi_cubi",
		onDie: "",
		onExplosion: "bonus",
		lifespan: 10
    }
};

const eventiPersonalizzati = {
    // Eventi OnCreated
    aggiungi_punti: function(circle) {
        punteggio += circle.points;
        document.getElementById("punteggio").textContent = punteggio;
		checklivello();
		document.getElementById("livello").textContent = livello;
		new Message_Screen(circle.points , {fontSize: 20,duration: 1000}).show();
    },
    
    // Eventi OnDelete
    penalita: function(circle) {
		lastime = -1;
        punteggio -= circle.points * 2;
        document.getElementById("punteggio").textContent = punteggio;
		checklivello();
		document.getElementById("livello").textContent = livello;
        circle.element.style.transform = 'scale(1.5)';
		circle.element.style.opacity = '0.5';
        setTimeout(() => circle.element.remove(), 300);
		
		new Message_Screen(-circle.points * 2 , {fontSize: 20,duration: 1000}).show();
    },
    
    bonus: function(circle) {
        punteggio += circle.points * 1;
        document.getElementById("punteggio").textContent = punteggio;
		checklivello();
		document.getElementById("livello").textContent = livello;
        circle.element.style.transform = 'scale(0.5)';
        circle.element.style.opacity = '0.5';
        setTimeout(() => circle.element.remove(), 500);
		
		new Message_Screen(circle.points , {fontSize: 20,duration: 1000}).show();
    },
	
	 movimentoSpeciale: function(circle) {
	 
	 circle.lifespan -= 0.1;
	  
	 if(circle.lifespan < 0)
	 {
		deleteCircle(circle.id,"vita")
	 }
    },
	
	
	shake: function(circle) {
        const intensity = 100; // Intensità del tremore
        const duration = 500; // Durata in millisecondi
        const container = document.getElementById('cubeContainer');
        let startTime = Date.now();

        function animateShake() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                // Calcola lo spostamento casuale
                const x = (Math.random() - 0.5) * intensity * (1 - progress);
                const y = (Math.random() - 0.5) * intensity * (1 - progress);
                
                // Applica la trasformazione
                container.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(animateShake);
            } else {
                // Ripristina la posizione originale
                container.style.transform = 'translate(0, 0)';
            }
        }

        animateShake();
    },
	
	
	
	esplosione: function(circle) {
        const explosionData = {
            startTime: Date.now(),
            element: document.createElement('div'),
            completed: false
        };

        // Modifica lo stile per l'effetto visivo
        explosionData.element.style.cssText = `
            position: fixed;
            left: ${circle.xCenter}px;
            top: ${circle.yCenter}px;
            width: 0;
            height: 0;
            border: 25px solid rgba(255, 165, 0, 0.3); // Arancione trasparente
            border-radius: 100%;
            transform: translate(-50%, -50%);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 30px rgba(255, 165, 0, 0.2);
            background-color: rgba(255, 165, 0, 0.1);
        `;

        document.body.appendChild(explosionData.element);

        // Animazione più evidente
        requestAnimationFrame(() => {
            explosionData.element.style.width = '400px';
            explosionData.element.style.height = '400px';
            explosionData.element.style.opacity = '0.8';
        });

        // Fase 2: Distruzione ritardata
        const checkExplosion = () => {
            if(!explosionData.completed) {
                const progress = (Date.now() - explosionData.startTime)/300;
                
                if(progress >= 1) {
                    // Distruggi cerchi nel raggio
                    circlesDB.forEach(c => {
                        const dx = c.xCenter - circle.xCenter;
                        const dy = c.yCenter - circle.yCenter;
                        if( Math.sqrt(dx**2 + dy**2) < 400 ) {
                            deleteCircle(c.id, "esplosione");
                        }
                    });
                    
                    explosionData.element.remove();
                    explosionData.completed = true;
                }
                else {
                    requestAnimationFrame(checkExplosion);
                }
            }
        };
        
        checkExplosion();
    },
	

	immortale_laser: function(circle) {
        
		immortale(0);
		// Variabile globale da modificare
        setTimeout(() => immortale(1) , 5000);
            
	},
	
	
	distruggi_cubi: function(circle) {
        
		immortale(2);
		// Variabile globale da modificare
        setTimeout(() => immortale(1) , 5000);
            
	}
	 
};
