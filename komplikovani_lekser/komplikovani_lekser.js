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
	if(str.s1 == "") return;
	
	if(str.i == 0 || str.i == 2) {
		lista.push( [ str.s1 , str.nazivi[str.i] ] );
		str.s1 = "";	
		return;
	}

	if(str.i == 1) {
		while(str.s1 != "") {
			ubacivanjeSpecToken(str, lista, definicijaJezika);
		}
		return;
	}
}

function obradaLekserWhiteSpace(z, str, lista, definicijaJezika) {
	praznjenjeStringova(str, lista, definicijaJezika);
	if(str.fix1) {
		str.s2 += z;
		return;
	}

	lista.push( [ z , "white_space" ] );
}

function obradaLekserBroj(z, str, lista, definicijaJezika) {
	if(str.fix1) {
		str.s2 += str.s1 + z;
		str.s1  = "";
		return;
	}

	if(str.i == 1  || (str.i == 0 && str.s1 == ""))	{
		praznjenjeStringova(str, lista, definicijaJezika);
		str.s1 += z;
		str.i = 2;
		return;
	}

	if(str.i == 2 || (str.i == 0 && str.s1 != "")) {
		str.s1 += z;
		return;
	}
}

function obradaLekserEscapeSekvenca(z, str, lista, definicijaJezika, i, tekst) {
	praznjenjeStringova(str, lista, definicijaJezika);
	if(str.fix1) {
		if(i < tekst.length - 1)  {
			str.s2 += tekst[i] + tekst[i + 1];
			++i;
		}
		else {
			str.s2 += tekst[i];
		}
		return i;
	}
	
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
	if(str.fix1) {
		str.s2 += z;
		return;
	}

	str.i  = 0;
	str.s1 += z;
}

function promenaLekserKonteksta(str, rezim, definicijaJezika, lista) { // lista je tu zbog debugginga!
	let kontekst       = str.stek[str.stek.length - 1];
	let lekserKontekst = definicijaJezika.lekserKonteksti.get(kontekst);
	let s              = (rezim === 0)? str.s1 : str.s1[0];
	let rez            = lekserKontekst.get(s);
	
	if(rez == undefined) return;
	
	if(rez[2]) {
		/* ----- premeštanje stringa s2 u listu ----- */
		lista.push( [ str.s2 , str.klasa ] );
		str.s2 = "";
		str.stek.pop();
		/* ----- povratak na prethodni kontekst ----- */
		kontekst     = str.stek[str.stek.length - 1];
		let ktxtInfo = definicijaJezika.lekserKontekstInfo.get(kontekst);
		str.fix1     = ktxtInfo[0];
		str.fix2     = ktxtInfo[1];
		str.klasa    = ktxtInfo[2];
	}

	if(rez[1]) {
		/* ----- dodavanje novog konteksta ----- */
		str.stek.push(rez[0]);
		str.fix1  = rez[3];
		str.fix2  = rez[4];
		str.klasa = rez[5];
		/* ----- premeštanje stringa s1 u listu ----- */
		lista.push( [ s , str.klasa ] );
		if(rezim == 0){
			str.s1 = "";
		}
		else {
			str.s1 = str.s1.substring(1 , str.s1.length);
		}
	}
}

function ubacivanjeSpecToken(str, lista, definicijaJezika) {
	let mapa = definicijaJezika.lekserTokeni;
	let rez  = mapa.get(str.s1);
	
	if(rez) {
		promenaLekserKonteksta(str, 0, definicijaJezika, lista);

		if(str.fix1) {
			str.s2 += str.s1;
			str.s1  = "";
		}
		else {
			lista.push( [ str.s1, rez] );
			str.s1 = "";
		}
	}
	else {
		promenaLekserKonteksta(str, 1, definicijaJezika, lista);
		if(str.fix1) {
			str.s2 += str.s1[0];
		}
		else {
			rez = mapa.get(str.s1[0]);
			lista.push( [ str.s1[0], rez ] );
		}
		str.s1 = str.s1.substring(1 , str.s1.length);
	}
}

function obradaLekserSpecZnak(z, str, lista, definicijaJezika) {
	if(!str.fix1 && str.i != 1) {
		praznjenjeStringova(str, lista, definicijaJezika);
		str.i = 1;
	}
	
	if(str.s1.length < definicijaJezika.maksDuzinaSpajanje) {
		str.s1 += z;
	}
	else {
		ubacivanjeSpecToken(str, lista, definicijaJezika);
		str.s1 += z;
	}
}

function lekserOpsti(tekst, definicijaJezika) {
	let lista = [];
	let str   = {
		i:      0,
		s1:     "",
		s2:     "",
		fix1:   false,
		fix2:   false,
		klasa:  "",
		stek:   [ 0 ],
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
			//obradaPrepoznatogTokena(lista[i], rez, lista, stek);
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
