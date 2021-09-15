/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function analizaIzrazaTokenDaLiJeWhiteSpace(token) {
	return token[0] == " " || token[0] == "\t";
}

/* -------------------------------------------------------------------------- */

// Otvarajući deo blok komentara  - "/*"

function analizaIzrazaToken_Komentar_01(token, podaci, novaLista) {
	if(podaci.kontekst == 0) {
		novaLista.push(token);
		podaci.stek.push(1);
		podaci.kontekst = 1;
		podaci.klasa    = "komentar";
	}
	else {
		podaci.s += token[0];
	}
}

/* -------------------------------------------------------------------------- */

// Zatvarajući deo blok komentara - "*/"

function analizaIzrazaToken_Komentar_02(token, podaci, novaLista) {
	if(podaci.kontekst > 1) {
		podaci.s += token[0];
		return;
	}
	
	if(podaci.kontekst == 1) {
		podaci.stek.pop();
		if(podaci.s != "") {
			novaLista.push( [ podaci.s , podaci.klasa ]);
			podaci.s     = "";
		}
	}
	
	novaLista.push(token);
	podaci.klasa = "";
}

/* -------------------------------------------------------------------------- */

// Otvarajući deo linijskog komentara - "//"

function analizaIzrazaToken_Komentar_03(token, podaci, novaLista) {
	if(podaci.kontekst == 0) {
		novaLista.push(token);
		podaci.stek.push(2);
		podaci.kontekst = 2;
		podaci.klasa    = "komentar";
	}
	else {
		podaci.s += token[0];
	}
}

/* -------------------------------------------------------------------------- */

function analizaIzrazaToken_Komentar(token, podaci, novaLista) {
	podaci.kontekst = podaci.stek[podaci.stek.length - 1];

	if(token[0] == "/*") {
		analizaIzrazaToken_Komentar_01(token, podaci, novaLista);
		return;
	}

	if(token[0] == "*/") {
		analizaIzrazaToken_Komentar_02(token, podaci, novaLista);
		return;
	}

	if(token[0] == "//") {
		analizaIzrazaToken_Komentar_03(token, podaci, novaLista);
		return;
	}
}

/* -------------------------------------------------------------------------- */

function analizaIzrazaToken_Niska(token, podaci, kontekst, naziv_klase, novaLista) { // navodnici - kontekst = 1;
	if(podaci.kontekst == kontekst) {                                                // apostrofi - kontekst = 2;
		if(podaci.s != "") {                                                         // backtick  - kontekst = 3
			novaLista.push( [ podaci.s , podaci.klasa ]);
			podaci.s     = "";
		}
		novaLista.push(token);
		//
		podaci.stek.pop();
		podaci.klasa = "";
		return;
	}
	
	if(podaci.kontekst == 0) {
		novaLista.push(token);
		podaci.stek.push(kontekst);
		podaci.kontekst = kontekst;
		podaci.klasa    = "niska_navodnici";
		return;
	}
	else {
		podaci.s += token[0];
		return;
	}
}

/* -------------------------------------------------------------------------- */

function analizaIzrazaToken_Regex(token, podaci, novaLista) {
	if(podaci.kontekst == 6) {
		if(podaci.s != "") {
			novaLista.push( [ podaci.s , podaci.klasa ]);
			podaci.s     = "";
		}
		novaLista.push( [ token[0] , "regularni_izraz" ] );
		//
		podaci.stek.pop();
		podaci.klasa        = "";
		podaci.prethodniTip = "a";
		return;
	}
	else {

	}

	if(podaci.kontekst == 0) {
		novaLista.push( [ token[0] , "regularni_izraz" ] );
		podaci.stek.push(6);
		podaci.kontekst = 6;
		podaci.klasa    = "regularni_izraz";
		return;
	}
	else {
		podaci.s += token[0];
		return;
	}
}

/* -------------------------------------------------------------------------- */

function analizaIzrazaPromenaKonteksta(lista, novaLista, definicijaJezika, token, podaci) {
	if(token[0] == "/*" || token[0] == "*/" || token[0] == "//") {
		analizaIzrazaToken_Komentar(token, podaci, novaLista);
		return true;
	}
	if(token[0] == "\"") {
		analizaIzrazaToken_Niska(token, podaci, 3, "niska_navodnici", novaLista);
		return true;
	}
	
	if(token[0] == "\'") {
		analizaIzrazaToken_Niska(token, podaci, 4, "niska_apostrofi", novaLista);
		return true;
	}
	
	if(token[0] == "\`") {
		analizaIzrazaToken_Niska(token, podaci, 5, "niska_backtick", novaLista);
		return true;
	}
			
	if(token[0] == "/") {
		if(podaci. prethodniTip == "+" || podaci.prethodniTip == "b") {
			analizaIzrazaToken_Regex(token, podaci, novaLista);
		}
		else {
			novaLista.push(token);
			podaci.prethodniTip = "+";
		}
		return true;
	}

	return false;
}

/* -------------------------------------------------------------------------- */

function analizaIzrazaObradaOperanda(token, podaci, definicijaJezika) {
	podaci.prethodniTip = "a";
	let specLista       = definicijaJezika.parserSpecListe.get(0)
	let rez             = specLista.get(token[0]);

	if(rez != null) {
		token[1]            = rez;
		podaci.prethodniTip = "b";
	}
}

/* -------------------------------------------------------------------------- */

function analizaIzrazaPotencijalniRegex(lista, novaLista, definicijaJezika) {
	let podaci = {
		stek:         [ 0 ] ,
		kontekst:     0 ,
		prethodniTip: "+" ,
		s:            "" ,
		klasa:        ""
	}

	lista.forEach(t => {
		podaci.kontekst = podaci.stek[podaci.stek.length - 1];

		if(analizaIzrazaPromenaKonteksta(lista, novaLista, definicijaJezika, t, podaci)) {
			return
		}		

		if(podaci.kontekst > 0) {
			podaci.s += t[0];
			return;
		}
				
		if(t[1] == "operator") {
			podaci.prethodniTip = "+";
		}

		if(t[0] == ")") {
			podaci.prethodniTip = "a";
		}
		
		if(t[1] == "") {
			analizaIzrazaObradaOperanda(t, podaci, definicijaJezika);
		}

		novaLista.push(t);
	});

	if(podaci.s != "") {
		novaLista.push( [ podaci.s , podaci.klasa ]);
	}
}

/* -------------------------------------------------------------------------- */
