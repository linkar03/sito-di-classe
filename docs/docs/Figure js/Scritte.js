/* eslint-disable no-unused-vars */


function startgame()
	{ 	
		stato_gioco = Stato.AVVIATO;
		para.updateContent(contents_avviato[0]);
		document.getElementById("punteggio").textContent = punteggio;
		console.log("Game started");
	}
	
function pause()
	{	
	stato_gioco = Stato.PAUSA;
	para.updateContent(contents_avviato[1]);
	console.log("Game Paused");
	}
	
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
	
window.addEventListener('wheel', (e) => {
	console.log("Evento Scroll");
	logic_scroll();
});
	
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
		'<div class="content"  style = "text-align: center;"><h1 style="color:white">Punteggio Attuale</h1><div id="contenuto_gioco" ><p id ="punteggio" style="color:white">0</p></div></div>',
		'<div class="content"  style = "text-align: center;" ><h2 style="color:white">Gioco in pausa</h2></div>',
	];
		

const contents_perso = [
		'<div class="content"  style = "text-align: center;"><h1 style="color:white">Hai perso</h1><div id="contenuto_gioco" ></div></div>',
		'<div class="content"  style = "text-align: center;" ><h2 style="color:white">Consiglio, impara a giocare</h2></div>',
	];
	

	
let currentContentIndex = 0;
let lastScroll = window.pageYOffset;
let isScrolling = false;

const para = new Parallelepiped({
        width: 100,
        height: 100,
        depth: 1,
        color: 'rgba(255, 255, 255, 0.2)',
        customFace: {
            face: 'front',
            html: contents_menu[currentContentIndex]
        },
    });
	
document.body.appendChild(para.element);

//para.updateContent(contents_perso[0]);

