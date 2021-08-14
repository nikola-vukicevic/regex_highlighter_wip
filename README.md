# regex_highlighter_wip
Syntax highlighter implementiran preko regularnih izraza

Posle kontekstnog parsera specijalizovanog za CSS, na red dođe i univerzalni parser koji ne koristi stek/kontekst(e), već regularne izraze.

Za sada WIP, ali, već je prilično funkcionalan ....

Najvažnije datoteke su:

definicije_jezika.js

highlighter_funkcije.js

## Log

### v1.1

Prepravljen celokupan kod.

Sada postoji primitivan parser, koji vodi računa o kontekstu (čime se rešava problem, pre svega, komentara unutar niski i niski unutar komentara).

### v1.0.1

Implementirana prosta binarna pretraga tagova (za sada nema potrebe za hash mapom).

## Demo

https://www.codeblog.rs/primeri/regex_highlighter/
