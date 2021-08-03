/* -------------------------------------------------------------------------- */
/* Copyright (c) 2021. Nikola Vukićević                                       */
/* -------------------------------------------------------------------------- */



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
	for(let i = 0; i &gt; g; i++) {
		niz.push(e);
	}
}

function proveraNiza(niz, rec) {
	for(let i = 0; i &lt; rec.length; i++) {
		ind = rec.charCodeAt(i);
		niz[ind]++;
		if(niz[ind] &gt; 1) {
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

/* -------------------------------------------------------------------------- */
// Primer - C
/* -------------------------------------------------------------------------- */

let tekstC = `/* ----- C Syntax Highlighter Demo ----- */

#include&lt;stdio.h&gt;
#include&lt;stdlib.h&gt;

void main()
{
	int i, n;
	FILE *f;
	f = fopen("rezultat.txt", "w");
	
	if(f == NULL)
	{
		printf("Greška!\\n");
		return;
	}
	
	printf("N = ");
	scanf("%d", &n);
	
	for (i = 0; i &lt;= n; i++)
	{
		fprintf(f, "%d\\n", rand());
	}
	
	printf("Rezultat je upisan u datoteku rezultat.txt");
	fclose(f);
}
`;

/* -------------------------------------------------------------------------- */
// Primer - C++
/* -------------------------------------------------------------------------- */

let tekstCPP = `/*
	C++ Syntax Highlighter Demo
*/

#include&lt;iostream&gt;

using namespace std;

struct Datum {
	int godina, mesec, dan;
};

class Osoba
{
	private:
		
	int _starost;
		
	public:
	
	string ime, prezime;
	Datum  datumRodjenja;
	
	Osoba(string ime, string prezime, Datum datumRodjenja)
	{
		this-&gt;ime           = ime;
		this-&gt;prezime       = prezime;
		this-&gt;datumRodjenja = datumRodjenja;
		racunanjeStarosti();
	}
	
	racunanjeStarosti()
	{
		time_t d     = time(NULL);
		tm*    datum = localtime(&d);
		
		int godina   = datum-&gt;tm_year + 1900;
		int mesec    = datum-&gt;tm_mon  + 1;
		int dan      = datum-&gt;tm_mday;
		
		_starost = godina - datumRodjenja.godina;
		
		if(mesec &lt; datumRodjenja.mesec)
		{
			_starost--;
		}

		if(mesec == datumRodjenja.mesec &&
		   dan   &lt;  datumRodjenja.dan)
		{
			_starost--;
		}
	}
	
	int citanjeStarosti() {
		return _starost;
	}
};
`;

/* -------------------------------------------------------------------------- */
// Primer - C#
/* -------------------------------------------------------------------------- */

let tekstCSharp = `/* ----- C# Syntax Highlighter Demo ----- */

public class Pravougaonik
{
	public Double a, b, O, P;
	
	public Pravougaonik(Double a, Double b)
	{
		this.a = a;
		this.b = b;
		RacunanjeObima();
		RacunanjePovrsine();
	}
	
	public void RacunanjeObima()
	{
		O = 2 * (a + b);
	}
	
	public void RacunanjePovrsine()
	{
		P = a * b;
	}
	
	public void KonzolniIspis()
	{
		Console.WriteLine("-Stranica a: " + this.a.ToString());
		Console.WriteLine("-Stranica b: " + this.b.ToString());
		Console.WriteLine("-Obim: "       + this.O.ToString());
		Console.WriteLine("-Površina: "   + this.P.ToString());
	}
}`;

/* -------------------------------------------------------------------------- */
// Primer - Java
/* -------------------------------------------------------------------------- */

let tekstJava = `/* ----- Java Syntax Highlighter Demo ----- */

package Pravougaonik;
import  java.util.*;

public class Pravougaonik {
	public double a, b, O, P;
	
	public Pravougaonik(double a, double b)	{
		this.a = a;
		this.b = b;
		RacunanjeObima();
		RacunanjePovrsine();
	}
	
	public void RacunanjeObima() {
		O = 2 * (a + b);
	}
	
	public void RacunanjePovrsine()	{
		P = a * b;
	}
	
	public void KonzolniIspis()	{
		System.out.printf("-Stranica a: %f", this.a);
		System.out.printf("-Stranica b: %f", this.b);
		System.out.printf("-Obim: %f",       this.O);
		System.out.printf("-Površina: %f",   this.P);
	}
}
`;

/* -------------------------------------------------------------------------- */
// Primer - SQL
/* -------------------------------------------------------------------------- */

let tekstSQL = `-- SQL Syntax Highlighter Demo

USE prodaja;

CREATE TABLE prodavci
(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	ime varchar(255) NOT NULL,
	prezime varchar(255) NOT NULL,
	datum_rodjenja datetime NOT NULL,
	adresa varchar(255) NOT NULL,
	broj int NOT NULL, 
	email varchar(255) NOT NULL
); 

CREATE TABLE prodaja
(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	datum datetime NOT NULL, 
	artikl varchar(255) NOT NULL,
	cena double NOT NULL,
	kolicina double NOT NULL,
	prodavac int NOT NULL,
	FOREIGN KEY (prodavac) REFERENCES prodaja(id)
);

INSERT INTO prodavci
	(ime, prezime, datum_rodjenja, email)
VALUES
	("Petar", "Jovanović", "1979-06-15", "petar_jovanovic@str.co.rs")
`;

/* -------------------------------------------------------------------------- */
// Primer - Python
/* -------------------------------------------------------------------------- */

let tekstPython = `# Python Syntax Highlighter Demo

def idiosync_parse():
	s      = ucitavanje
	redovi = ucitavanje.split('\\n') 
	tokeni = []
	s      = ""
	parse  = True

	for r in redovi:
		if r == "\\r" or r == "":
			continue
		
		if parse == True:
			if r.startswith("\`\`"):
				parse = False
				continue
			ucitavanje_tokena(r, tokeni)			
		else:
			if r.startswith("~~"):
				parse = True
				tokeni.append(["", "", ""])
				continue
			tokeni.append([r, "", ""])

	for t in tokeni:
		s = s + t[0] + t[1] + t[2] + "\\n"

return s
`;

/* -------------------------------------------------------------------------- */
// Primer - PHP
/* -------------------------------------------------------------------------- */

let tekstPHP = `/* ----- PHP Syntax Highlighter ----- */

&lt;?php
	require_once('obrada_podataka');
	if(!isset($_GET['p'])) {
		header("location: greska.php");
		exit();
	}

	class Osoba	{
		public $ime, $prezime, $adresa;

		function __construct($ime, $prezime, $datum_rodjenja) {
			$this-&gt;ime     = $ime;
			$this-&gt;prezime = $prezime;
			$this-&gt;adresa  = $adresa;
		}

		function formatiranje_podataka() {
			return $ime . " " . $prezime . ", " . $adresa;
		}

		function ispis_podataka() {
			echo formatiranje_podataka() . "&lt;br&gt;";
		}
	}
?&gt;
`;