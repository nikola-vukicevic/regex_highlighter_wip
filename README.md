# Syntax   highlighter
DIY syntax highlighter

## Demo

https://www.codeblog.rs/primeri/syntax_highlighter/

Posle highlightera specijalizovanog za CSS (sa primitivnim parserom koji vodi računa o kontekstu), na red je došao i univerzalni parser ....
Prva revizija implementirana je preko regularnih izraza i imala je (očekivano) problema sa raščlanjivanjem niski i komentara (niske unutar komentara su "razbijale" komentare), što je rešeno uvođenjem parsera (naravno, nije to pravi parser ni iz daleka, ali, vodi računa o kontekstu i - "radi posao").
Potom su došle na red optimizacije, ali, reklo bi se da ne donose neki preveliki boljitak u odnosu na regex verziju

## Instalacija

HTML datoteku koja sadrži blokove koda koji su propisno formatirani (http://localhost/projekti/codeblog/clanci.php?p=kako_napraviti_syntax_highlighter#Osnovni_tehni%C4%8Dki_preduslovi_za_prikaz_koda_na_sajtovima), potrebno je povezati sa datotekom highlighter.js

Ostalo se obavlja automatski.

### Najvažnije datoteke:

definicije_jezika.js

highlighter_funkcije.js

## Log

### 1.4.2

Implementirano izdvajanje regularnih izraza za JavaScript.

### 1.4.1

Implementirano bojenje sintakse unutar style i script tagova (u HTML blokovima)

### 1.4

Eksperimentisao sam sa lekserom koji (odmah) spaja tokene i sa parserom koji kreira novu listu i spaja tokene iste klase (sve uzastopne delove komentara, ili, delove niske, u jedan token).

Lekser radi, ali, kod postaje suviše komplikovan za ovako jednostavan program. Parser koji kreira novu listu i spaja tokene se pokazao kao bolje rešenje. Kod je možda čak i malo jednostavniji, aizvravanje je brže, tako da je to (bar za sada) finalna verzija highlighter-a.

Planovi za budućnost: prepoznavanje CSS i JS blokova unutar HTML datoteka (raščlanjivanje HTML i PHP koda u PHP datotekama već postoji i funkcioniše).

### 1.3

Rešen lekser.

(Postoji prostora za ubrzanje, ali, kod polako postaje kompleksniji, a ubrzanja nisu posebno primetna u odnosu na regex verziju, tako da je pitanje vredi li dalje eksperimentisati.)

### 1.2

Program se više ne oslanja na regularne izraze, već na parser sa kontekstima, ali lekser (DIY, pomalo brzinski sklepan) prolazi kroz tekst/tokene dvaput (biće rešeno).

### v1.1

Prepravljen celokupan kod.

Sada postoji primitivan parser, koji vodi računa o kontekstu (čime se rešava problem, pre svega, komentara unutar niski i niski unutar komentara).
Ostaje da se eksperimentiše sa optimizacijama ....

### v1.0

Syntax highlighter implementiran preko regularnih izraza

