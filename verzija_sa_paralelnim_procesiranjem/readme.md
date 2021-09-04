Ideja da se syntax highlighter pokreće preko web worker-a je više nego jasna, ali, u praksi se pokazalo da nema prevelikog ubrzanja kada se obrađuje poveći broj malih blokova koda, pa je za sada highlighter sa paralelnim procesiranjem (iako kod nije ni izdaleka prekomplikovan) paralelni projekat.

### Demo

https://www.codeblog.rs/primeri/syntax_highlighter/highlighter_multithreading/

Napomena: Demo verzija (zarad efekta) 'okreće' funkciju za obradu koda 5000 puta, za svaki blok (jer inače deluje da se obrada obavlja "trenutno").
