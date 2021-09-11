/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

document.addEventListener("keydown", prepoznavanjeTastera);
let poljeZaIspis = document.getElementById("polje_ispis");
let listaTokena  = null;
let radioDugme   = 1;
let brojDugmica  = 14;
let DEBUG        = false;
let PARSER       = true;
let REZIM_ISPISA = "html";

/* -------------------------------------------------------------------------- */
// Obrada:
/* -------------------------------------------------------------------------- */

function radioKlik(n) {
	
	if(n == 1) {
		document.getElementById("polje_ispis").classList.remove('language-php');
	}
	else {
		document.getElementById("polje_ispis").classList.add('language-php');
	}
	
	switch(n) {
		case 1  : obradaKoda(tekstHTML,      HTML_definicijaJezika,       poljeZaIspis, REZIM_ISPISA); break;
		case 2  : obradaKoda(tekstCSS,       CSS_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 3  : obradaKoda(tekstJS,        JavaScript_definicijaJezika, poljeZaIspis, REZIM_ISPISA); break;
		case 4  : obradaKoda(tekstC,         C_definicijaJezika,          poljeZaIspis, REZIM_ISPISA); break;
		case 5  : obradaKoda(tekstCPP,       CPP_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 6  : obradaKoda(tekstCSharp,    C_Sharp_definicijaJezika,    poljeZaIspis, REZIM_ISPISA); break;
		case 7  : obradaKoda(tekstJava,      Java_definicijaJezika,       poljeZaIspis, REZIM_ISPISA); break;
		case 8  : obradaKoda(tekstSQL,       SQL_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 9  : obradaKoda(tekstPython,    Python_definicijaJezika,     poljeZaIspis, REZIM_ISPISA); break;
		case 10 : obradaKoda(tekstPHP,       PHP_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 11 : obradaKoda(tekstJSON,      JSON_definicijaJezika,       poljeZaIspis, REZIM_ISPISA); break;
		case 12 : obradaKoda(tekstAssembler, Assembler_definicijaJezika,  poljeZaIspis, REZIM_ISPISA); break;
		case 13 : obradaKoda(tekstMarkup,    Markup_definicijaJezika,     poljeZaIspis, REZIM_ISPISA); break;
		case 14 : obradaKoda(tekstRegex,     RegEx_definicijaJezika,      poljeZaIspis, REZIM_ISPISA); break;
		default : obradaKoda(tekstCSS,       CSS_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
	}
}

function prebacivanjeJezika(smer) {
	radioDugme += smer;
	if(radioDugme > brojDugmica) radioDugme = 1;
	let rD = document.getElementById("izbor_jezika_" + radioDugme);
	rD.checked = true;
	radioKlik(radioDugme);
}

function prepoznavanjeTastera(event) {
	switch(event.keyCode) {
		case 81: prebacivanjeJezika(1); break; // q
		default: break;
	}
}

/* -------------------------------------------------------------------------- */
//let t1 = performance.now();
/* -------------------------------------------------------------------------- */

obradaKoda(tekstHTML, HTML_definicijaJezika, poljeZaIspis, "html");
// obradaKoda(tekstC, CLIKE_definicijaJezika, poljeZaIspis, "html");
// obradaKoda(tekstJS, JavaScript_definicijaJezika, poljeZaIspis, "html");

/* ----- telemetrija ----- */
//vremeObradeIspis(t1, "Glavna funkcija")
/* ----------------------- */
