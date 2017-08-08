// Copyright 2006-2017 ClickTale Ltd., US Patent Pending
// Generated on: 3/15/2017 3:32:16 AM (UTC 3/15/2017 8:32:16 AM)

window.ClickTaleGlobal = window.ClickTaleGlobal || {};
ClickTaleGlobal.scripts = ClickTaleGlobal.scripts || {};
ClickTaleGlobal.scripts.filter = ClickTaleGlobal.scripts.filter || (function () {
	var recordingThreshold = Math.random() * 100;

	return {
		isRecordingApproved: function(percentage) {
			return recordingThreshold <= percentage;
		}
	}
})();
	
		
// Copyright 2006-2017 ClickTale Ltd., US Patent Pending
// PID: 79
// Generated on: 3/15/2017 3:32:16 AM (UTC 3/15/2017 8:32:16 AM)



/*browsers exclusion start*/function doOnlyWhen(toDoHandler, toCheckHandler, interval, times, failHandler) {
    if ((!toDoHandler) || (!toCheckHandler)) return;
    if (typeof interval == "undefined") interval = 1000;
    if (typeof times == "undefined") times = 20;

    if (--times < 0 && typeof failHandler === 'function') {
        failHandler();
        return;
    }
    if (toCheckHandler()) {
        toDoHandler();
        return;
    }

    setTimeout(function () { doOnlyWhen(toDoHandler, toCheckHandler, interval, times); }, interval);
}
doOnlyWhen(function () { if (window.ClickTaleSettings.PTC.okToRunPCC) { (function(){
window.ClickTaleSettings = window.ClickTaleSettings || {};
window.ClickTaleSettings.PTC = window.ClickTaleSettings.PTC || {};
window.ClickTaleSettings.PTC.originalPCCLocation = "P33_PID79";
var e=!0,f=!1,j=this;var k,l,m,o;function p(){return j.navigator?j.navigator.userAgent:null}o=m=l=k=f;var q;if(q=p()){var aa=j.navigator;k=0==q.indexOf("Opera");l=!k&&-1!=q.indexOf("MSIE");m=!k&&-1!=q.indexOf("WebKit");o=!k&&!m&&"Gecko"==aa.product}var r=k,t=l,u=o,v=m,x;
a:{var y="",z;if(r&&j.opera)var A=j.opera.version,y="function"==typeof A?A():A;else if(u?z=/rv\:([^\);]+)(\)|;)/:t?z=/MSIE\s+([^\);]+)(\)|;)/:v&&(z=/WebKit\/(\S+)/),z)var B=z.exec(p()),y=B?B[1]:"";if(t){var C,D=j.document;C=D?D.documentMode:void 0;if(C>parseFloat(y)){x=""+C;break a}}x=y}var E={};
function F(a){var b;if(!(b=E[a])){b=0;for(var c=(""+x).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=(""+a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),g=Math.max(c.length,d.length),n=0;0==b&&n<g;n++){var L=c[n]||"",ka=d[n]||"",la=RegExp("(\\d*)(\\D*)","g"),w=RegExp("(\\d*)(\\D*)","g");do{var h=la.exec(L)||["","",""],i=w.exec(ka)||["","",""];if(0==h[0].length&&0==i[0].length)break;b=((0==h[1].length?0:parseInt(h[1],10))<(0==i[1].length?0:parseInt(i[1],10))?-1:(0==h[1].length?0:parseInt(h[1],
10))>(0==i[1].length?0:parseInt(i[1],10))?1:0)||((0==h[2].length)<(0==i[2].length)?-1:(0==h[2].length)>(0==i[2].length)?1:0)||(h[2]<i[2]?-1:h[2]>i[2]?1:0)}while(0==b)}b=E[a]=0<=b}return b}var G={};function ba(){G[9]||(G[9]=t&&!!document.documentMode&&9<=document.documentMode)};!t||ba();!t||ba();t&&F("8");!v||F("528");u&&F("1.9b")||t&&F("8")||r&&F("9.5")||v&&F("528");!u||F("8");var ca;function da(a){var b="someText".trim,c=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;ca=b&&!b.call(new String("\ufeff\u00a0"))?function(a){return null==a?"":b.call(a)}:function(a){return null==a?"":(a+"").replace(c,"")};return ca(a)};function H(a,b){var c=Element.prototype;H=function(a,c){return!a||!document.documentElement.contains(a)?f:H.e.call(a,c)};H.e=c.matches||c.webkitMatchesSelector||c.mozMatchesSelector||c.msMatchesSelector;return H(a,b)}function I(a,b){I=Element.prototype.closest?function(a,b){return Element.prototype.closest.call(a,b)}:function(a,b){for(;a&&!H(a,b);)a=a.parentElement;return a};return I(a,b)};function ea(a){function b(){c||(c=e,a())}var c=f;"complete"===document.readyState||"interactive"===document.readyState?b():document.addEventListener&&document.addEventListener("DOMContentLoaded",b,f)}
function J(a,b,c,d,g){"string"===typeof a?(a=document.querySelectorAll(a),Array.prototype.forEach.call(a,function(a){J(a,b,c,d,g)})):a instanceof Array||a instanceof NodeList?Array.prototype.forEach.call(a,function(a){J(a,b,c,d,g)}):a.addEventListener(b,function(a,b,c,d,g){return function(h){if("function"===typeof c)c.apply(this,arguments),g&&a.removeEventListener(b,arguments.callee,f);else{var i=I(h.target,c);i&&(d.apply(i,arguments),g&&a.removeEventListener(b,arguments.callee,f))}}}(a,b,c,d,g),
f)}function fa(a,b){document.addEventListener("mouseup",function(c){a===c.target&&b();document.removeEventListener("mouseup",arguments.callee,f)},f)}function ga(a,b){function c(c){document.removeEventListener("touchend",arguments.callee,f);a===c.target&&b()}document.addEventListener("touchend",c,f);document.addEventListener("touchmove",function(a){document.removeEventListener("touchmove",arguments.callee,f);document.removeEventListener("touchend",c,f)},f)}
function K(a,b){var c=M();c&&(K=c.m?ga:fa,K(a,b))}function ha(a){for(var b=0;b<a.length;b++){var c=a[b];c&&("string"===typeof c?(c=da(c))&&N(c):Array.isArray(c)&&ha(c))}};function O(a){if(window.CSS&&"function"===typeof window.CSS.escape)O=function(a){return window.CSS.escape.call(window.CSS,a)};else{var b=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,c=function(a,b){return b?"\x00"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a};O=function(a){return(a+"").replace(b,c)}}return O(a)};function ia(){"function"===typeof ClickTaleStop&&ClickTaleStop()}function N(a,b){"function"===typeof ClickTaleEvent&&(b?N.b[a]!==e&&(N.b[a]=e,ClickTaleEvent(a)):ClickTaleEvent(a))}N.b={};function ja(){var a=P;"function"===typeof ClickTaleRegisterFormSubmit&&ClickTaleRegisterFormSubmit(a)}function ma(){var a=P;"function"===typeof ClickTaleRegisterFormSubmitSent&&ClickTaleRegisterFormSubmitSent(a)}
function na(a){"function"===typeof window.ClickTaleRegisterElementAction&&(ClickTaleRegisterElementAction("mouseover",a),ClickTaleRegisterElementAction("click",a))}function oa(a,b){var c={},d;for(d in a)c[d]=a[d];c.target=b;c.srcElement=b;na(c)}window.ClickTaleDetectAgent&&window.ClickTaleDetectAgent()&&window.ClickTaleDetectAgent();
function pa(a,b){"object"==typeof a&&"string"==typeof b&&(window.ClickTaleContext&&-1!=document.referrer.indexOf(location.hostname)&&window.parent.ct&&window.parent.ct.ElementAddressing&&"function"===typeof window.parent.ct.ElementAddressing.setCustomElementID?window.parent.ct.ElementAddressing.setCustomElementID(a,b):(window.ClickTaleSetCustomElementID=window.ClickTaleSetCustomElementID||function(a,b){a.ClickTale=a.ClickTale||{};a.ClickTale.CustomID=b},window.ClickTaleSetCustomElementID(a,b)))}
function qa(){Array.prototype.forEach.call(document.querySelectorAll("[id]"),function(a){if(!H(a,'input[type="hidden"]')){var b=a.getAttribute("id");b.match(/(?:\r|\n)/)&&"function"===typeof ClickTaleNote&&ClickTaleNote("ctlib.api.SetCustomElementIdDuplicates: ids with line break found!");var a=document.querySelectorAll('[id="'+O(b)+'"]'),c=ra;1<a.length&&!c[b]&&(c[b]=e,Array.prototype.forEach.call(a,function(a,c){pa(a,b.replace(/(\r|\n|\r\n|\s+)+/g,"_").replace(/\W/g,"_")+"_"+c)}))}})}var ra={};
function sa(a,b){"function"===typeof window.ClickTaleLogical&&(N.b={},ra={},b?window.ClickTaleLogical(a,b):window.ClickTaleLogical(a))}function M(){if("function"===typeof ClickTaleDetectAgent){var a=ClickTaleDetectAgent();if(a)return M=function(){return a},M()}return null}
function ta(){var a;if(!a){a="mousedown";if("boolean"!=typeof Q){var b=M();b&&(Q=b.m)}Q&&(a="touchstart")}J(document,a,"label[for], img, a, button, textarea, input, select",function(a){var b=a.target,g=this;K(b,function(a,b){return function(){if(H(this,"label[for]")){var c=g.getAttribute("for");if(c&&(c=document.querySelector('[id= "'+c+'"]'))){var d={},w;for(w in b)d[w]=b[w];d.target=c;d.srcElement=c;"function"===typeof window.ClickTaleRegisterElementAction&&ClickTaleRegisterElementAction("mouseover",
d)}}if(!Q)if(H(this,"button,a,textarea")&&this!=a)oa(b,this);else{var h=function(){};document.addEventListener("click",function(a){return h=function(b){b.target===a&&(R=e);document.removeEventListener("click",arguments.callee,f)}}(a),f);setTimeout(function(){R||na(b);document.removeEventListener("click",h,f);R=void 0},200)}}.bind(g)}(b,a))})}var Q,R;
function S(a,b,c,d){S.d&&(S.d=f,d=d||400,"number"==typeof c&&(d=c,c=""),b=b||document.location.href,ia(),window.ClickTaleIncludedOnDOMReady=e,window.ClickTaleIncludedOnWindowLoad=e,"function"===typeof ClickTaleUploadPage&&ClickTaleUploadPage(void 0,void 0),sa(b,c),a(),setTimeout(function(){S.d=e},d))}S.d=e;function ua(a){"function"===typeof ClickTaleExec&&ClickTaleExec(a)}var T=N;var U="",V="",W=f,va=e,X="on",wa=location.href,P;
function Y(){qa();var a=W.toString();"function"===typeof ClickTaleField&&ClickTaleField("isMobile",a);wa=location.href;V=document.location.pathname.toLowerCase();if(va)va=f;else for(var a=window.ClickTaleSettings&&window.ClickTaleSettings.PTC&&window.ClickTaleSettings.PTC.InitFuncs?window.ClickTaleSettings.PTC.InitFuncs:[],b=0,c=a.length;b<c;b++)if("function"===typeof a[b])a[b]();window.s&&window.s.pageName&&T("Onload | Page Name | "+jQuery.trim(window.s.pageName));"/"==V&&(U="Homepage");"/checkout/sp/"==
V&&(U="Checkout",1==jQuery("div.checkout-warnings div.msg-header").length&&(a=jQuery.trim(jQuery("div.checkout-warnings div.msg-header:first").text()))&&T("Onload | Checkout | Error | "+a),Z(jQuery("div.billing-page"))&&1==jQuery("div.billing-page input[name=fnameShipping]:visible").length&&(""==jQuery("div.billing-page input[name=fnameShipping]:first").val()&&T("Onload | Checkout | Blank Form"),"function"===typeof ClickTaleFormDisableAll&&ClickTaleFormDisableAll(),a=jQuery("div.billing-page input[type=text],div.billing-page input[type=checkbox],div.billing-page select").toArray(),
b=jQuery("button.payment-continue"),Z(a)&&Z(b)&&(b=[b[0]],P="function"===typeof window.ClickTaleLogicalForm?window.ClickTaleLogicalForm("Checkout",a,b):0)))}function Z(a){return 0<a.length?e:f}
function xa(){if(!window.ClickTaleFirstPCCGo){window.ClickTaleFirstPCCGo=e;var a=M();a&&(W=a.m);"function"!=typeof jQuery.fn.on&&(X="delegate");Y();var a="a.search-magnify-btn,div.icon-chegg-hamburger"+("Homepage"==U?",div.section a":""),a=a+("Checkout"==U?",button.payment-continue":""),b=W?"touchstart":"mousedown",a="on"===X?[b,a]:[a,b];jQuery(document)[X](a[0],a[1],function(a){jQuery(a);a=jQuery(this);a.is("div.chgg-hdr-search-box a.autosuggest-search-btn.search-magnify-btn")&&T("Action | Header | Submit Search");
a.is("div.icon-chegg-hamburger")&&T("Action | Hamburger");switch(U){case "Homepage":a.is("div.sohp-header a.autosuggest-search-btn.search-magnify-btn")&&T("Action | Homepage | Submit Search");a.is("div.section a")&&T("Action | Homepage | Section CTA");break;case "Checkout":a.is("button.payment-continue")&&(T("Action | Checkout | Clicked Continue"),setTimeout(function(){if(jQuery("div.error-msg-sm:visible").length&&(T("Action | Checkout | Validation Errors"),P)){var a=P;"function"===typeof ClickTaleRegisterFormSubmitFailure&&
(a?ClickTaleRegisterFormSubmitFailure(a):ClickTaleRegisterFormSubmitFailure())}},1500),P&&(ja(),ma()))}});jQuery(document)[X]("keyup","input#autosuggest-input,input#header-autosuggest-input",function(a){var a=13==a.keyCode?e:f,b=jQuery(this);b.is("input#autosuggest-input")&&(a&&"Homepage"==U?T("Action | Homepage | Submit Search"):ua('jQuery("input#autosuggest-input").val("'+b.val()+'");'));b.is("input#header-autosuggest-input")&&(a?T("Action | Header | Submit Search"):ua('jQuery("input#header-autosuggest-input").val("'+
b.val()+'");'))})}}(function(a){function b(){2==++window.okToStartOn2&&a()}window.okToStartOn2=0;ea(function(){b()});if("function"==typeof ClickTaleIsRecording&&ClickTaleIsRecording()===e)b();else{var c=window.ClickTaleOnRecording||function(){};window.ClickTaleOnRecording=function(){b();return c.apply(this,arguments)}}})(function(){ta();xa()});window.clickTaleStartEventSignal=function(a){S(Y,location.href,wa);a&&"string"===typeof a&&T(a)};window.clickTaleEndEventSignal=function(){ia()};
window.ClicktaleIntegrationExperienceHandler=function(a,b,c){var d;return function(){var g=this,n=arguments,L=c&&!d;clearTimeout(d);d=setTimeout(function(){d=null;c||a.apply(g,n)},b);L&&a.apply(g,n)}}(function(){S(Y,document.location.href);arguments.length&&ha(arguments)},400,f);})();} }, function () { return !!(window.ClickTaleSettings && window.ClickTaleSettings.PTC && typeof window.ClickTaleSettings.PTC.okToRunPCC != 'undefined'); }, 500, 20);

