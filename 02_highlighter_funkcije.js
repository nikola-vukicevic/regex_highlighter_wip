/* -------------------------------------------------------------------------- */
//
// Copyright (c) 2021. Nikola Vukićević
//
/* -------------------------------------------------------------------------- */

// Datoteka sa glavnim funkcijama - detaljnija objašnjenja u nastavku

/* -------------------------------------------------------------------------- */
// Lekser:
/* -------------------------------------------------------------------------- */

function daLiJeWhiteSpace(z) {
	return z == " " || z == "\t" || z == "\n";
}

/* -------------------------------------------------------------------------- */

function daLiJeCifra(z) {
	return z[0] >= '0' && z[0] <= '9';
}

/* -------------------------------------------------------------------------- */

// Svaki put kada se promeni vrsta tokena koji se učitava,
// string se premešta u listu 

function praznjenjeStringova(str, lista, definicijaJezika) {
	if(str.s == "") return; // uslov je ovde, da ne bi bio na "100" mesta
	                        // u ostalim funkcijama :)
	if(str.i == 0 || str.i == 2) { // obični znakovi i brojevi
		lista.push( [ str.s , str.nazivi[str.i] ] );
		str.s = "";	
		return;
	}

	if(str.i == 1) { // specijalni znakovi
		while(str.s != "") {
			ubacivanjeSpecToken(str, lista, definicijaJezika);
		}
		return;
	}
}

/* -------------------------------------------------------------------------- */

// whitespace-ovi, pojedinačno, idu direktno u listu

function obradaLekserWhiteSpace(z, str, lista, definicijaJezika) {
	praznjenjeStringova(str, lista, definicijaJezika);
	lista.push( [ z , "white_space" ] );
}

/* -------------------------------------------------------------------------- */

// Brojevi se učitavaju kao brojevi, ako stoje samostalno, ili kao
// deo niske običnih znakova, ako je ta niska već započeta

function obradaLekserBroj(z, str, lista, definicijaJezika) {
	if(str.i == 1  || (str.i == 0 && str.s == ""))	{
		praznjenjeStringova(str, lista, definicijaJezika);
		str.s += z;
		str.i = 2;
		return;
	}

	// Ovde se zapravo dešavaju dve (različite) stvari:
	// Ako proradi prvi deo if-a, cifra se smešta u broj
	// Ako proradi drugi deo if-a (unutrašnja zagrada),
	// cifre se smeštaju u string sa običnim znakovima i neće
	// biti označene CSS klasom za brojeve

	if(str.i == 2 || (str.i == 0 && str.s != "")) {
		str.s += z;
		return;
	}
}

/* -------------------------------------------------------------------------- */

// Escape sekvence se direktno prosleđuju u listu
// kontekst dobijaju preko parsera
// Postoji i if koji, "eto, da budemo fini", proverava da li (zapravo)
// postoji sledeći znak

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

/* -------------------------------------------------------------------------- */

// Obični znakovi idu direktno u nisku

function obradaLekserObicanZnak(z, str, lista, definicijaJezika) {
	if(str.i != 0) praznjenjeStringova(str, lista, definicijaJezika);
	str.i  = 0;
	str.s += z;
}

/* -------------------------------------------------------------------------- */

/* ---------------------------------------- */ 
// Prepoznavanje specijalnih tokena
/* ---------------------------------------- */ 

// Specijalni tokeni se proveravaju u grupama, tako da je dužina niske
// definisana preko objekta definicijaJezika, shodno tome koliko najviše
// znakova može sadržati operator (ili neka druga specijalna niska)
// u datom jeziku (recimo "&&<" u C-u, "<!--" u HTML-u i slično).
// Ako se pronađe niska koja odgovara maksimalnoj dužini i sadrži
// prepoznati token (operator, komentar i sl), prosleđuje se u listu,
// dok u suprotnom funkcija analiza_str_s_Substringova, proverava
// podniske (da bi u niski "/**" bila prepoznata podniska "/*",
// kao početak blok komentara).
// U "najgorem slučaju" (za šta je zadužena funkcija ubacivanje_s_0),
// ako ostane podniska dužine 1, biće ubačena u listu i biće joj
// dodeljen tip (jer se specijalni tokeni dužine  veće od 1,
// sastoje samo iz znakova koji i inače imaju specijalno značenje).

function ubacivanje_s_0(str, mapa, lista) {
	let rez = mapa.get(str.s[0]);
	lista.push( [ str.s[0] , rez ] );
	str.s = str.s.substring(1, str.s.length);
}

