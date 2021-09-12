/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

// Cela svrha ove poveće datoteke je samo to da omogući funkciji za
// parisranje tokena da prepozna da li je određena sekvenca između dva
// tokena "/", algebarski izraz, ili regularni izraz (pri čemu je ideja da
// se, za proveru, ne koriste regularni izraz koji prepoznaje
// regularne izraze).
//
// Funkcija analizaIzraza uzima nisku znakova, kreira tokene i, preko
// algoritma Shunting Yard, proverava da li tokeni tvore algebarski izraz,
// to jest, da li se poklapaju operandi i operatori, kao i otvorene i
// zatvorene zagrade.

/* -------------------------------------------------------------------------- */

function analizaIzrazaTokenDaLiJeWhiteSpace(token) {
	return token[0] == " " || token[0] == "\t";
}

/* -------------------------------------------------------------------------- */

// Kontekst čitanja tokena:
//   1 - otvorena zagrada;
//   2 - zatvorena zagrada
//   3 - navodnici, apostrofi, backtick

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

/* -------------------------------------------------------------------------- */

// Donja funkcija, ostavlja samo 'relevantne' tokene, dok se ostali zanemaruju!
// Na primer, u obradi izraza ....
// 
//   	"a * -(f12("ime", "prezime", 12.54) + b) + --c"
// 
//  ... ostaće samo tokeni:
// 
// 	  "a * -(f12 + b) + --c"
// 
// .... što, naravno, ne bi bio adekvatan način za računanje vrednosti
// izraza, ali jeste sasvim prigodan način za proveru da li se izraz
// poklapa sa obrascem za zapis algebarskih izraza.

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
			//console.log(t)
			return;
		}
		
		if(t[0] == ")") {
			analizaIzrazaPromenaKonteksta(2, stek, prethodniTip);
			//console.log(t)
			return;
		}
		
		if(t[0] == "\"" || t[0] == "\'" || t[0] == "\`") {
			analizaIzrazaPromenaKonteksta(3, stek, prethodniTip);
			return;
		}
				
		if(kontekst > 0) return;
		//console.log(t)
		if(t[0] == "/") return;
		if(t[1] == "operator" && definicijaJezika.lekserUnarniOperatori.get(t[0]) != null) return;
		prethodniTip = t[1];
		
		tokeni.push(t);
	});

	return tokeni;
}

/* -------------------------------------------------------------------------- */

function ShuntingYard1ObradaOperand(podaci) {
	podaci.red.push("a");
	podaci.prethodniTip = "a";
}

/* -------------------------------------------------------------------------- */

function ShuntingYard1ObradaOtvorenaZagrada(podaci) {
	podaci.stek.push("(");
	podaci.prethodniTip = "+";
}

/* -------------------------------------------------------------------------- */

function ShuntingYard1ObradaZatvorenaZagrada(podaci) {
	while(podaci.stek.length > 0 && podaci.stek[podaci.stek.length - 1] == "+") {
		podaci.red.push(podaci.stek[podaci.stek.length - 1]);
		podaci.stek.pop();
	}
	if(podaci.stek.length > 0) podaci.stek.pop();
	podaci.prethodniTip = "+";
}

/* -------------------------------------------------------------------------- */

// Pojava unarnog minusa u JS izrazima iziskuje posebnu obradu, to jest,
// mora se napraviti razlika između unarnog minusa (koji se, kao i ostali
// unarni operatori, zanemaruje) i binarnog minusa (koji ostaje deo izraza).

function ShuntingYard1ObradaMinus(podaci) {
	if(podaci.prethodniTip == "a") {
		if(podaci.stek.length > 0 && podaci.stek[podaci.stek.length - 1] == "+") {
			podaci.red.push("+");
		}
		else {
			podaci.stek.push("+");
		}	
	}
}

/* -------------------------------------------------------------------------- */

function ShuntingYard1ObradaOperator(podaci) {
	if(podaci.stek.length > 0 &&podaci. stek[podaci.stek.length - 1] == "+") {
		podaci.red.push("+");                  
	}                             // U pravom Shunting Yard-u, operator bi      
	else {                        // se premeštao sa steka u red, ali, budući
		podaci.stek.push("+");    // da su svi operandi svedeni na "a", a svi
	}                             // operatori na "+", postupak se
	podaci.prethodniTip = "+";    // može uprostiti
	return;
}

/* -------------------------------------------------------------------------- */

function ShuntingYard1ObradaPraznjenjeSteka(podaci) {
	while(podaci.stek.length > 0) {
		podaci.red.push("+");
		podaci.stek.pop();
	}
}

/* -------------------------------------------------------------------------- */

/*
	Funkcija ShuntingYard1 obavlja prebacivanje izraza iz infiksne u
	postfiksnu notaciju, pri čemu se unarni operatori zanemaruju, što
	(ponovo) nije adekvatan način za računanje vrednosti algebarskih izraza,
	ali jeste raktičan način da se (oavakav pojednostavljeni)algoritam
	rastereti nepotrebnih provera.
*/

function ShuntingYard1(lista) {
	let shunting_yard = {
		red:          [],
		stek:         [],
		prethodniTip: "+"
	}

	lista.forEach(t => {
		if(t[1] == "") {
			ShuntingYard1ObradaOperand(shunting_yard);
			return;
		}

		if(t[0] == "(") {
			ShuntingYard1ObradaOtvorenaZagrada(shunting_yard);
			return;
		}
		
		if(t[0] == ")") {
			ShuntingYard1ObradaZatvorenaZagrada(shunting_yard);
			return;
		}

		if(t[0] == "-") {
			ShuntingYard1ObradaMinus(shunting_yard);
			return;
		}
		
		if(t[1] == "operator") {                
			ShuntingYard1ObradaOperator(shunting_yard)
			return;
		}

		if(t[1] != "") {
			shunting_yard.red.push("x");
			return;
		}
	});

	ShuntingYard1ObradaPraznjenjeSteka(shunting_yard);

	//console.log(shunting_yard.red)
	return shunting_yard.red;
}

/* -------------------------------------------------------------------------- */

/*
	Funkcija ShuntingYard2 obavlja simulaciju račuanja vrednosti algebarskog
	izraza, pri čemu se proverva da li niz tokeni, ranije svedenih na "a"
	(što je simbol za operand) i "+" (što je simbol za operator), predstavlja
	pravilno definisan izraz u postfiksnoj notaciji, što se proverava na kraju,
	tako što se posmatra da li na steku postoji tačno jedan operand (koji bi,
	u "pravom" Shunting Yard algoritmu, bio rezultat računanja).
*/

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

/* -------------------------------------------------------------------------- */

/*
	Kratak rezime onoga što je ranije već pomenuto:

		- Izraz se svodi na pojenostavljeni oblik, gde se pozivi funkcija
		  svode na identifikatore
		- Unarni operatori se zanemaruju
		- Izraz se prevodi iz infiksnog u postfksni oblik
		- Postfiksni izraz se proverava putem simulacije računanja
		  vrednosti postfiksnog izraza (preko steka)
*/

function analizaIzraza(lista, definicijaJezika) {
	let tokeni = null;
	tokeni = analizaIzrazaKreiranjeListeTokena(lista, definicijaJezika);
	//console.log(tokeni)
	tokeni = ShuntingYard1(tokeni);
	//console.log(tokeni)
	tokeni = ShuntingYard2(tokeni);
	//console.log(tokeni)
	
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
