/* -------------------------------------------------------------------------- */
// Jezik: TXT
/* -------------------------------------------------------------------------- */

let TXT_regexRastavljanje = null;

let TXT_listaRegex = [
	//[  /\n/g ,  "tekst"    ]  ,
];

let TXT_listaParser = [

];

let TXT_specijalneListe = [
	
];

let TXT_definicijaJezika = {
	naziv:              "TXT",
	regexRastavljanje:  TXT_regexRastavljanje,
	listaRegex:         TXT_listaRegex,
	listaParser:        TXT_listaParser,
	listeSpec:          TXT_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik - HTML
/* -------------------------------------------------------------------------- */

let HTML_regexRastavljanje = /(\&lt\;\!\-\-.*\-\-\&gt\;|\&lt\;\/[A-Za-z\d]*\&gt\;|\&lt;|\/&gt;|\&gt;|\=|\'.+?\'|\".+?\"|[ \t\n]+?)/g

let HTML_listaRegex = [
	[  /\&lt\;\!\-\-.*\-\-\&gt\;/g   ,  "komentar"          ,  true  , false  ]  ,
	[  /\&lt\;\/[A-Za-z\d]*\&gt\;/g  ,  "tag_zatvarajuci"   ,  true  , false  ]  ,
	[  /&lt;{1}/g                    ,  "tag_otvarajuci"    ,  true  , false  ]  , // <
	[  /&gt;{1}/g                    ,  "tag_otvarajuci"    ,  true  , false  ]  , // >
];

let HTML_listaParser = [
	[ // 0
		[  /&lt;{1}/g  ,  true  ,  0  ,  false  ,  false  ,  1  ,  ""  ]  ,
	],
	
	[ // 1	
	],

	[ // 2
		[  /&gt;{1}/g  ,  false  ,  1001   ,  false  ,  false  ,  -1  ,  ""                  ]  ,
		[  /\=/g       ,  false  ,  0      ,  true   ,  false  ,  -1  ,  "atribut_dodela"    ]  ,
		[  /\'.+\'/g   ,  false  ,  0      ,  true   ,  false  ,  -1  ,  "atribut_vrednost"  ]  ,
	]
];

let HTML_listaTagovi = [
	"!DOCTYPE",
	"a",
	"abbr",
	"acronym",
	"address",
	"applet",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"basefont",
	"bb",
	"bdo",
	"big",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	//"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"command",
	"datagrid",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"eventsource",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"isindex",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"menu",
	"meta",
	"meter",
	"nav",
	"noframes",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"pre",
	"progress",
	"q",
	"rp",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"sup",
	"t",
	"table",
	"tbody",
	"td",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	//"var",
	"video",
	"wbr",
];

let HTML_listaAtributi = [
	"alt",
	"charset",
	"href",
	"href",
	"rel",
	"src",
	"title",
]

let HTML_specijalneListe = [
	[ /* ----- 0 ----- */ ],
	[ /* ----- 1 ----- */
		[  HTML_listaTagovi    ,  "tag_otvarajuci"  ,   2  ]  ,
	],
	[ /* ----- 2 ----- */
		[  HTML_listaAtributi  ,  "atribut_naziv"   ,  -1  ]  ,
	],
];

let HTML_definicijaJezika = {
	naziv:              "HTML",
	regexRastavljanje:  HTML_regexRastavljanje,
	listaRegex:         HTML_listaRegex,
	listaParser:        HTML_listaParser,
	listeSpec:          HTML_specijalneListe
}

let XML_definicijaJezika = {
	naziv:              "XML",
	regexRastavljanje:  HTML_regexRastavljanje,
	listaRegex:         HTML_listaRegex,
	listaParser:        HTML_listaParser,
	listeSpec:          HTML_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: CSS
/* -------------------------------------------------------------------------- */

let CSS_regexRastavljanje = /([ \t\n]+|\;|\(|\|\@.*?;\n|\d*.\d+|[\d]+|\.[a-zA-Z_\d]+|\#[a-zA-Z_\d]+|\@[a-zA-Z-\d]+|\:[a-zA-Z-]+|[a-zA-Z-]+\:|\/\*|\*\/|\/\/.*\n|\/\/.*\n|\\.{1}|\"|\'|\,|\{|\}|\(|\))/g

let CSS_listaRegex = [
	[  /\/\/.*/g           ,  "komentar_linijski"          ,  true  , false  ]  ,
	[  /\/\*/g             ,  "komentar_otvaranje"         ,  true  , false  ]  ,
	[  /\*\//g             ,  "komentar_zatvaranje"        ,  true  , false  ]  ,
	[  /\@.+?;/g           ,  "pretprocesorska_direktiva"  ,  true  , false  ]  ,
	[  /\d*\.\d+/g         ,  "decimalna_vrednost"         ,  true  , false  ]  ,
	[  /^\d+/g             ,  "dekadni_broj"               ,  true  , false  ]  ,
	[  /\.[a-zA-Z_\d]+?/g  ,  "klasa_naziv"                ,  true  , false  ]  ,
	[  /\#[a-zA-Z_\d]+?/g  ,  "id_naziv"                   ,  true  , false  ]  ,
	[  /\@[a-zA-Z-\d]+?/g  ,  "et_direktiva_naziv"         ,  true  , false  ]  ,
	[  /^\:[a-zA-Z-]+/g    ,  "pseudoklasa"                ,  true  , false  ]  ,
	[  /[a-zA-Z-]+\:/g     ,  "svojstvo_naziv"             ,  true  , false  ]  ,
	[  /\;{1}/g            ,  "operator"                   ,  true  , false  ]  ,
	[  /\{{1}/g            ,  "blok_koda_otvaranje"        ,  true  , false  ]  ,
	[  /\}{1}/g            ,  "blok_koda_zatvaranje"       ,  true  , false  ]  ,
	[  /\({1}/g            ,  "otvorena_zagrada"           ,  true  , false  ]  ,
	[  /\){1}/g            ,  "zatvorena_zagrada"          ,  true  , false  ]  ,
	[  /\[{1}/g            ,  "operator_zagrada"           ,  true  , false  ]  ,
	[  /\]{1}/g            ,  "operator_zagrada"           ,  true  , false  ]  ,
];

let CSS_listaParser = [
	[ // 0
		[  /\/\*/g  ,  true  ,  0  ,  true   ,  false  ,  1  ,  "komentar"         ]  ,
		[  /^\"/g   ,  true  ,  0  ,  true   ,  false  ,  2  ,  "niska_navodnici"  ]  ,
		[  /^\'/g   ,  true  ,  0  ,  true   ,  false  ,  3  ,  "niska_apostrofi"  ]  ,
		[  /^\{/g   ,  true  ,  0  ,  false  ,  false  ,  4  ,  ""                 ]  ,
	],
	[ // 1
		[  /\*\//g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "komentar"  ]  ,
		[  /.*/g    ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "komentar"  ]  ,
	],
	[ // 2
		[  /^\"/g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "niska_navodnici"  ]  ,
		[  /.*/g   ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "niska_navodnici"  ]  ,
	],
	[ // 3
		[  /^\'/g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "niska_apostrofi"  ]  ,
		[  /.*/g   ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "niska_apostrofi"  ]  ,
	],
	[ // 4
		[  /^\}/g              ,  false  ,  1  ,  false  ,  false  ,  -1  ,  ""                         ]  ,
		[  /\/\*/g             ,  true   ,  0  ,  true   ,  false  ,   1  ,  "komentar"                 ]  ,
		[  /^\"/g              ,  true   ,  0  ,  true   ,  false  ,   2  ,  "niska_navodnici"          ]  ,
		[  /^\'/g              ,  true   ,  0  ,  true   ,  false  ,   3  ,  "niska_apostrofi"          ]  ,
		[  /^\#[\da-f]{3,8}/g  ,  false  ,  0  ,  true   ,  false  ,  -1  ,  "heksadecimalna_vrednost"  ]  ,
	],
];

let CSS_listaHTMLTagovi = [
	"a",
	"abbr",
	"acronym",
	"address",
	"applet",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"basefont",
	"bb",
	"bdo",
	"big",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"command",
	"datagrid",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"eventsource",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"isindex",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"menu",
	"meta",
	"meter",
	"nav",
	"noframes",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"pre",
	"progress",
	"q",
	"rp",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"sup",
	"t",
	"table",
	"tbody",
	"td",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"video",
	"wbr",
	//"center",
	//"var",
];

let CSS_listaPseudoklase = [
	"hover",
	"active",	
];

let CSS_listaAtributi = [
	"box-shadow",
	"color",
	"display",
	"font-family",
	"margin",
	"outline",
	"padding",
	"src",
	"text-decoration",
];

let CSS_listaJedinice = [
	"em",
	"pt",
	"px",
	"rem"
];

let CSS_specijalneListe = [
	
	[ // 0
		[  CSS_listaHTMLTagovi   ,  "html_tag"     ,  -1  ]  ,
		[  CSS_listaPseudoklase  ,  "pseudoklasa"  ,  -1  ]  ,
		[  CSS_listaAtributi     ,  "pseudoklasa"  ,  -1  ]  ,
		[  CSS_listaJedinice     ,  "jedinica"     ,  -1  ]  ,
	],

	[ // 1

	],

	[ // 2

	],

	[ // 3

	],

	[ // 4
		[  CSS_listaHTMLTagovi   ,  "html_tag"     ,  -1  ]  ,
		[  CSS_listaPseudoklase  ,  "pseudoklasa"  ,  -1  ]  ,
		[  CSS_listaAtributi     ,  "pseudoklasa"  ,  -1  ]  ,
		[  CSS_listaJedinice     ,  "jedinica"     ,  -1  ]  ,	
	],
]

let CSS_definicijaJezika = {
	naziv:              "CSS",
	regexRastavljanje:  CSS_regexRastavljanje,
	listaRegex:         CSS_listaRegex,
	listaParser:        CSS_listaParser,
	listeSpec:          CSS_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik - C
/* -------------------------------------------------------------------------- */

//let CLIKE_regexRastavljanje = /(\\.{1})/g
let CLIKE_regexRastavljanje = /(\#.*?\n|\/\/.*\n|\/\*|\*\/|\\.{1}|\"|\>\>|\<\<|\&\&|\|\||\=|\{|\}|\(|\)|\[|\]|\+|\-|\*|\/|\,|\;|[ \t\n]+?)/g

let CLIKE_listaRegex = [
	[  /\/\*/g    ,  "komentar_otvaranje"         ,  true  , false  ]  ,
	[  /\*\//g    ,  "komentar_zatvaranje"        ,  true  , false  ]  ,
	[  /\/\/.*/g  ,  "komentar_linijski"          ,  true  , false  ]  ,
	[  /\#.+?/g   ,  "pretprocesorska_direktiva"  ,  true  , false  ]  ,
	[  /\{{1}/g   ,  "blok_koda_otvaranje"        ,  true  , false  ]  ,
	[  /\}{1}/g   ,  "blok_koda_zatvaranje"       ,  true  , false  ]  ,
	[  /\({1}/g   ,  "otvorena_zagrada"           ,  true  , false  ]  ,
	[  /\){1}/g   ,  "zatvorena_zagrada"          ,  true  , false  ]  ,
	[  /\[{1}/g   ,  "operator"                   ,  true  , false  ]  ,
	[  /\]{1}/g   ,  "operator"                   ,  true  , false  ]  ,
	[  /\+/g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\-/g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\*/g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\//g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\=/g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\;/g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\,/g      ,  "operator"                   ,  true  , false  ]  ,
	[  /\>\>/g    ,  "operator"                   ,  true  , false  ]  ,
	[  /\<\</g    ,  "operator"                   ,  true  , false  ]  ,
	[  /\&\&/g    ,  "operator"                   ,  true  , false  ]  ,
	[  /\|\|/g    ,  "operator"                   ,  true  , false  ]  ,
	[  /\^\^/g    ,  "operator"                   ,  true  , false  ]  ,
]

let CLIKE_listaParser = [
	[ // 0
		[  /\/\*/g  ,  true  ,  0  ,  true  ,  false  ,  1  ,  "komentar"         ]  ,
		[  /^\"/g   ,  true  ,  0  ,  true  ,  false  ,  2  ,  "niska_navodnici"  ]  ,
		[  /^\'/g   ,  true  ,  0  ,  true  ,  false  ,  3  ,  "niska_apostrofi"  ]  ,
		[  /^\`/g   ,  true  ,  0  ,  true  ,  false  ,  4  ,  "niska_backtick"   ]  ,
	],
	[ // 1
		[  /\*\//g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "komentar_zatvaranje"  ]  ,
		[  /.*/g    ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "komentar"             ]  ,
	],
	[ // 2
		[  /^\"/g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "niska_navodnici"  ]  ,
		[  /.*/g   ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "niska_navodnici"  ]  ,
	],
	[ // 3
		[  /^\'/g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "niska_apostrofi"  ]  ,
		[  /.*/g   ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "niska_apostrofi"  ]  ,
	],
	[ // 4
		[  /^`/g  ,  false  ,  1  ,  true  ,  false  ,  -1  ,  "niska_backtick_zatv"  ]  ,
		[  /.*/g  ,  false  ,  0  ,  true  ,  false  ,  -1  ,  "niska_backtick"       ]  ,
	],
]

let CLIKE_listaRezervisaneReci = [
	"Decimal",
	"Double",
	"Float",
	"Int32",
	"Int64",
	"NULL",
	"UInt32",
	"UInt64",
	"base",
	"bool",
	"boolean",
	"break",
	"byte",
	"case",
	"catch",
	"char",
	"class",
	"const",
	"continue",
	"decimal",
	"default",
	"delegate",
	"do",
	"double",
	"else",
	"enum",
	"event",
	"extends",
	"false",
	"final",
	"finally",
	"float",
	"for",
	"foreach",
	"get",
	"if",
	"implements",
	"import",
	"int",
	"long",
	"namespace",
	"new",
	"null",
	"object",
	"override",
	"package",
	"private",
	"protected",
	"public",
	"return",
	"set",
	"short",
	"signed",
	"sizeof",
	"static",
	"struct",
	"super",
	"switch",
	"this",
	"throw",
	"true",
	"try",
	"typedef",
	"union",
	"unsigned",
	"unsigned",
	"using",
	"void",
	"while",
];

let CLIKE_listaSpecijalniTokeni = [
	"Console",
	"FILE",
	"ReadKey",
	"ReadLine",
	"System",
	"WriteLine",
	"cout",
	"endl",
	"fclose",
	"fopen",
	"out",
	"printf",
	"scanf",
	"string",
	"vector",
];

let CLIKE_specijalneListe = [
	[ /* ----- 0 ----- */
		[  CLIKE_listaRezervisaneReci   ,  "rezervisana_rec"   ,  -1  ]  ,
		[  CLIKE_listaSpecijalniTokeni  ,  "specijalni_token"  ,  -1  ]  ,
	],
	[ /* ----- 1 ----- */
	],
	[ /* ----- 2 ----- */
	],
	[ /* ----- 3 ----- */
	],
];

let C_definicijaJezika = {
	naziv:              "C",
	regexRastavljanje:  CLIKE_regexRastavljanje,
	listaRegex:         CLIKE_listaRegex,
	listaParser:        CLIKE_listaParser,
	listeSpec:          CLIKE_specijalneListe
}

let CLIKE_definicijaJezika = {
	naziv:              "CLIKE",
	regexRastavljanje:  CLIKE_regexRastavljanje,
	listaRegex:         CLIKE_listaRegex,
	listaParser:        CLIKE_listaParser,
	listeSpec:          CLIKE_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: C++
/* -------------------------------------------------------------------------- */

let CPP_definicijaJezika = {
	naziv:              "C++",
	regexRastavljanje:  CLIKE_regexRastavljanje,
	listaRegex:         CLIKE_listaRegex,
	listaParser:        CLIKE_listaParser,
	listeSpec:          CLIKE_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: C#
/* -------------------------------------------------------------------------- */

let C_Sharp_definicijaJezika = {
	naziv:              "C#",
	regexRastavljanje:  CLIKE_regexRastavljanje,
	listaRegex:         CLIKE_listaRegex,
	listaParser:        CLIKE_listaParser,
	listeSpec:          CLIKE_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: JavaScript
/* -------------------------------------------------------------------------- */

let JavaScript_definicijaJezika = {
	naziv:              "JavaScript",
	regexRastavljanje:  CLIKE_regexRastavljanje,
	listaRegex:         CLIKE_listaRegex,
	listaParser:        CLIKE_listaParser,
	listeSpec:          CLIKE_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Java
/* -------------------------------------------------------------------------- */

let Java_definicijaJezika = {
	naziv:              "Java",
	regexRastavljanje:  CLIKE_regexRastavljanje,
	listaRegex:         CLIKE_listaRegex,
	listaParser:        CLIKE_listaParser,
	listeSpec:          CLIKE_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: SQL
/* -------------------------------------------------------------------------- */

let SQL_regexRastavljanje = /(\-\-.*\n|\'[\s\S]*?\'|\"[\s\S]*?\"|\(|\)|\d*\.\d+|\d+|\;|\,|[ \t\n])/g;

let SQL_listaRegex = [
	[  /\-\-.*\n/g      ,  "komentar"                  ,  true  , false  ]  ,
	[  /\'[\s\S]*?\'/g  ,  "niska_apostrofi"           ,  true  , false  ]  ,
	[  /\"[\s\S]*?\"/g  ,  "niska_navodnici"           ,  true  , false  ]  ,
	[  /\(/g            ,  "zagrada_obicna_otvorena"   ,  true  , false  ]  ,
	[  /\)/g            ,  "zagrada_obicna_zatvorena"  ,  true  , false  ]  ,
	[  /\d*\.\d+/g      ,  "decimalna_vrednost"        ,  true  , false  ]  ,
	[  /\d+/g           ,  "dekadni_broj"              ,  true  , false  ]  ,
	[  /\;\,/g          ,  "separator"                 ,  true  , false  ]  ,
	[  /[ \t\n]+/g      ,  "white_space"               ,  true  , false  ]  ,
];

let SQL_listaParser = [

];

let SQL_rezervisaneReci = [
	"ADD",
	"AFTER",
	"ALTER",
	"AS",
	"ASC",
	"AUTO_INCREMENT",
	"BY",
	"CREATE",
	"DATABASE",
	"DELETE",
	"FOREIGN",
	"FROM",
	"INSERT",
	"INTO",
	"KEY",
	"NOT",
	"NULL",
	"ORDER",
	"PRIMARY",
	"REFERENCES",
	"SELECT",
	"SET",
	"TABLE",
	"UPDATE",
	"USE",
	"VALUES",
	"WHERE",
	"add",
	"after",
	"alter",
	"as",
	"asc",
	"auto_increment",
	"by",
	"create",
	"database",
	"delete",
	"foreign",
	"from",
	"insert",
	"into",
	"key",
	"not",
	"null",
	"order",
	"primary",
	"references",
	"select",
	"set",
	"table",
	"update",
	"use",
	"values",
	"where",
];

let SQL_tipoviPromenljivih = [
	"datetime",
	"double",
	"int",
	"varchar",
];

let SQL_specijalneListe = [
	[ // 0
		[  SQL_rezervisaneReci     ,  "rezervisana_rec"  ,  - 1  ]  ,
		[  SQL_tipoviPromenljivih  ,  "tip_promenljive"  ,  - 1  ]  ,
	]	
];

let SQL_definicijaJezika = {
	naziv:              "SQL",
	regexRastavljanje:  SQL_regexRastavljanje,
	listaRegex:         SQL_listaRegex,
	listaParser:        SQL_listaParser,
	listeSpec:          SQL_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: Python
/* -------------------------------------------------------------------------- */

let Python_regexRastavljanje = /(\#.*\n|\"[\s\S]*?\"|\'[\s\S]*?\'|\`[\s\S]*?\`|[ \t\n]+|\d*\.\d+|\d+|\{|\}|\(|\)|\[|\]|\+|\-|\*|\/|\=|\:|\;|\,)/g;

let Python_listaRegex = [
	[  /\#.*\n/g       ,  "komentar"               ,  true  , false  ]  ,
	[  /\"[\s\S]*\"/g  ,  "niska_navodnici"        ,  true  , false  ]  ,
	[  /\'[\s\S]*\'/g  ,  "niska_apostrofi"        ,  true  , false  ]  ,
	[  /\`[\s\S]*\`/g  ,  "niska_backtick"         ,  true  , false  ]  ,
	[  /\d*\.\d+/g     ,  "decimalna_vrednost"     ,  true  , false  ]  ,
	[  /\d+/g          ,  "dekadni_broj"           ,  true  , false  ]  ,
	[  /\{{1}/g        ,  "blok_koda_otvaranje"    ,  true  , false  ]  ,
	[  /\}{1}/g        ,  "blok_koda_zatvaranje"   ,  true  , false  ]  ,
	[  /\({1}/g        ,  "otvorena_zagrada"       ,  true  , false  ]  ,
	[  /\){1}/g        ,  "zatvorena_zagrada"      ,  true  , false  ]  ,
	[  /\[{1}/g        ,  "zagrada_niz_otvorena"   ,  true  , false  ]  ,
	[  /\]{1}/g        ,  "zagrada_niz_zatvorena"  ,  true  , false  ]  ,
	[  /\+/g           ,  "operator"               ,  true  , false  ]  ,
	[  /\-/g           ,  "operator"               ,  true  , false  ]  ,
	[  /\*/g           ,  "operator"               ,  true  , false  ]  ,
	[  /\//g           ,  "operator"               ,  true  , false  ]  ,
	[  /\=/g           ,  "operator"               ,  true  , false  ]  ,
	[  /\;/g           ,  "operator"               ,  true  , false  ]  ,
	[  /\,/g           ,  "operator"               ,  true  , false  ]  ,
	[  /\>\>/g         ,  "operator"               ,  true  , false  ]  ,
	[  /\<\</g         ,  "operator"               ,  true  , false  ]  ,
	[  /\&\&/g         ,  "operator"               ,  true  , false  ]  ,
	[  /\|\|/g         ,  "operator"               ,  true  , false  ]  ,
	[  /\^\^/g         ,  "operator"               ,  true  , false  ]  ,
];

let Python_listaParser = [
	
];

let Python_rezervisaneReci = [
	"and",
	"break",
	"case",
	"class",
	"continue",
	"def",
	"else",
	"for",
	"if",
	"import",
	"in",
	"or",
	"return",
	"switch",
	"while",
];

let Python_specijalniTokeni = [
	"False",
	"True",
];

let Python_specijalneListe = [
	[ // 0
		[  Python_rezervisaneReci   ,  "rezervisana_rec"   ,  -1  ]  ,
		[  Python_specijalniTokeni  ,  "specijalni_token"  ,  -1  ]  ,
	]
];

let Python_definicijaJezika = {
	naziv:              "Python",
	regexRastavljanje:  Python_regexRastavljanje,
	listaRegex:         Python_listaRegex,
	listaParser:        Python_listaParser,
	listeSpec:          Python_specijalneListe
};

/* -------------------------------------------------------------------------- */
// Jezik: PHP
/* -------------------------------------------------------------------------- */

let PHP_regexRastavljanje = /(\n)/g;

let PHP_listaRegex = [
	[  /\n/g  ,  "php"  ,  false  , false  ]  ,
];

let PHP_listaParser = [

];

let PHP_specijalneListe = [
	
];

let PHP_definicijaJezika = {
	naziv:              "PHP",
	regexRastavljanje:  PHP_regexRastavljanje,
	listaRegex:         PHP_listaRegex,
	listaParser:        PHP_listaParser,
	listeSpec:          PHP_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: JSON
/* -------------------------------------------------------------------------- */

let JSON_regexRastavljanje = /(\".+?\"[ \t]*?\:|\".+?\"|\d*\.\d+|\d+|\{|\}|\:|\,|\[|\])/g;

let JSON_listaRegex = [
	[  /\".+\"[ \t]*?\:/g    ,  "svojstvo_naziv"      ,  true  , false  ]  ,
	[  /\".+?\"/g            ,  "svojstvo_vrednost"   ,  true  , false  ]  ,
	[  /\{|\}|\:|\,|\[|\]/g  ,  "json_separator"      ,  true  , false  ]  ,
	[  /\d*\.\d+/g           ,  "decimalna_vrednost"  ,  true  , false  ]  ,
	[  /\d+/g                ,  "brojcana_vrednost"   ,  true  , false  ]  ,
];

let JSON_listaParser = [

];

let JSON_specijalneListe = [

];

let JSON_definicijaJezika = {
	naziv:              "JSON",
	regexRastavljanje:  JSON_regexRastavljanje,
	listaRegex:         JSON_listaRegex,
	listaParser:        JSON_listaParser,
	listeSpec:          JSON_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: Assembler
/* -------------------------------------------------------------------------- */

let Assembler_regexRastavljanje = /(\,|\n| |0x\d+|^\d*\.\d+|^\d+)/g;

let Assembler_listaRegex = [
	[  /0x\d+/g     ,  "assembler_adresa"    ,  true  , false  ]  ,
	[  /\,| /g      ,  "separator"           ,  true  , false  ]  ,
	[  /\d*\.\d+/g  ,  "decimalna_vrednost"  ,  true  , false  ]  ,
	[  /\d+/g       ,  "brojcana_vrednost"   ,  true  , false  ]  ,
];

let Assembler_listaParser = [

];

let Assembler_naredbe = [
	"acc",
	"add",
	"div",
	"jnc",
	"mov",
];

let Assembler_registri = [
	"R1",
	"R2",
	"R3",
];

let Assembler_specijalneListe = [
	[ // 0
		[  Assembler_naredbe   ,  "assembler_naredba"   ,  -1  ]  ,
		[  Assembler_registri  ,  "assembler_registar"  ,  -1  ]  ,
	]
];

let Assembler_definicijaJezika = {
	naziv:              "Assembler",
	regexRastavljanje:  Assembler_regexRastavljanje,
	listaRegex:         Assembler_listaRegex,
	listaParser:        Assembler_listaParser,
	listeSpec:          Assembler_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: Markup
/* -------------------------------------------------------------------------- */

let Markup_regexRastavljanje = /(######.+?\n|#####.+?\n|####.+?\n|###.+?\n|##.+?\n|#.+?\n|\*[\s\S]*?\*\*)/g;

let Markup_listaRegex = [
	[  /(######.+?\n)/g     ,  "markup_naslov_h6"  ,  true  , false  ]  ,
	[  /(#####.+?\n)/g      ,  "markup_naslov_h5"  ,  true  , false  ]  ,
	[  /(####.+?\n)/g       ,  "markup_naslov_h4"  ,  true  , false  ]  ,
	[  /(###.+?\n)/g        ,  "markup_naslov_h3"  ,  true  , false  ]  ,
	[  /(##.+?\n)/g         ,  "markup_naslov_h2"  ,  true  , false  ]  ,
	[  /(#.+?\n)/g          ,  "markup_naslov_h1"  ,  true  , false  ]  ,
	[  /(\*[\s\S]*?\*\*)/g  ,  "markup_lista"      ,  true  , false  ]  ,
];

let Markup_listaParser = [

];

let Markup_specijalneListe = [
	
];

let Markup_definicijaJezika = {
	naziv:              "Markup",
	regexRastavljanje:  Markup_regexRastavljanje,
	listaRegex:         Markup_listaRegex,
	listaParser:        Markup_listaParser,
	listeSpec:          Markup_specijalneListe
}

/* -------------------------------------------------------------------------- */
// Jezik: RegEx
/* -------------------------------------------------------------------------- */

let RegEx_regexRastavljanje = /(\/\(|\)\/|\)\/g|\)\/gm|\\.{1}|\{.*?\}|\+|\?|\*|\\w|\\W|\\b|\\B\\c|\\C|\\s|\\S|\\d|\\D|\||\[|\]|\(|\))/g;

let RegEx_listaRegex = [
	[  /\/\(/g                                    ,  "regex_pocetak"        ]  ,
	[  /\)\/|\)\/g|\)\/gm/g                       ,  "regex_kraj"           ]  ,
	[  /\\.{1}/g                                  ,  "regex_escape"         ]  ,
	[  /\{.*?\}|\+|\?|\*/g                        ,  "regex_kvantifikator"  ]  ,
	[  /\\w|\\W|\\b|\\B\\c|\\C|\\s|\\S|\\d|\\D/g  ,  "regex_klase_znakova"  ]  ,
	[  /\||\[|\]|\(|\)/g                          ,  "operator"             ]  ,
];

let RegEx_listaParser = [

];

let RegEx_specijalneListe = [
	
];

let RegEx_definicijaJezika = {
	naziv:              "RegEx",
	regexRastavljanje:  RegEx_regexRastavljanje,
	listaRegex:         RegEx_listaRegex,
	listaParser:        RegEx_listaParser,
	listeSpec:          RegEx_specijalneListe
}
