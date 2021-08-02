/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let poljeZaIspis = document.getElementById("polje_ispis");
let listaTokena  = null;

function formatiranjeListe(lista, rezim) {
	let s = "";
	
	for(let i = 0; i < lista.length; i++) {
		
		//if(lista[i][1] !== false) continue;
		if(lista[i][0] === "")    continue;

		if(rezim == "html") {
			s += `<span class='token ${lista[i][2]}' title='${lista[i][2]}'>${lista[i][0]}</span>`
			continue;
		}

		if(rezim == "tech") {
			s += `[${lista[i][0]}] - ${lista[i][2]}\n`;
			s += `-------------------------------------\n`;
			continue;
		}
	}

	return s;
}

function rastavljanje(tekst, regex) {
	return tekst.split(regex);
}

function proveraListe(lista, regex, token) {
	for(let i = 0; i < lista.length; i++) {
		if(lista[i].match(regex)) {
			lista.splice( i, 1, [ lista[i], true,  token ] );
		}
		else {
			lista.splice( i, 1, [ lista[i], false, "tekst" ] );
		}
	}
}

function proveraTokena(lista, regex, token) {
	for(let i = 0; i < lista.length; i++) {
		if(lista[i][1] == false) {
			
			let novaLista = rastavljanje(lista[i][0], regex);
			
			proveraListe(novaLista, regex, token);
			
			for(let j = 0; j < novaLista.length; j++) {
				lista.splice(i + j, (j == 0)? 1 : 0, novaLista[j]);
			}
		}
	}
}

function prepravljanjeTokena(lista, nizSpecijalnih, token) {
	for(let i = 0; i < lista.length; i++) {
		
		if(lista[i][1] == true) continue;
		if(lista[i][0] == "")   continue;

		if(nizSpecijalnih.includes(lista[i][0])) {
			lista[i][1] = true;
			lista[i][2] = token;
		}
	}
}

function proveraListeTokena(listaTokena, listaDefinicija) {
	listaDefinicija.forEach(e => {
		proveraTokena(listaTokena, e[0], e[1]);
	});
}

function proveraListeZaTagove(lista, regex, token, tokenDefault) {
	for(let i = 0; i < lista.length; i++) {
		if(lista[i].match(regex)) {
			lista.splice( i, 1, [ lista[i], true,  token ] );
		}
		else {
			lista.splice( i, 1, [ lista[i], true, tokenDefault ] );
		}
	}
}

function rastavljanjeOtvarajucihTagova(lista, regex, token, tokenDefault, provera) {
	for(let i = 0; i < lista.length; i++) {
		if(lista[i][2] == provera) {

			let novaLista = rastavljanje(lista[i][0], regex);
			
			proveraListeZaTagove(novaLista, regex, token, tokenDefault);
			
			for(let j = 0; j < novaLista.length; j++) {
				lista.splice(i + j, (j == 0)? 1 : 0, novaLista[j]);
			}
		}
	}
}

function inicijalizacijaListeTokena(tekst) {
	return [
		[ tekst, false, "tekst" ]
	];
}

function obradaCSSKoda() {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekstCSS);

	proveraListeTokena(listaTokena,  CSS_definicijaJezika);
	prepravljanjeTokena(listaTokena, CSS_htmlTagovi,  "html_tag");
	prepravljanjeTokena(listaTokena, CSS_pseudoklase, "pseudoklasa");
	prepravljanjeTokena(listaTokena, CSS_jedinice,    "jedinica");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(odziv);

	//console.log(listaTokena)
	poljeZaIspis.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaJSKoda() {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekstJS);
	
	proveraListeTokena(listaTokena,  JS_definicijaJezika);
	prepravljanjeTokena(listaTokena, JS_RezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, JS_SpecijalniTokeni, "specijalni_token");
	prepravljanjeTokena(listaTokena, JS_Operatori,        "operator");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(odziv);

	//console.log(listaTokena)
	poljeZaIspis.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaHTMLKoda() {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekstHTML);

	proveraListeTokena(listaTokena,  HTML_definicijaJezika);
	//console.log(listaTokena);
	rastavljanjeOtvarajucihTagova(listaTokena, /(\=\'[A-Za-z\d\.\:\/\-\_ ]+\')/g , "atribut_vrednost" , "tag_otvarajuci"   , "tag_otvarajuci");
	rastavljanjeOtvarajucihTagova(listaTokena, /(\=)/g                           , "atribut_dodela"   , "atribut_vrednost" , "atribut_vrednost");
	rastavljanjeOtvarajucihTagova(listaTokena, /([\s]+[A-Za-z]*)/g               , "atribut_naziv"    , "tag_otvarajuci"   , "tag_otvarajuci");
	//prepravljanjeTokena(listaTokena, HTML_RezervisaneReci,  "rezervisana_rec");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(odziv);

	//console.log(listaTokena)

	poljeZaIspis.innerHTML = formatiranjeListe(listaTokena, "html");
}

function radioKlik(n) {
	switch(n) {
		case 1  : obradaCSSKoda();  break;
		case 2  : obradaJSKoda();   break;
		case 3  : obradaHTMLKoda(); break;
		default : obradaCSSKoda();  break;
	}
}

obradaCSSKoda();
//obradaJSKoda();
//obradaHTMLKoda();