/* -------------------------------------------------------------------------- */

function analiza_str_s_Substringova(str, mapa, lista) {
	let g2 = str.s.length;
	let g1 = g2 - 1;

	if(g1 == 0) ubacivanje_s_0(str, mapa, lista);

	while(g1 >= 1) {
		let x = str.s.substring(0, g1);
		let y = str.s.substring(g1, g2);
		
		let rez = mapa.get(x);

		if(rez != null) {
			lista.push( [ x , rez] );
			str.s = y;
			return;
		}

		g1--;
	}
}

/* -------------------------------------------------------------------------- */

// funkcija ubacivanjeSpecToken proradi svaki put kada se učita niska
// specijalnih znakova čija dužina odgovara maksimalnoj dužini specijalne
// niske za dati jezik, ili, kada se promeni kontekst učitavanja (kada se
// sa specijalnih znakova pređe na obične znakove, ili cifre)

function ubacivanjeSpecToken(str, lista, definicijaJezika) {
	let mapa = definicijaJezika.lekserTokeni;
	let rez  = mapa.get(str.s);
	
	if(rez) {
		lista.push( [ str.s, rez] );
		str.s = "";
	}
	else {
		analiza_str_s_Substringova(str, mapa, lista);
	}
}

/* -------------------------------------------------------------------------- */

// Osnovna funkcija za obradu specijalnih znakova (obradaLekserSpecZnak),
// proverava da li je vreme za slanje niske specijalnih znakova na obradu
// (ako je niska kraća od najdužeg operatora, specijalni znak će biti
// dodat u nisku i onda se čeka, ili da dužina dostigne maks. dozvoljenu
// dužinu, ili da prelazak na obične znakove ili cifre, pokrene analizu
// niske specijalnih znakova).

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

/* -------------------------------------------------------------------------- */

// Lekser "opšti" je označen kao takav, zato što (u drugoj datoteci) postoji
// verzija leksera koja funkcioniše preko regularnih izraza.
// Opšti lekser je DIY rešenje u skripti koje se koristi za većinu jezika,
// ali je za neke jezike/sintakse, kao što su assembler, markup i regex,
// lekser koji je implementiran preko regularnih izraza mnogo
// praktičnije rešenje.
// Opšti lekser jednostavno prolazi kroz tekst, znak-po-znak, i poziva gornje
// funkcije u skladu sa tipom znaka koji se ispituje
// Funkcija vraća listu tokena.

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

// Parser obrađuje tokene u zavisnosti od konteksta (nije pravi parser,
// ali ćemo biti praktični i tako ga zvati), a konteksti du definisani
// preko objekta definicijaJezika (koji je pripisan svakom od jezika)
// određeni specijalni tokeni menjaju kontekst i definišu ponašaje
// parsera u skladu sa tim (recimo, token "*/" otvara kontekst blok
// komentara, što nalaže parseru da sve dolazeće tokene označava)
// odgovarajućom CSS klasom, sve dok se ne pojavi token "*/", koji
// postavlja parser u prethodni kontekst
// Parser prvo proverava da li se token nalazi u listi tokena koji
// odgovaraju datom kontekstu, a zatim:
//     - ako je token prepoznat (u datom kontekstu), vrši se njegova
//       obrada (sam token se označava odgovarajućom CSS klasom i
//       se da li dati token okida promenu konteksta)
//     - ako token nije prepoznat, proverava se da li se dati token
//       nalazi u listama specijalnih tokena (rezervisane reči, standardne
//       klase i sl), s tim da su liste specijalnih tokena definisane u
//       zavsnosti od konteksta.
//           - ako je token pronađen u listi specijalnih tokena, dodeljuje
//             mu se klasa iz liste specijalnih tokena
//           - ako token nije prepoznat u listi specijalnih tokena,
//             dodeljuje mu se podrazumevana klasa za dati ontekst

