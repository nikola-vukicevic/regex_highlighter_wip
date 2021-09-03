/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

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

let INDEKS_ID = 1;

function obradaBlokova(spisak) {
	/* ----- telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let listaBlokova = [];

	spisak.forEach((klasa) =>  {
		punjenjeListeBlokova(klasa, listaBlokova);
	});

	listaBlokova.forEach(blok => {
		let definicijaJezika = mapaKlasa.get(blok[0]);
		obradaPojedinacnogBloka(blok[1], definicijaJezika);
	})
	
	/* ----- telemetrija ---------------------------------------------------- */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(`Obrada blokova (vreme obrade: ${odziv})`);
	/* ---------------------------------------------------------------------- */
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

//odWrapperovanje();
setTimeout(() => {
	obradaBlokova(spisakKlasa);
}, 100);