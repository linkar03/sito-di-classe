/* eslint-disable no-unused-vars */

function getRandomColor() {

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
	
	return `#${randomColor.padStart(6, '0')}`;
}

function getRandomFloat(min, max) {

    return Math.random() * (max - min) + min;
}

function getRandomBlueTone() {

    const red = Math.floor(Math.random() * 100);

    const green = Math.floor(Math.random() * 105) + 150;

    const blue = Math.floor(Math.random() * 55) + 200;

    const toHex = (value) => value.toString(16).padStart(2, '0');
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

//----------------------------------------
//------ VARIABILI GLOBALI ---------------
//----------------------------------------

var dimensione_min = 120;
var dimensione_max = 180;

var velocita_min_x = -5;
var velocita_max_x = 5;

var velocita_min_y = -5;
var velocita_max_y = 5;


var velocita_rotazione_min_x = -3;
var velocita_rotazione_max_x = 3;

var velocita_rotazione_min_y = -1;
var velocita_rotazione_max_y = 1;

var dr_pagine = "Pagine/"
var dr_risorse = "Risorse/"

//----------------------------------------

const pages = [
    [
        "Liviu", 										//Nome cubo
        dr_pagine + "Liviu/Liviu.html",						//Pagina link
        dr_risorse + "immagine_profilo_liviu.png",		//Immagine cubo
        getRandomBlueTone(),							//Colore cubo
        getRandomFloat(dimensione_min,dimensione_max),  //Dimensione
        getRandomFloat(velocita_min_x,velocita_max_x),  //Velocità X
        getRandomFloat(velocita_min_y,velocita_max_y),   //Velocità Y
		getRandomFloat(velocita_rotazione_min_x,velocita_rotazione_max_x),	//Velocità rotazione X
		getRandomFloat(velocita_rotazione_min_y,velocita_rotazione_max_y),	//Velocità rotazione Y
    ],
	
    [
        "Alessandro", 
        dr_pagine + "Alessandro/Alessandro.html",
        dr_risorse + "immagine_profilo_ale.jpg",
        getRandomBlueTone(),
        getRandomFloat(dimensione_min,dimensione_max), 
        getRandomFloat(velocita_min_x,velocita_max_x), 
        getRandomFloat(velocita_min_x,velocita_max_y),
		getRandomFloat(velocita_rotazione_min_x,velocita_rotazione_max_x),
		getRandomFloat(velocita_rotazione_min_y,velocita_rotazione_max_y),
    
    ],
	
	[
        "Alessio", 
        dr_pagine + "Alessio/Alessio.html",
        dr_risorse + "immagine_profilo_alessio.jpg",
        getRandomGreenTone(),
        getRandomFloat(dimensione_min,dimensione_max), 
        getRandomFloat(velocita_min_x,velocita_max_x), 
        getRandomFloat(velocita_min_x,velocita_max_y),
		getRandomFloat(velocita_rotazione_min_x,velocita_rotazione_max_x),
		getRandomFloat(velocita_rotazione_min_y,velocita_rotazione_max_y),
    
    ],
	
];
