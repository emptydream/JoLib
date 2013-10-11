/*
	jolib: hangul postpositional word(Josa) Javascript Library 
	version: 0.1.3
	Date: 2013-10-11
	
	Copyright 2013 emptydream
	http://www.emptydream.net
	Released under the GPL license
	http://www.gnu.org/licenses/gpl.html
*/
(function(window)
{

var 
	//About this library
	arrAbout = 
	{
		Version: "0.1.3",
		Created: "2013-10-11",
		Author: "emptydream",
		Blog: "www.emptydream.net"
	};
	
var 
	//ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
	charArrayChoSeong = 
		[ 0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 
		  0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e ],

	//ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
	charArrayJungSeong = 
		[ 0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 
		  0x3159, 0x315a, 0x315b, 0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 
		  0x3163 ],

	//( ) ㄱ ㄲ ㄳ ㄴ ㄵ ㄶ ㄷ ㄹ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅁ ㅂ ㅄ ㅅ ㅆ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ
	charArrayJongSeong = 
		[      0, 0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 
		  0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 
		  0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e ];


//functions with associative array
var jolib = 
{
	/*
		return the about information
	*/
	about: function()
	{
		return arrAbout;
	},
	
	/*
		Is this a Hangul Hexadecimal?
		in: a hexadecimal
		out: true(Hangul) or false
	*/
	boolIsHangulHex: function(_intSrc)
	{
		//Hangul range on hexadecimal
		if((_intSrc >= 0xAC00) && (_intSrc <= 0xD7A3))
			return true;	//Hangul
		else 
			return false;	//others
	},

	/*
		Is this a Hangul character?
		in: a character
		out: true(Hangul) or false
	*/
	boolIsHangulChr: function(_charSrc)
	{
		//convert the character to hexadecimal, and check it
		if(this.boolIsHangulHex(this.intChrToHex(_charSrc)) == true)
			return true;
		else 
			return false;
	},

	/*
		find a last Hangul character on a string
		in: a unicode string (ex. "가나12ab다b3")
		out: a unicode character (ex. "다")
	*/
	charFindLastHangulChr: function(_strSrc)
	{
		if(_strSrc == "") return "";
		
		//search for the hangul character from the last
		for(var i=_strSrc.length-1; i >= 0; i--)
		{
			if(this.boolIsHangulChr(_strSrc[i]) == true)
			{
				//return the last Hangul character
				return _strSrc[i];
			}
		}
		
		//there's no hangul
		return "";
	},

	/*
		convert a string to web-used-unicode string
		in: a string
		out: web-used-unicode string (ex. &#x000000;&#x002211;...)
	*/
	strStrToWebUnicode: function(_strSrc)
	{
		if(_strSrc == "") return "";
		
		var strUnicode = "";
		var intSrcLen = _strSrc.length;

		for(var i = 0; i < intSrcLen; i++)
		{
			//change the characters one by one
			strUnicode += this.charChrToWebUnicode(_strSrc[i]);
		}

		return strUnicode;
	},

	/*
		convert a character to web-unicode-code, except ASCII
		in: a character(ex. a)
		out: web-used-unicode(ex. &#x000000)
	*/
	charChrToWebUnicode: function(_charSrc)
	{
		//encode a char to unicode
		var charEsc = escape(_charSrc);
		
		//get a only one character
		if(charEsc == "") return "";
		
		//is this character a ASCII?
		//(ASCII code range: 0~127 Decimal, 0x00~0x80 Hexadecimal)
		else if(this.intChrEscapedUnicodeToHex(charEsc) > 0x80)
		{
			//change the unicode hex to hex number
			return (charEsc.replace("%u", "&#x")+";");
		}else
			//if the char is a ASCII, just return it
			return _charSrc;
	},

	/*
		change the unicode-hex to hex-number
		in: unicode-hex(ex. %u000000)
		out: hex-number(ex. 0x000000)
		(javascript's hexadecimal number starts with 0x
	*/
	intChrEscapedUnicodeToHex: function(_charSrc)
	{
		if(_charSrc == "") return "";
		else 
		{
			return _charSrc.replace("%u", "0x");
		}
	},

	/*
		convert a character to hex-number
		in: a unicode character(ex. a)
		out: hex-number(ex. 0x0000)
	*/
	intChrToHex: function(_charSrc)
	{
		if(_charSrc == "") return "";
		else return this.intChrEscapedUnicodeToHex(escape(_charSrc));
	},

	/*
		get hexadecimal numbers, except ASCII
		in: unicode string
		out: Array (Hangul changed to hexadecimal)
	*/
	arrayStrToHex: function(_strSrc)
	{
		var intSrcLen = _strSrc.length;
		var arrResult = new Array();	//result array
		
		if(intSrcLen <= 0) return "";
			
		for(var i = 0; i < intSrcLen; i++)
		{
			//change character to hex
			arrResult[i] = this.intChrToHex(_strSrc[i]);
		}
		
		return arrResult;
	},

	/*
		convert a hexadecimal to a unicode hex (escaped char)
		in: a hexadecimal (ex. 0xAFB8)
		out: a unicode hex (ex. %uAFB8)
	*/
	charHexToUnicodeHex: function(_intSrc)
	{
		if(_intSrc == "") return "";
		else
		{
			return _intSrc.replace("0x", "%u");
		}
	},
	
	/*
		convert a hexadecimal to a unicode character
		in: a hexadecimal (ex. 0xAFB8)
		out: a unicode character (ex. 꾸)
	*/
	charHexToUnicodeChr: function(_intSrc)
	{
		if(_intSrc == "") return "";
		else
		{
			return unescape(this.charHexToUnicodeHex(_intSrc));
		}
	},
	
	/*
		convert an array(hex) to a string(char)
		in: an Array (hex) (ex. ["0xAFB8","0xB8E8","0xB8F9"])
		out: a string (char) (ex. 꾸루룹)
	*/
	strHexArrayToUnicode: function(_arrSrc)
	{
		var intSrcLen = _arrSrc.length;
		var strResult = "";
		
		if(intSrcLen <= 0) return "";
			
		for(var i=0; i<intSrcLen; i++)
		{
			//change hex to char
			strResult += this.charHexToUnicodeChr(_arrSrc[i]);
		}
		
		return strResult;
	},
	
	/*
		convert a web-unicode string(hex) to a general string
		in: a web-used-unicode string (ex. &#xC6F9;&#xCF54;&#xB4DC;)
		out: a string (ex. 웹코드)
	*/
	strWebUnicodeToStr: function(_strSrc)
	{
		//replace the string "&#x" to "%u"
		return unescape(_strSrc.replace(/&#x(.*?);/gi, "%u$1"));
	},
	
	/*
		convert a web-unicode-code to a character, except ASCII
		in: a web-used-unicode(ex. &#x000000)
		out: a character(ex. a)
	*/
	charWebUnicodeToChr: function(_charSrc)
	{
		//get an only one character
		if(_charSrc == "") return "";
		
		//is this character a ASCII?
		//(ASCII code range: 0~127 Decimal, 0x00~0x80 Hexadecimal)
		else if(this.intWebUnicodeToHex(_charSrc) > 0x80)
		{
			//change the hex to unicode character
			return unescape(_charSrc.replace("&#x", "%u"));
		}else
			//if the char is an ASCII, just return it
			return _charSrc;
	},
	
	/*
		Convert a WebUnicode string to a hex string
		in: webunicode string (ex. &#xAFB8)
		out: hex string (ex. 44984)
	*/
	intWebUnicodeToHex: function(_charSrc)
	{
		if(_charSrc == "") return "";

		return parseInt(_charSrc.replace("&#x", "0x"), 16);
	},
	
	/*
		Convert a WebUnicode string to a hex string
		in: webunicode string (ex. &#xAFB8)
		out: hex string (ex. 0xAFB8)
	*/
	strWebUnicodeToHex: function(_charSrc)
	{
		if(_charSrc == "") return "";
		
		return _charSrc.replace("&#x", "0x");
	},
	
	/*
		get a choseong by hexadecimal
		in: a hex (a hangul character)
		out: a hex (choseong)
	*/
	intGetChoseongHex: function(_intSrc)
	{
		return (_intSrc - 0xAC00)/(28*21);
	},

	/*
		get a jungseong by hexadecimal
		in: a hex (a hangul character)
		out: a hex (jungseong)
	*/
	intGetJungseongHex: function(_intSrc)
	{
		return ((_intSrc - 0xAC00)%(28*21))/28;
	},

	/*
		get a jongseong by hexadecimal
		in: a hex (a hangul character)
		out: a hex (jongseong)
	*/
	intGetJongseongHex: function(_intSrc)
	{
		return ((_intSrc - 0xAC00)%(28*21))%28;
	},

	/*
		get a choseong on a given character
		in: a (hangul) character
		out: a choseong character
	*/
	charGetChoseongChr: function(_charSrc)
	{
		var intSrcHex = parseInt(escape(_charSrc).replace("%u", "0x"));

		if(intSrcHex < 0xAC00 || intSrcHex > 0xD7A3)
			//it's not a hangul, then just pass
			return _charSrc;
		else
		{
			//get a choseong hexadecimal number, and set it an integer
			var intJaso = this.intGetChoseongHex(intSrcHex)>>>0;
			return unescape("%u" + charArrayChoSeong[intJaso].toString(16));
		}
	},

	/*
		get a jungseong on a given character
		in: a (hangul) character
		out: a jungseong character
	*/
	charGetJungseongChr: function(_charSrc)
	{
		var intSrcHex = parseInt(escape(_charSrc).replace("%u", "0x"));

		if(intSrcHex < 0xAC00 || intSrcHex > 0xD7A3)
			//it's not a hangul, just pass
			return _charSrc;
		else
		{
			var intJaso = this.intGetJungseongHex(intSrcHex)>>>0;
			return unescape("%u" + charArrayJungSeong[intJaso].toString(16));
		}
	},

	/*
		get a jongseong on a given character
		in: a (hangul) character
		out: a jongseong character
	*/
	charGetJongseongChr: function(_charSrc)
	{
		var intSrcHex = parseInt(escape(_charSrc).replace("%u", "0x"), 16);

		if(intSrcHex < 0xAC00 || intSrcHex > 0xD7A3)
			//it's not a hangul, just pass
			return _charSrc;
		else
		{
			var intJaso = this.intGetJongseongHex(intSrcHex)>>>0;
			
			//jongseong could be not exist.
			if(intJaso <= 0) return "";
			else return unescape("%u" + charArrayJongSeong[intJaso].toString(16));
		}
	},

	/*
		get Jaso from a character
		in: a hangul character (ex.냥)
		out: a string with Jaso (ex. ㄴㅑㅇ)
	*/
	strGetJasoChr: function(_charSrc)
	{
		var intSrcHex = parseInt(escape(_charSrc).replace("%u", "0x"), 16);

		if(intSrcHex < 0xAC00 || intSrcHex > 0xD7A3)
			//it's not a hangul, just pass
			return _charSrc;
		else
		{
			var strJaso = "";
			var intJaso = 0;

			//get the cho-jung-jongseong
			strJaso = this.charGetChoseongChr(_charSrc)
				+ this.charGetJungseongChr(_charSrc) 
				+ this.charGetJongseongChr(_charSrc);
				
			return strJaso;
		}
	},

	/*
		get Jaso from a string
		in: a hangul character (ex.냥냥)
		out: a string with Jaso (ex. ㄴㅑㅇㄴㅑㅇ)
	*/
	strGetJasoStr: function(_strSrc)
	{
		var intSrcLen = _strSrc.length;
		if(intSrcLen <= 0) return "";
		
		var strJaso = "";
		
		for(var i=0; i<intSrcLen; i++)
			strJaso += this.strGetJasoChr(_strSrc[i]);
		
		return strJaso;
	},

	/*
		Is there a Jongseong at the last character?
		in: string
		out: true/false (be Jongseong or not)
	*/
	boolIsLastChrJongseong: function(_strSrc)
	{
		if(_strSrc.length <= 0) return -1;
		
		if(this.charGetJongseongChr(_strSrc[_strSrc.length-1]))
			return true;
		else 
			return false;
	},

	/*
		get a word attached ro/uro
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울로)
	*/
	strGetWordRouroStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";

		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaRouroStr(_strSrc);
	},

	/*
		get a string ro/uro
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 로)
	*/
	strGetJosaRouroStr: function(_strSrc)
	{
		var intSrcLen = _strSrc.length;
		if(intSrcLen <= 0) return "";

		//get a jongseong
		var charJong = this.charGetJongseongChr(_strSrc[_strSrc.length-1]);

		switch(charJong)
		{
			case "":
				//no jongseong
				return unescape("%uB85C");	//로
			case unescape("%u3139"):
				//jongseong is the ㄹ
				return unescape("%uB85C");	//로
			default:
				//jongseong exists
				return unescape("%uC73C%uB85C");	//으로
		}
	},

	/*
		get a word attached rosseo/urosseo
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울로써)
	*/
	strGetWordRosseoStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaRosseoStr(_strSrc);
	},

	/*
		get a string rosseo/urosseo
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 로써)
	*/
	strGetJosaRosseoStr: function(_strSrc)
	{
		var intSrcLen = _strSrc.length;
		if(intSrcLen <= 0) return "";
		
		var charJong = this.charGetJongseongChr(_strSrc[_strSrc.length-1]);

		switch(charJong)
		{
			case "":	
			//no Jongseong
				return unescape("%uB85C%uC368");	//로써
			case unescape("%u3139"):	
			//there's a Jongseong but it's 'ㄹ'
				return unescape("%uB85C%uC368");	//로써
			default:
			//there's a Jongseong
				return unescape("%uC73C%uB85C%uC368");	//으로써
		}
	},

	/*
		get a word attached un/nun
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울은)
	*/
	strGetWordUnnunStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaUnnunStr(_strSrc);
	},

	/*
		get a string un/nun
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 은)
	*/
	strGetJosaUnnunStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		if(this.boolIsLastChrJongseong(_strSrc) == true)
			return unescape("%uC740");	//은
		else
			return unescape("%uB294");	//는
	},

	/*
		get a word attached ul/rul
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울을)
	*/
	strGetWordUlrulStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaUlrulStr(_strSrc);
	},

	/*
		get a string ul/rul
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 을)
	*/
	strGetJosaUlrulStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		if(this.boolIsLastChrJongseong(_strSrc) == true)
			return unescape("%uC744");	//을
		else
			return unescape("%uB97C");	//를
	},

	/*
		get a word attached i/ga
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울이)
	*/
	strGetWordIgaStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaIgaStr(_strSrc);
	},

	/*
		get a string i/ga
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 이)
	*/
	strGetJosaIgaStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		if(this.boolIsLastChrJongseong(_strSrc) == true)
			return unescape("%uC774");	//이
		else
			return unescape("%uAC00");	//가
	},

	/*
		get a word attached a/ya
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울아)
	*/
	strGetWordAyaStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaAyaStr(_strSrc);
	},

	/*
		get a string a/ya
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 아)
	*/
	strGetJosaAyaStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		if(this.boolIsLastChrJongseong(_strSrc) == true)
			return unescape("%uC544");	//아
		else
			return unescape("%uC57C");	//야
	},

	/*
		get a word attached wa/gwa
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 서울과)
	*/
	strGetWordWagwaStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaWagwaStr(_strSrc);
	},

	/*
		get a string wa/gwa
		in: a word(string) (ex. 서울)
		out: a word(string) (ex. 과)
	*/
	strGetJosaWagwaStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		if(this.boolIsLastChrJongseong(_strSrc) == true)
			return unescape("%uACFC");	//과
		else
			return unescape("%uC640");	//와
	},

	/*
		Get a word attached 라고/이라고 on the given word
		in: a string
		out: a string attached 라고 or 이라고
	*/
	strGetWordRagoStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		//get the Josa and attach it on the given string
		return _strSrc + this.strGetJosaRagoStr(_strSrc);
	},

	/*
		Get a Josa 라고/이라고 depend on a word
		in: a string
		out: a string 라고 or 이라고
	*/
	strGetJosaRagoStr: function(_strSrc)
	{
		if(_strSrc.length <= 0) return "";
		
		if(this.boolIsLastChrJongseong(_strSrc) == true)
			//there's a Jongseong
			return unescape("%uC774%uB77C%uACE0");	//이라고
		else
			//no Jongseong
			return unescape("%uB77C%uACE0");	//라고

	}
};

window.jolib = jolib;

})(window);
