/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let poljeZaIspis = document.getElementById("polje_ispis");
let listaTokena  = null;
let radioDugme   = 1;
let brojDugmica  = 14;
let DEBUG        = false;
document.addEventListener("keydown", prepoznavanjeTastera);

/* ----- Prave stvari su u datoteci highlighter_funkcije.js ----- */

function obradaTXTKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst.trim());
	
	//proveraListe(listaTokena, "" , "tekst");
	//prepravljanjeTokena(listaTokena, CSS_htmlTagovi,  "html_tag");
	//prepravljanjeTokena(listaTokena, CSS_pseudoklase, "pseudoklasa");
	//prepravljanjeTokena(listaTokena, CSS_jedinice,    "jedinica");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaHTMLKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);

	obradaHTMLKodaRadni(listaTokena);
	obradaHTMLKodaDodatni(listaTokena);
	
	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaHTMLKodaRadni(lista) {
	proveraListeTokena(lista,  HTML_definicijaJezika);
}

function obradaHTMLKodaDodatni(lista) {
	rastavljanjeOtvarajucihTagova(lista, /(\=\'[A-Za-z\d\.\:\/\-\_ ]+\')/g , "atribut_vrednost" , "tag_otvarajuci"   , "tag_otvarajuci");
	rastavljanjeOtvarajucihTagova(lista, /(\=)/g                           , "atribut_dodela"   , "atribut_vrednost" , "atribut_vrednost");
	rastavljanjeOtvarajucihTagova(lista, /([\s]+[A-Za-z\(\)]*)/g           , "atribut_naziv"    , "tag_otvarajuci"   , "tag_otvarajuci");
}

function obradaCSSKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);

	proveraListeTokena(listaTokena,  CSS_definicijaJezika);
	prepravljanjeTokena(listaTokena, CSS_htmlTagovi,  "html_tag");
	prepravljanjeTokena(listaTokena, CSS_pseudoklase, "pseudoklasa");
	prepravljanjeTokena(listaTokena, CSS_jedinice,    "jedinica");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaJavaScriptKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	
	proveraListeTokena(listaTokena,  JS_definicijaJezika);
	prepravljanjeTokena(listaTokena, JS_RezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, JS_SpecijalniTokeni, "specijalni_token");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaCKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	
	proveraListeTokena(listaTokena,  CLIKE_definicijaJezika);
	prepravljanjeTokena(listaTokena, CLIKE_RezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, CLIKE_SpecijalniTokeni, "specijalni_token");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaCPPKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	
	proveraListeTokena(listaTokena,  CLIKE_definicijaJezika);
	prepravljanjeTokena(listaTokena, CLIKE_RezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, CLIKE_SpecijalniTokeni, "specijalni_token");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaCSharpKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	
	proveraListeTokena(listaTokena,  CLIKE_definicijaJezika);
	prepravljanjeTokena(listaTokena, CLIKE_RezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, CLIKE_SpecijalniTokeni, "specijalni_token");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaJavaKoda(tekst, polje) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	
	proveraListeTokena(listaTokena,  CLIKE_definicijaJezika);
	prepravljanjeTokena(listaTokena, CLIKE_RezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, CLIKE_SpecijalniTokeni, "specijalni_token");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)
	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaSQLKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);

	proveraListeTokena(listaTokena,  SQL_definicijaJezika);
	prepravljanjeTokena(listaTokena, SQL_rezervisaneReci,    "rezervisana_rec");
	prepravljanjeTokena(listaTokena, SQL_tipoviPromenljivih, "tip_promenljive");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaPythonKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);

	proveraListeTokena(listaTokena,  Python_definicijaJezika);
	prepravljanjeTokena(listaTokena, Python_rezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(listaTokena, Python_specijalniTokeni, "specijalni_token");

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaPHPKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);

	obradaPHPKodaRadni(listaTokena);
	obradaHTMLKodaDodatni(listaTokena);

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaPHPKodaRadni(lista) {
	proveraListeTokena(lista,  PHP_definicijaJezika);
	prepravljanjeTokena(lista, PHP_rezervisaneReci,  "rezervisana_rec");
	prepravljanjeTokena(lista, PHP_specijalniTokeni, "specijalni_token");
}

function obradaJSONKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	//console.log(listaTokena)
	proveraListeTokena(listaTokena,  JSON_definicijaJezika);
		
	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaAssemblerKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	//console.log(listaTokena)
	proveraListeTokena(listaTokena,  Assembler_definicijaJezika);
	prepravljanjeTokena(listaTokena, Assembler_rezervisaneReci,  "rezervisana_rec");
		
	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaRegExKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	//console.log(listaTokena)
	proveraListeTokena(listaTokena,  RegEx_definicijaJezika);
			
	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function obradaMarkupKoda(tekst, polje) {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	listaTokena = inicijalizacijaListeTokena(tekst);
	//console.log(listaTokena)
	proveraListeTokena(listaTokena,  Markup_definicijaJezika);
			
	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	if(DEBUG) console.log(odziv);

	//console.log(listaTokena)

	polje.innerHTML = formatiranjeListe(listaTokena, "html");
}

function radioKlik(n) {
	
	if(n == 1) {
		document.getElementById("polje_ispis").classList.remove('language-php');
	}
	else {
		document.getElementById("polje_ispis").classList.add('language-php');
	}
	
	switch(n) {
		case 1  : obradaHTMLKoda(tekstHTML,           poljeZaIspis); break;
		case 2  : obradaCSSKoda(tekstCSS,             poljeZaIspis); break;
		case 3  : obradaJavaScriptKoda(tekstJS,       poljeZaIspis); break;
		case 4  : obradaCKoda(tekstC,                 poljeZaIspis); break;
		case 5  : obradaCPPKoda(tekstCPP,             poljeZaIspis); break;
		case 6  : obradaCSharpKoda(tekstCSharp,       poljeZaIspis); break;
		case 7  : obradaJavaKoda(tekstJava,           poljeZaIspis); break;
		case 8  : obradaSQLKoda(tekstSQL,             poljeZaIspis); break;
		case 9  : obradaPythonKoda(tekstPython,       poljeZaIspis); break;
		case 10 : obradaPHPKoda(tekstPHP,             poljeZaIspis); break;
		case 11 : obradaJSONKoda(tekstJSON,           poljeZaIspis); break;
		case 12 : obradaAssemblerKoda(tekstAssembler, poljeZaIspis); break;
		case 13 : obradaMarkupKoda(tekstMarkup,       poljeZaIspis); break;
		case 14 : obradaRegExKoda(tekstRegex,         poljeZaIspis); break;
		default : obradaCSSKoda(tekstCSS,             poljeZaIspis); break;
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
		case 81: prebacivanjeJezika(1); break; // q
		default: break;
	}
}

obradaHTMLKoda(tekstHTML, poljeZaIspis);