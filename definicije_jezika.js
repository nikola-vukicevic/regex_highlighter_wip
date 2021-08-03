/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let SABLON_KOMENTAR_BLOK      = /(\/\*[\s\S]*?\*\/)/g;
let SABLON_KOMENTAR_LINIJSKI  = /(\/\/.*\n)/g;

let SABLON_KOMENTAR_SQL       = /(\-\-.*\n)/g;
let SABLON_KOMENTAR_PYTHON    = /(\#.*\n)/g;

let SABLON_PRETPROCESOR       = /(\#include.*\n)/g;
let SABLON_NISKA_APOSTROFI    = /(\'.*?\')/g;
let SABLON_NISKA_NAVODNICI    = /(\".*?\")/g;
let SABLON_ZAGRADA_OTV        = /(\()/g;
let SABLON_ZAGRADA_ZAT        = /(\))/g;
let SABLON_V_ZAGRADA_OTV      = /(\{)/g;
let SABLON_V_ZAGRADA_ZAT      = /(\})/g;
let SABLON_U_ZAGRADA_OTV      = /(\[)/g;
let SABLON_U_ZAGRADA_ZAT      = /(\])/g;
let SABLON_HEX_VREDNOST       = /(\B\#[\dA-Fa-f]{3,6}\b)/g;
let SABLON_DECIMALNA_VREDNOST = /(\d*\.\d+)/g;
let SABLON_DEKADNI_BROJ       = /(\b\d+)/g;
let SABLON_WHITE_SPACE        = /([ \t\n]+)/g;
let SABLON_OPERATOR           = /(\+\+|\-\-|&gt;\=|&gt;|&lt;\=|&lt;|\=\=|&lt;&lt;|&gt;&gt;|\-&gt;|\=|\+|\-|\*|\/)/g;
let SABLON_SEPARATOR          = /([>\.,:;]{1})/g;

/* -------------------------------------------------------------------------- */
// Jezik - CSS
/* -------------------------------------------------------------------------- */

let CSS_definicijaJezika = [
	[  SABLON_KOMENTAR_BLOK        ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  SABLON_KOMENTAR_LINIJSKI    ,  "komentar_linijski"             ]  ,  // // komentar
	[  SABLON_NISKA_APOSTROFI      ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  SABLON_NISKA_NAVODNICI      ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  SABLON_V_ZAGRADA_OTV        ,  "selektor_otvarajuca_zagrada"   ]  ,  // {
	[  SABLON_V_ZAGRADA_ZAT        ,  "selektor_zatvarajuca_zagrada"  ]  ,  // {
	[  SABLON_ZAGRADA_OTV          ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  SABLON_ZAGRADA_ZAT          ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  SABLON_HEX_VREDNOST         ,  "heksadecimalna_vrednost"       ]  ,  // #ee04e7
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
	"center",
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
	"var",
	"video",
	"wbr",
];

let CSS_pseudoklase = [
	"hover"
];

let CSS_jedinice = [
	"em",
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
	"const",
	"for",
	"function",
	"if",
	"let",
	"return",
	"var",
	"while",
];

let JS_SpecijalniTokeni = [
	"console",
	"document",
	"getElementById",
	"getElementsByClassName",
	"log",
];

/* -------------------------------------------------------------------------- */
// Jezik - HTML
/* -------------------------------------------------------------------------- */

let HTML_definicijaJezika = [
	[  /(\&lt\;\!\-\-.*\-\-\&gt\;)/g  ,  "komentar"         ]  ,  // <! ---- komentar ---- -->
	[  /(&lt;\/[A-Za-z\d]*&gt;)/g     ,  "tag_zatvarajuci"  ]  ,  // 'niska niska niska'
	[  /(&lt;.*&gt;)/g                ,  "tag_otvarajuci"   ]  ,  // 'niska niska niska'
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
	"Uint32",
	"Uint64",
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
	"System",
	"WriteLine",
	"fclose",
	"fopen",
	"out",
	"printf",
	"scanf",
];

/* -------------------------------------------------------------------------- */
// Jezik - SQL
/* -------------------------------------------------------------------------- */

let SQL_definicijaJezika = [
	[  SABLON_KOMENTAR_SQL        ,  "komentar"                      ]  ,  // -- komentar
	[  SABLON_NISKA_APOSTROFI     ,  "niska_apostrofi"               ]  ,  // 'niska niska niska'
	[  SABLON_NISKA_NAVODNICI     ,  "niska_navodnici"               ]  ,  // "niska niska niska"
	[  SABLON_ZAGRADA_OTV         ,  "zagrada_obicna_otvorena"       ]  ,  // (
	[  SABLON_ZAGRADA_ZAT         ,  "zagrada_obicna_zatvorena"      ]  ,  // )
	[  SABLON_DECIMALNA_VREDNOST  ,  "decimalna_vrednost"            ]  ,  // 12.54
	[  SABLON_DEKADNI_BROJ        ,  "dekadni_broj"                  ]  ,  // 12
	[  SABLON_SEPARATOR           ,  "separator"                     ]  ,  // separator
	[  SABLON_WHITE_SPACE         ,  "white_space"                   ]  ,  // \t\n
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
	[  SABLON_KOMENTAR_BLOK       ,  "komentar_blok"                 ]  ,  // /* ---- komentar ---- */
	[  SABLON_KOMENTAR_LINIJSKI   ,  "komentar_linijski"             ]  ,  // // komentar
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
	[  /(&lt;\?php|\?&gt;)/g      ,  "granice_bloka"                 ]  ,  // <?php ?>
	[  SABLON_OPERATOR            ,  "operator"                      ]  ,  // operator
	[  SABLON_SEPARATOR           ,  "separator"                     ]  ,  // separator
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
	"exit",
	"fclose",
	"function",
	"header",
	"html_entities",
	"isset",
	"mysqli_fetch_assoc",
	"mysqli_query",
	"mysqli_real_escape_string",
	"session_start",
	"trim",
	"unset",
];