function obradaPrepoznatogTokena(token, lista, parser, definicijaJezika) {

	if(parser.rez[1] === true ) {
		parser.stek.pop();
		
		/* ----- prebacivanje stringa s u novu listu ----- */
		
		if(parser.s != "") {
			parser.novaLista.push( [ parser.s , parser.klasa ] );
			parser.s = "";
		}
	}

	if(parser.rez[0] === true) {
		parser.stek.push(parser.rez[2]);

		/* ----- prebacivanje stringa s u novu listu ----- */

		if(parser.s != "") {
			parser.novaLista.push( [ parser.s , parser.klasa ] );
			parser.s = "";
		}
	}
	
	/* ---- Preuzimanje informacija za trenutni kontekst ---- */

	parser.kontekst      = parser.stek[parser.stek.length - 1];
	parser.spajanje      = definicijaJezika.parserPrepravaljanje.get(parser.kontekst)[0];
	parser.prepravljanje = definicijaJezika.parserPrepravaljanje.get(parser.kontekst)[1];
	parser.klasa         = definicijaJezika.parserPrepravaljanje.get(parser.kontekst)[2];

	/* ----- ubacivanje tokena u novu listu ----- */

	parser.novaLista.push( [ token[0] , parser.rez[3] ] );
	
	/*
	console.log(token)
	console.log(parser.stek)
	console.log(parser)
	console.log("------------------------------")
	//*/
}

/* -------------------------------------------------------------------------- */

// Parser opšteg tipa je (kao i lekser), označen kao takav, da bi se
// razlikovao od parsera koji odgovara lekseru koji koristi
// regularne izraze

function parserOpsti(definicijaJezika, lista) {
	let parser = {
		novaLista:      [],
		stek:           [ 0 ],
		kontekst:       -1,
		s:              "",
		mapa:           null,
		rez:            null,
		spajanje:       false,
		prepravljanje:  false,
		klasa:          definicijaJezika.defaultKlasa
	}

	for(let i = 0; i < lista.length; i++) {
		parser.kontekst = parser.stek[parser.stek.length- 1];
		parser.mapa     = definicijaJezika.parserTokeni.get(parser.kontekst);
		parser.rez      = parser.mapa.get(lista[i][0]);

		/* ----- Pokušaj učitavanja regularnog izraza ----------------------- */

		if(lista[i][0] == "/" && parser.kontekst == definicijaJezika.kontekstZaRegex) {
			i = parserProveraRegularnogIzraza(parser.kontekst, i, lista, parser.novaLista, definicijaJezika);
			continue;
		}

		/* ----- Pokušaj učitavanja generika -------------------------------- */

		///*
		if(lista[i][0] == "<" && parser.kontekst == definicijaJezika.kontekstZaGenerike) {
			i = parserPokusajUcitavanjaGenerika(parser.kontekst, i, lista, parser.novaLista, definicijaJezika);
			continue;
		}
		//*/
							
		/* ----- Prepoznati token (koji menja, ili ne menja, kontekst) ------ */

		if(parser.rez != null) {
			obradaPrepoznatogTokena(lista[i], lista, parser, definicijaJezika);
			continue;
		}
		
		/*
		    Ako je parser u režimu spajanja tokena, nema pretrage
		    tokena u specijalnim listama!
		*/

		if(parser.spajanje) {
			parser.s += lista[i][0];
			continue;
		}

		/* ----- Pretraga lista specijalnih tokena -------------------------- */

		let specLista = definicijaJezika.parserSpecListe.get(parser.kontekst);

		if(specLista) {
			let specKlasa = specLista.get(lista[i][0]);

			if(specKlasa) {
				parser.novaLista.push( [ lista[i][0] , specKlasa ] );
				//lista[i][1] = rez;
				continue;
			}
		}

		/* ----- Da li se klasa tokena prepravlja ----- */

		if(parser.prepravljanje && lista[i][1] == "") {
			lista[i][1] = parser.klasa;
		} 

		parser.novaLista.push( lista[i] );
	}

	if(parser.s != "") {
		parser.novaLista.push( [ parser.s , parser.klasa ] );
	}

	return parser.novaLista;
}

/* -------------------------------------------------------------------------- */

function neuspesniPokusajUbacivanjaRegularnogIzraza(pomLista, novaLista) {
	pomLista.forEach(e => {
		novaLista.push(e);
	});
}

/* -------------------------------------------------------------------------- */

function pokusajUbacivanjaRegularnogIzraza(s, pomLista, novaLista, definicijaJezika) {
	if(!analizaIzraza(pomLista,  definicijaJezika)) {
		novaLista.push( [ s , "regularni_izraz"] );
	}
	else {
		neuspesniPokusajUbacivanjaRegularnogIzraza(pomLista, novaLista);
	}
}

/* -------------------------------------------------------------------------- */

