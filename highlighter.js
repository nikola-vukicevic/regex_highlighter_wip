/* -------------------------------------------------------------------------- */
// Syntax highlighter v1.4.2
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function analizaIzrazaTokenDaLiJeWhiteSpace(token) {
	return token[0] == " " || token[0] == "\t";
}

function analizaIzrazaPromenaKonteksta(tkn, stek, prethodniTip) { 
	let kontekst = stek[stek.length - 1];                         

	if(tkn == 1) {
		if(prethodniTip == "operator")
			stek.push(0);
		else
			stek.push(1);
		return;
	}

	if(tkn == 2) {
		if(stek.length > 0) stek.pop();
		return;
	}

	if(tkn == 3) {
		if(kontekst != 3) {
			stek.push(3);
			return;
		}

		if(stek.length > 0 && kontekst == 3) {
			stek.pop();
			return;
		}
	}
}

function analizaIzrazaKreiranjeListeTokena(lista, definicijaJezika) {
	let tokeni       = [];
	let stek         = [ 0 ];
	let kontekst     = 0;
	let prethodniTip = "operator";

	lista.forEach(t => {
		if(analizaIzrazaTokenDaLiJeWhiteSpace(t)) return;

		kontekst = stek[stek.length - 1];

		if(t[0] == "(") {
			analizaIzrazaPromenaKonteksta(1, stek, prethodniTip);
			return;
		}

		if(t[0] == ")") {
			analizaIzrazaPromenaKonteksta(2, stek, prethodniTip);
			return;
		}

		if(t[0] == "\"" || t[0] == "\'" || t[0] == "\`") {
			analizaIzrazaPromenaKonteksta(3, stek, prethodniTip);
			return;
		}

		if(kontekst > 0) return;
		if(t[0] == "/") return;
		if(t[1] == "operator" && t[0].length > 1) return;
		prethodniTip = t[1];

		tokeni.push(t);

	});

	return tokeni;
}

function ShuntingYard1(lista) {
	let red  = [];
	let stek = [];

	lista.forEach(t => {
		if(t[1] == "") {
			red.push("a");
			return;
		}

		if(t[0] == "(") {
			stek.push("(");
			return;
		}

		if(t[0] == ")") {
			while(stek.length > 0 && stek[stek.length - 1] == "+") {
				red.push(stek[stek.length - 1]);
				stek.pop();
			}
			if(stek.length > 0) stek.pop();
			return;
		}

		if(t[1] == "operator") {               
			if(stek[stek.length - 1] == "+") { 
				red.push("+");                 
			}                                  
			else {                             
				stek.push("+");
			}
			return;
		}

		if(t[1] != "") {
			red.push("x");
			return;
		}
	});

	while(stek.length > 0) {
		red.push("+");
		stek.pop();
	}

	return red;
}

function ShuntingYard2(lista) {
	let stek  = [];
	let sveOk = true;

	lista.forEach(t => {
		if(t == "a") {
			stek.push("a");
			return;
		}

		if(t == "+") {
			if(stek.length > 1) {
				stek.pop();
				return;
			}
			else {
				sveOk = false;
			}
		}

		if(t == "x") {
			sveOk = false;
			return;
		}
	});

	if(sveOk) {
		return stek;
	}
	else {
		return [];
	}
}

function analizaIzraza(lista, definicijaJezika) {
	let tokeni = null;
	tokeni = analizaIzrazaKreiranjeListeTokena(lista, definicijaJezika);

	tokeni = ShuntingYard1(tokeni);

	tokeni = ShuntingYard2(tokeni);

	return tokeni.length == 1 && tokeni[0] == "a";
}

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

function ubacivanje_s_0(str, mapa, lista) {
	let rez = mapa.get(str.s[0]);
	lista.push( [ str.s[0] , rez ] );
	str.s = str.s.substring(1, str.s.length);
}

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
			""     , 
			""     , 
			"broj" , 
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

function obradaPrepoznatogTokena(token, lista, parser, definicijaJezika) {

	if(parser.rez[1] === true ) {
		parser.stek.pop();

		if(parser.s != "") {
			parser.novaLista.push( [ parser.s , parser.klasa ] );
			parser.s = "";
		}
	}

	if(parser.rez[0] === true) {
		parser.stek.push(parser.rez[2]);

		if(parser.s != "") {
			parser.novaLista.push( [ parser.s , parser.klasa ] );
			parser.s = "";
		}
	}

	parser.kontekst      = parser.stek[parser.stek.length - 1];
	parser.spajanje      = definicijaJezika.parserPrepravaljanje.get(parser.kontekst)[0];
	parser.prepravljanje = definicijaJezika.parserPrepravaljanje.get(parser.kontekst)[1];
	parser.klasa         = definicijaJezika.parserPrepravaljanje.get(parser.kontekst)[2];

	parser.novaLista.push( [ token[0] , parser.rez[3] ] );

}

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

		if( lista[i][0] == "/" && parser.kontekst == 0) {
			i = parserProveraRegularnogIzraza(parser.kontekst, i, lista, parser.novaLista, definicijaJezika);
			continue;
		}

		if(parser.rez != null) {
			obradaPrepoznatogTokena(lista[i], lista, parser, definicijaJezika);
			continue;
		}

		if(parser.spajanje) {
			parser.s += lista[i][0];
			continue;
		}

		let specLista = definicijaJezika.parserSpecListe.get(parser.kontekst);

		if(specLista) {
			let specKlasa = specLista.get(lista[i][0]);

			if(specKlasa) {
				parser.novaLista.push( [ lista[i][0] , specKlasa ] );

				continue;
			}
		}

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

function neuspesniPokusajUbacivanjaRegularnogIzraza(pomLista, novaLista) {
	pomLista.forEach(e => {
		novaLista.push(e);
	});
}

function pokusajUbacivanjaRegularnogIzraza(s, pomLista, novaLista, definicijaJezika) {
	if(!analizaIzraza(pomLista,  definicijaJezika)) {
		novaLista.push( [ s , "regularni_izraz"] );
	}
	else {
		neuspesniPokusajUbacivanjaRegularnogIzraza(pomLista, novaLista);
	}
}

