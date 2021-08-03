let mapaKlasa = new Map();

mapaKlasa.set("css",        "obradaCSSKoda");
mapaKlasa.set("html",       "obradaHTMLKoda");
mapaKlasa.set("javascript", "obradaJavaScriptKoda");
mapaKlasa.set("clike",      "obradaCKoda");
mapaKlasa.set("java",       "obradaJavaKoda");
mapaKlasa.set("sql",        "obradaSQLKoda");
mapaKlasa.set("python",     "obradaPythonKoda");
mapaKlasa.set("php",        "obradaPHPKoda");

function obradaBlokova() {
	
	/* ----- telemetrija ------ */
	let t1 = performance.now();



	let blokoviKoda = document.getElementsByClassName("language");
	
	for(let i = 0; i < blokoviKoda.length; i++) {
		obradaBloka(blokoviKoda[i]);
	}



	/* ----- telemetrija ------ */
	let t2    = performance.now();
	let odziv = (t2 - t1) + "ms";
	console.log(`Obrada blokova (vreme obrade: ${odziv})`);
}

function obradaBloka(blok) {
	let tekst = blok.innerText;

	tekst = tekst.replace(/</g, "&lt;");
	tekst = tekst.replace(/>/g, "&gt;");

	let spisakKlasa = blok.classList;
	let imeFunkcije = "";

	spisakKlasa.forEach(klasa => {
		if(klasa.startsWith("language-")) {
			imeFunkcije = klasa.substring(9, klasa.length);
			imeFunkcije = mapaKlasa.get(imeFunkcije);
		}
	});

	//console.log(`Ime funkcije: ${imeFunkcije}`);

	window[imeFunkcije](tekst, blok);
}

function obradaBloka2(blok) {
	let tekst = blok.innerText;

	tekst = tekst.replace(/</g, "&lt;");
	tekst = tekst.replace(/>/g, "&gt;");

	if(blok.classList.contains("language-css")) {
		obradaCSSKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-javascript")) {
		obradaJavaScriptKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-html")) {
		obradaHTMLKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-clike")) {
		obradaCKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-java")) {
		obradaJavaKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-sql")) {
		obradaSQLKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-python")) {
		obradaPythonKoda(tekst, blok);
		return;
	}

	if(blok.classList.contains("language-php")) {
		obradaPHPKoda(tekst, blok);
		return;
	}
}

function odWrapperovanje() {
	let wrapper = document.getElementById("wrapper");
	wrapper.style.width  = "auto";
	wrapper.style.height = "auto";	
}


odWrapperovanje();
obradaBlokova();