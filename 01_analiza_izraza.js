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

function analizaIzrazaTokenDaLiJeWhiteSpace(token) {
	return token[0] == " " || token[0] == "\t";
}

function analizaIzrazaPromenaKonteksta(tkn, stek, prethodniTip) { // 1 - otvorena zagrada;
	let kontekst = stek[stek.length - 1];                         // 2 - zatvorena zagrada
                                                                  // 3 - navodnici, apostrofi, backtick
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
		console.log(t)
		if(t[0] == "/") return;
		if(t[1] == "operator" && definicijaJezika.lekserUnarniOperatori.get(t[0]) != null) return;
		prethodniTip = t[1];
		
		tokeni.push(t);
		//console.log(t)
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

		if(t[1] == "operator") {               // U pravom Shunting Yard-u, operator bi
			if(stek[stek.length - 1] == "+") { // se premeštao sa steka u red, ali, budući
				red.push("+");                 // da su svi operandi svedeni na "a", a svi
			}                                  // operatori na "+", postupak se
			else {                             // može uprostiti
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

	//console.log(red)
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
	console.log(tokeni)
	tokeni = ShuntingYard1(tokeni);
	console.log(tokeni)
	tokeni = ShuntingYard2(tokeni);
	console.log(tokeni)
	
	//console.log(tokeni)
	return tokeni.length == 1 && tokeni[0] == "a";
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