function parserProveraRegularnogIzraza(kontekst, i, lista, novaLista, definicijaJezika) {
	let pronadjenPar = false;
	let pomLista     = []
	let s            = "/";
	pomLista.push( lista[i] );
	i++;
	
	while(!pronadjenPar && lista[i][0] != "\n") {
		pomLista.push(lista[i]);
		s += lista[i][0];
		
		if(lista[i][0] == "/") {
			pronadjenPar    = true;
		}

		i++;
	}

	if(pronadjenPar) {
		pokusajUbacivanjaRegularnogIzraza(s, pomLista, novaLista, definicijaJezika);
	}
	else {
		neuspesniPokusajUbacivanjaRegularnogIzraza(pomLista, novaLista);
	}

	return i-1;
}

/* -------------------------------------------------------------------------- */

function parserPraznjenjePomListe(pomLista, lista) {
	pomLista.forEach(e => {
		lista.push(e);
	})
}

/* -------------------------------------------------------------------------- */

function parserPokusajUcitavanjaGenerika(kontekst, i, lista, novaLista, definicijaJezika) {
	let s        = "<";
	let pomLista = [];
	let nastavak = true;
	pomLista.push(lista[i]);
	i++;

	while(daLiJeWhiteSpace(lista[i][0])) {
		pomLista.push(lista[i]);
		s += lista[i][0]
		i++
	}

	if(lista[i][1] == "") {
		pomLista.push(lista[i]);
		s += lista[i][0];
		i++;	
	}
	else {
		nastavak = false;
		parserPraznjenjePomListe(pomLista, novaLista);
		return i - 1;
	}

	while(nastavak && daLiJeWhiteSpace(lista[i][0])) {
		pomLista.push(lista[i]);
		s += lista[i][0]
		i++
	}

	if(nastavak && lista[i][0] == ">") {
		pomLista.push(lista[i]);
		s += lista[i][0]
		i++;
		novaLista.push( [ s , "generik" ] );
	}
	else {
		parserPraznjenjePomListe(pomLista, novaLista);
		return i - 1;
	}

	return i - 1;
}

/* -------------------------------------------------------------------------- */
// Pomoćne funkcije:
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
		              .replace(/</g, "&lt;")
		              .replace(/>/g, "&gt;");
		let t_1 = lista[i][1];
		
		if(rezim == "tech") {
			t_0 = t_0
			          .replace(/\n/g, "ENTER")
			          .replace(/\t/g, "TAB");
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

/* -------------------------------------------------------------------------- */

function vremeObradeIspis(t1, naziv) {
	let t2 = performance.now();
	let odziv = t2 - t1 + "ms";
	console.log(`Vreme obrade - ${naziv}: ${odziv}`);
}

/* -------------------------------------------------------------------------- */
//// Obrada ....
/* -------------------------------------------------------------------------- */

function ispisKodaTekst(tekst, poljeZaIspis) {
	let tekstKod = document.createElement('span');
	tekstKod.innerText = tekst.trim();
	tekstKod.classList.add("token");
	tekstKod.classList.add("tekst");
	tekstKod.title = "tekst";
	poljeZaIspis.innerHTML = "";
	poljeZaIspis.appendChild(tekstKod);
}

/* -------------------------------------------------------------------------- */

function obradaKoda(tekst, definicijaJezika, poljeZaIspis, rezim) {
	
	/* ---------------------------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	if(definicijaJezika.naziv == "TXT") {
		tekst = tekst.trim();
		ispisKodaTekst(tekst, poljeZaIspis);
		return;
	}

	tekst = tekst.trim() + "\n";
	
	let listaTokena = null;

	listaTokena = definicijaJezika.lekser(tekst, definicijaJezika);	
	listaTokena = definicijaJezika.parser(definicijaJezika, listaTokena);
		
	poljeZaIspis.innerHTML = formatiranjeIspisListe(listaTokena, rezim);

	/* ---------------------------------------------------------------------- */
	vremeObradeIspis(t1, "Glavna funkcija")
	/* ---------------------------------------------------------------------- */
}

/* -------------------------------------------------------------------------- */

function obradaKodaWorker(tekst, definicijaJezika, poljeZaIspis, rezim) {
	
	/* ---------------------------------------------------------------------- */
	//let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	if(definicijaJezika.naziv == "TXT") return [
		[ tekst.trim() , "tekst"]
	];

	tekst = tekst.trim() + "\n";
	let listaTokena = null;

	listaTokena = definicijaJezika.lekser(tekst, definicijaJezika);	
	listaTokena = definicijaJezika.parser(definicijaJezika, listaTokena);
	
	/* ---------------------------------------------------------------------- */
	//vremeObradeIspis(t1, "Glavna funkcija")
	/* ---------------------------------------------------------------------- */

	return listaTokena;

}

/* -------------------------------------------------------------------------- */
