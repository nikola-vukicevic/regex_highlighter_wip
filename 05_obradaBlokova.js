/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let MULTITHREADING = typeof(Worker) !== undefined && true;
let BROJ_THREADOVA = navigator.hardwareConcurrency;
let KORAK          = BROJ_THREADOVA;
let INDEKS_ID      = 1;
let INDEKS_THREAD;
let T1, T2, ODZIV;

function obradaBlokova(spisak) {
	/* ----- telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let listaBlokova = [];

	spisak.forEach((klasa) =>  {
		punjenjeListeBlokova(klasa, listaBlokova);
	});

	if(MULTITHREADING && listaBlokova.length > KORAK) {
		kreiranjeWorkera(listaBlokova);
	}
	else {
		listaBlokova.forEach(blok => {
			let definicijaJezika = mapaKlasa.get(blok[0]);
			obradaPojedinacnogBloka(blok[1], definicijaJezika);
		});
	}
		
	/* ----- telemetrija ---------------------------------------------------- */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(`Obrada blokova (vreme obrade: ${odziv})`);
	/* ---------------------------------------------------------------------- */
}

function punjenjeListeBlokova(klasa, lista) {
	let listaBlokova = document.getElementsByClassName(klasa);
	
	for(let i = 0; i < listaBlokova.length; i++) {
		if(listaBlokova[i].id == "") {
			listaBlokova[i].id = `kod_blok_pojedinacni_${INDEKS_ID}`;
			INDEKS_ID++;
		}
		lista.push( [ klasa , listaBlokova[i] , listaBlokova[i].innerText , listaBlokova[i].id ] );
	}
}

function obradaPojedinacnogBloka(blok, definicijaJezika) {
	let tekst = blok.innerText;
	obradaKoda(tekst, definicijaJezika, blok, REZIM_ISPISA);
}

function odWrapperovanje() {
	let wrapper = document.getElementById("wrapper");
	wrapper.style.width  = "auto";
	wrapper.style.height = "auto";	
}

//odWrapperovanje();
setTimeout(() => {
	if(typeof(document) !== "undefined") {
		obradaBlokova(spisakKlasa);
	}
}, 100);
