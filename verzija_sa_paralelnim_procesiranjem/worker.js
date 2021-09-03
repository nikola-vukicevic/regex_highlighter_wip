/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

importScripts('highlighter_funkcije.js')
importScripts('highlighter_funkcije_regex.js')
importScripts('definicije_jezika.js')
//importScripts('obradaBlokova.js')
//importScripts('highlighter.js')

let zauzet = false;

onmessage = e => {
	if(zauzet) return;

	zauzet = true;

	let i_primljeno      = e.data.i_poslato;
	let ajDi             = e.data.id;
	//console.log(ajDi)
	let tekst            = e.data.tekst;
	let definicijaJezika = mapaKlasa.get(e.data.definicijaJezika);
	let rezim            = e.data.rezim;

	let rez = obradaKodaWorker(tekst, definicijaJezika, rezim);
	
	postMessage(
		{
			"i_primljeno": i_primljeno ,
			"id":          ajDi        ,
			"listaTokena": rez
		}
	)

	zauzet = false;	
}