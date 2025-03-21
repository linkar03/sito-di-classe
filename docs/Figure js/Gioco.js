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
 -1,50,100,200,300,500,750,1000,2000,5000,10000
]



var linee_rosse = 1;
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

const eventiPersonalizzati = {
    // Eventi OnCreated
    aggiungi_punti: function(circle) {
        punteggio += circle.points;
        document.getElementById("punteggio").textContent = punteggio;
		checklivello();
		document.getElementById("livello").textContent = livello;
    },
    
    // Eventi OnDelete
    penalita: function(circle) {
        punteggio -= circle.points * 2;
        document.getElementById("punteggio").textContent = punteggio;
		checklivello();
		document.getElementById("livello").textContent = livello;
        circle.element.style.transform = 'scale(1.5)';
		circle.element.style.opacity = '0.5';
        setTimeout(() => circle.element.remove(), 300);
    },
    
    bonus: function(circle) {
        punteggio += circle.points * 1;
        document.getElementById("punteggio").textContent = punteggio;
		checklivello();
		document.getElementById("livello").textContent = livello;
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