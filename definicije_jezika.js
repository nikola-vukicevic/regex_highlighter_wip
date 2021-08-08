/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let SABLON_KOMENTAR_BLOK      = /(\/\*[\s\S]*?\*\/)/g;
let SABLON_KOMENTAR_LINIJSKI  = /(\/\/.*\n)/g;
let SABLON_PRETPROCESOR       = /(\#.*\n)/g;
let SABLON_NISKA_APOSTROFI    = /(\'[\s\S]*?\')/g;
let SABLON_NISKA_NAVODNICI    = /(\"[\s\S]*?\")/g;
let SABLON_NISKA_BACKTICK     = /(\`[\s\S]*?\`)/g;
let SABLON_ZAGRADA_OTV        = /(\()/g;
let SABLON_ZAGRADA_ZAT        = /(\))/g;
let SABLON_V_ZAGRADA_OTV      = /(\{)/g;
let SABLON_V_ZAGRADA_ZAT      = /(\})/g;
let SABLON_U_ZAGRADA_OTV      = /(\[)/g;
let SABLON_U_ZAGRADA_ZAT      = /(\])/g;
let SABLON_HEX_VREDNOST       = /(\B\#[\dA-Fa-f]{3,6}\b)/g;
let SABLON_DECIMALNA_VREDNOST = /(\d*\.\d+)/g;
let SABLON_DEKADNI_BROJ       = /(\b\d+)/g;
let SABLON_ASSEMBLER_ADRESA   = /(0x\d+)/g;
let SABLON_WHITE_SPACE        = /([ \t\n]+)/g;
let SABLON_OPERATOR           = /(\+\+|\-\-|&gt;\=|&gt;|&lt;\=|&lt;|\=\=|&lt;&lt;|&gt;&gt;|\-&gt;|\&\&|\|\||\=|\+|\-|\*|\/)/g;
let SABLON_SEPARATOR          = /(&lt;|&gt;|\.|\,|\:|\;)/g;
/* ----- Komentari ----- */
let SABLON_KOMENTAR_SQL       = /(\-\-.*\n)/g;
let SABLON_KOMENTAR_PYTHON    = /(\#.*\n)/g;
/* ----- HTML ----- */
let SABLON_HTML_TAG_OTV       = /(&lt;[\s\S]*?&gt;)/g;
let SABLON_HTML_TAG_ZAT       = /(&lt;\/[A-Za-z\d]*&gt;)/g;
let SABLON_HTML_KOMENTAR      = /(\&lt\;\!\-\-.*\-\-\&gt\;)/g;

/* -------------------------------------------------------------------------- */
// Jezik - TXT
/* -------------------------------------------------------------------------- */

let TXT_definicijaJezika = [

];

/* -------------------------------------------------------------------------- */
// Jezik - CSS
/* -------------------------------------------------------------------------- */

let CSS_definicijaJezika = [
	[  SABLON_KOMENTAR_BLOK        ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  SABLON_KOMENTAR_LINIJSKI    ,  "komentar_linijski"             ]  ,  // // komentar
	[  SABLON_NISKA_NAVODNICI      ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  SABLON_NISKA_APOSTROFI      ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  SABLON_V_ZAGRADA_OTV        ,  "selektor_otvarajuca_zagrada"   ]  ,  // {
	[  SABLON_V_ZAGRADA_ZAT        ,  "selektor_zatvarajuca_zagrada"  ]  ,  // {
	[  SABLON_ZAGRADA_OTV          ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  SABLON_ZAGRADA_ZAT          ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  SABLON_HEX_VREDNOST         ,  "heksadecimalna_vrednost"       ]  ,  // #ee04e7
	[  /(\:[A-Za-z]+)/g            ,  "pseudoklasa"                   ]  ,  // #ajDi_01
	[  /(\-\-[a-z_]+\b)/g          ,  "css_var"                       ]  ,  // #ajDi_01
	[  /(\#[\dA-Za-z _]*)/g        ,  "id_naziv"                      ]  ,  // #ajDi_01
	[  SABLON_DECIMALNA_VREDNOST   ,  "decimalna_vrednost"            ]  ,  // 12.54
	[  /([ \t]*\.[\dA-Za-z _]*)/g  ,  "klasa_naziv"                   ]  ,  // #klasa_02
	[  SABLON_DEKADNI_BROJ         ,  "dekadni_broj"                  ]  ,  // 12
	[  /(\@[\dA-Za-z_-]*)/g        ,  "et_direktiva_naziv"            ]  ,  // @etDirektiva_03
	[  /([A-Za-z-]*\:)/g           ,  "svojstvo_naziv"                ]  ,  // font-weight:
	[  SABLON_WHITE_SPACE          ,  "white_space"                   ]  ,  // \t\n
	[  SABLON_SEPARATOR            ,  "separator"                     ]  ,  // separator
	[  /([\*]{1})/g                ,  "selektor_globalni"             ]  ,  // *
];

let CSS_htmlTagovi = [
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

let CSS_pseudoklase = [
	"hover",
	"active",
];

let CSS_jedinice = [
	"em",
	"pt",
	"px",
	"rem"
];

/* -------------------------------------------------------------------------- */
// Jezik - JavaScript
/* -------------------------------------------------------------------------- */

let JS_definicijaJezika = [
	[  SABLON_KOMENTAR_BLOK       ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  SABLON_KOMENTAR_LINIJSKI   ,  "komentar_linijski"             ]  ,  // // komentar
	[  SABLON_NISKA_APOSTROFI     ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  SABLON_NISKA_NAVODNICI     ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  SABLON_NISKA_BACKTICK      ,  "niska_backtick"                ]  ,  // "niska niska niska"
	[  SABLON_V_ZAGRADA_OTV       ,  "blok_koda_otvarajuca_zagrada"  ]  ,  // {
	[  SABLON_V_ZAGRADA_ZAT       ,  "blok_koda_zatvarajuca_zagrada" ]  ,  // {
	[  SABLON_ZAGRADA_OTV         ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  SABLON_ZAGRADA_ZAT         ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  SABLON_U_ZAGRADA_OTV       ,  "zagrada_niz_otvorena"          ]  ,  // [
	[  SABLON_U_ZAGRADA_ZAT       ,  "zagrada_niz_zatvorena"         ]  ,  // ]
	[  SABLON_HEX_VREDNOST        ,  "heksadecimalna_vrednost"       ]  ,  // #ee04e7
	[  SABLON_DECIMALNA_VREDNOST  ,  "decimalna_vrednost"            ]  ,  // 12.54
	[  SABLON_DEKADNI_BROJ        ,  "dekadni_broj"                  ]  ,  // 12
	[  SABLON_WHITE_SPACE         ,  "white_space"                   ]  ,  // \t\n
	[  SABLON_OPERATOR            ,  "operator"                      ]  ,  // operator
	[  SABLON_SEPARATOR           ,  "separator"                     ]  ,  // separator
];

let JS_RezervisaneReci = [
	"async",
	"await",
	"break",
	"case",
	"catch",
	"class",
	"const",
	"default",
	"else",
	"for",
	"function",
	"if",
	"let",
	"new",
	"return",
	"switch",
	"then",
	"try",
	"var",
	"while",
];

let JS_SpecijalniTokeni = [
	"Date",
	"Math",
	"Promise",
	"all",
	"ceiling",
	"console",
	"constructor",
	"document",
	"error",
	"fetch",
	"floor",
	"getElementById",
	"getElementsByClassName",
	"getItem",
	"innerHTML",
	"innerText",
	"localStorage",
	"log",
	"map",
	"parseInt",
	"pop",
	"push",
	"reject",
	"resolve",
	"sessionStorage",
	"setInterval",
	"setItem",
	"setTimeout",
	"shift",
];

/* -------------------------------------------------------------------------- */
// Jezik - HTML
/* -------------------------------------------------------------------------- */

let HTML_definicijaJezika = [
	[  SABLON_HTML_KOMENTAR  ,  "komentar"         ]  ,  // <! ---- komentar ---- -->
	[  SABLON_HTML_TAG_ZAT   ,  "tag_zatvarajuci"  ]  ,  // 'niska niska niska'
	[  SABLON_HTML_TAG_OTV   ,  "tag_otvarajuci"   ]  ,  // 'niska niska niska'
];

/* -------------------------------------------------------------------------- */
// Jezik - C/C++/C#
/* -------------------------------------------------------------------------- */

let CLIKE_definicijaJezika = [
	[  SABLON_KOMENTAR_BLOK       ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  SABLON_KOMENTAR_LINIJSKI   ,  "komentar_linijski"             ]  ,  // // komentar
	[  SABLON_PRETPROCESOR        ,  "pretprocesorska_direktiva"     ]  ,  // #define 3.14159265359 PI
	[  SABLON_NISKA_APOSTROFI     ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  SABLON_NISKA_NAVODNICI     ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  SABLON_V_ZAGRADA_OTV       ,  "blok_koda_otvarajuca_zagrada"  ]  ,  // {
	[  SABLON_V_ZAGRADA_ZAT       ,  "blok_koda_zatvarajuca_zagrada" ]  ,  // {
	[  SABLON_ZAGRADA_OTV         ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  SABLON_ZAGRADA_ZAT         ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  SABLON_U_ZAGRADA_OTV       ,  "zagrada_niz_otvorena"          ]  ,  // [
	[  SABLON_U_ZAGRADA_ZAT       ,  "zagrada_niz_zatvorena"         ]  ,  // ]
	[  SABLON_DECIMALNA_VREDNOST  ,  "decimalna_vrednost"            ]  ,  // 12.54
	[  SABLON_DEKADNI_BROJ        ,  "dekadni_broj"                  ]  ,  // 12
	[  SABLON_WHITE_SPACE         ,  "white_space"                   ]  ,  // \t \n razmak
	[  SABLON_OPERATOR            ,  "operator"                      ]  ,  // operator
	[  SABLON_SEPARATOR           ,  "separator"                     ]  ,  // separator
];

let CLIKE_RezervisaneReci = [
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

let CLIKE_SpecijalniTokeni = [
	"Console",
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

/* -------------------------------------------------------------------------- */
// Jezik - SQL
/* -------------------------------------------------------------------------- */

let SQL_definicijaJezika = [
	[  SABLON_KOMENTAR_SQL        ,  "komentar"                  ]  ,  // -- komentar
	[  SABLON_NISKA_APOSTROFI     ,  "niska_apostrofi"           ]  ,  // 'niska niska niska'
	[  SABLON_NISKA_NAVODNICI     ,  "niska_navodnici"           ]  ,  // "niska niska niska"
	[  SABLON_ZAGRADA_OTV         ,  "zagrada_obicna_otvorena"   ]  ,  // (
	[  SABLON_ZAGRADA_ZAT         ,  "zagrada_obicna_zatvorena"  ]  ,  // )
	[  SABLON_DECIMALNA_VREDNOST  ,  "decimalna_vrednost"        ]  ,  // 12.54
	[  SABLON_DEKADNI_BROJ        ,  "dekadni_broj"              ]  ,  // 12
	[  SABLON_SEPARATOR           ,  "separator"                 ]  ,  // separator
	[  SABLON_WHITE_SPACE         ,  "white_space"               ]  ,  // \t\n
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

/* -------------------------------------------------------------------------- */
// Jezik - Python
/* -------------------------------------------------------------------------- */

let Python_definicijaJezika = [
	[  SABLON_KOMENTAR_PYTHON     ,  "komentar"                  ]  ,  // // komentar
	[  SABLON_NISKA_APOSTROFI     ,  "niska_apostrofi"           ]  ,  // 'niska niska niska'
	[  SABLON_NISKA_NAVODNICI     ,  "niska_navodnici"           ]  ,  // "niska niska niska"
	[  SABLON_ZAGRADA_OTV         ,  "zagrada_obicna_otvorena"   ]  ,  // (
	[  SABLON_ZAGRADA_ZAT         ,  "zagrada_obicna_zatvorena"  ]  ,  // )
	[  SABLON_U_ZAGRADA_OTV       ,  "zagrada_niz_otvorena"      ]  ,  // [
	[  SABLON_U_ZAGRADA_ZAT       ,  "zagrada_niz_zatvorena"     ]  ,  // ]
	[  SABLON_DECIMALNA_VREDNOST  ,  "decimalna_vrednost"        ]  ,  // 12.54
	[  SABLON_DEKADNI_BROJ        ,  "dekadni_broj"              ]  ,  // 12
	[  SABLON_WHITE_SPACE         ,  "white_space"               ]  ,  // \t\n
	[  SABLON_OPERATOR            ,  "operator"                  ]  ,  // operator
	[  SABLON_SEPARATOR           ,  "separator"                 ]  ,  // separator
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

/* -------------------------------------------------------------------------- */
// Jezik - PHP
/* -------------------------------------------------------------------------- */

let PHP_definicijaJezika = [
	[  SABLON_KOMENTAR_BLOK       ,  "komentar_blok"                  ]  ,  // /* ---- komentar ---- */
	[  SABLON_KOMENTAR_LINIJSKI   ,  "komentar_linijski"              ]  ,  // // komentar
	[  /(&lt;\?php|\?&gt;)/g      ,  "granice_bloka"                  ]  ,  // <?php ?>
	/* ----- HTML ----- */
	[  SABLON_HTML_KOMENTAR       ,  "komentar"                       ]  ,  // <! ---- komentar ---- -->
	[  SABLON_HTML_TAG_ZAT        ,  "tag_zatvarajuci"                ]  ,  // 'niska niska niska'
	[  SABLON_HTML_TAG_OTV        ,  "tag_otvarajuci"                 ]  ,  // 'niska niska niska'
	/* ---------------- */
	[  SABLON_NISKA_NAVODNICI     ,  "niska_navodnici"                ]  ,  // "niska niska niska"
	[  SABLON_NISKA_APOSTROFI     ,  "niska_apostrofi"                ]  ,  // 'niska niska niska'
	[  SABLON_V_ZAGRADA_OTV       ,  "blok_koda_otvarajuca_zagrada"   ]  ,  // {
	[  SABLON_V_ZAGRADA_ZAT       ,  "blok_koda_zatvarajuca_zagrada"  ]  ,  // {
	[  SABLON_ZAGRADA_OTV         ,  "zagrada_obicna_otvorena"        ]  ,  // (
	[  SABLON_ZAGRADA_ZAT         ,  "zagrada_obicna_zatvorena"       ]  ,  // )
	[  SABLON_U_ZAGRADA_OTV       ,  "zagrada_niz_otvorena"           ]  ,  // [
	[  SABLON_U_ZAGRADA_ZAT       ,  "zagrada_niz_zatvorena"          ]  ,  // ]
	[  SABLON_DECIMALNA_VREDNOST  ,  "decimalna_vrednost"             ]  ,  // 12.54
	[  SABLON_DEKADNI_BROJ        ,  "dekadni_broj"                   ]  ,  // 12
	[  SABLON_WHITE_SPACE         ,  "white_space"                    ]  ,  // \t \n razmak
	[  SABLON_OPERATOR            ,  "operator"                       ]  ,  // operator
	[  SABLON_SEPARATOR           ,  "separator"                      ]  ,  // separator
];

let PHP_rezervisaneReci = [
	"break",
	"case",
	"catch",
	"class",
	"const",
	"continue",
	"do",
	"echo",
	"elseif",
	"extends",
	"for",
	"foreach",
	"if",
	"implements",
	"include",
	"include_once",
	"instanceof",
	"interface",
	"namespace",
	"new",
	"private",
	"protected",
	"public",
	"require",
	"require_once",
	"return",
	"static",
	"switch",
	"throw",
	"try",
	"use",
	"var",
	"while",
];

let PHP_specijalniTokeni = [
	"$_COOKIE",
	"$_GET",
	"$_POST",
	"$_SERVER",
	"$_SESSION",
	"$this",
	"Console",
	"WriteLine",
	"abs",
	"exit",
	"fclose",
	"function",
	"header",
	"htmlentities",
	"isset",
	"json_encode",
	"mysqli_close",
	"mysqli_connect",
	"mysqli_fetch_assoc",
	"mysqli_num_rows",
	"mysqli_query",
	"mysqli_real_escape_string",
	"password_hash",
	"pregmatch",
	"rand",
	"rand",
	"session_start",
	"set_cookie",
	"sqrt",
	"str_replace",
	"strlen",
	"trim",
	"unset",
];

/* -------------------------------------------------------------------------- */
// Jezik - JSON
/* -------------------------------------------------------------------------- */

let JSON_definicijaJezika = [
	[  /(\".+?\")(?=[\t ]*?\:)/g  ,  "svojstvo_naziv"  ,  /^(\".+\")$/g,  ""  ]  ,
	[  /(\".+?\")/g               ,  "svojstvo_vrednost"  ]  ,
	[  SABLON_DECIMALNA_VREDNOST  ,  "brojcana_vrednost"  ]  ,
	[  SABLON_DEKADNI_BROJ        ,  "brojcana_vrednost"  ]  ,
	[  /(\{|\}|\:|\,|\[|\])/g     ,  "json_separator"     ]  ,

];

/* -------------------------------------------------------------------------- */
// Jezik - ASSEMBLER
/* -------------------------------------------------------------------------- */

let Assembler_definicijaJezika = [
	[  SABLON_ASSEMBLER_ADRESA    ,  "assembler_adresa"   ]  ,
	[  SABLON_DECIMALNA_VREDNOST  ,  "brojcana_vrednost"  ]  ,
	[  SABLON_DEKADNI_BROJ        ,  "brojcana_vrednost"  ]  ,
	[  SABLON_WHITE_SPACE         ,  "white_space"        ]  ,
	[  SABLON_SEPARATOR           ,  "separator"          ]  ,
];

let Assembler_rezervisaneReci = [
	"acc",
	"add",
	"div",
	"jnc",
	"mov",
];

/* -------------------------------------------------------------------------- */
// Jezik - RegEx
/* -------------------------------------------------------------------------- */

let RegEx_definicijaJezika = [
	[  /(\{.*?\}|\+|\?|\*)/g                        ,  "regex_kvantifikator"  ]  ,
	[  /(\\w|\\W|\\b|\\B\\c|\\C|\\s|\\S|\\d|\\D)/g  ,  "regex_klase_znakova"  ]  ,
	[  /(\||\[|\]|\(|\))/g                          ,  "operator"             ]  ,
	[  /(\\.{1})/g                                  ,  "regex_escape"         ]  ,
];

let RegEx_rezervisaneReci = [
	"acc",
	"add",
	"div",
	"jnc",
	"mov",
];

/* -------------------------------------------------------------------------- */
// Jezik - Markup
/* -------------------------------------------------------------------------- */

let Markup_definicijaJezika = [
	[  /(######.+?\n)/g     ,  "markup_naslov_h6"  ]  ,
	[  /(#####.+?\n)/g      ,  "markup_naslov_h5"  ]  ,
	[  /(####.+?\n)/g       ,  "markup_naslov_h4"  ]  ,
	[  /(###.+?\n)/g        ,  "markup_naslov_h3"  ]  ,
	[  /(##.+?\n)/g         ,  "markup_naslov_h2"  ]  ,
	[  /(#.+?\n)/g          ,  "markup_naslov_h1"  ]  ,
	[  /(\*[\s\S]*?\*\*)/g  ,  "markup_lista"      ]  ,
	[  SABLON_SEPARATOR     ,  "separator"         ]  ,
];

let Markup_rezervisaneReci = [
	"acc",
	"add",
	"div",
	"jnc",
	"mov",
];