function parserProveraRegularnogIzraza(kontekst, i, lista, novaLista, definicijaJezika) {
	if(definicijaJezika.naziv != "JavaScript") {
		novaLista.push(lista[i]);               
		return i;
	}

	let pronadjenPar    = false;

	let pomLista        = []
	let s               = "/";
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
		              .replaceAll("<", "&lt;")
		              .replaceAll(">", "&gt;");
		let t_1 = lista[i][1];

		if(rezim == "tech") {
			t_0 = t_0
			          .replace("\n", "ENTER")
			          .replace("\t", "TAB");
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

function ispisKodaTekst(tekst, poljeZaIspis) {
	let tekstKod = document.createElement('span');
	tekstKod.innerText = tekst.trim();
	tekstKod.classList.add("token");
	tekstKod.classList.add("tekst");
	tekstKod.title = "tekst";
	poljeZaIspis.innerHTML = "";
	poljeZaIspis.appendChild(tekstKod);
}

function obradaKoda(tekst, definicijaJezika, poljeZaIspis, rezim) {

	let t1 = performance.now();

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

	vremeObradeIspis(t1, "Glavna funkcija")

}

function obradaKodaWorker(tekst, definicijaJezika, poljeZaIspis, rezim) {

	if(definicijaJezika.naziv == "TXT") return [
		[ tekst.trim() , "tekst"]
	];

	tekst = tekst.trim() + "\n";
	let listaTokena = null;

	listaTokena = definicijaJezika.lekser(tekst, definicijaJezika);	
	listaTokena = definicijaJezika.parser(definicijaJezika, listaTokena);

	return listaTokena;

}

function pripremaListe(lista) {
	for(let i = 0; i < lista.length; i++) {
		lista[i] = [ lista[i] , "tekst" , false , false ];
	}
}

function utiskivanjeTokenPojedinacni(regex, token, boolLexer, boolParser, lista) {
	lista.forEach(e => {
		if(e[2] == false && e[0].match(regex)) {
			e[1] = token;
			e[2] = boolLexer;
			e[3] = boolParser;
		}
	});
}

function utiskivanjeTokena(listaRegexa, listaTokena) {
	listaRegexa.forEach(e => {
		utiskivanjeTokenPojedinacni(e[0], e[1], e[2], e[3], listaTokena);
	});
}

function obradaPrepoznatogTokenaRegex(listaTokenaRed, stek, listaParserRed) {

	if(listaParserRed[3] === true) {
		listaTokenaRed[2] = listaParserRed[6]; 
	}

 	if(listaParserRed[1] === true ) {
 		stek.push(listaParserRed[5])  
 		return;                       
 	}                                 

 	if(listaParserRed[2] > 0) {
 		if(listaParserRed[2] > 1000) {
 			while(stek.length > 1) {
 				stek.pop();
 			}
 		}
 		else {
 			let p = listaParserRed[2];
 			while(p > 0) {
 				stek.pop();
 				p--;
 			}			
 		}	

 		return;      
 	}
}

function parserTokenPojedinacni(listaTokenaRed, stek, listaParserPredata, specijalneListe) {
	let kontekst = stek[stek.length - 1];

	if(listaParserPredata.length > 0) {
		let listaParser = listaParserPredata[kontekst];

		for(let i = 0; i < listaParser.length; i++) {
			if(listaTokenaRed[3] === true) continue;			

			if (listaTokenaRed[0].match(listaParser[i][0])) {
				obradaPrepoznatogTokenaRegex(listaTokenaRed, stek, listaParser[i]);
				return;
			}
		}
	}

	if(specijalneListe.length > 0) {
		let listeSpecijalnihTokena = specijalneListe[kontekst];

		listeSpecijalnihTokena.forEach(specLista => {
			let rez = proveraSpecijalnihTokena(listaTokenaRed, specLista[0], specLista[1]);
			if(rez && specLista[2] != -1) {
				stek.push(specLista[2]);
			}
		});
	}
}

function proveraSpecijalnihTokena(tokenRed, listaSpec, oznaka) {
	if(binarnaPretraga(tokenRed[0], listaSpec)) {
		tokenRed[2] = oznaka;
		return true;
	}

	return false;
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

function lekserRegex(tekst, definicija_jezika) {

	let t1 = performance.now();

	let lista = tekst.split(definicija_jezika.regexRastavljanje);
	pripremaListe(lista);
	utiskivanjeTokena(definicija_jezika.listaRegex, lista);

	let t2    = performance.now();
	let odziv = t2 - t1 + "ms";
	console.log(`Vreme obrade - lekser (${definicija_jezika.naziv}) - ${odziv}`)

	return lista;
}

function parserRegex(definicija_jezika, listaTokena) {
	let stek = [  0  ];

	for(let i = 0; i < listaTokena.length; i++)	{
		parserTokenPojedinacni(listaTokena[i], stek, definicija_jezika.listaParser, definicija_jezika.listeSpec);
	}

	return listaTokena;
}

let TXT_definicijaJezika = {

	naziv:        "TXT",
	defaultKlasa: "tekst",      

};

let CSS_lekserTokeni = new Map( [

	[ "/*" , "komentar" ] ,
	[ "*/" , "komentar" ] ,
	[ "//" , "komentar" ] ,
	[ "/"  , "komentar" ] ,
	[ "*"  , "komentar" ] ,
	[ "@"  , ""         ] ,
	[ "#"  , ""         ] ,
	[ ","  , ""         ] ,
	[ "."  , ""         ] ,
	[ "{"  , ""         ] ,
	[ "}"  , ""         ] ,
	[ "("  , ""         ] ,
	[ ")"  , ""         ] ,
	[ "["  , ""         ] ,
	[ "]"  , ""         ] ,
	[ "="  , ""         ] ,
	[ ">"  , ""         ] ,
	[ ":"  , ""         ] ,
	[ ";"  , ""         ] ,
	[ "'"  , ""         ] ,
	[ "\"" , ""         ] ,

] );

let CSS_parserPrepravljanje = new Map( [

	[ 0 , [ false , false , "tekst"             ] ] ,
	[ 1 , [ true  , true  , "komentar"          ] ] ,
	[ 2 , [ true  , true  , "komentar"          ] ] ,
	[ 3 , [ true  , true  , "niska_apostrofi"   ] ] ,
	[ 4 , [ true  , true  , "niska_navodnici"   ] ] ,
	[ 5 , [ true  , true  , "et_direktiva"      ] ] ,
	[ 6 , [ true  , true  , "id_naziv"          ] ] ,
	[ 7 , [ true  , true  , "klasa_naziv"       ] ] ,
	[ 8 , [ false , true  , "svojstvo_naziv"    ] ] ,
	[ 9 , [ false , true  , "svojstvo_vrednost" ] ] ,

] );

let CSS_parserTokeni = new Map();

	let CSS_parserLista_0 = new Map( [

		[ "/*" , [ true  , false ,  1 , "komentar"        ] ] ,
		[ "//" , [ true  , false ,  2 , "komentar"        ] ] ,
		[ "'"  , [ true  , false ,  3 , "niska_apostrofi" ] ] ,
		[ "\"" , [ true  , false ,  4 , "niska_navodnici" ] ] ,
		[ "@"  , [ true  , false ,  5 , "et_direktiva"    ] ] ,
		[ "#"  , [ true  , false ,  6 , "id_naziv"        ] ] ,
		[ "."  , [ true  , false ,  7 , "klasa_naziv"     ] ] ,
		[ "{"  , [ true  , false ,  8 , "blok_svojstva"   ] ] ,
		[ "*"  , [ false , false , -1 , "globalni"        ] ] ,

	] );

	let CSS_parserLista_1 = new Map( [

		[ "*/" , [ false , true  , -1 , "komentar"      ] ] ,
		[ "{"  , [ true  , false ,  8 , "blok_svojstva" ] ] ,

	] );

	let CSS_parserLista_2 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let CSS_parserLista_3 = new Map( [

		[ "'"  , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let CSS_parserLista_4 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let CSS_parserLista_5 = new Map( [

		[ ";"  , [ false , true  , -1 , "operator"      ] ] ,
		[ "{"  , [ true  , true  ,  8 , "blok_svojstva" ] ] ,
		[ "/*" , [ true  , false ,  1 , "komentar"      ] ] ,
		[ "//" , [ true  , false ,  2 , "komentar"      ] ] ,

	] );

	let CSS_parserLista_6 = new Map( [

		[ " "  , [ false , true  , -1 , "white_space"   ] ] ,
		[ "\t" , [ false , true  , -1 , "white_space"   ] ] ,
		[ ","  , [ false , true  , -1 , "separator"     ] ] ,
		[ "{"  , [ true  , true  ,  8 , "blok_svojstva" ] ] ,
		[ "/*" , [ true  , false ,  1 , "komentar"      ] ] ,
		[ "//" , [ true  , false ,  2 , "komentar"      ] ] ,

	] );

	let CSS_parserLista_7 = new Map( [

		[ " "  , [ false , true  , -1 , "white_space"   ] ] ,
		[ "\t" , [ false , true  , -1 , "white_space"   ] ] ,
		[ ","  , [ false , true  , -1 , "separator"     ] ] ,
		[ "{"  , [ true  , true  ,  8 , "blok_svojstva" ] ] ,
		[ "/*" , [ true  , false ,  1 , "komentar"      ] ] ,
		[ "//" , [ true  , false ,  2 , "komentar"      ] ] ,

	] );

	let CSS_parserLista_8 = new Map( [

		[ "}"  , [ false , true  , -1 , "blok_svojstva"  ] ] ,
		[ ":"  , [ true  , false ,  9 , "atribut_dodela" ] ] ,
		[ "/*" , [ true  , false ,  1 , "komentar"       ] ] ,
		[ "//" , [ true  , false ,  2 , "komentar"       ] ] ,
		[ "#"  , [ true  , false ,  6 , "id_naziv"       ] ] ,
		[ "."  , [ true  , false ,  7 , "klasa_naziv"    ] ] ,

	] );

	let CSS_parserLista_9 = new Map( [

		[ ";"  , [ false , true  , -1 , "operator" ] ] ,
		[ "/*" , [ true  , false ,  1 , "komentar" ] ] ,
		[ "//" , [ true  , false ,  2 , "komentar" ] ] ,

	] );

CSS_parserTokeni.set( 0 , CSS_parserLista_0 )
                .set( 1 , CSS_parserLista_1 )
                .set( 2 , CSS_parserLista_2 )
                .set( 3 , CSS_parserLista_3 )
                .set( 4 , CSS_parserLista_4 )
                .set( 5 , CSS_parserLista_5 )
                .set( 6 , CSS_parserLista_6 )
                .set( 7 , CSS_parserLista_7 )
                .set( 8 , CSS_parserLista_8 )
                .set( 9 , CSS_parserLista_9 )

let CSS_parserSpecListe = new Map();

	let CSS_parserSpecLista_0 = new Map( [

		[ "a"           , "html_tag" ] ,
		[ "abbr"        , "html_tag" ] ,
		[ "acronym"     , "html_tag" ] ,
		[ "address"     , "html_tag" ] ,
		[ "applet"      , "html_tag" ] ,
		[ "area"        , "html_tag" ] ,
		[ "article"     , "html_tag" ] ,
		[ "aside"       , "html_tag" ] ,
		[ "audio"       , "html_tag" ] ,
		[ "b"           , "html_tag" ] ,
		[ "base"        , "html_tag" ] ,
		[ "basefont"    , "html_tag" ] ,
		[ "bb"          , "html_tag" ] ,
		[ "bdo"         , "html_tag" ] ,
		[ "big"         , "html_tag" ] ,
		[ "blockquote"  , "html_tag" ] ,
		[ "body"        , "html_tag" ] ,
		[ "br"          , "html_tag" ] ,
		[ "button"      , "html_tag" ] ,
		[ "canvas"      , "html_tag" ] ,
		[ "caption"     , "html_tag" ] ,
		[ "cite"        , "html_tag" ] ,
		[ "code"        , "html_tag" ] ,
		[ "col"         , "html_tag" ] ,
		[ "colgroup"    , "html_tag" ] ,
		[ "command"     , "html_tag" ] ,
		[ "datagrid"    , "html_tag" ] ,
		[ "datalist"    , "html_tag" ] ,
		[ "dd"          , "html_tag" ] ,
		[ "del"         , "html_tag" ] ,
		[ "details"     , "html_tag" ] ,
		[ "dfn"         , "html_tag" ] ,
		[ "dialog"      , "html_tag" ] ,
		[ "dir"         , "html_tag" ] ,
		[ "div"         , "html_tag" ] ,
		[ "dl"          , "html_tag" ] ,
		[ "dt"          , "html_tag" ] ,
		[ "em"          , "html_tag" ] ,
		[ "embed"       , "html_tag" ] ,
		[ "eventsource" , "html_tag" ] ,
		[ "fieldset"    , "html_tag" ] ,
		[ "figcaption"  , "html_tag" ] ,
		[ "figure"      , "html_tag" ] ,
		[ "font"        , "html_tag" ] ,
		[ "footer"      , "html_tag" ] ,
		[ "form"        , "html_tag" ] ,
		[ "frame"       , "html_tag" ] ,
		[ "frameset"    , "html_tag" ] ,
		[ "h1"          , "html_tag" ] ,
		[ "h2"          , "html_tag" ] ,
		[ "h3"          , "html_tag" ] ,
		[ "h4"          , "html_tag" ] ,
		[ "h5"          , "html_tag" ] ,
		[ "h6"          , "html_tag" ] ,
		[ "head"        , "html_tag" ] ,
		[ "header"      , "html_tag" ] ,
		[ "hgroup"      , "html_tag" ] ,
		[ "hr"          , "html_tag" ] ,
		[ "html"        , "html_tag" ] ,
		[ "i"           , "html_tag" ] ,
		[ "iframe"      , "html_tag" ] ,
		[ "img"         , "html_tag" ] ,
		[ "input"       , "html_tag" ] ,
		[ "ins"         , "html_tag" ] ,
		[ "isindex"     , "html_tag" ] ,
		[ "kbd"         , "html_tag" ] ,
		[ "keygen"      , "html_tag" ] ,
		[ "label"       , "html_tag" ] ,
		[ "legend"      , "html_tag" ] ,
		[ "li"          , "html_tag" ] ,
		[ "link"        , "html_tag" ] ,
		[ "main"        , "html_tag" ] ,
		[ "map"         , "html_tag" ] ,
		[ "mark"        , "html_tag" ] ,
		[ "menu"        , "html_tag" ] ,
		[ "meta"        , "html_tag" ] ,
		[ "meter"       , "html_tag" ] ,
		[ "nav"         , "html_tag" ] ,
		[ "noframes"    , "html_tag" ] ,
		[ "noscript"    , "html_tag" ] ,
		[ "object"      , "html_tag" ] ,
		[ "ol"          , "html_tag" ] ,
		[ "optgroup"    , "html_tag" ] ,
		[ "option"      , "html_tag" ] ,
		[ "output"      , "html_tag" ] ,
		[ "p"           , "html_tag" ] ,
		[ "param"       , "html_tag" ] ,
		[ "pre"         , "html_tag" ] ,
		[ "progress"    , "html_tag" ] ,
		[ "q"           , "html_tag" ] ,
		[ "rp"          , "html_tag" ] ,
		[ "ruby"        , "html_tag" ] ,
		[ "s"           , "html_tag" ] ,
		[ "samp"        , "html_tag" ] ,
		[ "script"      , "html_tag" ] ,
		[ "section"     , "html_tag" ] ,
		[ "select"      , "html_tag" ] ,
		[ "small"       , "html_tag" ] ,
		[ "source"      , "html_tag" ] ,
		[ "span"        , "html_tag" ] ,
		[ "strike"      , "html_tag" ] ,
		[ "strong"      , "html_tag" ] ,
		[ "style"       , "html_tag" ] ,
		[ "sub"         , "html_tag" ] ,
		[ "sup"         , "html_tag" ] ,
		[ "t"           , "html_tag" ] ,
		[ "table"       , "html_tag" ] ,
		[ "tbody"       , "html_tag" ] ,
		[ "td"          , "html_tag" ] ,
		[ "textarea"    , "html_tag" ] ,
		[ "tfoot"       , "html_tag" ] ,
		[ "th"          , "html_tag" ] ,
		[ "thead"       , "html_tag" ] ,
		[ "time"        , "html_tag" ] ,
		[ "title"       , "html_tag" ] ,
		[ "tr"          , "html_tag" ] ,
		[ "track"       , "html_tag" ] ,
		[ "tt"          , "html_tag" ] ,
		[ "u"           , "html_tag" ] ,
		[ "ul"          , "html_tag" ] ,
		[ "video"       , "html_tag" ] ,
		[ "wbr"         , "html_tag" ] ,
		[ "center"      , "html_tag" ] ,
		[ "var"         , "html_tag" ] ,

		[ "hover"  , "pseudoklasa" ] ,
		[ "active" , "pseudoklasa" ] ,

	] );

	let CSS_parserSpecLista_9 = new Map( [

		[ "px" , "jedinica" ] ,
		[ "em" , "jedinica" ] ,

	] );

CSS_parserSpecListe.set( 0 , CSS_parserSpecLista_0 )
                   .set( 9 , CSS_parserSpecLista_9 )

let CSS_definicijaJezika = {

	naziv:                 "CSS",
	defaultKlasa:          "tekst",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          CSS_lekserTokeni,
	maksDuzinaSpajanje:    2,
	parserPrepravaljanje:  CSS_parserPrepravljanje,
	parserTokeni:          CSS_parserTokeni,
	parserSpecListe:       CSS_parserSpecListe,

}

let C_lekserTokeni = new Map( [

	[ "/*"  , "komentar"                      ] ,
	[ "//"  , "komentar"                      ] ,
	[ "*/"  , "komentar"                      ] ,
	[ "#"   , "pretprocesorska_direktiva"     ] ,
	[ ":"   , "operator"                      ] ,
	[ "\""  , "niska_navodnici"               ] ,
	[ "\'"  , "niska_apostrofi"               ] ,
	[ "\`"  , "niska_backtick"                ] ,
	[ "\\"  , "escape_sekvenca"               ] ,
	[ "="   , "operator"                      ] ,
	[ "+"   , "operator"                      ] ,
	[ "-"   , "operator"                      ] ,
	[ "*"   , "operator"                      ] ,
	[ "/"   , "operator"                      ] ,
	[ "%"   , "operator"                      ] ,
	[ "+="  , "operator"                      ] ,
	[ "-="  , "operator"                      ] ,
	[ "*="  , "operator"                      ] ,
	[ "/="  , "operator"                      ] ,
	[ "%="  , "operator"                      ] ,
	[ ">>=" , "operator"                      ] ,
	[ "<<=" , "operator"                      ] ,
	[ "&="  , "operator"                      ] ,
	[ "^="  , "operator"                      ] ,
	[ "|="  , "operator"                      ] ,
	[ "++"  , "operator"                      ] ,
	[ "--"  , "operator"                      ] ,
	[ "=="  , "operator"                      ] ,
	[ "!="  , "operator"                      ] ,
	[ ">"   , "operator"                      ] ,
	[ "<"   , "operator"                      ] ,
	[ ">="  , "operator"                      ] ,
	[ "<="  , "operator"                      ] ,
	[ "!"   , "operator"                      ] ,
	[ "&&"  , "operator"                      ] ,
	[ "||"  , "operator"                      ] ,
	[ "&"   , "operator"                      ] ,
	[ "|"   , "operator"                      ] ,
	[ "^"   , "operator"                      ] ,
	[ "~"   , "operator"                      ] ,
	[ "<<"  , "operator"                      ] ,
	[ ">>"  , "operator"                      ] ,
	[ "?"   , "operator"                      ] ,
	[ ","   , "operator"                      ] ,
	[ "."   , "operator"                      ] ,
	[ ";"   , "operator"                      ] ,
	[ "->"  , "operator"                      ] ,
	[ "("   , "zagrada_obicna_otvorena"       ] ,
	[ ")"   , "zagrada_obicna_zatvorena"      ] ,
	[ "{"   , "blok_koda_otvarajuca_zagrada"  ] ,
	[ "}"   , "blok_koda_zatvarajuca_zagrada" ] ,
	[ "["   , "otvorena_zagrada_niz"          ] ,
	[ "]"   , "zatvorena_zagrada_niz"         ] ,

] );

let C_parserPrepravljanje = new Map( [

	[ 0 , [ false , false , "identifikator"             ] ] ,
	[ 1 , [ true  , true  , "komentar"                  ] ] ,
	[ 2 , [ true  , true  , "komentar"                  ] ] ,
	[ 3 , [ true  , true  , "pretprocesorska_direktiva" ] ] ,
	[ 4 , [ true  , true  , "niska_navodnici"           ] ] ,
	[ 5 , [ true  , true  , "niska_apostrofi"           ] ] ,
	[ 6 , [ true  , true  , "niska_backtick"            ] ] ,

] );

let C_parserTokeni = new Map();

	let C_parserLista_0 = new Map( [

		[ "/*" , [ true , false , 1, "komentar"                  ] ] ,
		[ "//" , [ true , false , 2, "komentar"                  ] ] ,
		[ "#"  , [ true , false , 3, "pretprocesorska_direktiva" ] ] ,
		[ "\"" , [ true , false , 4, "niska_navodnici"           ] ] ,
		[ "'"  , [ true , false , 5, "niska_apostrofi"           ] ] ,
		[ "`"  , [ true , false , 6, "niska_backtick"            ] ] ,

	] );

	let C_parserLista_1 = new Map( [

		[ "*/" , [ false , true , -1 , "komentar" ] ] ,

	] );

	let C_parserLista_2 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let C_parserLista_3 = new Map( [

		[ ">"  , [ false , true , -1 , "pretprocesorska_direktiva" ] ] ,
		[ "\n" , [ false , true , -1 , "pretprocesorska_direktiva" ] ] ,

	] );

	let C_parserLista_4 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let C_parserLista_5 = new Map( [

		[ "'"  , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let C_parserLista_6 = new Map( [

		[ "`"  , [ false , true , -1 , "niska_backtick" ] ] ,

	] );

C_parserTokeni.set( 0, C_parserLista_0 )
              .set( 1, C_parserLista_1 )
              .set( 2, C_parserLista_2 )
              .set( 3, C_parserLista_3 )
              .set( 4, C_parserLista_4 )
              .set( 5, C_parserLista_5 )
              .set( 6, C_parserLista_6 )

let C_parserSpecListe = new Map();

	let C_parserSpecLista_0 = new Map( [

		[ "Decimal"    , "rezervisana_rec" ] ,
		[ "Double"     , "rezervisana_rec" ] ,
		[ "Float"      , "rezervisana_rec" ] ,
		[ "Int32"      , "rezervisana_rec" ] ,
		[ "Int64"      , "rezervisana_rec" ] ,
		[ "NULL"       , "rezervisana_rec" ] ,
		[ "UInt32"     , "rezervisana_rec" ] ,
		[ "UInt64"     , "rezervisana_rec" ] ,
		[ "base"       , "rezervisana_rec" ] ,
		[ "bool"       , "rezervisana_rec" ] ,
		[ "boolean"    , "rezervisana_rec" ] ,
		[ "break"      , "rezervisana_rec" ] ,
		[ "byte"       , "rezervisana_rec" ] ,
		[ "case"       , "rezervisana_rec" ] ,
		[ "catch"      , "rezervisana_rec" ] ,
		[ "char"       , "rezervisana_rec" ] ,
		[ "class"      , "rezervisana_rec" ] ,
		[ "const"      , "rezervisana_rec" ] ,
		[ "continue"   , "rezervisana_rec" ] ,
		[ "decimal"    , "rezervisana_rec" ] ,
		[ "default"    , "rezervisana_rec" ] ,
		[ "delegate"   , "rezervisana_rec" ] ,
		[ "do"         , "rezervisana_rec" ] ,
		[ "double"     , "rezervisana_rec" ] ,
		[ "else"       , "rezervisana_rec" ] ,
		[ "enum"       , "rezervisana_rec" ] ,
		[ "event"      , "rezervisana_rec" ] ,
		[ "extends"    , "rezervisana_rec" ] ,
		[ "false"      , "rezervisana_rec" ] ,
		[ "final"      , "rezervisana_rec" ] ,
		[ "finally"    , "rezervisana_rec" ] ,
		[ "float"      , "rezervisana_rec" ] ,
		[ "for"        , "rezervisana_rec" ] ,
		[ "foreach"    , "rezervisana_rec" ] ,
		[ "get"        , "rezervisana_rec" ] ,
		[ "if"         , "rezervisana_rec" ] ,
		[ "implements" , "rezervisana_rec" ] ,
		[ "import"     , "rezervisana_rec" ] ,
		[ "int"        , "rezervisana_rec" ] ,
		[ "long"       , "rezervisana_rec" ] ,
		[ "namespace"  , "rezervisana_rec" ] ,
		[ "new"        , "rezervisana_rec" ] ,
		[ "null"       , "rezervisana_rec" ] ,
		[ "object"     , "rezervisana_rec" ] ,
		[ "override"   , "rezervisana_rec" ] ,
		[ "package"    , "rezervisana_rec" ] ,
		[ "private"    , "rezervisana_rec" ] ,
		[ "protected"  , "rezervisana_rec" ] ,
		[ "public"     , "rezervisana_rec" ] ,
		[ "return"     , "rezervisana_rec" ] ,
		[ "set"        , "rezervisana_rec" ] ,
		[ "short"      , "rezervisana_rec" ] ,
		[ "signed"     , "rezervisana_rec" ] ,
		[ "sizeof"     , "rezervisana_rec" ] ,
		[ "static"     , "rezervisana_rec" ] ,
		[ "struct"     , "rezervisana_rec" ] ,
		[ "super"      , "rezervisana_rec" ] ,
		[ "switch"     , "rezervisana_rec" ] ,
		[ "this"       , "rezervisana_rec" ] ,
		[ "throw"      , "rezervisana_rec" ] ,
		[ "true"       , "rezervisana_rec" ] ,
		[ "try"        , "rezervisana_rec" ] ,
		[ "typedef"    , "rezervisana_rec" ] ,
		[ "union"      , "rezervisana_rec" ] ,
		[ "unsigned"   , "rezervisana_rec" ] ,
		[ "unsigned"   , "rezervisana_rec" ] ,
		[ "using"      , "rezervisana_rec" ] ,
		[ "void"       , "rezervisana_rec" ] ,
		[ "while"      , "rezervisana_rec" ] ,

		[ "Console"   , "specijalni_token" ] ,
		[ "FILE"      , "specijalni_token" ] ,
		[ "ReadKey"   , "specijalni_token" ] ,
		[ "ReadLine"  , "specijalni_token" ] ,
		[ "System"    , "specijalni_token" ] ,
		[ "WriteLine" , "specijalni_token" ] ,
		[ "cout"      , "specijalni_token" ] ,
		[ "endl"      , "specijalni_token" ] ,
		[ "fclose"    , "specijalni_token" ] ,
		[ "fopen"     , "specijalni_token" ] ,
		[ "fprintf"   , "specijalni_token" ] ,
		[ "fscanf"    , "specijalni_token" ] ,
		[ "main"      , "specijalni_token" ] ,
		[ "out"       , "specijalni_token" ] ,
		[ "printf"    , "specijalni_token" ] ,
		[ "scanf"     , "specijalni_token" ] ,
		[ "string"    , "specijalni_token" ] ,
		[ "vector"    , "specijalni_token" ] ,

	] );

C_parserSpecListe.set( 0 , C_parserSpecLista_0 );

let C_definicijaJezika = {

	naziv:                 "C",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          C_lekserTokeni,
	maksDuzinaSpajanje:    3,
	parserPrepravaljanje:  C_parserPrepravljanje,
	parserTokeni:          C_parserTokeni,
	parserSpecListe:       C_parserSpecListe,

};

let CLIKE_definicijaJezika = {

	naziv:                 "CLIKE",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          C_lekserTokeni,
	maksDuzinaSpajanje:    3,
	parserPrepravaljanje:  C_parserPrepravljanje,
	parserTokeni:          C_parserTokeni,
	parserSpecListe:       C_parserSpecListe,

};

let CPP_definicijaJezika = {

	naziv:                 "C++",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          C_lekserTokeni,
	maksDuzinaSpajanje:    3,
	parserPrepravaljanje:  C_parserPrepravljanje,
	parserTokeni:          C_parserTokeni,
	parserSpecListe:       C_parserSpecListe,

};

let C_Sharp_definicijaJezika = {

	naziv:                 "C#",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          C_lekserTokeni,
	maksDuzinaSpajanje:    3,
	parserPrepravaljanje:  C_parserPrepravljanje,
	parserTokeni:          C_parserTokeni,
	parserSpecListe:       C_parserSpecListe,

};

let Java_parserSpecListe = new Map();

	let Java_parserSpecLista_0 = new Map( [

		[ "abstract"     , "rezervisana_rec" ] ,
		[ "assert"       , "rezervisana_rec" ] ,
		[ "boolean"      , "rezervisana_rec" ] ,
		[ "break"        , "rezervisana_rec" ] ,
		[ "byte"         , "rezervisana_rec" ] ,
		[ "case"         , "rezervisana_rec" ] ,
		[ "catch"        , "rezervisana_rec" ] ,
		[ "char"         , "rezervisana_rec" ] ,
		[ "class"        , "rezervisana_rec" ] ,
		[ "continue"     , "rezervisana_rec" ] ,
		[ "const"        , "rezervisana_rec" ] ,
		[ "default"      , "rezervisana_rec" ] ,
		[ "do"           , "rezervisana_rec" ] ,
		[ "double"       , "rezervisana_rec" ] ,
		[ "else"         , "rezervisana_rec" ] ,
		[ "enum"         , "rezervisana_rec" ] ,
		[ "exports"      , "rezervisana_rec" ] ,
		[ "extends"      , "rezervisana_rec" ] ,
		[ "final"        , "rezervisana_rec" ] ,
		[ "finally"      , "rezervisana_rec" ] ,
		[ "float"        , "rezervisana_rec" ] ,
		[ "for"          , "rezervisana_rec" ] ,
		[ "goto"         , "rezervisana_rec" ] ,
		[ "if"           , "rezervisana_rec" ] ,
		[ "implements"   , "rezervisana_rec" ] ,
		[ "import"       , "rezervisana_rec" ] ,
		[ "instanceof"   , "rezervisana_rec" ] ,
		[ "int"          , "rezervisana_rec" ] ,
		[ "interface"    , "rezervisana_rec" ] ,
		[ "long"         , "rezervisana_rec" ] ,
		[ "module"       , "rezervisana_rec" ] ,
		[ "native"       , "rezervisana_rec" ] ,
		[ "new"          , "rezervisana_rec" ] ,
		[ "package"      , "rezervisana_rec" ] ,
		[ "private"      , "rezervisana_rec" ] ,
		[ "protected"    , "rezervisana_rec" ] ,
		[ "public"       , "rezervisana_rec" ] ,
		[ "requires"     , "rezervisana_rec" ] ,
		[ "return"       , "rezervisana_rec" ] ,
		[ "short"        , "rezervisana_rec" ] ,
		[ "static"       , "rezervisana_rec" ] ,
		[ "strictfp"     , "rezervisana_rec" ] ,
		[ "super"        , "rezervisana_rec" ] ,
		[ "switch"       , "rezervisana_rec" ] ,
		[ "synchronized" , "rezervisana_rec" ] ,
		[ "this"         , "rezervisana_rec" ] ,
		[ "throw"        , "rezervisana_rec" ] ,
		[ "throws"       , "rezervisana_rec" ] ,
		[ "transient"    , "rezervisana_rec" ] ,
		[ "try"          , "rezervisana_rec" ] ,
		[ "var"          , "rezervisana_rec" ] ,
		[ "void"         , "rezervisana_rec" ] ,
		[ "volatile"     , "rezervisana_rec" ] ,
		[ "while"        , "rezervisana_rec" ] ,

		[ "Add"           , "specijalni_token" ] ,
		[ "List"          , "specijalni_token" ] ,
		[ "LocalDate"     , "specijalni_token" ] ,
		[ "LocalDateTime" , "specijalni_token" ] ,
		[ "Math"          , "specijalni_token" ] ,
		[ "Queue"         , "specijalni_token" ] ,
		[ "Stack"         , "specijalni_token" ] ,
		[ "String"        , "specijalni_token" ] ,
		[ "System"        , "specijalni_token" ] ,
		[ "ceil"          , "specijalni_token" ] ,
		[ "floor"         , "specijalni_token" ] ,
		[ "format"        , "specijalni_token" ] ,
		[ "getDayOfMonth" , "specijalni_token" ] ,
		[ "getMonthValue" , "specijalni_token" ] ,
		[ "getSecond"     , "specijalni_token" ] ,
		[ "java"          , "specijalni_token" ] ,
		[ "length"        , "specijalni_token" ] ,
		[ "now"           , "specijalni_token" ] ,
		[ "out"           , "specijalni_token" ] ,
		[ "printf"        , "specijalni_token" ] ,
		[ "string"        , "specijalni_token" ] ,
		[ "util"          , "specijalni_token" ] ,

	] );	

Java_parserSpecListe.set( 0 , Java_parserSpecLista_0 );

let Java_definicijaJezika = {

	naziv:                 "Java",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          C_lekserTokeni,
	maksDuzinaSpajanje:    3,
	parserPrepravaljanje:  C_parserPrepravljanje,
	parserTokeni:          C_parserTokeni,
	parserSpecListe:       Java_parserSpecListe,

};

let JavaScript_parserSpecListe = new Map();

	let JavaScript_parserSpecLista_0 = new Map( [

		[ "arguments"    , "rezervisana_rec" ] ,
		[ "await"        , "rezervisana_rec" ] ,
		[ "boolean"      , "rezervisana_rec" ] ,
		[ "break"        , "rezervisana_rec" ] ,
		[ "byte"         , "rezervisana_rec" ] ,
		[ "case"         , "rezervisana_rec" ] ,
		[ "catch"        , "rezervisana_rec" ] ,
		[ "char"         , "rezervisana_rec" ] ,
		[ "class"        , "rezervisana_rec" ] ,
		[ "const"        , "rezervisana_rec" ] ,
		[ "continue"     , "rezervisana_rec" ] ,
		[ "debugger"     , "rezervisana_rec" ] ,
		[ "default"      , "rezervisana_rec" ] ,
		[ "delete"       , "rezervisana_rec" ] ,
		[ "do"           , "rezervisana_rec" ] ,
		[ "double"       , "rezervisana_rec" ] ,
		[ "else"         , "rezervisana_rec" ] ,
		[ "enum"         , "rezervisana_rec" ] ,
		[ "eval"         , "rezervisana_rec" ] ,
		[ "export"       , "rezervisana_rec" ] ,
		[ "extends"      , "rezervisana_rec" ] ,
		[ "false"        , "rezervisana_rec" ] ,
		[ "final"        , "rezervisana_rec" ] ,
		[ "finally"      , "rezervisana_rec" ] ,
		[ "float"        , "rezervisana_rec" ] ,
		[ "for"          , "rezervisana_rec" ] ,
		[ "function"     , "rezervisana_rec" ] ,
		[ "goto"         , "rezervisana_rec" ] ,
		[ "if"           , "rezervisana_rec" ] ,
		[ "implements"   , "rezervisana_rec" ] ,
		[ "import"       , "rezervisana_rec" ] ,
		[ "in"           , "rezervisana_rec" ] ,
		[ "instanceof"   , "rezervisana_rec" ] ,
		[ "int"          , "rezervisana_rec" ] ,
		[ "interface"    , "rezervisana_rec" ] ,
		[ "let"          , "rezervisana_rec" ] ,
		[ "long"         , "rezervisana_rec" ] ,
		[ "native"       , "rezervisana_rec" ] ,
		[ "new"          , "rezervisana_rec" ] ,
		[ "null"         , "rezervisana_rec" ] ,
		[ "package"      , "rezervisana_rec" ] ,
		[ "private"      , "rezervisana_rec" ] ,
		[ "protected"    , "rezervisana_rec" ] ,
		[ "public"       , "rezervisana_rec" ] ,
		[ "return"       , "rezervisana_rec" ] ,
		[ "short"        , "rezervisana_rec" ] ,
		[ "static"       , "rezervisana_rec" ] ,
		[ "super"        , "rezervisana_rec" ] ,
		[ "switch"       , "rezervisana_rec" ] ,
		[ "synchronized" , "rezervisana_rec" ] ,
		[ "this"         , "rezervisana_rec" ] ,
		[ "throw"        , "rezervisana_rec" ] ,
		[ "throws"       , "rezervisana_rec" ] ,
		[ "transient"    , "rezervisana_rec" ] ,
		[ "true"         , "rezervisana_rec" ] ,
		[ "try"          , "rezervisana_rec" ] ,
		[ "typeof"       , "rezervisana_rec" ] ,
		[ "var"          , "rezervisana_rec" ] ,
		[ "void"         , "rezervisana_rec" ] ,
		[ "volatile"     , "rezervisana_rec" ] ,
		[ "while"        , "rezervisana_rec" ] ,
		[ "with"         , "rezervisana_rec" ] ,
		[ "yield"        , "rezervisana_rec" ] ,

		[ "Date"                   , "specijalni_token" ] ,
		[ "Promise"                , "specijalni_token" ] ,
		[ "all"                    , "specijalni_token" ] ,
		[ "async"                  , "specijalni_token" ] ,
		[ "console"                , "specijalni_token" ] ,
		[ "constructor"            , "specijalni_token" ] ,
		[ "document"               , "specijalni_token" ] ,
		[ "error"                  , "specijalni_token" ] ,
		[ "fetch"                  , "specijalni_token" ] ,
		[ "getElementById"         , "specijalni_token" ] ,
		[ "getElementsByClassName" , "specijalni_token" ] ,
		[ "getItem"                , "specijalni_token" ] ,
		[ "innerHTML"              , "specijalni_token" ] ,
		[ "innerText"              , "specijalni_token" ] ,
		[ "localStorage"           , "specijalni_token" ] ,
		[ "log"                    , "specijalni_token" ] ,
		[ "map"                    , "specijalni_token" ] ,
		[ "pop"                    , "specijalni_token" ] ,
		[ "push"                   , "specijalni_token" ] ,
		[ "reject"                 , "specijalni_token" ] ,
		[ "resolve"                , "specijalni_token" ] ,
		[ "sessionStorage"         , "specijalni_token" ] ,
		[ "setInterval"            , "specijalni_token" ] ,
		[ "setItem"                , "specijalni_token" ] ,
		[ "setTimeout"             , "specijalni_token" ] ,
		[ "shift"                  , "specijalni_token" ] ,
		[ "then"                   , "specijalni_token" ] ,

	] );

JavaScript_parserSpecListe.set( 0 , JavaScript_parserSpecLista_0 );

let JavaScript_definicijaJezika = {

	naziv:                 "JavaScript",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          C_lekserTokeni,
	maksDuzinaSpajanje:    3,
	parserPrepravaljanje:  C_parserPrepravljanje,
	parserTokeni:          C_parserTokeni,
	parserSpecListe:       JavaScript_parserSpecListe,

};

let HTML_lekserTokeni = new Map( [

	[ "<"    , "html_tag"       ] ,
	[ ">"    , "html_tag"       ] ,
	[ "/"    , "html_tag"       ] ,
	[ "!"    , "html_tag"       ] ,
	[ "-"    , "komentar"       ] ,
	[ "="    , "atribut_dodela" ] ,
	[ "\""   , ""               ] ,
	[ "\'"   , ""               ] ,
	[ "\`"   , ""               ] ,
	[ "</"   , "html_tag"       ] ,
	[ "/>"   , "html_tag"       ] ,
	[ "<!"   , "doctype"        ] ,
	[ "<!--" , "komentar"       ] ,
	[ "-->"  , "komentar"       ] ,

	[ "#"  , ""                 ] ,
	[ "@"  , ""                 ] ,
	[ ":"  , ""                 ] ,
	[ ";"  , "operator"         ] ,
	[ ","  , ""                 ] ,
	[ "."  , ""                 ] ,
	[ "*"  , ""                 ] ,
	[ "/*" , "komentar"         ] ,
	[ "*/" , "komentar"         ] ,
	[ "//" , "komentar"         ] ,

	[ "+"  , "operator"         ] ,
	[ "-"  , "operator"         ] ,
	[ "*"  , "operator"         ] ,
	[ "/"  , "operator"         ] ,
	[ "=>" , "operator"         ] ,
	[ "+=" , "operator"         ] ,
	[ "(" , "operator"          ] ,
	[ ")" , "operator"          ] ,
] );

let HTML_parserPrepravljanje = new Map( [

	[ 0  , [ true  , true  , "tekst"             ] ] ,
	[ 1  , [ true  , true  , "html_tag"          ] ] ,
	[ 2  , [ false , true  , "atribut_naziv"     ] ] ,
	[ 3  , [ true  , true  , "niska_apostrofi"   ] ] ,
	[ 4  , [ true  , true  , "niska_navodnici"   ] ] ,
	[ 5  , [ true  , true  , "komentar"          ] ] ,
	[ 7  , [ false , true  , "atribut_naziv"     ] ] , 
	[ 71 , [ true  , true  , "html_tag"          ] ] , 
	[ 8  , [ false , true  , "atribut_naziv"     ] ] , 
	[ 81 , [ true  , true  , "html_tag"          ] ] , 

	[ 10 , [ false , false , "tekst"             ] ] ,
	[ 11 , [ true  , true  , "komentar"          ] ] ,
	[ 12 , [ true  , true  , "komentar"          ] ] ,
	[ 13 , [ true  , true  , "niska_apostrofi"   ] ] ,
	[ 14 , [ true  , true  , "niska_navodnici"   ] ] ,
	[ 15 , [ true  , true  , "et_direktiva"      ] ] ,
	[ 16 , [ true  , true  , "id_naziv"          ] ] ,
	[ 17 , [ true  , true  , "klasa_naziv"       ] ] ,
	[ 18 , [ false , true  , "svojstvo_naziv"    ] ] ,
	[ 19 , [ false , true  , "svojstvo_vrednost" ] ] ,

	[ 20 , [ false , false , "identifikator"             ] ] ,
	[ 21 , [ true  , true  , "komentar"                  ] ] ,
	[ 22 , [ true  , true  , "komentar"                  ] ] ,
	[ 23 , [ true  , true  , "pretprocesorska_direktiva" ] ] ,
	[ 24 , [ true  , true  , "niska_apostrofi"           ] ] ,
	[ 25 , [ true  , true  , "niska_navodnici"           ] ] ,
	[ 26 , [ true  , true  , "niska_backtick"            ] ] ,

] );

let HTML_parserTokeni = new Map();

	let HTML_parserLista_0 = new Map( [

		[ "<"    , [ true  , false ,  1 , "html_tag" ] ] ,
		[ "</"   , [ true  , false ,  1 , "html_tag" ] ] ,
		[ "<!--" , [ true  , false ,  5 , "komentar" ] ] ,

	] );

	let HTML_parserLista_1 = new Map( [

		[ " "      , [ true  , true ,  2 , "white_space" ] ] ,
		[ "\t"     , [ true  , true ,  2 , "white_space" ] ] ,
		[ ">"      , [ false , true , -1 , "html_tag"    ] ] ,
		[ "/>"     , [ false , true , -1 , "html_tag"    ] ] ,
		[ "style"  , [ true  , true ,  7 , "html_tag"    ] ] ,
		[ "script" , [ true  , true ,  8 , "html_tag"    ] ] ,

	] );

	let HTML_parserLista_2 = new Map( [

		[ " "  , [ false , false , -1 , "white_space"     ] ] ,
		[ ">"  , [ false , true  , -1 , "html_tag"        ] ] ,
		[ "/>" , [ false , true  , -1 , "html_tag"        ] ] ,
		[ "="  , [ false , false , -1 , "atribut_dodela"  ] ] ,
		[ "\'" , [ true  , false ,  3 , "niska_apostrofi" ] ] ,
		[ "\"" , [ true  , false ,  4 , "niska_navodnici" ] ] ,

	] );

	let HTML_parserLista_3 = new Map( [

		[ "\'" , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let HTML_parserLista_4 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let HTML_parserLista_5 = new Map( [

		[ "-->" , [ false , true , -1 , "komentar" ] ] ,

	] );

	let HTML_parserLista_7 = new Map( [

		[ ">"  , [ true  , true  , 10 , "html_tag"        ] ] ,
		[ "="  , [ false , false , -1 , "atribut_dodela"  ] ] ,
		[ " "  , [ false , false , -1 , "white_space"     ] ] ,
		[ "\t" , [ false , false , -1 , "white_space"     ] ] ,
		[ "\'" , [ true  , false ,  3 , "niska_apostrofi" ] ] ,
		[ "\"" , [ true  , false ,  4 , "niska_navodnici" ] ] ,

	] );

	let HTML_parserLista_71 = new Map( [

		[ "style"  , [ true  , true ,  1 , "html_tag"    ] ] ,

	] );

	let HTML_parserLista_10 = new Map( [

		[ "/*"  , [ true  , false , 11 , "komentar"        ] ] ,
		[ "//"  , [ true  , false , 12 , "komentar"        ] ] ,
		[ "'"   , [ true  , false , 13 , "niska_apostrofi" ] ] ,
		[ "\""  , [ true  , false , 14 , "niska_navodnici" ] ] ,
		[ "@"   , [ true  , false , 15 , "et_direktiva"    ] ] ,
		[ "#"   , [ true  , false , 16 , "id_naziv"        ] ] ,
		[ "."   , [ true  , false , 17 , "klasa_naziv"     ] ] ,
		[ "{"   , [ true  , false , 18 , "blok_svojstva"   ] ] ,
		[ "*"   , [ false , false , -1 , "globalni"        ] ] ,
		[ "</"  , [ true  , true  , 71 , "html_tag"        ] ] ,

	] );

	let HTML_parserLista_11 = new Map( [

		[ "*/" , [ false , true  , -1 , "komentar"      ] ] ,
		[ "{"  , [ true  , false , 18 , "blok_svojstva" ] ] ,

	] );

	let HTML_parserLista_12 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let HTML_parserLista_13 = new Map( [

		[ "'"  , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let HTML_parserLista_14 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let HTML_parserLista_15 = new Map( [

		[ ";"  , [ false , true  , -1 , "operator"      ] ] ,
		[ "{"  , [ true  , true  , 18 , "blok_svojstva" ] ] ,
		[ "/*" , [ true  , false , 11 , "komentar"      ] ] ,
		[ "//" , [ true  , false , 12 , "komentar"      ] ] ,

	] );

	let HTML_parserLista_16 = new Map( [

		[ " "  , [ false , true  , -1 , "white_space"   ] ] ,
		[ "\t" , [ false , true  , -1 , "white_space"   ] ] ,
		[ ","  , [ false , true  , -1 , "separator"     ] ] ,
		[ "{"  , [ true  , true  , 18 , "blok_svojstva" ] ] ,
		[ "/*" , [ true  , false , 11 , "komentar"      ] ] ,
		[ "//" , [ true  , false , 12 , "komentar"      ] ] ,

	] );

	let HTML_parserLista_17 = new Map( [

		[ " "  , [ false , true  , -1 , "white_space"   ] ] ,
		[ "\t" , [ false , true  , -1 , "white_space"   ] ] ,
		[ ","  , [ false , true  , -1 , "separator"     ] ] ,
		[ "{"  , [ true  , true  , 18 , "blok_svojstva" ] ] ,
		[ "/*" , [ true  , false , 11 , "komentar"      ] ] ,
		[ "//" , [ true  , false , 12 , "komentar"      ] ] ,

	] );

	let HTML_parserLista_18 = new Map( [

		[ "}"  , [ false , true  , -1 , "blok_svojstva"  ] ] ,
		[ ":"  , [ true  , false , 19 , "atribut_dodela" ] ] ,
		[ "/*" , [ true  , false , 11 , "komentar"       ] ] ,
		[ "//" , [ true  , false , 12 , "komentar"       ] ] ,
		[ "#"  , [ true  , false , 16 , "id_naziv"       ] ] ,
		[ "."  , [ true  , false , 17 , "klasa_naziv"    ] ] ,

	] );

	let HTML_parserLista_19 = new Map( [

		[ ";"  , [ false , true  , -1 , "operator" ] ] ,
		[ "/*" , [ true  , false , 11 , "komentar" ] ] ,
		[ "//" , [ true  , false , 12 , "komentar" ] ] ,

	] );

	let HTML_parserLista_8 = new Map( [

		[ ">"  , [ true  , true  , 20 , "html_tag"        ] ] ,
		[ "="  , [ false , false , -1 , "atribut_dodela"  ] ] ,
		[ " "  , [ false , false , -1 , "white_space"     ] ] ,
		[ "\t" , [ false , false , -1 , "white_space"     ] ] ,
		[ "\'" , [ true  , false ,  3 , "niska_apostrofi" ] ] ,
		[ "\"" , [ true  , false ,  4 , "niska_navodnici" ] ] ,

	] );

	let HTML_parserLista_81 = new Map( [

		[ "script"  , [ true  , true ,  1 , "html_tag"    ] ] ,

	] );

	let HTML_parserLista_20 = new Map( [

		[ "/*" , [ true , false , 21 , "komentar"                  ] ] ,
		[ "//" , [ true , false , 22 , "komentar"                  ] ] ,
		[ "#"  , [ true , false , 23 , "pretprocesorska_direktiva" ] ] ,
		[ "\"" , [ true , false , 24 , "niska_navodnici"           ] ] ,
		[ "'"  , [ true , false , 25 , "niska_apostrofi"           ] ] ,
		[ "`"  , [ true , false , 26 , "niska_backtick"            ] ] ,
		[ "</" , [ true , true  , 81 , "html_tag"                  ] ] ,

	] );

	let HTML_parserLista_21 = new Map( [

		[ "*/" , [ false , true , -1 , "komentar" ] ] ,

	] );

	let HTML_parserLista_22 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let HTML_parserLista_23 = new Map( [

		[ ">"  , [ false , true , -1 , "pretprocesorska_direktiva" ] ] ,
		[ "\n" , [ false , true , -1 , "pretprocesorska_direktiva" ] ] ,

	] );

	let HTML_parserLista_24 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let HTML_parserLista_25 = new Map( [

		[ "'"  , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let HTML_parserLista_26 = new Map( [

		[ "`"  , [ false , true , -1 , "niska_backtick" ] ] ,

	] );

HTML_parserTokeni.set( 0  , HTML_parserLista_0 )
                 .set( 1  , HTML_parserLista_1 )
                 .set( 2  , HTML_parserLista_2 )
                 .set( 3  , HTML_parserLista_3 )
                 .set( 4  , HTML_parserLista_4 )
                 .set( 5  , HTML_parserLista_5 )

                 .set( 7  , HTML_parserLista_7  )
                 .set( 71 , HTML_parserLista_71 )
                 .set( 10 , HTML_parserLista_10 )
                 .set( 11 , HTML_parserLista_11 )
                 .set( 12 , HTML_parserLista_12 )
                 .set( 13 , HTML_parserLista_13 )
                 .set( 14 , HTML_parserLista_14 )
                 .set( 15 , HTML_parserLista_15 )
                 .set( 16 , HTML_parserLista_16 )
                 .set( 17 , HTML_parserLista_17 )
                 .set( 18 , HTML_parserLista_18 )
                 .set( 19 , HTML_parserLista_19 )

                 .set( 8  , HTML_parserLista_8  )
                 .set( 81 , HTML_parserLista_81 )
                 .set( 20 , HTML_parserLista_20 )
                 .set( 21 , HTML_parserLista_21 )
                 .set( 22 , HTML_parserLista_22 )
                 .set( 23 , HTML_parserLista_23 )
                 .set( 24 , HTML_parserLista_24 )
                 .set( 25 , HTML_parserLista_25 )
                 .set( 26 , HTML_parserLista_26 )

let HTML_parserSpecListe = new Map();

HTML_parserSpecListe.set( 10 , CSS_parserSpecLista_0        );
HTML_parserSpecListe.set( 20 , JavaScript_parserSpecLista_0 );

let HTML_definicijaJezika = {

	naziv:                 "HTML",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          HTML_lekserTokeni,
	maksDuzinaSpajanje:    4,
	parserPrepravaljanje:  HTML_parserPrepravljanje,
	parserTokeni:          HTML_parserTokeni,
	parserSpecListe:       HTML_parserSpecListe,

}

let XML_definicijaJezika = {

	naziv:                 "XML",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          HTML_lekserTokeni,
	maksDuzinaSpajanje:    4,
	parserPrepravaljanje:  HTML_parserPrepravljanje,
	parserTokeni:          HTML_parserTokeni,
	parserSpecListe:       HTML_parserSpecListe,

}

let SQL_lekserTokeni = new Map( [

	[ "--" , "komentar" ] ,
	[ ";"  , ""         ] ,
	[ "-"  , ""         ] ,
	[ "("  , ""         ] ,
	[ ")"  , ""         ] ,
	[ ","  , ""         ] ,
	[ "\"" , ""         ] ,
	[ "\'" , ""         ] ,
	[ "\`" , ""         ] ,

] );

let SQL_parserPrepravljanje = new Map( [

	[ 0 , [ false , false , "tekst"           ] ] ,
	[ 1 , [ true  , true  , "komentar"        ] ] ,
	[ 2 , [ true  , true  , "niska_apostrofi" ] ] ,
	[ 3 , [ true  , true  , "niska_navodnici" ] ] ,
	[ 4 , [ true  , true  , "niska_backtick"  ] ] ,

] );

let SQL_parserTokeni = new Map();

	let SQL_parserLista_0 = new Map( [

		[ "--" , [ true , false , 1 , "komentar"        ] ] ,
		[ "\"" , [ true , false , 2 , "niska_navodnici" ] ] ,
		[ "\'" , [ true , false , 3 , "niska_apostrofi" ] ] ,
		[ "\`" , [ true , false , 4 , "niska_backtick"  ] ] ,

	] );

	let SQL_parserLista_1 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let SQL_parserLista_2 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let SQL_parserLista_3 = new Map( [

		[ "\'" , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let SQL_parserLista_4 = new Map( [

		[ "\`" , [ false , true , -1 , "niska_backtick" ] ] ,

	] );

SQL_parserTokeni.set( 0, SQL_parserLista_0 )
                .set( 1, SQL_parserLista_1 )
                .set( 2, SQL_parserLista_2 )
                .set( 3, SQL_parserLista_3 )
                .set( 4, SQL_parserLista_4 )

let SQL_parserSpecListe = new Map();

	let SQL_parserSpecLista_0 = new Map( [

		[ "ADD"            , "rezervisana_rec" ] ,
		[ "AFTER"          , "rezervisana_rec" ] ,
		[ "ALTER"          , "rezervisana_rec" ] ,
		[ "AS"             , "rezervisana_rec" ] ,
		[ "ASC"            , "rezervisana_rec" ] ,
		[ "AUTO_INCREMENT" , "rezervisana_rec" ] ,
		[ "BY"             , "rezervisana_rec" ] ,
		[ "CREATE"         , "rezervisana_rec" ] ,
		[ "DATABASE"       , "rezervisana_rec" ] ,
		[ "DELETE"         , "rezervisana_rec" ] ,
		[ "FOREIGN"        , "rezervisana_rec" ] ,
		[ "FROM"           , "rezervisana_rec" ] ,
		[ "INSERT"         , "rezervisana_rec" ] ,
		[ "INTO"           , "rezervisana_rec" ] ,
		[ "KEY"            , "rezervisana_rec" ] ,
		[ "NOT"            , "rezervisana_rec" ] ,
		[ "NULL"           , "rezervisana_rec" ] ,
		[ "ORDER"          , "rezervisana_rec" ] ,
		[ "PRIMARY"        , "rezervisana_rec" ] ,
		[ "REFERENCES"     , "rezervisana_rec" ] ,
		[ "SELECT"         , "rezervisana_rec" ] ,
		[ "SET"            , "rezervisana_rec" ] ,
		[ "TABLE"          , "rezervisana_rec" ] ,
		[ "UPDATE"         , "rezervisana_rec" ] ,
		[ "USE"            , "rezervisana_rec" ] ,
		[ "VALUES"         , "rezervisana_rec" ] ,
		[ "WHERE"          , "rezervisana_rec" ] ,
		[ "add"            , "rezervisana_rec" ] ,
		[ "after"          , "rezervisana_rec" ] ,
		[ "alter"          , "rezervisana_rec" ] ,
		[ "as"             , "rezervisana_rec" ] ,
		[ "asc"            , "rezervisana_rec" ] ,
		[ "auto_increment" , "rezervisana_rec" ] ,
		[ "by"             , "rezervisana_rec" ] ,
		[ "create"         , "rezervisana_rec" ] ,
		[ "database"       , "rezervisana_rec" ] ,
		[ "delete"         , "rezervisana_rec" ] ,
		[ "foreign"        , "rezervisana_rec" ] ,
		[ "from"           , "rezervisana_rec" ] ,
		[ "insert"         , "rezervisana_rec" ] ,
		[ "into"           , "rezervisana_rec" ] ,
		[ "key"            , "rezervisana_rec" ] ,
		[ "not"            , "rezervisana_rec" ] ,
		[ "null"           , "rezervisana_rec" ] ,
		[ "order"          , "rezervisana_rec" ] ,
		[ "primary"        , "rezervisana_rec" ] ,
		[ "references"     , "rezervisana_rec" ] ,
		[ "select"         , "rezervisana_rec" ] ,
		[ "set"            , "rezervisana_rec" ] ,
		[ "table"          , "rezervisana_rec" ] ,
		[ "update"         , "rezervisana_rec" ] ,
		[ "use"            , "rezervisana_rec" ] ,
		[ "values"         , "rezervisana_rec" ] ,
		[ "where"          , "rezervisana_rec" ] ,

		[ "where"    , "tip_promenljive" ] ,
		[ "datetime" , "tip_promenljive" ] ,
		[ "double"   , "tip_promenljive" ] ,
		[ "int"      , "tip_promenljive" ] ,
		[ "varchar"  , "tip_promenljive" ] ,

	] );

SQL_parserSpecListe.set( 0 , SQL_parserSpecLista_0 );

let SQL_definicijaJezika = {

	naziv:                 "SQL",
	defaultKlasa:          "tekst",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          SQL_lekserTokeni,
	maksDuzinaSpajanje:    2,
	parserPrepravaljanje:  SQL_parserPrepravljanje,
	parserTokeni:          SQL_parserTokeni,
	parserSpecListe:       SQL_parserSpecListe,

};

let Python_lekserTokeni = new Map( [

	[ "#"  , "" ] ,
	[ "("  , "" ] ,
	[ "["  , "" ] ,
	[ "]"  , "" ] ,
	[ "\"" , "" ] ,
	[ "\'" , "" ] ,
	[ "\`" , "" ] ,
	[ ":"  , "" ] ,
	[ "+"  , "" ] ,
	[ "-"  , "" ] ,
	[ "*"  , "" ] ,
	[ "/"  , "" ] ,
	[ "="  , "" ] ,
	[ ","  , "" ] ,

] );

let Python_parserPrepravljanje = new Map( [

	[ 0 , [ false , false , "identifikator"   ] ] ,
	[ 1 , [ true  , true  , "komentar"        ] ] ,
	[ 2 , [ true  , true  , "niska_apostrofi" ] ] ,
	[ 3 , [ true  , true  , "niska_navodnici" ] ] ,
	[ 4 , [ true  , true  , "niska_backtick"  ] ] ,

] );

let Python_parserTokeni = new Map();

	let Python_parserLista_0 = new Map( [

		[ "#"  , [ true , false , 1 , "komentar"        ] ] ,
		[ "\"" , [ true , false , 2 , "niska_navodnici" ] ] ,
		[ "\'" , [ true , false , 3 , "niska_apostrofi" ] ] ,
		[ "\`" , [ true , false , 4 , "niska_backtick"  ] ] ,

		[ "=" , [ false , false , -1 , "operator"              ] ] ,
		[ "+" , [ false , false , -1 , "operator"              ] ] ,
		[ "-" , [ false , false , -1 , "operator"              ] ] ,
		[ "/" , [ false , false , -1 , "operator"              ] ] ,
		[ "*" , [ false , false , -1 , "operator"              ] ] ,
		[ "," , [ false , false , -1 , "operator"              ] ] ,
		[ "(" , [ false , false , -1 , "otvorena_zagrada"      ] ] ,
		[ ")" , [ false , false , -1 , "zatvorena_zagrada"     ] ] ,
		[ "[" , [ false , false , -1 , "otvorena_zagrada_niz"  ] ] ,
		[ "]" , [ false , false , -1 , "zatvorena_zagrada_niz" ] ] ,

	] );

	let Python_parserLista_1 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let Python_parserLista_2 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let Python_parserLista_3 = new Map( [

		[ "\'" , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let Python_parserLista_4 = new Map( [

		[ "\`" , [ false , true , -1 , "niska_backtick" ] ] ,

	] );

Python_parserTokeni.set( 0, Python_parserLista_0 )
                   .set( 1, Python_parserLista_1 )
                   .set( 2, Python_parserLista_2 )
                   .set( 3, Python_parserLista_3 )
                   .set( 4, Python_parserLista_4 )

let Python_parserSpecListe = new Map();

	let Python_parserSpecLista_0 = new Map( [

		[ "False"    , "rezervisana_rec" ] ,
		[ "None"     , "rezervisana_rec" ] ,
		[ "True"     , "rezervisana_rec" ] ,
		[ "and"      , "rezervisana_rec" ] ,
		[ "as"       , "rezervisana_rec" ] ,
		[ "assert"   , "rezervisana_rec" ] ,
		[ "async"    , "rezervisana_rec" ] ,
		[ "await"    , "rezervisana_rec" ] ,
		[ "break"    , "rezervisana_rec" ] ,
		[ "class"    , "rezervisana_rec" ] ,
		[ "continue" , "rezervisana_rec" ] ,
		[ "def"      , "rezervisana_rec" ] ,
		[ "del"      , "rezervisana_rec" ] ,
		[ "elif"     , "rezervisana_rec" ] ,
		[ "else"     , "rezervisana_rec" ] ,
		[ "except"   , "rezervisana_rec" ] ,
		[ "finally"  , "rezervisana_rec" ] ,
		[ "for"      , "rezervisana_rec" ] ,
		[ "from"     , "rezervisana_rec" ] ,
		[ "global"   , "rezervisana_rec" ] ,
		[ "if"       , "rezervisana_rec" ] ,
		[ "import"   , "rezervisana_rec" ] ,
		[ "in"       , "rezervisana_rec" ] ,
		[ "is"       , "rezervisana_rec" ] ,
		[ "lambda"   , "rezervisana_rec" ] ,
		[ "nonlocal" , "rezervisana_rec" ] ,
		[ "not"      , "rezervisana_rec" ] ,
		[ "or"       , "rezervisana_rec" ] ,
		[ "pass"     , "rezervisana_rec" ] ,
		[ "raise"    , "rezervisana_rec" ] ,
		[ "return"   , "rezervisana_rec" ] ,
		[ "try"      , "rezervisana_rec" ] ,
		[ "while"    , "rezervisana_rec" ] ,
		[ "with"     , "rezervisana_rec" ] ,
		[ "yield"    , "rezervisana_rec" ] ,

	] );

Python_parserSpecListe.set( 0 , Python_parserSpecLista_0 );

let Python_definicijaJezika = {

	naziv:                 "Python",
	defaultKlasa:          "identifikator",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          Python_lekserTokeni,
	maksDuzinaSpajanje:    1,
	parserPrepravaljanje:  Python_parserPrepravljanje,
	parserTokeni:          Python_parserTokeni,
	parserSpecListe:       Python_parserSpecListe,

}

let PHP_lekserTokeni = new Map( [

	[ "<"  , "operator" ] ,
	[ "?"  , "operator" ] ,
	[ "!"  , "komentar" ] ,
	[ ">"  , "operator" ] ,
	[ "/"  , "komentar" ] ,
	[ "*"  , "komentar" ] ,
	[ "+"  , "operator" ] ,
	[ "-"  , "operator" ] ,
	[ "="  , "operator" ] ,
	[ "{"  , ""         ] ,
	[ "}"  , ""         ] ,
	[ "("  , ""         ] ,
	[ ")"  , ""         ] ,
	[ "["  , ""         ] ,
	[ "]"  , ""         ] ,
	[ ";"  , ""         ] ,
	[ ","  , ""         ] ,
	[ "."  , ""         ] ,
	[ "\"" , ""         ] ,
	[ "\\" , ""         ] ,
	[ "\n" , ""         ] ,
	[ "\"" , ""         ] ,
	[ "\'" , ""         ] ,
	[ "\`" , ""         ] ,
	[ "^"  , ""         ] ,
	[ "|"  , ""         ] ,
	[ "~"  , ""         ] ,

	[ "</" , "html_tag" ] ,
	[ "/>" , "html_tag" ] ,
	[ "<!" , "komentar" ] ,
	[ "->" , "komentar" ] ,

	[ "<?" , "php_blok" ] ,
	[ "?>" , "php_blok" ] ,

	[ "/*" , "komentar" ] ,
	[ "*/" , "komentar" ] ,
	[ "//" , "komentar" ] ,

	[ "!=" , "operator" ] ,
	[ "&&" , "operator" ] ,
	[ "++" , "operator" ] ,
	[ "--" , "operator" ] ,
	[ "<=" , "operator" ] ,
	[ "==" , "operator" ] ,
	[ ">=" , "operator" ] ,

] );

let PHP_parserPrepravljanje = new Map( [

	[ 0 , [ true  , false , "tekst"           ] ] ,
	[ 1 , [ true  , true  , "html_tag"        ] ] ,
	[ 2 , [ false , true  , "atribut_naziv"   ] ] ,
	[ 3 , [ true  , true  , "niska_apostrofi" ] ] ,
	[ 4 , [ true  , true  , "niska_navodnici" ] ] ,
	[ 5 , [ true  , true  , "komentar"        ] ] ,

	[ 10 , [ false , true , "identifikator"   ] ] ,
	[ 11 , [ true  , true , "komentar"        ] ] ,
	[ 12 , [ true  , true , "komentar"        ] ] ,
	[ 13 , [ true  , true , "niska_apostrofi" ] ] ,
	[ 14 , [ true  , true , "niska_navodnici" ] ] ,
	[ 15 , [ true  , true , "niska_backtick"  ] ] ,

] );

let PHP_parserTokeni = new Map();

	let PHP_parserLista_0 = new Map( [

		[ "<"  , [ true , false ,  1 , "html_tag" ] ] ,
		[ "</" , [ true , false ,  1 , "html_tag" ] ] ,
		[ "<!" , [ true , false ,  5 , "komentar" ] ] ,
		[ "<?" , [ true , false , 10 , "php_blok" ] ] ,

	] );

	let PHP_parserLista_1 = new Map( [

		[ " "  , [ true  , true ,  2 , "white_space" ] ] ,
		[ "\t" , [ true  , true ,  2 , "white_space" ] ] ,
		[ ">"  , [ false , true , -1 , "html_tag"    ] ] ,
		[ "/>" , [ false , true , -1 , "html_tag"    ] ] ,

	] );

	let PHP_parserLista_2 = new Map( [

		[ " "  , [ false , false , -1 , "white_space"     ] ] ,
		[ ">"  , [ false , true  , -1 , "html_tag"        ] ] ,
		[ "/>" , [ false , true  , -1 , "html_tag"        ] ] ,
		[ "="  , [ false , false , -1 , "atribut_dodela"  ] ] ,
		[ "\'" , [ true  , false ,  3 , "niska_apostrofi" ] ] ,
		[ "\"" , [ true  , false ,  4 , "niska_navodnici" ] ] ,

	] );

	let PHP_parserLista_3 = new Map( [

		[ "\'" , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let PHP_parserLista_4 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let PHP_parserLista_5 = new Map( [

		[ "->" , [ false , true , -1 , "komentar" ] ] ,
		[ ">"  , [ false , true , -1 , "komentar" ] ] ,

	] );

	let PHP_parserLista_10 = new Map( [

		[ "/*" , [ true  , false , 11, "komentar"          ] ] ,
		[ "//" , [ true  , false , 12, "komentar"          ] ] ,
		[ "\"" , [ true  , false , 13, "niska_navodnici"   ] ] ,
		[ "'"  , [ true  , false , 14, "niska_apostrofi"   ] ] ,
		[ "`"  , [ true  , false , 15, "niska_backtick"    ] ] ,
		[ "?>" , [ false , true  , -1, "php_blok"          ] ] ,

	] );

	let PHP_parserLista_11 = new Map( [

		[ "*/" , [ false , true , -1 , "komentar" ] ] ,

	] );

	let PHP_parserLista_12 = new Map( [

		[ "\n" , [ false , true , -1 , "white_space" ] ] ,

	] );

	let PHP_parserLista_13 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let PHP_parserLista_14 = new Map( [

		[ "'"  , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let PHP_parserLista_15 = new Map( [

		[ "`"  , [ false , true , -1 , "niska_backtick" ] ] ,

	] );

PHP_parserTokeni.set( 0 , PHP_parserLista_0 )
                .set( 1 , PHP_parserLista_1 )
                .set( 2 , PHP_parserLista_2 )
                .set( 3 , PHP_parserLista_3 )
                .set( 4 , PHP_parserLista_4 )
                .set( 5 , PHP_parserLista_5 )

                .set( 10 , PHP_parserLista_10 )
                .set( 11 , PHP_parserLista_11 )
                .set( 12 , PHP_parserLista_12 )
                .set( 13 , PHP_parserLista_13 )
                .set( 14 , PHP_parserLista_14 )
                .set( 15 , PHP_parserLista_15 )

let PHP_parserSpecListe = new Map();

	let PHP_parserSpecLista_10 = new Map( [

		[ "__halt_compiler" , "rezervisana_rec" ] ,
		[ "abstract"        , "rezervisana_rec" ] ,
		[ "and"             , "rezervisana_rec" ] ,
		[ "array"           , "rezervisana_rec" ] ,
		[ "as"              , "rezervisana_rec" ] ,
		[ "break"           , "rezervisana_rec" ] ,
		[ "callable"        , "rezervisana_rec" ] ,
		[ "case"            , "rezervisana_rec" ] ,
		[ "catch"           , "rezervisana_rec" ] ,
		[ "class"           , "rezervisana_rec" ] ,
		[ "clone"           , "rezervisana_rec" ] ,
		[ "const"           , "rezervisana_rec" ] ,
		[ "continue"        , "rezervisana_rec" ] ,
		[ "declare"         , "rezervisana_rec" ] ,
		[ "default"         , "rezervisana_rec" ] ,
		[ "die"             , "rezervisana_rec" ] ,
		[ "do"              , "rezervisana_rec" ] ,
		[ "echo"            , "rezervisana_rec" ] ,
		[ "else"            , "rezervisana_rec" ] ,
		[ "elseif"          , "rezervisana_rec" ] ,
		[ "empty"           , "rezervisana_rec" ] ,
		[ "enddeclare"      , "rezervisana_rec" ] ,
		[ "endfor"          , "rezervisana_rec" ] ,
		[ "endforeach"      , "rezervisana_rec" ] ,
		[ "endif"           , "rezervisana_rec" ] ,
		[ "endswitch"       , "rezervisana_rec" ] ,
		[ "endwhile"        , "rezervisana_rec" ] ,
		[ "eval"            , "rezervisana_rec" ] ,
		[ "exit"            , "rezervisana_rec" ] ,
		[ "extends"         , "rezervisana_rec" ] ,
		[ "final"           , "rezervisana_rec" ] ,
		[ "finally"         , "rezervisana_rec" ] ,
		[ "fn"              , "rezervisana_rec" ] ,
		[ "for"             , "rezervisana_rec" ] ,
		[ "foreach"         , "rezervisana_rec" ] ,
		[ "function"        , "rezervisana_rec" ] ,
		[ "global"          , "rezervisana_rec" ] ,
		[ "goto"            , "rezervisana_rec" ] ,
		[ "if"              , "rezervisana_rec" ] ,
		[ "implements"      , "rezervisana_rec" ] ,
		[ "include"         , "rezervisana_rec" ] ,
		[ "include_once"    , "rezervisana_rec" ] ,
		[ "instanceof"      , "rezervisana_rec" ] ,
		[ "insteadof"       , "rezervisana_rec" ] ,
		[ "interface"       , "rezervisana_rec" ] ,
		[ "isset"           , "rezervisana_rec" ] ,
		[ "list"            , "rezervisana_rec" ] ,
		[ "match"           , "rezervisana_rec" ] ,
		[ "namespace"       , "rezervisana_rec" ] ,
		[ "new"             , "rezervisana_rec" ] ,
		[ "or"              , "rezervisana_rec" ] ,
		[ "print"           , "rezervisana_rec" ] ,
		[ "private"         , "rezervisana_rec" ] ,
		[ "protected"       , "rezervisana_rec" ] ,
		[ "public"          , "rezervisana_rec" ] ,
		[ "require"         , "rezervisana_rec" ] ,
		[ "require_once"    , "rezervisana_rec" ] ,
		[ "return"          , "rezervisana_rec" ] ,
		[ "static"          , "rezervisana_rec" ] ,
		[ "switch"          , "rezervisana_rec" ] ,
		[ "throw"           , "rezervisana_rec" ] ,
		[ "trait"           , "rezervisana_rec" ] ,
		[ "try"             , "rezervisana_rec" ] ,
		[ "unset"           , "rezervisana_rec" ] ,
		[ "use"             , "rezervisana_rec" ] ,
		[ "var"             , "rezervisana_rec" ] ,
		[ "while"           , "rezervisana_rec" ] ,
		[ "xor"             , "rezervisana_rec" ] ,
		[ "yield"           , "rezervisana_rec" ] ,
		[ "yield from"      , "rezervisana_rec" ] ,

		[ "$_COOKIE"                  , "specijalni_token" ] ,
		[ "$_GET"                     , "specijalni_token" ] ,
		[ "$_POST"                    , "specijalni_token" ] ,
		[ "$_SERVER"                  , "specijalni_token" ] ,
		[ "$_SESSION"                 , "specijalni_token" ] ,
		[ "$this"                     , "specijalni_token" ] ,
		[ "__construct"               , "specijalni_token" ] ,
		[ "abs"                       , "specijalni_token" ] ,
		[ "exit"                      , "specijalni_token" ] ,
		[ "fclose"                    , "specijalni_token" ] ,
		[ "header"                    , "specijalni_token" ] ,
		[ "htmlentities"              , "specijalni_token" ] ,
		[ "isset"                     , "specijalni_token" ] ,
		[ "json_encode"               , "specijalni_token" ] ,
		[ "mysqli_close"              , "specijalni_token" ] ,
		[ "mysqli_connect"            , "specijalni_token" ] ,
		[ "mysqli_fetch_assoc"        , "specijalni_token" ] ,
		[ "mysqli_num_rows"           , "specijalni_token" ] ,
		[ "mysqli_query"              , "specijalni_token" ] ,
		[ "mysqli_real_escape_string" , "specijalni_token" ] ,
		[ "password_hash"             , "specijalni_token" ] ,
		[ "pregmatch"                 , "specijalni_token" ] ,
		[ "rand"                      , "specijalni_token" ] ,
		[ "session_start"             , "specijalni_token" ] ,
		[ "set_cookie"                , "specijalni_token" ] ,
		[ "sqrt"                      , "specijalni_token" ] ,
		[ "str_replace"               , "specijalni_token" ] ,
		[ "strlen"                    , "specijalni_token" ] ,
		[ "trim"                      , "specijalni_token" ] ,
		[ "unset"                     , "specijalni_token" ] ,

		[ "php"                       , "php_blok"         ] ,

	] );

PHP_parserSpecListe.set( 10 , PHP_parserSpecLista_10 );

let PHP_definicijaJezika = {

	naziv:                 "PHP",
	defaultKlasa:          "tekst",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          PHP_lekserTokeni,
	maksDuzinaSpajanje:    2,
	parserPrepravaljanje:  PHP_parserPrepravljanje,
	parserTokeni:          PHP_parserTokeni,
	parserSpecListe:       PHP_parserSpecListe,

};

let JSON_lekserTokeni = new Map( [

	[ ":" ,  "" ] ,
	[ "[" ,  "" ] ,
	[ "]" ,  "" ] ,
	[ "," ,  "" ] ,
	[ "\"" , "" ] ,
	[ "\'" , "" ] ,
	[ "\`" , "" ] ,

] );

let JSON_parserPrepravljanje = new Map( [

	[ 0 , [ false , false , "tekst"             ] ] ,
	[ 1 , [ false , true  , "svojstvo_naziv"    ] ] ,
	[ 2 , [ false , false , "svojstvo_vrednost" ] ] ,
	[ 3 , [ true  , true  , "niska_apostrofi"   ] ] ,
	[ 4 , [ true  , true  , "niska_navodnici"   ] ] ,
	[ 5 , [ true  , true  , "niska_backtick"    ] ] ,

] );

let JSON_parserTokeni = new Map();

	let JSON_parserLista_0 = new Map( [

		[ "{"  , [ true , false , 1 , "operator"        ] ] ,
		[ "\"" , [ true , false , 3 , "niska_navodnici" ] ] ,
		[ "\'" , [ true , false , 4 , "niska_apostrofi" ] ] ,
		[ "\`" , [ true , false , 5 , "niska_backtick"  ] ] ,

	] );

	let JSON_parserLista_1 = new Map( [

		[ ":" , [ true  , false ,  2 , "svojstvo_dodela"   ] ] ,
		[ "}" , [ false , true  , -1 , "operator         " ] ] ,

	] );

	let JSON_parserLista_2 = new Map( [

		[ "{"  , [ true  , false ,  1 , "operator"        ] ] ,
		[ "\"" , [ true  , false ,  3 , "niska_navodnici" ] ] ,
		[ "\'" , [ true  , false ,  4 , "niska_apostrofi" ] ] ,
		[ "\`" , [ true  , false ,  5 , "niska_backtick"  ] ] ,
		[ ","  , [ false , true  , -1 , "operator"        ] ] ,
		[ "}"  , [ false , true  , -1 , "operator"        ] ] ,

	] );

	let JSON_parserLista_3 = new Map( [

		[ "\"" , [ false , true , -1 , "niska_navodnici" ] ] ,

	] );

	let JSON_parserLista_4 = new Map( [

		[ "\'" , [ false , true , -1 , "niska_apostrofi" ] ] ,

	] );

	let JSON_parserLista_5 = new Map( [

		[ "\`" , [ false , true , -1 , "niska_backtick" ] ] ,

	] );

JSON_parserTokeni.set( 0 , JSON_parserLista_0 )
                 .set( 1 , JSON_parserLista_1 )
                 .set( 2 , JSON_parserLista_2 )
                 .set( 3 , JSON_parserLista_3 )
                 .set( 4 , JSON_parserLista_4 )
                 .set( 5 , JSON_parserLista_5 )

let JSON_parserSpecListe = new Map();

let JSON_definicijaJezika = {

	naziv:                 "JSON",
	defaultKlasa:          "tekst",
	lekser:                lekserOpsti,
	parser:                parserOpsti,
	lekserTokeni:          JSON_lekserTokeni,
	maksDuzinaSpajanje:    1,
	parserPrepravaljanje:  JSON_parserPrepravljanje,
	parserTokeni:          JSON_parserTokeni,
	parserSpecListe:       JSON_parserSpecListe,

};

let Assembler_regexRastavljanje = /(\,|\n| |0x\d+|^\d*\.\d+|^\d+)/g;

let Assembler_listaRegex = [
	[  /0x\d+/g     ,  "assembler_adresa"    ,  true  , false  ]  ,
	[  /\,| /g      ,  "separator"           ,  true  , false  ]  ,
	[  /\d*\.\d+/g  ,  "decimalna_vrednost"  ,  true  , false  ]  ,
	[  /\d+/g       ,  "brojcana_vrednost"   ,  true  , false  ]  ,
];

let Assembler_listaParser = [

];

let Assembler_naredbe = [
	"acc",
	"add",
	"div",
	"jnc",
	"mov",
];

let Assembler_registri = [
	"R1",
	"R2",
	"R3",
];

let Assembler_specijalneListe = [
	[ 
		[  Assembler_naredbe   ,  "assembler_naredba"   ,  -1  ]  ,
		[  Assembler_registri  ,  "assembler_registar"  ,  -1  ]  ,
	]
];

let Assembler_definicijaJezika = {
	naziv:              "Assembler",
	lekser:             lekserRegex,
	parser:             parserRegex,
	regexRastavljanje:  Assembler_regexRastavljanje,
	listaRegex:         Assembler_listaRegex,
	listaParser:        Assembler_listaParser,
	listeSpec:          Assembler_specijalneListe
}

let Markup_regexRastavljanje = /(######.+?\n|#####.+?\n|####.+?\n|###.+?\n|##.+?\n|#.+?\n|\*[\s\S]*?\*\*)/g;

let Markup_listaRegex = [

	[ /(######.+?\n)/g    , "markup_naslov_h6" , true , false ] ,
	[ /(#####.+?\n)/g     , "markup_naslov_h5" , true , false ] ,
	[ /(####.+?\n)/g      , "markup_naslov_h4" , true , false ] ,
	[ /(###.+?\n)/g       , "markup_naslov_h3" , true , false ] ,
	[ /(##.+?\n)/g        , "markup_naslov_h2" , true , false ] ,
	[ /(#.+?\n)/g         , "markup_naslov_h1" , true , false ] ,
	[ /(\*[\s\S]*?\*\*)/g , "markup_lista"     , true , false ] ,

];

let Markup_listaParser = [

];

let Markup_specijalneListe = [

];

let Markup_definicijaJezika = {

	naziv:              "Markup",
	lekser:             lekserRegex,
	parser:             parserRegex,
	regexRastavljanje:  Markup_regexRastavljanje,
	listaRegex:         Markup_listaRegex,
	listaParser:        Markup_listaParser,
	listeSpec:          Markup_specijalneListe

}

let RegEx_regexRastavljanje = /(\/\(|\)\/|\)\/g|\)\/gm|\\.{1}|\{.*?\}|\+|\?|\*|\\w|\\W|\\b|\\B\\c|\\C|\\s|\\S|\\d|\\D|\||\[|\]|\(|\))/g;

let RegEx_listaRegex = [

	[ /\/\(/g                                   , "regex_pocetak"       , true , false ] ,
	[ /\)\/|\)\/g|\)\/gm/g                      , "regex_kraj"          , true , false ] ,
	[ /\\.{1}/g                                 , "regex_escape"        , true , false ] ,
	[ /\{.*?\}|\+|\?|\*/g                       , "regex_kvantifikator" , true , false ] ,
	[ /\\w|\\W|\\b|\\B\\c|\\C|\\s|\\S|\\d|\\D/g , "regex_klase_znakova" , true , false ] ,
	[ /\||\[|\]|\(|\)/g                         , "operator"            , true , false ] ,

];

let RegEx_listaParser = [

];

let RegEx_specijalneListe = [

];

let RegEx_definicijaJezika = {

	naziv:              "RegEx",
	lekser:             lekserRegex,
	parser:             parserRegex,
	regexRastavljanje:  RegEx_regexRastavljanje,
	listaRegex:         RegEx_listaRegex,
	listaParser:        RegEx_listaParser,
	listeSpec:          RegEx_specijalneListe

}

let mapaKlasa = new Map();

mapaKlasa.set("language-text",       TXT_definicijaJezika)
         .set("language-assembler",  Assembler_definicijaJezika)
         .set("language-clike",      CLIKE_definicijaJezika)
         .set("language-css",        CSS_definicijaJezika)
         .set("language-html",       HTML_definicijaJezika)
         .set("language-java",       Java_definicijaJezika)
         .set("language-javascript", JavaScript_definicijaJezika)
         .set("language-json",       JSON_definicijaJezika)
         .set("language-markup",     Markup_definicijaJezika)
         .set("language-php",        PHP_definicijaJezika)
         .set("language-python",     Python_definicijaJezika)
         .set("language-regex",      RegEx_definicijaJezika)
         .set("language-sql",        SQL_definicijaJezika)
         .set("language-xml",        XML_definicijaJezika)

let spisakKlasa = [
	"language-text",
	"language-assembler",
	"language-css",
	"language-html",
	"language-javascript",
	"language-clike",
	"language-java",
	"language-json",
	"language-markup",
	"language-sql",
	"language-python",
	"language-regex",
	"language-php",
	"language-xml",
];

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

	let listaTokena = e.data.listaTokena;

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

let MULTITHREADING = typeof(Worker) !== undefined && true;
let BROJ_THREADOVA = navigator.hardwareConcurrency;
let KORAK          = BROJ_THREADOVA;
let INDEKS_ID      = 1;
let INDEKS_THREAD;
let T1, T2, ODZIV;

function obradaBlokova(spisak) {

	let t1 = performance.now();

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

	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(`Obrada blokova (vreme obrade: ${odziv})`);

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

setTimeout(() => {
	if(typeof(document) !== "undefined") {
		obradaBlokova(spisakKlasa);
	}
}, 100);

let listaTokena  = null;
let radioDugme   = 1;
let brojDugmica  = 14;
let DEBUG        = false;
let PARSER       = true;
let REZIM_ISPISA = "html";

function radioKlik(n) {

	if(n == 1) {
		document.getElementById("polje_ispis").classList.remove('language-php');
	}
	else {
		document.getElementById("polje_ispis").classList.add('language-php');
	}

	switch(n) {
		case 1  : obradaKoda(tekstHTML,      HTML_definicijaJezika,       poljeZaIspis, REZIM_ISPISA); break;
		case 2  : obradaKoda(tekstCSS,       CSS_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 3  : obradaKoda(tekstJS,        JavaScript_definicijaJezika, poljeZaIspis, REZIM_ISPISA); break;
		case 4  : obradaKoda(tekstC,         C_definicijaJezika,          poljeZaIspis, REZIM_ISPISA); break;
		case 5  : obradaKoda(tekstCPP,       CPP_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 6  : obradaKoda(tekstCSharp,    C_Sharp_definicijaJezika,    poljeZaIspis, REZIM_ISPISA); break;
		case 7  : obradaKoda(tekstJava,      Java_definicijaJezika,       poljeZaIspis, REZIM_ISPISA); break;
		case 8  : obradaKoda(tekstSQL,       SQL_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 9  : obradaKoda(tekstPython,    Python_definicijaJezika,     poljeZaIspis, REZIM_ISPISA); break;
		case 10 : obradaKoda(tekstPHP,       PHP_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
		case 11 : obradaKoda(tekstJSON,      JSON_definicijaJezika,       poljeZaIspis, REZIM_ISPISA); break;
		case 12 : obradaKoda(tekstAssembler, Assembler_definicijaJezika,  poljeZaIspis, REZIM_ISPISA); break;
		case 13 : obradaKoda(tekstMarkup,    Markup_definicijaJezika,     poljeZaIspis, REZIM_ISPISA); break;
		case 14 : obradaKoda(tekstRegex,     RegEx_definicijaJezika,      poljeZaIspis, REZIM_ISPISA); break;
		default : obradaKoda(tekstCSS,       CSS_definicijaJezika,        poljeZaIspis, REZIM_ISPISA); break;
	}
}

function prebacivanjeJezika(smer) {
	radioDugme += smer;
	if(radioDugme > brojDugmica) radioDugme = 1;
	let rD = document.getElementById("izbor_jezika_" + radioDugme);
	rD.checked = true;
	radioKlik(radioDugme);
}

function prepoznavanjeTastera(event) {
	switch(event.keyCode) {
		case 81: prebacivanjeJezika(1); break; 
		default: break;
	}
}
