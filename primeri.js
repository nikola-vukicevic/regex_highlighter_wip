/* -------------------------------------------------------------------------- */
// Primer - CSS
/* -------------------------------------------------------------------------- */

let tekstCSS = `/* ---- CSS Syntax Highlighter Demo ---- */

@import 'config.css';

/*
	Unesite Vaš CSS kod u levo tekstualno polje
	(koje je interaktivno), a u desnom će biti
	prikazan rezultat tokenizacije) ....
*/

// Linijski komentar

* {
	margin:  0;
	padding: 0;
}

@font-face {
	font-family: 'OpenSans-Regular', Arial, sans-serif;
	src:         url('../fontovi/OpenSans-Regular.ttf') format('truetype');
}

#ajDi_1 {
	display:    flex; // #ddf? --- */ Hex
	color:      #edd;
	box-shadow: 0px 0px 16px 1px rgba(0, 0, 0, 0.03);
}

.klasa_1,
.klasa_2 {
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

h1, span, aside, h2.klasa1,
form#forma_prijava > input[type='password'] {
	outline: 0;
}

@media only screen and (min-width: 768px) {
	#wrapper {
	padding:  1em 16px 1.25em 24px;
	}
}

GRESKA! Ne sme se bežati sa časova!
`;

/* -------------------------------------------------------------------------- */
// Primer - JS
/* -------------------------------------------------------------------------- */

let tekstJS = `/*
	JavaScript Syntax Highlighter Demo
*/

// C, C++, C#, Java - coming soon ....

function genNiz(niz, g, e) {
	for(let i = 0; i < g; i++) {
		niz.push(e);
	}
}

function proveraNiza(niz, rec) {
	for(let i = 0; i < rec.length; i++) {
		ind = rec.charCodeAt(i);
		niz[ind]++;
		if(niz[ind] > 1) {
			return false;
		}
	}

	return true;
}

function daLiSuSviRazliciti(rec) {
	let niz = []
	
	genNiz(niz, 128, 0);
	return proveraNiza(niz, rec);
}

console.log(daLiSuSviRazliciti("Ana"));
`;

/* -------------------------------------------------------------------------- */
// Primer - HTML
/* -------------------------------------------------------------------------- */

let tekstHTML = `&lt;!-- HTML Syntax Highlighter Demo --&gt;

&lt;!DOCTYPE html&gt;

&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset='utf-8'/&gt;
		&lt;title&gt;Naša prva stranica&lt;/title&gt;
		&lt;link rel='stylesheet' href='stil.css'/&gt;
	&lt;/head&gt;

	&lt;body&gt;
		&lt;h1&gt;Ovo je glavni naslov&lt;/h1&gt;
		
		&lt;h2&gt;Podnaslov 1&lt;/h2&gt;
		
		&lt;p&gt;
			Tekst prvog pasusa.
		&lt;/p&gt;

		&lt;h2&gt;Podnaslov 2&lt;/h2&gt;

		&lt;p&gt;
			Tekst drugog pasusa.
		&lt;/p&gt;

		&lt;p&gt;
			Dobar dan!
		&lt;/p&gt;

		&lt;a href='https://www.codeblog.rs'&gt;Ovo je link&lt;/a&gt;

		&lt;img src='slika_01.png' alt='Slika 1' title='Slika 1'/&gt;
	&lt;/body&gt;
&lt;/html&gt;
`;
