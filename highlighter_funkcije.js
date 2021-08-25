/* -------------------------------------------------------------------------- */
//
// Copyright (c) 2021. Nikola Vukićević
//
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// Lekser:
/* -------------------------------------------------------------------------- */

function daLiJeWhiteSpace(z) {
	return z == " " || z == "\t" || z == "\n";
}

function daLiJeCifra(z) {
	return z[0] >= '0' && z[0] <= '9';
}

function praznjenjeStringova(str, lista, definicijaJezika) {
	if(str.s == "") return;
	
	if(str.i == 0 || str.i == 2) {
		lista.push( [ str.s , str.nazivi[str.i] ] );
		str.s = "";	
		return;
	}

	if(str.i == 1) {
		while(str.s != "") {
			ubacivanjeSpecToken(str, lista, definicijaJezika);
		}
		return;
	}
}

function obradaLekserWhiteSpace(z, str, lista, definicijaJezika) {
	praznjenjeStringova(str, lista, definicijaJezika);
	lista.push( [ z , "white_space" ] );
}

function obradaLekserBroj(z, str, lista, definicijaJezika) {
	if(str.i == 1  || (str.i == 0 && str.s == ""))	{
		praznjenjeStringova(str, lista, definicijaJezika);
		str.s += z;
		str.i = 2;
		return;
	}

	if(str.i == 2 || (str.i == 0 && str.s != "")) {
		str.s += z;
		return;
	}
}

function obradaLekserEscapeSekvenca(z, str, lista, definicijaJezika, i, tekst) {
	praznjenjeStringova(str, lista, definicijaJezika);
	
	if(i < tekst.length - 1)  {
		lista.push( [ tekst[i] + tekst[i + 1] , "escape_sekvenca" ] );
		++i;
	}
	else {
		lista.push( [ tekst[i] , "escape_sekvenca" ] );
	}
	
	return i;
}

function obradaLekserObicanZnak(z, str, lista, definicijaJezika) {
	if(str.i != 0) praznjenjeStringova(str, lista, definicijaJezika);
	str.i  = 0;
	str.s += z;
}

function ubacivanjeSpecToken(str, lista, definicijaJezika) {
	let mapa = definicijaJezika.lekserTokeni;
	let rez  = mapa.get(str.s);
	
	if(rez) {
		lista.push( [ str.s, rez] );
		str.s = "";
	}
	else {
		rez   = mapa.get(str.s[0]);
		lista.push( [ str.s[0], rez ] );
		str.s = str.s.substring(1 , str.s.length);
	}
}

function obradaLekserSpecZnak(z, str, lista, definicijaJezika) {
	if(str.i != 1) praznjenjeStringova(str, lista, definicijaJezika);
	str.i = 1;
	
	if(str.s.length < definicijaJezika.maksDuzinaSpajanje) {
		str.s += z;
	}
	else {
		ubacivanjeSpecToken(str, lista, definicijaJezika);
		str.s += z;
	}
}

function lekserOpsti(tekst, definicijaJezika) {
	let lista = [];
	let str   = {
		i: 0,
		s: "",
		nazivi: [
			""     , // 0 - običan znak - trba da bude prazan string - zbog parsera
			""     , // 1 - specijalni znak, klasa se dodeljuje preko mape
			"broj" , // 2 - broj dobija klasu preko leksera
		]
	}

	for(let i = 0; i < tekst.length; i++) {
	
		let z = tekst[i];

		if(daLiJeWhiteSpace(z)) {
			obradaLekserWhiteSpace(z, str, lista, definicijaJezika);
			continue;
		}

		if(daLiJeCifra(z)) {
			obradaLekserBroj(z, str, lista, definicijaJezika);
			continue;
		}
		
		if(z == "\\") {
			i = obradaLekserEscapeSekvenca(z, str, lista, definicijaJezika, i, tekst);
			continue;
		}
		
		let rez = definicijaJezika.lekserTokeni.get(z);

		if(rez != null) {
			obradaLekserSpecZnak(z, str, lista, definicijaJezika);
			continue;
		}

		obradaLekserObicanZnak(z, str, lista, definicijaJezika);
	}

	praznjenjeStringova(str, lista, definicijaJezika);
	return lista;
}

/* -------------------------------------------------------------------------- */
// Parser:
/* -------------------------------------------------------------------------- */

function obradaPrepoznatogTokena(token, rez, lista, stek) {
	
	if(rez[1] === true ) {
		stek.pop();
	}

	if(rez[0] === true) {
		stek.push(rez[2]);
	}

	token[1] = rez[3];
}

function parserOpsti(definicijaJezika, lista) {
	let stek     = [ 0 ];
	let kontekst = null;
	let mapa     = null;
	let rez      = null;	
	let klasa    = "";
	
	for(let i = 0; i < lista.length; i++) {
		kontekst     = stek[stek.length- 1];
		mapa         = definicijaJezika.parserTokeni.get(kontekst);
		rez          = mapa.get(lista[i][0]);
		klasaIzmena  = definicijaJezika.parserPrepravaljanje.get(kontekst)[0];
		klasaNaziv   = definicijaJezika.parserPrepravaljanje.get(kontekst)[1];

		/* ----- Prepoznati token ----- */

		if(rez) {
			obradaPrepoznatogTokena(lista[i], rez, lista, stek);
			continue;
		}

		/* ----- Token iz liste ----- */

		let specLista = definicijaJezika.parserSpecListe.get(kontekst);

		if(specLista) {
			rez = specLista.get(lista[i][0]);

			if(rez) {
				lista[i][1] = rez;
				continue;
			}
		}

		/* ----- Token opšteg tipa ----- */
		
		if(klasaIzmena === true || lista[i][1] == "") {
			lista[i][1] = klasaNaziv;
		}
	}
}

/* -------------------------------------------------------------------------- */
// Pomoćne:
/* -------------------------------------------------------------------------- */

function formatiranjeIspisListe(lista, rezim) {
	let s = "";
	let alt1 = false, alt2 = true;

	if(rezim == "rand"){
		alt1  = true;
		rezim = "html"
	}

	for(let i = 0; i < lista.length; i++) {
		
		if(lista[i][0] == "") continue;
		
		let t_0 = lista[i][0]
		              .replace("<", "&lt;")
		              .replace(">", "&gt;");
		let t_1 = lista[i][1];
		
		if(rezim == "tech") {
			s += `[ |${t_0}| , ${t_1} ]\n---------------------------------\n`;
			continue;
		}

		if(rezim == "html") {
			s += `<span class='token ${t_1+((alt1)?(alt2?1:2):"")}' title='${t_1+((alt1)?(alt2?1:2):"")}'>${t_0}</span>`;
			alt2 = !alt2;
			continue;
		}
	}

	return s;
}

function vremeObradeIspis(t1, naziv) {
	let t2 = performance.now();
	let odziv = t2 - t1 + "ms";
	console.log(`Vreme obrade - ${naziv}: ${odziv}`);
}

/* -------------------------------------------------------------------------- */
// Obrada ....
/* -------------------------------------------------------------------------- */

function obradaKoda(tekst, definicijaJezika, poljeZaIspis, rezim) {
	
	/* ---------------------------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	tekst = tekst.trim() + "\n";
	let listaTokena = definicijaJezika.lekser(tekst, definicijaJezika);
	definicijaJezika.parser(definicijaJezika, listaTokena);
	poljeZaIspis.innerHTML = formatiranjeIspisListe(listaTokena, rezim);

	/* ---------------------------------------------------------------------- */
	vremeObradeIspis(t1, "Glavna funkcija")
	/* ---------------------------------------------------------------------- */
}
