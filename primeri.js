/* -------------------------------------------------------------------------- */
//
/* Copyright (c) 2021. Nikola Vukićević                                       */
//
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// Primer - CSS
/* -------------------------------------------------------------------------- */

let tekstCSS = `/* ---- CSS Syntax Highlighter Demo ---- */

@import 'config.css';

/*
	Blok komentar u više redova
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
	box-shadow: 0 px 0px 16px 1px rgba(0, 0, 0, 0.03);
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
		
const narucivanjePromise = podaci => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if(podaci.uslov) {
				console.log(podaci.poruka);
				resolve({
					uslov: PROVERA_PROVERA_DELOVA,
					poruka: "Delovi su prošli proveru"
				});
			}
			else {
				reject("Greška: Naručeni delovi NISU DOSTAVLJENI");
			}
		}, INTERVAL_NARUCIVANJE);
	});
}
		
async function PokretanjeAsyncAwait() {
	
	let podaci = {
		uslov: PROVERA_NARUCIVANJE,
		poruka: "Naručeni delovi su dostavljeni ...."
	};
	
	let narucivanje = await narucivanjePromise(podaci);
	console.log(narucivanje);
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

let tekstHTML = `<!-- HTML Syntax Highlighter Demo -->

<!DOCTYPE html>

<html>
	<head>
		<meta charset='utf-8'/>
		<title>Probna stranica</title>
		<link rel='stylesheet' href='stil.css'/>
	</head>

	<body>
		<h1>Glavni naslov</h1>
		
		<h2>Podnaslov 1</h2>
		
		<p>
			Tekst prvog pasusa.
		</p>

		<h2>Podnaslov 2</h2>

		<p>
			Tekst drugog pasusa.
		</p>

		<p>
			Dobar dan!
		</p>

		<a href='https://www.codeblog.rs'>Ovo je link</a>

		<img src='slika_01.png' alt='Slika 1' title='Slika 1'/>
	</body>
</html>
`;

/* -------------------------------------------------------------------------- */
// Primer - C
/* -------------------------------------------------------------------------- */

let tekstC = `/* ----- C Syntax Highlighter Demo ----- */

#include<stdio.h>
#include<stdlib.h>

void main()
{
	int i, n;
	int a = 12;
	double d = 12.54;
	double f = .54;
	FILE *f;
	f = fopen("rezultat void main int .txt", "w");
	
	if(f == NULL)
	{
		printf("\\"Greška!\\"\\n");
		return;
	}
	
	printf("N = ");
	scanf("%d", &n);
	
	for (i = 0; i <= n; i++)
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

#include<iostream>

using namespace std;

struct Datum_12 {
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
		this->ime           = ime;
		this->prezime       = prezime;
		this->datumRodjenja = datumRodjenja;
		racunanjeStarosti();
	}
	
	racunanjeStarosti()
	{
		time_t d     = time(NULL);
		tm*    datum = localtime(&d);
		
		int godina   = datum->tm_year + 1900;
		int mesec    = datum->tm_mon  + 1;
		int dan      = datum->tm_mday;
		
		_starost = godina - datumRodjenja.godina;
		
		if(mesec < datumRodjenja.mesec)
		{
			_starost--;
		}

		if(mesec == datumRodjenja.mesec &&
		   dan   <  datumRodjenja.dan)
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
	
	public void KonzolniIspis_12()
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
	
	public void KonzolniIspis_12()	{
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

CREATE TABLE prodavci_12
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

def idiosync_parse_12():
	s        = ucitavanje
	redovi   = ucitavanje.split('\\n') 
	tokeni   = []
	s        = ""
	parse_12 = True

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

let tekstPHP = `<?php
	/* ----- PHP Syntax Highlighter ----- */
	require_once('obrada_podataka');
	if(!isset($_GET['p'])) {
		header("location: greska.php");
		exit();
	}

	$a = 12.54;
	$b = 12;
	$c = .54;

	class Osoba_12	{
		public $ime, $prezime, $adresa;

		function __construct($ime, $prezime, $datum_rodjenja) {
			$this->ime     = $ime;
			$this->prezime = $prezime;
			$this->adresa  = $adresa;
			$this->visina  = 0.14;
		}

		function formatiranje_podataka() {
			return $ime . "\\" razmak " . $prezime . ", " . $adresa;
		}

		function ispis_podataka() {
			echo formatiranje_podataka() . "<br>";
		}
	}
?>

<!----- HTML blok u PHP datoteci ----->

<!DOCTYPE html>

<html>
	<head>
		<meta charset='utf-8'/>
		<title>PHP</title>
	</head>
	<body>
	</body>
</html>
`;

/* -------------------------------------------------------------------------- */
// Primer - JSON
/* -------------------------------------------------------------------------- */

let tekstJSON = `{
	"ime"     : "Milan",
	"prezime" : "Nešić",
	"adresa"  : {
					"drzava" : "Srbija",
					"grad"   : "Beograd",
					"ulica"  : "Grofa Drakule",
					"broj"   : 41
				},
	"email"   : "mixi_79@gmail.com",
	"godiste" : 1979
}
`;

/* -------------------------------------------------------------------------- */
// Primer - Assembler
/* -------------------------------------------------------------------------- */

let tekstAssembler = `		
mov 0x0020, 10
mov 0x0024, 15
mov R1, 0x0020
mov R2, 0x0024
add R1, R2, R3
mov 0x0028, R3
`;

/* -------------------------------------------------------------------------- */
// Primer - Markdown
/* -------------------------------------------------------------------------- */

let tekstMarkup = `
# Naslov (h1)

Uvod u kome se spominje šta će se sve lepo dešavati ....

## Glavni podnaslov (h2)

Prvi pasus.

Drugi pasus

Treci pasus

### Pod-podnaslov (h3)
#### Pod-pod-podnaslov (h4)
`;

/* -------------------------------------------------------------------------- */
// Primer - Regex
/* -------------------------------------------------------------------------- */

let tekstRegex = `
/(\\/\\*[\s\S]*?\\*\\/)/g;
/(\\/\\/.*\\n)/g;
/(\\#.*\\n)/g;
/(\\'[\\s\\S]*?\\')/g;
/(\\"[\\s\\S]*?\\")/g;
/(\\\`[\\s\\S]*?\\\`)/g;
/(\\()/g;
/(\\))/g;
/(\\{)/g;
/(\\})/g;
/(\\[)/g;
/(\\])/g;
/(\\B\\#[\\dA-Fa-f]{3,6}\\b)/g;
/(\\d*\\.\\d+)/g;
/(\\b\\d+)/g;
/(0x\\d+)/g;
/([ \\t\\n]+)/g;
/(\\+\\+|\\-\\-|\\<\\=|\\>|\\<\\=|\\<|\\=\\=|\\<\\<|\\>\\>|\\-\\>|\\&\\&|\\|\\||\\=|\\+|\\-|\\*|\\/)/g;
/(\\<|\\>|\\.|\\,|\\:|\\;)/g;
/(\\-\\-.*\\n)/g;
/(\\#.*\\n)/g;
/(\\<[\\s\\S]*?>)/g;
/(\\<\\/[A-Za-z\\d]*>)/g;
/(\\<\\!\\-\\-.*\\-\\-\\>)/g;
`;

/* -------------------------------------------------------------------------- */
// Primer - TXT
/* -------------------------------------------------------------------------- */

let tekstTXT = `U tekstualnom obliku tekst je ....

.... ako pređemo u novi red .....

Zapisan!

`;
