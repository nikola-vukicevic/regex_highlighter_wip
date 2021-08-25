# Syntax   highlighter
Syntax highlighter implementiran preko regularnih izraza

## Demo

https://www.codeblog.rs/primeri/regex_highlighter/

Posle highlightera specijalizovanog za CSS (sa primitivnim parserom koji vodi računa o kontekstu), na red je došao i univerzalni parser ....
Prva revizija implementirana je preko regularnih izraza i imala je (očekivano) problema sa raščlanjivanjem niski i komentara (niske unutar komentara su "razbijale" komentare), što je rešeno uvođenjem parsera (naravno, nije to pravi parser ni iz daleka, ali, vodi računa o kontekstu i - "radi posao").
Potom su došle na red optimizacije, ali, reklo bi se da ne donose neki preveliki boljitak u odnosu na regex verziju

### Najvažnije datoteke:

definicije_jezika.js
highlighter_funkcije.js

## Log

### 1.3

Rešen lekser.

(Postoji mesto za ubrzanje, ali, kod polako postaje kompleksniji, a ubrzanja nisu posebno primetna u odnosu na regex verziju, tako da je pitanje vredi li dalje eksperimentisati.)

### 1.2

Program se više ne oslanja na regularne izraze, već na parser sa kontekstima, ali lekser (DIY, pomalo brzinski sklepan) prolazi kroz tekst/tokene dvaput (biće rešeno).

### v1.1

Prepravljen celokupan kod.

Sada postoji primitivan parser, koji vodi računa o kontekstu (čime se rešava problem, pre svega, komentara unutar niski i niski unutar komentara).
Ostaje da se eksperimentiše sa optimizacijama ....

### v1.0

Syntax highlighter implementiran preko regularnih izraza

