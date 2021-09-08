function workerObradaPodataka(worker, e, lista) {
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

	let blok = document.getElementById(e.data.id);
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

function definisanjeWorkera(worker, lista, i) {
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
		workerObradaPodataka(worker, e, lista);
	}
}

function kreiranjeWorkera(lista) {
	let listaWorkera = [];
	for(let i = 0; i < BROJ_THREADOVA; i++) {
		listaWorkera.push(new Worker('js/highlighter_worker.js'));
	}

	for(let i = 0; i < BROJ_THREADOVA; i++) {
		let worker = new Worker('js/highlighter_worker.js');
		definisanjeWorkera(worker, lista, i, workerObradaPodataka);
	}
}
