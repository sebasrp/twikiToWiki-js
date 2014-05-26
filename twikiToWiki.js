var TWIKITOWIKI = (function () {
	var my = {};

	my.getNumber = function(numToGet) {
		return numToGet;
	}

	my.rules = [
		[/^%TOC%/gi, ''],  // Remove Table of contents
		[/^%STARTINCLUDE%/gi, ''],
		[/^%STOPINCLUDE%/gi, ''],
		[/^%SEARCH{[^}]*}%/gi, ''],  // Remove SEARCH macro
		[/^%META.*/gi, ''],  // Remove meta tags
		[/<\/div>/gi, ''],  // Remove closing div tags
		[/<div(?: [^>]*)?>/gi, ''],  // Remove opening div tags
		[/<noautolink(?: [^>]*)?>/gi, ''],  // Remove opening noautolink tags
		[/<\/noautolink>/gi, ''],  // Remove closing noautolink tags
		[/( )(!)(\w+)/gi, '$1$3'],  // remove ! from Twiki words.

		// Formatting
		[/(^|[\s\(])\*([^ ].*?[^ ])\*([\s\)\.\,\:\;\!\?]|$)/gi , "$1'''$2'''$3"],
		[/(^|[\s\(])\_\_([^ ].*?[^ ])\_\_([\s\)\.\,\:\;\!\?]|$)/gi , "$1''<b>$2</b>''$3"],  // italic bold
		[/(^|[\s\(])\_([^ ].*?[^ ])\_([\s\)\.\,\:\;\!\?]|$)/gi, "$1''$2''$3"], // italic
		[/(^|[\s\(])==([^ ].*?[^ ])==([\s\)\.\,\:\;\!\?]|$)/gi, "$1'''<tt>$2</tt>'''$3"],  // monospaced bold
		[/(^|[\s\(])=([^ ].*?[^ ])=([\s\)\.\,\:\;\!\?]|$)/gi, "$1<tt>$2</tt>$3"],  // monospaced
		[/(^|[\\n\r])---\+\+\+\+\+\+([^\\n\r]*)/gi, "$1======$2 ======"],  // H6
		[/(^|[\n\r])---\+\+\+\+\+([^\n\r]*)/gi, "$1=====$2 ====="],  // H5
		[/(^|[\n\r])---\+\+\+\+([^\n\r]*)/gi, "$1====$2 ===="],  // H4
		[/(^|[\n\r])---\+\+\+([^\n\r]*)/gi, "$1===$2 ==="],  // H3
		[/(^|[\n\r])---\+\+([^\n\r]*)/gi, "$1==$2 =="],  // H2
		[/(^|[\n\r])----\+\+([^\n\r]*)/gi, "$1==$2 =="],  // H2 (slightly misformed variant)
		[/(^|[\n\r])---\+[!]*([^\n\r]*)/gi, "$1=$2 ="],  // H1
		// Links
		[/\[\[(https?:.*?)]\[(.*?)]]/gi, "[$1 $2]"],  // external link [[http:...][label]]
		[/\[\[((?!http).*?)]\[(.*?)]]/gi, "[[$1 | $2]]"],  // internal link [[http:...][label]]
		[/<a .* href=\"(.*?)\".*>(.*)<\/a>/gi, "[$1 $2]"], // external link
		// Bullets
		[/(^|[\n\r])[ ]{3}\* /gi, "$1* "],  // level 1 bullet
		[/(^|[\n\r])[\t]{1}\* /gi, "$1* "],  // level 1 bullet: Handle single tabs (from twiki .txt files)
		[/(^|[\n\r])[ ]{6}\* /gi, "$1** "],  // level 2 bullet
		[/(^|[\n\r])[\t]{2}\* /gi, "$1** "],  // level 1 bullet: Handle double tabs
		[/(^|[\n\r])[ ]{9}\* /gi, "$1*** "],  // level 3 bullet
		[/(^|[\n\r])[\t]{3}\* /gi, "$1*** "],  // level 3 bullet: Handle tabbed version
		[/(^|[\n\r])[ ]{12}\* /gi, "$1**** "],  // level 4 bullet
		[/(^|[\n\r])[ ]{15}\* /gi, "$1***** "],  // level 5 bullet
		[/(^|[\n\r])[ ]{18}\* /gi, "$1****** "],  // level 6 bullet
		[/(^|[\n\r])[ ]{21}\* /gi, "$1******* "],  // level 7 bullet
		[/(^|[\n\r])[ ]{24}\* /gi, "$1******** "],  // level 8 bullet
		[/(^|[\n\r])[ ]{27}\* /gi, "$1********* "],  // level 9 bullet
		[/(^|[\n\r])[ ]{30}\* /gi, "$1********** "],  // level 10 bullet
		// Numbering
		[/(^|[\n\r])[ ]{3}[0-9]\.? /gi, "$1# "],  // level 1 bullet
		[/(^|[\n\r])[\t]{1}[0-9]\.? /gi, "$1# "],  // level 1 bullet: handle 1 tab
		[/(^|[\n\r])[ ]{6}[0-9]\.? /gi, "$1## "],  // level 2 bullet
		[/(^|[\n\r])[\t]{2}[0-9]\.? /gi, "$1## "],  // level 2 bullet: handle 2 tabs
		[/(^|[\n\r])[ ]{9}[0-9]\.? /gi, "$1### "],  // level 3 bullet
		[/(^|[\n\r])[\t]{3}[0-9]\.? /gi, "$1### "],  // level 3 bullet: handle 3 tabs
		[/(^|[\n\r])[ ]{12}[0-9]\.? /gi, "$1#### "],  // level 4 bullet
		[/(^|[\n\r])[ ]{15}[0-9]\.? /gi, "$1##### "],  // level 5 bullet
		[/(^|[\n\r])[ ]{18}[0-9]\.? /gi, "$1###### "],  // level 6 bullet
		[/(^|[\n\r])[ ]{21}[0-9]\.? /gi, "$1####### "],  // level 7 bullet
		[/(^|[\n\r])[ ]{24}[0-9]\.? /gi, "$1######## "],  // level 8 bullet
		[/(^|[\n\r])[ ]{27}[0-9]\.? /gi, "$1######### "],  // level 9 bullet
		[/(^|[\n\r])[ ]{30}[0-9]\.? /gi, "$1########## "],  // level 10 bullet
		[/(^|[\n\r])[ ]{3}\$ ([^:]*)/gi, "$1; $2 "], // $ definition: term
		[/^[\s]+/gi, ''],
		// Verbatim
		[/<verbatim>(.*)<\/verbatim>/gi, '<pre>$1</pre>'],
		[/<verbatim>/gi, '<pre>'],
		[/<\/verbatim>/gi, '</pre>'],
		];

	my.translateTwikiToWiki = function(line){
		// Converts a line from TWiki to Mediawiki syntaxes"""
		console.log("testing");
		my.rules.forEach(function(entry) {
			line = line.replace(entry[0], entry[1]);
		});
		return line;
	};

	my.convert_twiki_to_wikimedia = function(text){
		// Converts a text from TWiki syntax to Mediawiki's"""

		var converted = '';
		var converting_table = false;
		text.split("\n").forEach(function(line) {
			// Handle Table Endings
			if (converting_table){
				if (null != line.match("^[^\|]")){
					converted += "|}\n\n";
					converting_table = false;
				}
			}

			// Handle Tables
			console.log(line.match(/\|/gi));
			if (null != line.match(/\|/gi)){
				if (converting_table === false){
					converted += '{| cellpadding="5" cellspacing="0" border="1"' + "\n";
					converting_table = true;
				}
				// start new row
				converted += "|-\n";

				arAnswer = line.replace(/\\b\|$'\\b/gi, '');  // remove end pipe.
				arAnswer = arAnswer.replace(/(.)\|(.)/gi, '$1\|\|$2');  // remove end pipe.

				// text = '||'.join(map(translate_twiki_to_wiki, re.split(r'\|', arAnswer[1:])))
				converted += '|' + arAnswer + "\n"

			// Handle blank lines..
			} else if (null != line.match(/^$/gi)){
				converted += line + "\n";
			} else {
				// Handle anything else...
				text = my.translateTwikiToWiki(line);
				converted += text + "\n";
			}
		});
		// Get rid of the Categories header
		converted = converted.replace(/----\n<b>Categories for.*<\/b> /gi, "");
		return converted;
	};

	return my;
}());