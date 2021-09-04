/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let INDEKS_ID      = 1;
let BROJ_THREADOVA = navigator.hardwareConcurrency;
let KORAK          = BROJ_THREADOVA;
let INDEKS_THREAD;
let MULTITHREADING = true;
let T1, T2, ODZIV;

function kreiranjeWorkera(lista) {
	let listaWorkera = [];
	for(let i = 0; i < BROJ_THREADOVA; i++) {
		listaWorkera.push(new Worker('js/worker.js'));
	}

	for(let i = 0; i < BROJ_THREADOVA; i++) {
		let worker = new Worker('js/worker.js');

		worker.postMessage(
			{
				"i_poslato":        i           ,
				"id":               lista[i][3] , 
				"tekst":            lista[i][2] ,
				"definicijaJezika": lista[i][0] ,
				"rezim":            REZIM_ISPISA
			}
		);

		worker.onmessage = e => {
			//console.log(`worker_${i} --- blok: ${e.data.id}`)
			/*
			for(let i = 0; i < listaWorkera.length; i++) {
				if(worker === listaWorkera[i]) {
					console.log("YAY")
					console.log(`worker_${i+1}`)
					console.log("------------------------------")
				}
			}
			*/
			INDEKS_THREAD = e.data.i_primljeno;
			
			if(INDEKS_THREAD == 0){
				T1 = performance.now();
				console.log(T1);
			}
			if(INDEKS_THREAD == lista.length - 1) {
				T2 = performance.now();
				ODZIV = T2 - T1 + "ms";
				console.log(`Vreme obrade2: ${ODZIV}`);
			}

			let blok        = document.getElementById(e.data.id);
			//console.log(e.data.id)
			//console.log(blok)
			let listaTokena = e.data.listaTokena;
			//console.log(listaTokena)
			//console.log("----------------------------------------")
			if(blok != null) {
				blok.innerHTML  = formatiranjeIspisListe(listaTokena, REZIM_ISPISA);

			}
			
			INDEKS_THREAD += KORAK;
			
			if(INDEKS_THREAD < lista.length) {
				worker.postMessage(
					{
						"i_poslato":        INDEKS_THREAD           ,
						"id":               lista[INDEKS_THREAD][3] , 
						"tekst":            lista[INDEKS_THREAD][2] ,
						"definicijaJezika": lista[INDEKS_THREAD][0] ,
						"rezim":            REZIM_ISPISA
					}
				);
			}
		}
	}
}

function obradaBlokova(spisak) {
	/* ----- telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let listaBlokova = [];

	spisak.forEach((klasa) =>  {
		punjenjeListeBlokova(klasa, listaBlokova);
	});

	if(MULTITHREADING) {
		kreiranjeWorkera(listaBlokova);
	}
	else {
		listaBlokova.forEach(blok => {
			let definicijaJezika = mapaKlasa.get(blok[0]);
			obradaPojedinacnogBloka(blok[1], definicijaJezika);
		})
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
	obradaBlokova(spisakKlasa);
}, 100);