/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

// Cela svrha ove poveće datoteke je da omogući funkciji za parisranje tokena,
// da prepozna da li je određena sekvenca između dva tokena "/" algebarski izraz,
// ili regularni izraz (pri čemu je ideja da se ne koriste regularni izrazi).
// 
// Funkcija analizaIzraza uzima nisku znakova, kreira tokene i, preko algoritma
// Shunting Yard, proverava da li tokeni tvore algebarski izraz, to jest, da li
// se poklapaju operandi i operatori, kao i otvorene i zatvorene zagrade.

function daLiSuZnakovi_slovo(z) {
	return z.toLowerCase() != z.toUpperCase();
}

function daLiSuZnakovi_operator(z) {
	return z == "+" || z == "-" || z == "*" || z == "/";
}

function daLiSuZnakovi_broj(z, tokeni) {
	let uslov;
	
	uslov = z[0] >= '0' && z[0] <= '9' || z[0] == '.';
	if(uslov) return true;

	uslov = z[0] == '.';
	if(uslov) return true;
	
	uslov = (z[0] == 'e' || z[0] == 'E') && (tokeni.prethodniTip == 1);
	if(uslov) return true;
}

function analizaIzrazaUpisUListu(tokeni) {
	if(tokeni.s == "") return;
	tokeni.lista.push( [ "a" , 1 ] );
	tokeni.s = "";
}

function analizaIzrazaZnak_slovo(z, tokeni) {
	tokeni.tip = 1;
	if(tokeni.tip != tokeni.prethodniTip) {
		analizaIzrazaUpisUListu(tokeni);
	}
	tokeni.s           += z;
	tokeni.prethodniTip = 1;
}

function analizaIzrazaZnak_operator(z, tokeni) {
	tokeni.tip = 2;
	if(tokeni.tip != tokeni.prethodniTip) {
		analizaIzrazaUpisUListu(tokeni);
	}
	tokeni.lista.push( [ z , 2 ] );
	tokeni.prethodniTip = 2;
}

function analizaIzrazaZnak_broj(z, tokeni) {
	if(tokeni.prethodniTip == 1) {
		tokeni.s += z;
		return;
	}

	tokeni.tip = 5;
	if(tokeni.tip != tokeni.prethodniTip) {
		analizaIzrazaUpisUListu(tokeni);
	}
	tokeni.s           += z;
	tokeni.prethodniTip = 5;
}

function analizaIzrazaZnak_otvorenaZagrada(z, tokeni) {
	tokeni.tip = 3;
	
	if(tokeni.tip != tokeni.prethodniTip) {
		analizaIzrazaUpisUListu(tokeni);
	}

	if(tokeni.prethodniTip == 2) {
		tokeni.lista.push( [ z , 3 ] );
		return;
	}

	if(tokeni.prethodniTip == 1) {
		tokeni.stek1.push(1);
		return;
	}
}

function analizaIzrazaZnak_zatvorenaZagrada(z, tokeni) {
	tokeni.tip = 4;

	if(tokeni.tip != tokeni.prethodniTip) {
		analizaIzrazaUpisUListu(tokeni);
	}

	if(tokeni.stek1[tokeni.stek1.length - 1] == 1) {
		tokeni.stek1.pop();
		return;
	}
	
	if(tokeni.prethodniTip == 1) {
		tokeni.lista.push( [ z , 4 ] );
		return;
	}
}

function analizaIzrazaTokenizacija(izraz, tokeni) {
	for(let i = 0; i < izraz.length; i++) {
		let z        = izraz[i];
		let kontekst = tokeni.stek1[tokeni.stek1.length - 1];

		if(z == " " || z == "\t" || z == "/") continue;

		if(daLiSuZnakovi_slovo(z)) {
			if(kontekst != 0) continue;
			analizaIzrazaZnak_slovo(z, tokeni);
			continue;
		}

		if(daLiSuZnakovi_operator(z)) {
			if(kontekst != 0) continue;
			analizaIzrazaZnak_operator(z, tokeni);
			continue;
		}

		if(daLiSuZnakovi_broj(z, tokeni)) {
			if(kontekst != 0) continue;
			analizaIzrazaZnak_broj(z, tokeni);
			continue;
		}

		if(z == "(") {
			analizaIzrazaZnak_otvorenaZagrada(z, tokeni);
			continue;
		}

		if(z == ")") {
			analizaIzrazaZnak_zatvorenaZagrada(z, tokeni);
			continue;
		}

		if(kontekst != 0) continue;
		
		// Ako se pojavi neki nepredviđen znak ....
		return false;
	}

	analizaIzrazaUpisUListu(tokeni);

	return tokeni.lista;
}

function analizaIzrazaListaURed(tokeni) {
	for(let i = 0; i < tokeni.lista.length; i++) {
		let t = tokeni.lista[i];
		
		if(t[1] == 1) { // a
			tokeni.red.push(t);
			continue;
		}

		if(t[1] == 2 || t[1] == 3) {
			tokeni.stek2.push(t);
			continue;
		}

		if(t[1] == 4) {
			while(tokeni.stek2.length > 0 && tokeni.stek2[tokeni.stek2.length - 1][1] == 2) {
				tokeni.red.push( [ "+" , 2 ] );
				tokeni.stek2.pop();
			}
			tokeni.stek2.pop();
			continue;
		}
	}

	while(tokeni.stek2.length > 0) {
		tokeni.red.push( [ "+" , 2 ] );
		tokeni.stek2.pop();
	}
}

function analizaIzrazaInterpretacija(tokeni) {
	for(let i = 0; i < tokeni.red.length; i++) {
		let t = tokeni.red[i];
		
		if(t[1] == 1) {
			tokeni.stek2.push(t);
			continue;
		}

		if(t[1] == 2) {
			if(tokeni.stek2.length >= 2) {
				tokeni.stek2.pop(); // u pravom Shunting yard-u, ovde bi
				                   // bila skinuta dva tokena, izračunat
				                   // rezultat i vraćen na stek
			}
			else {
				return false;
			}
			continue;
		}
	}

	return tokeni.stek2.length == 1 && tokeni.stek2[tokeni.stek2.length - 1][1] == 1;
}

function analizaIzraza(izraz) {
	let tokeni = {
		s:             "" ,
		tip:           -1 , // 1 - identifikator; 2 - operator;
		                    // 3 - otvorena zagrada; 4 - zatvorena zagrada
		                    // 5 - broj
		prethodniZnak: 'a' ,
		prethodniTip:  -1 ,
		lista:         [] ,
		red:           [] ,
		stek1:         [ 0 ] , // kreiranje liste tokena
		stek2:         []      // shunting yard
	}

	if(!analizaIzrazaTokenizacija(izraz, tokeni)) return false;
	analizaIzrazaListaURed(tokeni);
	return analizaIzrazaInterpretacija(tokeni);
}

/* -------------------------------------------------------------------------- */
// Telemetrija

//let t1 = performance.now()

/* -------------------------------------------------------------------------- */

//let izraz   = "a + 12.54 + (pera12 (12, pera12(), \"Zivot je more\") + c) * b";
//let izraz   = "(b+c)";
//let lista12;
//let granica = 120;
//
//for(let i = 0; i < granica; i++) {
//	lista12 = analizaIzraza(izraz);
//}
//console.log(lista12)

/* -------------------------------------------------------------------------- */
// Telemetrija

//let t2 = performance.now();
//let odziv = t2 - t1 + "ms";
//console.log(`Vreme obrade; ${odziv}`);

/* -------------------------------------------------------------------------- */
