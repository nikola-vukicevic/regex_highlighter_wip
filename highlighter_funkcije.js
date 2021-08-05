/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function formatiranjeListe(lista, rezim) {
	let s       = "";
	let granica = lista.length - 1;

	while(lista[granica][2] == "white_space" || lista[granica][0] == "") granica--;

	for(let i = 0; i <= granica; i++) {
		
		if(lista[i][0] === "") continue;

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

function proveraTokena(lista, regexSplit, regexProvera, token) {
	for(let i = 0; i < lista.length; i++) {
		if(lista[i][1] == false) {
			
			let novaLista = rastavljanje(lista[i][0], regexSplit);
			
			proveraListe(novaLista, regexProvera, token);
			
			for(let j = 0; j < novaLista.length; j++) {
				lista.splice(i + j, (j == 0)? 1 : 0, novaLista[j]);
			}
		}
	}
}

function binarnaPretraga(element, niz) {
	let le  = 0, de = niz.length - 1;
	let ind = parseInt(Math.floor((le + de) * 0.5));
	
	while(le <= de) {

		if(element == niz[ind]) {
			return true;
		}
		
		if(element < niz[ind]) {
			de = ind - 1;
		}
		else {
			le = ind + 1;
		}

		ind = parseInt(Math.floor((le + de) * 0.5)); 
	}

	return false;
}

function prepravljanjeTokena(lista, nizSpecijalnih, token) {
	for(let i = 0; i < lista.length; i++) {
		
		if(lista[i][1] == true) continue;
		if(lista[i][0] == "")   continue;

		//if(nizSpecijalnih.includes(lista[i][0])) {
		if(binarnaPretraga(lista[i][0], nizSpecijalnih)) {
			lista[i][1] = true;
			lista[i][2] = token;
		}
	}
}

function proveraListeTokena(listaTokena, listaDefinicija) {
	listaDefinicija.forEach(e => {
		let regex = (e.length === 2)? e[0] : e[2];
		proveraTokena(listaTokena, e[0], regex, e[1]);
	});
}

function proveraListeZaTagove(lista, regex, token, tokenDefault) {
	for(let i = 0; i < lista.length; i++) {
		if(lista[i].match(regex)) {
			lista.splice( i, 1, [ lista[i], true, token ] );
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

