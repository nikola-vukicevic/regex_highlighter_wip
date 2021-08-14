function formatiranjeHTMLa(lista, rezim) {
	let s =  ""
	for(let i = 0; i < lista.length; i++) {
		
		if(lista[i][0] == "") continue;
		
		let tekst = lista[i][0].replace("<", "&lt;").replace(">", "&gt;");
		let klasa = lista[i][2];
		
		if(rezim == "html") {
			s += `<span class='token ${klasa}' title='${klasa}'>${tekst}</span>`;
			continue;
		}
		if(rezim == "tech") {
			s += `${tekst}\n--------------------------------------------------\n`;
			continue;
		}
	}

	return s;
}

function pripremaListe(lista) {
	for(let i = 0; i < lista.length; i++) {
		lista[i] = [  lista[i]  ,  false  ,  "tekst"  ,  false  ];
	}
}

function utiskivanjeTokenPojedinacni(regex, token, boolLexer, boolParser, lista) {
	lista.forEach(e => {
		if(e[1] == false && e[0].match(regex)) {
			e[1] = boolLexer;
			e[2] = token;
			e[3] = boolParser;
		}
	});
}

function utiskivanjeTokena(listaRegexa, listaTokena) {
	listaRegexa.forEach(e => {
		utiskivanjeTokenPojedinacni(e[0], e[1], e[2], e[3], listaTokena);
	});
}

function obradaPrepoznatogTokena(listaTokenaRed, stek, listaParserRed) {
	
	// Prepravaljanje trenutnog tokena - indeks 3
	
	if(listaParserRed[3] === true) {
		listaTokenaRed[2] = listaParserRed[6]; // Token za prepravaljanje - Indeks 6
	}

	// Da li se dodaje novi kontekst na stek? - Indeks 1

	if(listaParserRed[1] === true ) {
		stek.push(listaParserRed[5])  // Novi kontekst- Indeks 5
		return;                       // Nema dalje ako se dodaje
	}                                 // noci kontekst na stek

	// Da li se skida kontekst sa steka? - Indeks 2

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
                     // Nema dalje ako se skida
		return;      // kontekst sa steka
	}
}

function parserTokenPojedinacni(listaTokenaRed, stek, listaParserPredata, specijalneListe) {
	let kontekst = stek[stek.length - 1];

	if(listaParserPredata.length > 0) {
		let listaParser = listaParserPredata[kontekst];

		for(let i = 0; i < listaParser.length; i++) {
			if(listaTokenaRed[3] === true) continue;			

			if (listaTokenaRed[0].match(listaParser[i][0])) {
				obradaPrepoznatogTokena(listaTokenaRed, stek, listaParser[i]);
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

function parser(listaParser, listaTokena, specijalneListe) {
	let stek = [  0  ];

	for(let i = 0; i < listaTokena.length; i++)	{
		parserTokenPojedinacni(listaTokena[i], stek, listaParser, specijalneListe);
	}
}

function obradaKoda(tekst, definicija_jezika, poljeZaIspis, format) {
	let lista = tekst.split(definicija_jezika.regexRastavljanje);
	pripremaListe(lista);
	utiskivanjeTokena(definicija_jezika.listaRegex, lista);
	
	if(PARSER === true) {
		parser(definicija_jezika.listaParser, lista, definicija_jezika.listeSpec);

	}
	
	poljeZaIspis.innerHTML = formatiranjeHTMLa(lista, format);
}
