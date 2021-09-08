/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

importScripts('highlighter.js')

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

	let rez = f27Worker(tekst, definicijaJezika, rezim);
	// console.log(rez)
	// console.log(e.data)
	
	postMessage(
		{
			"i_primljeno": i_primljeno ,
			"id":          ajDi        ,
			"listaTokena": rez
		}
	)

	zauzet = false;	
}