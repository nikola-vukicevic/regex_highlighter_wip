/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// Jezik - CSS
/* -------------------------------------------------------------------------- */

let CSS_definicijaJezika = [
	[  /(\/\*[\s\S]*?\*\/)/g       ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  /(\/\/.*\n)/g               ,  "komentar_linijski"             ]  ,  // // komentar
	[  /(\'[A-Za-z\/\\\.-]*\')/g   ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  /(\".*\"")/g                ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  /(\{)/g                     ,  "selektor_otvarajuca_zagrada"   ]  ,  // {
	[  /(\})/g                     ,  "selektor_zatvarajuca_zagrada"  ]  ,  // {
	[  /(\()/g                     ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  /(\))/g                     ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  /(\B\#[\dA-Fa-f]{3,6}\b)/g  ,  "heksadecimalna_vrednost"       ]  ,  // #ee04e7
	[  /(\#[\dA-Za-z _]*)/g        ,  "id_naziv"                      ]  ,  // #ajDi_01
	[  /(\d*\.\d+)/g               ,  "decimalna_vrednost"            ]  ,  // 12.54
	[  /([ \t]*\.[\dA-Za-z _]*)/g  ,  "klasa_naziv"                   ]  ,  // #klasa_02
	[  /(\b\d+)/g                  ,  "dekadni_broj"                  ]  ,  // 12.54
	[  /(\@[\dA-Za-z_-]*)/g        ,  "et_direktiva_naziv"            ]  ,  // @etDirektiva_03
	[  /([A-Za-z-]*\:)/g           ,  "svojstvo_naziv"                ]  ,  // font-weight:
	[  /([ \t\n]+)/g               ,  "white_space"                   ]  ,  // \t\n
	[  /([>,;]{1})/g               ,  "separator"                     ]  ,  // , >
	[  /([\*]{1})/g                ,  "selektor_globalni"             ]  ,  // , >
];

let CSS_htmlTagovi = [
	"a",
	"p",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"span",
	"aside",
	"form",
	"div"
]

let CSS_pseudoklase = [
	"hover"
];

let CSS_jedinice = [
	"px",
	"em",
	"rem"
];

/* -------------------------------------------------------------------------- */
// Jezik - JavaScript
/* -------------------------------------------------------------------------- */

let JS_definicijaJezika = [
	[  /(\/\*[\s\S]*?\*\/)/g       ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  /(\/\/.*\n)/g               ,  "komentar_linijski"             ]  ,  // // komentar
	[  /(\'[A-Za-z\/\\\.-]*\')/g   ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  /(\".*\"")/g                ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  /(\{)/g                     ,  "blok_koda_otvarajuca_zagrada"  ]  ,  // {
	[  /(\})/g                     ,  "blok_koda_zatvarajuca_zagrada" ]  ,  // {
	[  /(\()/g                     ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  /(\))/g                     ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  /(\[)/g                     ,  "zagrada_niz_otvorena"          ]  ,  // [
	[  /(\])/g                     ,  "zagrada_niz_zatvorena"         ]  ,  // ]
	[  /(\B\#[\dA-Fa-f]{3,6}\b)/g  ,  "heksadecimalna_vrednost"       ]  ,  // #ee04e7
	[  /(\d*\.\d+)/g               ,  "decimalna_vrednost"            ]  ,  // 12.54
	[  /(\b\d+)/g                  ,  "dekadni_broj"                  ]  ,  // 12.54
	[  /([ \t\n]+)/g               ,  "white_space"                   ]  ,  // \t\n
	[  /([>\.,;]{1})/g             ,  "separator"                     ]  ,  // , >
	[  /([\*]{1})/g                ,  "selektor_globalni"             ]  ,  // , >
];

let JS_RezervisaneReci = [
	"var",
	"let",
	"const",
	"function",
	"if",
	"for",
	"while",
	"return",
]

let JS_SpecijalniTokeni = [
	"console",
]

let JS_Operatori = [
	"+",
	"-",
	"*",
	"/",
	"=",
];

/* -------------------------------------------------------------------------- */
// Jezik - HTML
/* -------------------------------------------------------------------------- */

let HTML_definicijaJezika = [
	[  /(\&lt\;\!\-\-.*\-\-\&gt\;)/g  ,  "komentar"         ]  ,  // <! ---- komentar ---- -->
	[  /(&lt;\/[A-Za-z\d]*&gt;)/g     ,  "tag_zatvarajuci"  ]  ,  // 'niska niska niska'
	[  /(&lt;.*&gt;)/g                ,  "tag_otvarajuci"   ]  ,  // 'niska niska niska'
];

let HTML_Tagovi = [
	"a",
	"p",
	"q",
	"div",
	"span",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"aside",
	"header",
	"nav",
	"main",
	"footer",
]
