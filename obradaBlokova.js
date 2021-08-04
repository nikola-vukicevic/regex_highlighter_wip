/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let mapaKlasa = new Map();

mapaKlasa.set("language-text",       "obradaTXTKoda");
mapaKlasa.set("language-assembler",  "obradaAssemblerKoda");
mapaKlasa.set("language-clike",      "obradaCKoda");
mapaKlasa.set("language-css",        "obradaCSSKoda");
mapaKlasa.set("language-html",       "obradaHTMLKoda");
mapaKlasa.set("language-java",       "obradaJavaKoda");
mapaKlasa.set("language-javascript", "obradaJavaScriptKoda");
mapaKlasa.set("language-json",       "obradaJSONKoda");
mapaKlasa.set("language-markup",     "obradaMarkupKoda");
mapaKlasa.set("language-php",        "obradaPHPKoda");
mapaKlasa.set("language-python",     "obradaPythonKoda");
mapaKlasa.set("language-regex",      "obradaRegExKoda");
mapaKlasa.set("language-sql",        "obradaSQLKoda");
mapaKlasa.set("language-xml",        "obradaHTMLKoda");

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

function obradaBlokova(spisak) {
	/* ----- telemetrija ------ */
	let t1 = performance.now();

	spisak.forEach(klasa =>  {
		obradaBlokovaJedneKlase(klasa);
	});

	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(`Obrada blokova (vreme obrade: ${odziv})`);
}

function obradaBlokovaJedneKlase(klasa) {
	
	let blokoviKoda = document.getElementsByClassName(klasa);
	
	for(let i = 0; i < blokoviKoda.length; i++) {
		let imeFunkcije = mapaKlasa.get(klasa);
		obradaBloka(blokoviKoda[i], imeFunkcije);
	}
}

function obradaBloka(blok, imeFunkcije) {
	
	let tekst = blok.innerText.trim() + "\n";

	tekst = tekst.replace(/</g, "&lt;");
	tekst = tekst.replace(/>/g, "&gt;");

	window[imeFunkcije](tekst, blok);
}

function odWrapperovanje() {
	let wrapper = document.getElementById("wrapper");
	wrapper.style.width  = "auto";
	wrapper.style.height = "auto";	
}

//odWrapperovanje();
setTimeout(() => {
	obradaBlokova(spisakKlasa);
}, 100);