/*********** Begin Chegg.com AppMeasurement code file ************/

/* code version - update this date whenever making changes to this file */
var s_code_version = "CH|v20170314";

/************************** REPORT SUITE DECLARATION ***********************************

 logic below looks at several elements to decide where to send data inside Analytics.

 ****************************************************************************************/
/* if URL of DTM script contains "-staging" we are in staging environment*/
var ps = document.getElementsByTagName('script');
var sacct_env;
for(var c=0;c<ps.length;c++){
    if(ps[c].src.toLowerCase().indexOf('satellitelib')>-1 && ps[c].src.indexOf('-staging')>-1){
        sacct_env = 'staging'
    }
}
/* try to detect if staging version of DTM container is used in case of map local or map remote */
try{
    if(_satellite.settings.isStaging === true){ /* if DTM is being run and the staging flag is set to true */
        sacct_env = 'staging';
    }
} catch(err){
    sacct_env = 'staging'; /* this means we aren't using the DTM and container should be set to staging anyway */
}

/* logic to set report suite based on staging flag above and base URL */
if(sacct_env == 'staging'){
    // Dev/Test
    var s_account = isInNativeApp() === true ? 'cheggnativeappdev' : 'cheggincdev';
} else {
    // Production
    var s_account = isInNativeApp() === true ? 'cheggnativeappprod' : 'cheggincglobal';
}

function isInNativeApp() {
    if ((!!window.KERMIT_PARAMS && window.KERMIT_PARAMS.is_in_app)
      		|| (typeof C !== "undefined"
                && typeof C.Kermit !== "undefined"
                && typeof C.Kermit.shell !== "undefined")) {
        return true;
    } else {
      try {
      	if (!!parent.KERMIT_PARAMS && parent.KERMIT_PARAMS.is_in_app) {
        	return true;
      	}
      } catch (e) {
        // do nothing
     	}

    	return false;
    }
}


/* set report suite using output of logic above */
var s=s_gi(s_account);

/************************** GLOBAL CONFIG ***************************

 put any global config information and variable here.

 *********************************************************************/
/* turn on use of plugins */
s.usePlugins = true;

/* general config */
s.linkTrackVars="eVar4,eVar5,eVar7,eVar11,eVar12,eVar49,prop6,prop7,prop11,prop20,prop75"
s.linkTrackEvents="None"
s.fpCookieDomainPeriods = "2"

/* Time Parting Plugin Config, for daylight savings time */
s._tpDST = {
    2015:'3/8,11/1',
    2016:'3/13,11/6',
    2017:'3/12,11/5',
    2018:'3/11,11/4',
    2019:'3/10,11/3'}
 

s.pte = 'event401,event402,event403,event404,event405,event406,event407,event408,event409,event410';
s.ptc = false;

//ClickTale Integration Start
function clickTaleGetUID_PID() {
    if (document.cookie.indexOf("WRUID") > -1 && document.cookie.indexOf("WRIgnore=true") == -1) {
        var ca = document.cookie.split(';');
        var PID = 0, UID = 0;
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf("CT_Data") > -1) PID = c.substring(c.indexOf("apv_")).split("_")[1];
            if (
              ((document.cookie.match(/WRUID/g) || []).length == 1 && c.indexOf("WRUID") > -1) ||
              (c.indexOf("WRUID") > -1 && (document.cookie.match(/WRUID/g) || []).length > 1 && c.indexOf("WRUID=") == -1)
            )
                UID = c.split("=")[1];
        }
        return (UID == 0 || PID == 0) ? null : (UID + "." + PID);
    }
    else
        return null;
}
var clickTaleValues = clickTaleGetUID_PID();
if (clickTaleValues != null) {
    s.eVar78 = clickTaleValues;
}
//ClickTale Integration End

/************************** DOPLUGINS ********************************

 put code in the below function to execute on every server call

 *********************************************************************/
function s_doPlugins(s) {
    /* external promotions */
    if(!s.campaign){	
        s._utm_source=s.Util.getQueryParam('utm_source');
        s._utm_medium=s.Util.getQueryParam('utm_medium');
        s._utm_content=s.Util.getQueryParam('utm_content');
        s._utm_campaign=s.Util.getQueryParam('utm_campaign');
        s.campaign=s._utm_source + "|" + s._utm_medium + "|" + s._utm_content + "|" + s._utm_campaign;
        if(s.campaign === "|||"){s.campaign = ""};
    }

    /* set user statuses only if they changes */
    // CS subscription
    if (!s.eVar63 && s.prop23 || s.eVar63 !== s.prop23) {
        s.eVar63 = s.prop23;
    }

    /* User ID*/
    if (_satellite.getVar('userUUID')) {
        s.eVar11 = s.prop11 = _satellite.getVar('userUUID');
    }

    /* time between checkout start and purchase - SV 6/27 commented out until compatibility issue can be fixed. 
    if(s.events && s.events.indexOf('scCheckout')>-1)s.prop14='start';
    if(s.events && s.events.indexOf('purchase')>-1)s.prop14='stop';
    _satellite.notify("@@@@@@@@++++++++@@@@@@@@+++++++++@@@@@@@@",4);
    _satellite.notify("@@s.events ="+s.events,4);
    _satellite.notify("@@Prop14 (before plugin) ="+s.prop14,4);
    s.prop14=s.getTimeToComplete(s.prop14,'ttc',0);
    _satellite.notify("@@Prop14 (after plugin) ="+s.prop14,4);
    if(s.prop14){
        s.linktrackVars += ',prop14';
        }
	*/
    /* Set s.events String as context data for use in processing rules if needed */
   // if(s.events){
       // s.contextData['events'] = s.events;
   // }

    /* detect present of visitor API and set in context data variable if needed */
    s.contextData['visitorAPI'] = (typeof(Visitor) != "undefined" ? "VisitorAPI Present" : "VisitorAPI Missing");
    /* put visitor ID in prop20 for debugging purposes */
    s.prop20="D=mid";

    /* page depth for conversion events	*/
    s.eVar37="+1";

    /* header-based variables */
    s.pageUrl=document.location.href;
    if(s.pageUrl.indexOf("?")>0){
        s.pageUrl=s.pageUrl.split("?");
    } else {
        s.pageUrl=s.pageUrl.split("#");
    }
    s.prop7=s.pageUrl[0];
    s.prop6=s.pageUrl[1] ? s.pageUrl[1] : '';
    s.eVar5="D=c7";
    s.eVar4="D=c6";
	
    /* copy page name to eVar */
  	//s.pageName = _satellite.getVar('pageName');
    if(s.pageName && !s.eVar7){
		s.eVar7=s.pageName;
	} else if(!s.pageName && !s.eVar7){ /* set eVar7 to URL in case pageName isn't set to avoid issues with eVar persistence */
		s.eVar7="D=c7";
	}
	
	/* belt-and-suspenders approach for making sure prodview and event16 are set for chegg study product views */
	if((s.pageName === "chegg|web|cs|chegg study homepage" || s.pageName === "chegg|web|cs|tbs|tbs book page" || s.pageName ==="chegg|web|cs|qa|my q&a") && typeof s.products!== "undefined"){
		if(typeof s.events === "undefined"){
			s.events="prodView,event16";
    } else if (s.events === "") {
      s.events="prodView,event16";
    }else if (s.events.toLowerCase().indexOf('prodview,event16') == -1){
			s.events=s.apl(s.events,'prodView,event16',",",2);
		} 
	}
	
	/* previous page name */
    s.eVar6=s.getPreviousValue(s.pageName,'gpv_v6','');

    /* Page Title */
    if(!s.prop22){s.prop22 = document.title;}
    if(s.prop22){s.eVar55="D=c22";}

    /* time parting */
    var tpA = s.getTimeParting('n','-8'); /* "-8" = pacific time */
    tpA = tpA.split('|');
    s.eVar12=tpA[0] + "/" + tpA[1] + "/" + tpA[2] + " " + tpA[3]; /* time stamp to help with debugging order information */

    /* clicked element tracking */
    s.hbx_lt = "auto";
    s.setupLinkTrack(",,prop13,","hbx_lt");

	/* perfomance timing */
	s.performanceTiming();

    /* audience manager segment */
    s.list1=s.getAamSegments('aamsc','aam_sc');

    /* List of Chegg Experiments from exp cookie */
    s.list2=decodeURIComponent(s.c_r('exp'));

    /* AppMeasurement code version */
    s.prop75=s_code_version + "|" + s.version;
    try { /* try/catch statements in case DTM or visitor API information isn't available on page load */
      s.prop75 += "|" + s.visitor.version;
    } catch(e) {
        s.prop75+="|No MCID API";
    }
    try {
        s.prop75+="|" + _satellite.buildDate;
    } catch(e) {
        s.prop75+="|No DTM Build Date";
    }

    try {
        var idState = s.visitor.isClientSideMarketingCloudVisitorID();
        if (idState == null) {
            s.prop75+="|Existing ID";
        } else {
            s.prop75+= idState ? "|Client Side ID" : "|Server Side ID";
        }
    } catch(e) {
        s.prop75+="|Unknown ID state";
    }

  
    /*  NATIVE TO WEB VIEW VISITOR ID TRACKING */

    if (s.Util.getQueryParam("appvi")) {
        s.new_vi_date=new Date;
        s.new_vi_date.setFullYear(s.new_vi_date.getFullYear() + 5);
        s.c_w("app_vi",s.Util.getQueryParam("appvi"),s.new_vi_date);
        s.visitorID=s.c_r("app_vi");
        s.visitor.setAnalyticsVisitorID(s.c_r("app_vi"));
    }
    else if (s.c_r("app_vi")) {
        s.visitorID=s.c_r("app_vi");
        s.visitor.setAnalyticsVisitorID(s.c_r("app_vi"));
    }

    /* Audience Manager */
    s.AudienceManagement.setup({
        "partner": "chegginc",
        "containerNSID": 0,
        "uuidCookie": {
            "name":"aam_uuid",
            "days":30 }
    });


} /* end s_doPlugins() */

// set timestamp only if reporting app
if (document.location.href.indexOf('is_in_app') != -1) {
    s.timestamp=Math.round((new Date()).getTime()/1000);
}

s.doPlugins=s_doPlugins;


/************************** PLUGINS **********************************************

 put modules and plugin functions here to be referenced elsewhere in the code file

 *********************************************************************************/
/*
 * Gets the AAM segments out of a cookie. Requires replace (repl)
 */
s.getAamSegments=new Function("a","b",""
    +"var s=this;var c=s.c_r(a);if(c){c=s.repl(c,b+'=','');}ret"
    +"urn c");
/*
 * Plugin: setupLinkTrack v3.15AM
 */
s.setupLinkTrack=new Function("vl","c","e",""
    +"var s=this;var cv=s.c_r(c);if(vl){var vla=vl.split(',');}if(cv!='')"
    +"{var cva=s.split(cv,'^^');if(cva[1]!=''){for(x in vla){s[vla[x]]=cv"
    +"a[x];if(e){s.events=s.apl(s.events,e,',',2);}}}}s.c_w(c,'',0);if(ty"
    +"peof s.linkObject!='undefined'&&s.hbx_lt!='manual'){s.lta=[];if(typ"
    +"eof s.pageName!='undefined')s.lta[0]=s.pageName;if(typeof s.linkObj"
    +"ect!=null){slo=s.linkObject;if(s.linkObject!=0){if(s.linkObject.get"
    +"Attribute('name')!=null){var b=s.linkObject.getAttribute('name');if"
    +"(b.indexOf('&lpos=')>-1){s.lta[3]=b.match('\&lpos\=([^\&]*)')[1];}i"
    +"f(b.indexOf('&lid=')>-1){s.lta[1]=b.match('\&lid\=([^\&]*)')[1];}}}"
    +"if(typeof s.lta[1]=='undefined'){if(s.linkName!=0){s.lta[1]=s.linkN"
    +"ame;}else if(s.linkObject!=0){if(s.cleanStr(s.linkObject.innerHTML)"
    +".length>0){s.lta[1]=s.cleanStr(s.linkObject.innerHTML);}else if(s.l"
    +"inkObject.innerHTML.indexOf('<img')>-1){s.lta[1]=s.linkObject.inner"
    +"HTML.match('alt=\"([^\"]*)')[1];if(!s.lta[1]){s.lta[1]=s.linkObject.i"
    +"nnerHTML.match('src=\"([^\"]*)')[1]}}else{s.lta[1]=s.linkObject.inner"
    +"HTML;}}}try{if(typeof s.trackLinkModule(s.linkObject)!='undefined')"
    +"{s.lta[3]=s.trackLinkModule(s.linkObject);}}catch(e){}if(s.lta[1]!="
    +"null&&typeof s.lta[1]!='undefined'){if(typeof s.pageName!='undefine"
    +"d')s.lta[0]=s.pageName;s.lta[2]=s.pageName+' | '+s.lta[1];}}if(s.li"
    +"nkType!=0){for(var x=0;x<vla.length;x++){s[vla[x]]=s.cleanStr(s.lta"
    +"[x]);if(e){s.events=s.apl(s.events,e,',',2);s.linkTrackVars=s.apl(s"
    +".linkTrackVars,'events',',',2);}}s.linkTrackVars=s.apl(s.linkTrackV"
    +"ars,vl,',',2);}else{if(s.lta[1]){var tcv='';for(var x=0;x<s.lta.len"
    +"gth;x++){tcv+=s.cleanStr(s.lta[x])+'^^'}s.c_w(c,tcv)}}s.lta=null;}");
s.cleanStr = function(a){
    if(typeof a != 'undefined'){
        if(typeof a == "string"){
            a = a.replace(/<\/?[^>]+(>|$)/g, '');
            a = a.replace(/^\s+|\s+$/g,'');
            a = a.replace(/[\u2018\u2019\u201A]/g, "\'");
            return a;
        }
    }
}
/*
 * Plugin: getTimeParting 3.4a - modified to return date stamp
 */
s.getTimeParting=new Function("h","z",""
    +"var s=this,od;od=new Date('1/1/2000');if(od.getDay()!=6||od.getMont"
    +"h()!=0){return'Data Not Available';}else{var H,M,D,U,ds,de,tm,da=['"
    +"Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturda"
    +"y'],d=new Date();z=z?z:0;z=parseFloat(z);if(s._tpDST){var dso=s._tp"
    +"DST[d.getFullYear()].split(/,/);ds=new Date(dso[0]+'/'+d.getFullYea"
    +"r());de=new Date(dso[1]+'/'+d.getFullYear());if(h=='n'&&d>ds&&d<de)"
    +"{z=z+1;}else if(h=='s'&&(d>de||d<ds)){z=z+1;}}d=d.getTime()+(d.getT"
    +"imezoneOffset()*60000);d=new Date(d+(3600000*z)); dd=d.getDate();mm = d.getMonth()+1;yyyy = d.getFullYear();H=d.getHours();M=d"
    +".getMinutes();M=(M<10)?'0'+M:M;D=d.getDay();U=' AM';if(H>=12){U=' P"
    +"M';H=H-12;}if(H==0){H=12;}D=da[D];tm=H+':'+M+U;return(mm+'|'+dd+'|'+yyyy+'|'+tm+'|'+D);}");
/*
 * Plugin: getTimeToComplete 0.4 - return the time from start to stop
 
s.getTimeToComplete=new Function("v","cn","e",""
    +"var s=this,d=new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='"
    +"stop')s.ttcr=1;x.setTime(x.getTime()+e*86400000);if(v=='start'){s.c"
    +"_w(cn,d.getTime(),e?x:0);return '';}if(v=='stop'){k=s.c_r(cn);if(!s"
    +".c_w(cn,'',d)||!k)return '';v=(d.getTime()-k)/1000;var td=86400,th="
    +"3600,tm=60,r=5,u,un;if(v>td){u=td;un='days';}else if(v>th){u=th;un="
    +"'hours';}else if(v>tm){r=2;u=tm;un='minutes';}else{r=.2;u=1;un='sec"
    +"onds';}v=v*r/u;return (Math.round(v)/r)+' '+un;}}return '';"); */
	
/*
* Plugin: getTimeToComplete, v2.0 (minified)
*/
s.getTimeToComplete=function(e,t,o,i){var n,a,l,r,s,c,f=this,m=5,T=new Date,u=86400,d=3600,g=60,h=i?"undefined"!=typeof _satellite.notify?_satellite.notify:console.log:function(e){};if(e=e?e.toLowerCase():"start",t=t?t:"gttc",o=o?o:0,h("--- getTimeToComplete ---"),"object"==typeof f.Util)s=f.Util.cookieWrite,c=f.Util.cookieRead;else{if("undefined"==typeof f.c_w)return void h('		Unable to read the getTimeToComplete cookie "'+t+'"');s=function(e,t,o){return f.c_w(e,t,o)},c=function(e){return f.c_r(e)}}if(r=c(t),h("		action (v) = "+e),h("		cookieName (cn) = "+t),h("		cookieValue (cv) = "+r),h("		expiration (e) = "+o),"start"===e){if(!r)return void s(t,T.getTime(),o?new Date(T.getTime()+864e5*o):0);h('		The getTimeToComplete cookie already exists. To fix the problem, call the "stop" action to delete the cookie, then call "start" again')}if("stop"===e){if(r)return e=Math.round((T.getTime()-r)/1e3),e>u?(n=u,a="days"):e>d?(n=d,a="hours"):e>g?(m=2,n=g,a="minutes"):(n=1,a="seconds"),h(["		v is "+e," r is "+m," u is "+n].join(",")),e=e*m/n,l=Math.round(e)/m+" "+a,0===l.indexOf("1 ")&&(l=l.substring(0,l.length-1)),s(t,"",new Date(T.getTime()-r)),h("		TimeToComplete = "+l),l;h('		The getTimeToComplete cookie does not exist. To fix the problem, call the "start" action first, then call "stop" again.')}};
/*
 * Plugin: getPreviousValue v1.0
 */
s.getPreviousValue=new Function("v","c","el",""
    +"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
    +"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
    +"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
    +":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
    +"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");
/*
 * Plugin: getValOnce_v1.1
 */
s.getValOnce=new Function("v","c","e","t",""
    +"var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6000"
    +"0:86400000;k=s.c_r(c);if(v){a.setTime(a.getTime()+e*i);s.c_w(c,v,e"
    +"==0?0:a);}return v==k?'':v");
/*
 * Plugin Utility: apl v1.1
 */
s.apl=new Function("l","v","d","u",""
    +"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
    +"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
    +"e()));}}if(!m)l=l?l+d+v:v;return l");
/*
 * Utility Function: split v1.5 (JS 1.0 compatible)
 */
s.split=new Function("l","d",""
    +"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
    +"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
/*
 * Function - read combined cookies v 0.41
 */
if(!s.__ccucr){
    s.c_rr = s.c_r;
    s.__ccucr = true;
    function c_r(k){
        var s = this,d = new Date,v = s.c_rr(k),c = s.c_rspers(),i, m, e;
        if(v)return v;k = s.Util.urlDecode(k);i = c.indexOf(' ' + k + '=');c = i < 0 ? s.c_rr('s_sess') : c;
        i = c.indexOf(' ' + k + '=');m = i < 0 ? i : c.indexOf('|', i);
        e = i < 0 ? i : c.indexOf(';', i);m = m > 0 ? m : e;
        v = i < 0 ? '' : s.Util.urlDecode(c.substring(i + 2 + k.length, m < 0 ? c.length : m));
        return v;
    }
    function c_rspers(){
        var cv = s.c_rr("s_pers");var date = new Date().getTime();var expd = null;var cvarr = [];var vcv = "";
        if(!cv)return vcv; cvarr = cv.split(";");for(var i = 0, l = cvarr.length; i < l; i++){
            expd = cvarr[i].match(/\|([0-9]+)$/);if(expd && parseInt(expd[1]) >= date){vcv += cvarr[i] + ";";}}
        return vcv;
    }
    s.c_rspers = c_rspers;
    s.c_r = c_r;
}
/*
 * Function - write combined cookies v 0.41
 */
if(!s.__ccucw){
    s.c_wr = s.c_w;
    s.__ccucw = true;
    function c_w(k, v, e){
        var s = this,d = new Date,ht = 0,pn = 's_pers',sn = 's_sess',pc = 0,sc = 0,pv, sv, c, i, t;
        d.setTime(d.getTime() - 60000);if(s.c_rr(k))s.c_wr(k, '', d);k = s.Util.urlEncode(k);
        pv = s.c_rspers();i = pv.indexOf(' ' + k + '=');if(i > -1){
            pv = pv.substring(0, i) + pv.substring(pv.indexOf(';', i) + 1);pc = 1;}
        sv = s.c_rr(sn);i = sv.indexOf(' ' + k + '=');if(i > -1){
            sv = sv.substring(0, i) + sv.substring(sv.indexOf(';', i) + 1);sc = 1;}
        d = new Date;if(e){if(e.getTime() > d.getTime()){
            pv += ' ' + k + '=' + s.Util.urlEncode(v) + '|' + e.getTime() + ';';pc = 1;}}
        else{sv += ' ' + k + '=' + s.Util.urlEncode(v) + ';';sc = 1;}sv = sv.replace(/%00/g, '');
        pv = pv.replace(/%00/g, '');if(sc)s.c_wr(sn, sv, 0);if(pc){t = pv;
            while(t && t.indexOf(';') != -1){var t1 = parseInt(t.substring(t.indexOf('|') + 1, t.indexOf(';')));
                t = t.substring(t.indexOf(';') + 1);ht = ht < t1 ? t1 : ht;}d.setTime(ht);
            s.c_wr(pn, pv, d);}return v == s.c_r(s.Util.urlEncode(k));}
    s.c_w = c_w;
}

/*
 * Utility: AppMeasurement Compatibility v1.1
 * Define deprecated H-code s properties and methods used by legacy plugins
 */
s.wd=window;
s.fl=new Function("x","l",""
    +"return x?(''+x).substring(0,l):x");
s.pt=new Function("x","d","f","a",""
    +"var s=this,t=x,z=0,y,r,l='length';while(t){y=t.indexOf(d);y=y<0?t[l"
    +"]:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d[l];t=x.subs"
    +"tring(z,x[l]);t=z<x[l]?t:''}return''");
s.rep=new Function("x","o","n",""
    +"var a=new Array,i=0,j;if(x){if(x.split)a=x.split(o);else if(!o)for("
    +"i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){"
    +"j=x.indexOf(o,i);a[a.length]=x.substring(i,j<0?x.length:j);i=j;if(i"
    +">=0)i+=o.length}}x='';j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.joi"
    +"n)x=a.join(n);else for(i=1;i<j;i++)x+=n+a[i]}}return x");
s.ape=new Function("x",""
    +"var s=this,h='0123456789ABCDEF',f='+~!*()\\'',i,c=s.charSet,n,l,e,y"
    +"='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComp"
    +"onent(x);for(i=0;i<f.length;i++){n=f.substring(i,i+1);if(x.indexOf("
    +"n)>=0)x=s.rep(x,n,'%'+n.charCodeAt(0).toString(16).toUpperCase())}}"
    +"else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.sub"
    +"string(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e="
    +"h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='"
    +"+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+','%2"
    +"B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0)"
    +"{i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.subst"
    +"ring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.subst"
    +"ring(i);i=x.indexOf('%',i)}}}return x");
s.epa=new Function("x",""
    +"var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Fu"
    +"nction('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unescape"
    +"(x)}return y');return tcf(x)}else return unescape(x)}return y");
s.parseUri=new Function("u",""
    +"if(u){u=u+'';u=u.indexOf(':')<0&&u.indexOf('//')!=0?(u.indexOf('/')"
    +"==0?'/':'//')+u:u}u=u?u+'':window.location.href;var e,a=document.cr"
    +"eateElement('a'),l=['href','protocol','host','hostname','port','pat"
    +"hname','search','hash'],p,r={href:u,toString:function(){return this"
    +".href}};a.setAttribute('href',u);for(e=1;e<l.length;e++){p=l[e];r[p"
    +"]=a[p]||''}delete a;p=r.pathname||'';if(p.indexOf('/')!=0)r.pathnam"
    +"e='/'+p;return r");
s.gtfs=new Function(""
    +"var w=window,l=w.location,d=document,u;if(!l.origin)l.origin=l.prot"
    +"ocol+'//'+l.hostname+(l.port?':'+l.port:'');u=l!=w.parent.location?"
    +"d.referrer:d.location;return{location:s.parseUri(u)}");
/*
 * Plugin Utility: Replace v1.0
 */
s.repl=new Function("x","o","n",""
    +"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
    +"substring(i+o.length);i=x.indexOf(o,i+l)}return x");


/* Plugin: Performance Timing Tracking - 0.11 BETA */
s.performanceTiming=new Function("v",""
+"var s=this;if(v)s.ptv=v;if(typeof performance!='undefined'){if(perf"
+"ormance.timing.loadEventEnd==0){s.pi=setInterval(function(){s.perfo"
+"rmanceWrite()},250);}if(!s.ptc||s.linkType=='e'){s.performanceRead("
+");}else{s.rfe();s[s.ptv]='';}}");
s.performanceWrite=new Function("",""
+"var s=this;if(performance.timing.loadEventEnd>0)clearInterval(s.pi)"
+";try{if(s.c_r('s_ptc')==''&&performance.timing.loadEventEnd>0){try{"
+"var pt=performance.timing;var pta='';pta=s.performanceCheck(pt.fetc"
+"hStart,pt.navigationStart);pta+='^^'+s.performanceCheck(pt.domainLo"
+"okupStart,pt.fetchStart);pta+='^^'+s.performanceCheck(pt.domainLook"
+"upEnd,pt.domainLookupStart);pta+='^^'+s.performanceCheck(pt.connect"
+"End,pt.connectStart);pta+='^^'+s.performanceCheck(pt.responseStart,"
+"pt.connectEnd);pta+='^^'+s.performanceCheck(pt.responseEnd,pt.respo"
+"nseStart);pta+='^^'+s.performanceCheck(pt.loadEventStart,pt.domLoad"
+"ing);pta+='^^'+s.performanceCheck(pt.loadEventEnd,pt.loadEventStart"
+");pta+='^^'+s.performanceCheck(pt.loadEventEnd,pt.navigationStart);"
+"s.c_w('s_ptc',pta);if(sessionStorage&&navigator.cookieEnabled&&s.pt"
+"v!='undefined'){var pe=performance.getEntries();var tempPe='';for(v"
+"ar i=0;i<pe.length;i++){tempPe+='!';tempPe+=pe[i].name.indexOf('?')"
+">-1?pe[i].name.split('?')[0]:pe[i].name;tempPe+='|'+(Math.round(pe["
+"i].startTime)/1000).toFixed(1)+'|'+(Math.round(pe[i].duration)/1000"
+").toFixed(1)+'|'+pe[i].initiatorType;}sessionStorage.setItem('s_pec"
+"',tempPe);}}catch(err){return;}}}catch(err){return;}");
s.performanceCheck=new Function("a","b",""
+"if(a>=0&&b>=0){if((a-b)<60000&&((a-b)>=0)){return((a-b)/1000).toFix"
+"ed(2);}else{return 600;}}");
s.performanceRead=function()
{
	var s = this;
	if (performance.timing.loadEventEnd > 0) clearInterval(s.pi);
	var cv = s.c_r('s_ptc');
	if (s.pte) {
	    var ela = s.pte.split(',');
	}
	if (cv != '') {
	    var cva = s.split(cv, '^^');
	    if (cva[1] != '') {
	        for (var x = 0; x < (ela.length - 1); x++) {
	            s.events = s.apl(s.events, ela[x] + '=' + cva[x], ',', 2);
	        }
	    }
	    s.events = s.apl(s.events, ela[ela.length - 1], ',', 2);
	}
	s.linkTrackEvents = s.apl(s.linkTrackEvents, s.pte, ',', 2);
	s.c_w('s_ptc', '', 0);
	if (sessionStorage && navigator.cookieEnabled && s.ptv != 'undefined') {
	    s[s.ptv] = sessionStorage.getItem('s_pec');
	    sessionStorage.setItem('s_pec', '', 0);
	} else {
	    s[s.ptv] = 'sessionStorage Unavailable';
	}
	s.ptc = true;
}
/* Remove from Events 0.1 - Performance Specific, removes all performance events from s.events once they have been tracked. */
s.rfe=new Function("",""
+"var s=this;var ea=s.split(s.events,',');var pta=s.split(s.pte,',');"
+"try{for(x in pta){s.events=s.rfl(s.events,pta[x]);s.contextData['ev"
+"ents']=s.events;}}catch(e){return;}");
/* Plugin Utility - RFL (remove from list) 1.0*/
s.rfl=new Function("l","v","d1","d2","ku",""
+"var s=this,R=new Array(),C='',d1=!d1?',':d1,d2=!d2?',':d2,ku=!ku?0:"
+"1;if(!l)return'';L=l.split(d1);for(i=0;i<L.length;i++){if(L[i].inde"
+"xOf(':')>-1){C=L[i].split(':');C[1]=C[0]+':'+C[1];L[i]=C[0];}if(L[i"
+"].indexOf('=')>-1){C=L[i].split('=');C[1]=C[0]+'='+C[1];L[i]=C[0];}"
+"if(L[i]!=v&&C)R.push(C[1]);else if(L[i]!=v)R.push(L[i]);else if(L[i"
+"]==v&&ku){ku=0;if(C)R.push(C[1]);else R.push(L[i]);}C='';}return s."
+"join(R,{delim:d2})");


/************************** FIRST PARTY COOKIES **********************************

 first party cookie configuration here. Additional config needed in visitorAPI.js

 *********************************************************************************/

/* WARNING: Changing any of the below variables will cause drastic changes to how your visitor data is collected.  Changes should only be made when instructed to do so by your account manager.*/
s.trackingServer="adobetp.chegg.com";
s.trackingServerSecure="adobetps.chegg.com";

/************************** CORE APPMEASUREMENT CODE *****************************

 this is the core code that powers Analytics. Don't make changes.

 *********************************************************************************/
s.loadModule("AudienceManagement");

/************************** AUDIENCE MANAGER APPMEASUREMENT CODE *****************************

 this is the AAM code that powers Audience Manager. Don't make changes.

 *********************************************************************************/
function AppMeasurement_Module_AudienceManagement(d){var a=this;a.s=d;var b=window;b.s_c_in||(b.s_c_il=[],b.s_c_in=0);a._il=b.s_c_il;a._in=b.s_c_in;a._il[a._in]=a;b.s_c_in++;a._c="s_m";a.setup=function(c){b.DIL&&c&&(c.disableDefaultRequest=!0,c.disableScriptAttachment=!0,c.disableCORS=!0,c.secureDataCollection=!1,a.instance=b.DIL.create(c),a.tools=b.DIL.tools)};a.isReady=function(){return a.instance?!0:!1};a.getEventCallConfigParams=function(){return a.instance&&a.instance.api&&a.instance.api.getEventCallConfigParams?
a.instance.api.getEventCallConfigParams():{}};a.passData=function(b){a.instance&&a.instance.api&&a.instance.api.passData&&a.instance.api.passData(b)}}
"function"!==typeof window.DIL&&(window.DIL=function(a,c){var b=[],d,f;a!==Object(a)&&(a={});var g,k,r,v,s,p,n,E,u,A,L,B,C,F;g=a.partner;k=a.containerNSID;r=!!a.disableDestinationPublishingIframe;v=a.iframeAkamaiHTTPS;s=a.mappings;p=a.uuidCookie;n=!0===a.enableErrorReporting;E=a.visitorService;u=a.declaredId;A=!0===a.removeFinishedScriptsAndCallbacks;L=!0===a.delayAllUntilWindowLoad;B=!0===a.disableIDSyncs;C="undefined"===typeof a.secureDataCollection||!0===a.secureDataCollection;F=!0===a.useCORSOnly;
var M,N,I,G,O,P,Q,R;M=!0===a.disableScriptAttachment;N=!0===a.disableDefaultRequest;I=a.afterResultForDefaultRequest;G=a.dpIframeSrc;O=!0===a.testCORS;P=!0===a.useJSONPOnly;Q=a.visitorConstructor;R=!0===a.disableCORS;n&&DIL.errorModule.activate();var T=!0===window._dil_unit_tests;(d=c)&&b.push(d+"");if(!g||"string"!==typeof g)return d="DIL partner is invalid or not specified in initConfig",DIL.errorModule.handleError({name:"error",message:d,filename:"dil.js"}),Error(d);d="DIL containerNSID is invalid or not specified in initConfig, setting to default of 0";
if(k||"number"===typeof k)k=parseInt(k,10),!isNaN(k)&&0<=k&&(d="");d&&(k=0,b.push(d),d="");f=DIL.getDil(g,k);if(f instanceof DIL&&f.api.getPartner()===g&&f.api.getContainerNSID()===k)return f;if(this instanceof DIL)DIL.registerDil(this,g,k);else return new DIL(a,"DIL was not instantiated with the 'new' operator, returning a valid instance with partner = "+g+" and containerNSID = "+k);var z={IS_HTTPS:C||"https:"===document.location.protocol,POST_MESSAGE_ENABLED:!!window.postMessage,COOKIE_MAX_EXPIRATION_DATE:"Tue, 19 Jan 2038 03:14:07 UTC"},
J={stuffed:{}},m={},q={firingQueue:[],fired:[],firing:!1,sent:[],errored:[],reservedKeys:{sids:!0,pdata:!0,logdata:!0,callback:!0,postCallbackFn:!0,useImageRequest:!0},callbackPrefix:"demdexRequestCallback",firstRequestHasFired:!1,useJSONP:!0,abortRequests:!1,num_of_jsonp_responses:0,num_of_jsonp_errors:0,num_of_cors_responses:0,num_of_cors_errors:0,corsErrorSources:[],num_of_img_responses:0,num_of_img_errors:0,toRemove:[],removed:[],readyToRemove:!1,platformParams:{d_nsid:k+"",d_rtbd:"json",d_jsonv:DIL.jsonVersion+
"",d_dst:"1"},nonModStatsParams:{d_rtbd:!0,d_dst:!0,d_cts:!0,d_rs:!0},modStatsParams:null,adms:{TIME_TO_CATCH_ALL_REQUESTS_RELEASE:2E3,calledBack:!1,mid:null,noVisitorAPI:!1,VisitorAPI:null,instance:null,releaseType:"no VisitorAPI",isOptedOut:!0,isOptedOutCallbackCalled:!1,admsProcessingStarted:!1,process:function(e){try{if(!this.admsProcessingStarted){this.admsProcessingStarted=!0;var x=this,a,h,d,b;if("function"===typeof e&&"function"===typeof e.getInstance){if(E===Object(E)&&(a=E.namespace)&&"string"===
typeof a)h=e.getInstance(a,{idSyncContainerID:k});else{this.releaseType="no namespace";this.releaseRequests();return}if(h===Object(h)&&h instanceof e&&"function"===typeof h.isAllowed&&"function"===typeof h.getMarketingCloudVisitorID&&"function"===typeof h.getCustomerIDs&&"function"===typeof h.isOptedOut){this.VisitorAPI=e;if(!h.isAllowed()){this.releaseType="VisitorAPI not allowed";this.releaseRequests();return}this.instance=h;d=function(e){"VisitorAPI"!==x.releaseType&&(x.mid=e,x.releaseType="VisitorAPI",
x.releaseRequests())};b=h.getMarketingCloudVisitorID(d);if("string"===typeof b&&b.length){d(b);return}setTimeout(function(){"VisitorAPI"!==x.releaseType&&(x.releaseType="timeout",x.releaseRequests())},this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE);return}this.releaseType="invalid instance"}else this.noVisitorAPI=!0;this.releaseRequests()}}catch(c){this.releaseRequests()}},releaseRequests:function(){this.calledBack=!0;q.registerRequest()},getMarketingCloudVisitorID:function(){return this.instance?this.instance.getMarketingCloudVisitorID():
null},getMIDQueryString:function(){var e=w.isPopulatedString,x=this.getMarketingCloudVisitorID();e(this.mid)&&this.mid===x||(this.mid=x);return e(this.mid)?"d_mid="+this.mid+"&":""},getCustomerIDs:function(){return this.instance?this.instance.getCustomerIDs():null},getCustomerIDsQueryString:function(e){if(e===Object(e)){var x="",a=[],h=[],d,b;for(d in e)e.hasOwnProperty(d)&&(h[0]=d,b=e[d],b===Object(b)&&(h[1]=b.id||"",h[2]=b.authState||0,a.push(h),h=[]));if(h=a.length)for(e=0;e<h;e++)x+="&d_cid_ic="+
t.encodeAndBuildRequest(a[e],"%01");return x}return""},getIsOptedOut:function(){this.instance?this.instance.isOptedOut([this,this.isOptedOutCallback],this.VisitorAPI.OptOut.GLOBAL,!0):(this.isOptedOut=!1,this.isOptedOutCallbackCalled=!0)},isOptedOutCallback:function(e){this.isOptedOut=e;this.isOptedOutCallbackCalled=!0;q.registerRequest()}},declaredId:{declaredId:{init:null,request:null},declaredIdCombos:{},setDeclaredId:function(e,a){var l=w.isPopulatedString,h=encodeURIComponent;if(e===Object(e)&&
l(a)){var d=e.dpid,b=e.dpuuid,c=null;if(l(d)&&l(b)){c=h(d)+"$"+h(b);if(!0===this.declaredIdCombos[c])return"setDeclaredId: combo exists for type '"+a+"'";this.declaredIdCombos[c]=!0;this.declaredId[a]={dpid:d,dpuuid:b};return"setDeclaredId: succeeded for type '"+a+"'"}}return"setDeclaredId: failed for type '"+a+"'"},getDeclaredIdQueryString:function(){var e=this.declaredId.request,a=this.declaredId.init,l=encodeURIComponent,h="";null!==e?h="&d_dpid="+l(e.dpid)+"&d_dpuuid="+l(e.dpuuid):null!==a&&(h=
"&d_dpid="+l(a.dpid)+"&d_dpuuid="+l(a.dpuuid));return h}},registerRequest:function(e){var a=this.firingQueue;e===Object(e)&&a.push(e);this.firing||!a.length||L&&!DIL.windowLoaded||(this.adms.isOptedOutCallbackCalled||this.adms.getIsOptedOut(),this.adms.calledBack&&!this.adms.isOptedOut&&this.adms.isOptedOutCallbackCalled&&(this.adms.isOptedOutCallbackCalled=!1,e=a.shift(),e.src=e.src.replace(/demdex.net\/event\?d_nsid=/,"demdex.net/event?"+this.adms.getMIDQueryString()+"d_nsid="),w.isPopulatedString(e.corsPostData)&&
(e.corsPostData=e.corsPostData.replace(/^d_nsid=/,this.adms.getMIDQueryString()+"d_nsid=")),D.fireRequest(e),this.firstRequestHasFired||"script"!==e.tag&&"cors"!==e.tag||(this.firstRequestHasFired=!0)))},processVisitorAPI:function(){this.adms.process(Q||window.Visitor)},requestRemoval:function(e){if(!A)return"removeFinishedScriptsAndCallbacks is not boolean true";var a=this.toRemove,l,h;e===Object(e)&&(l=e.script,h=e.callbackName,(l===Object(l)&&"SCRIPT"===l.nodeName||"no script created"===l)&&"string"===
typeof h&&h.length&&a.push(e));if(this.readyToRemove&&a.length){h=a.shift();l=h.script;h=h.callbackName;"no script created"!==l?(e=l.src,l.parentNode.removeChild(l)):e=l;window[h]=null;try{delete window[h]}catch(d){}this.removed.push({scriptSrc:e,callbackName:h});DIL.variables.scriptsRemoved.push(e);DIL.variables.callbacksRemoved.push(h);return this.requestRemoval()}return"requestRemoval() processed"}};f=function(){var e="http://fast.",a="?d_nsid="+k+"#"+encodeURIComponent(document.location.href);
if("string"===typeof G&&G.length)return G+a;z.IS_HTTPS&&(e=!0===v?"https://fast.":"https://");return e+g+".demdex.net/dest5.html"+a};var y={THROTTLE_START:3E4,throttleTimerSet:!1,id:"destination_publishing_iframe_"+g+"_"+k,url:f(),iframe:null,iframeHasLoaded:!1,sendingMessages:!1,messages:[],messagesPosted:[],messageSendingInterval:z.POST_MESSAGE_ENABLED?15:100,ibsDeleted:[],jsonProcessed:[],newIframeCreated:null,iframeIdChanged:!1,originalIframeHasLoadedAlready:null,attachIframe:function(){function e(){h=
document.createElement("iframe");h.sandbox="allow-scripts allow-same-origin";h.title="Adobe ID Syncing iFrame";h.id=l.id;h.style.cssText="display: none; width: 0; height: 0;";h.src=l.url;l.newIframeCreated=!0;a();document.body.appendChild(h)}function a(){t.addListener(h,"load",function(){h.className="aamIframeLoaded";l.iframeHasLoaded=!0;l.requestToProcess()})}var l=this,h=document.getElementById(this.id);h?"IFRAME"!==h.nodeName?(this.id+="_2",this.iframeIdChanged=!0,e()):(this.newIframeCreated=!1,
"aamIframeLoaded"!==h.className?(this.originalIframeHasLoadedAlready=!1,a()):(this.iframeHasLoaded=this.originalIframeHasLoadedAlready=!0,this.iframe=h,this.requestToProcess())):e();this.iframe=h},requestToProcess:function(e,a){var l=this;e&&!w.isEmptyObject(e)&&this.process(e,a);this.iframeHasLoaded&&this.messages.length&&!this.sendingMessages&&(this.throttleTimerSet||(this.throttleTimerSet=!0,setTimeout(function(){l.messageSendingInterval=z.POST_MESSAGE_ENABLED?15:150},this.THROTTLE_START)),this.sendingMessages=
!0,this.sendMessages())},process:function(e,a){var l=encodeURIComponent,h,d,b,c,g,f;a===Object(a)&&(f=t.encodeAndBuildRequest(["",a.dpid||"",a.dpuuid||""],","));if((h=e.dests)&&h instanceof Array&&(d=h.length))for(b=0;b<d;b++)c=h[b],c=[l("dests"),l(c.id||""),l(c.y||""),l(c.c||"")],this.addMessage(c.join("|"));if((h=e.ibs)&&h instanceof Array&&(d=h.length))for(b=0;b<d;b++)c=h[b],c=[l("ibs"),l(c.id||""),l(c.tag||""),t.encodeAndBuildRequest(c.url||[],","),l(c.ttl||""),"",f],this.addMessage(c.join("|"));
if((h=e.dpcalls)&&h instanceof Array&&(d=h.length))for(b=0;b<d;b++)c=h[b],g=c.callback||{},g=[g.obj||"",g.fn||"",g.key||"",g.tag||"",g.url||""],c=[l("dpm"),l(c.id||""),l(c.tag||""),t.encodeAndBuildRequest(c.url||[],","),l(c.ttl||""),t.encodeAndBuildRequest(g,","),f],this.addMessage(c.join("|"));this.jsonProcessed.push(e)},addMessage:function(e){var a=encodeURIComponent,a=n?a("---destpub-debug---"):a("---destpub---");this.messages.push(a+e)},sendMessages:function(){var e=this,a;this.messages.length?
(a=this.messages.shift(),DIL.xd.postMessage(a,this.url,this.iframe.contentWindow),this.messagesPosted.push(a),setTimeout(function(){e.sendMessages()},this.messageSendingInterval)):this.sendingMessages=!1}},K={traits:function(e){w.isValidPdata(e)&&(m.sids instanceof Array||(m.sids=[]),t.extendArray(m.sids,e));return this},pixels:function(e){w.isValidPdata(e)&&(m.pdata instanceof Array||(m.pdata=[]),t.extendArray(m.pdata,e));return this},logs:function(e){w.isValidLogdata(e)&&(m.logdata!==Object(m.logdata)&&
(m.logdata={}),t.extendObject(m.logdata,e));return this},customQueryParams:function(e){w.isEmptyObject(e)||t.extendObject(m,e,q.reservedKeys);return this},signals:function(e,a){var l,h=e;if(!w.isEmptyObject(h)){if(a&&"string"===typeof a)for(l in h={},e)e.hasOwnProperty(l)&&(h[a+l]=e[l]);t.extendObject(m,h,q.reservedKeys)}return this},declaredId:function(e){q.declaredId.setDeclaredId(e,"request");return this},result:function(e){"function"===typeof e&&(m.callback=e);return this},afterResult:function(e){"function"===
typeof e&&(m.postCallbackFn=e);return this},useImageRequest:function(){m.useImageRequest=!0;return this},clearData:function(){m={};return this},submit:function(){D.submitRequest(m);m={};return this},getPartner:function(){return g},getContainerNSID:function(){return k},getEventLog:function(){return b},getState:function(){var e={},b={};t.extendObject(e,q,{callbackPrefix:!0,useJSONP:!0,registerRequest:!0});t.extendObject(b,y,{attachIframe:!0,requestToProcess:!0,process:!0,sendMessages:!0});return{initConfig:a,
pendingRequest:m,otherRequestInfo:e,destinationPublishingInfo:b}},idSync:function(e){if(B)return"Error: id syncs have been disabled";if(e!==Object(e)||"string"!==typeof e.dpid||!e.dpid.length)return"Error: config or config.dpid is empty";if("string"!==typeof e.url||!e.url.length)return"Error: config.url is empty";var a=e.url,b=e.minutesToLive,h=encodeURIComponent,d,a=a.replace(/^https:/,"").replace(/^http:/,"");if("undefined"===typeof b)b=20160;else if(b=parseInt(b,10),isNaN(b)||0>=b)return"Error: config.minutesToLive needs to be a positive number";
d=t.encodeAndBuildRequest(["",e.dpid,e.dpuuid||""],",");e=["ibs",h(e.dpid),"img",h(a),b,"",d];y.addMessage(e.join("|"));q.firstRequestHasFired&&y.requestToProcess();return"Successfully queued"},aamIdSync:function(e){if(B)return"Error: id syncs have been disabled";if(e!==Object(e)||"string"!==typeof e.dpuuid||!e.dpuuid.length)return"Error: config or config.dpuuid is empty";e.url="//dpm.demdex.net/ibs:dpid="+e.dpid+"&dpuuid="+e.dpuuid;return this.idSync(e)},passData:function(e){if(w.isEmptyObject(e))return"Error: json is empty or not an object";
y.ibsDeleted.push(e.ibs);delete e.ibs;D.defaultCallback(e);return e},getPlatformParams:function(){return q.platformParams},getEventCallConfigParams:function(){var e=q,a=e.modStatsParams,b=e.platformParams,h;if(!a){a={};for(h in b)b.hasOwnProperty(h)&&!e.nonModStatsParams[h]&&(a[h.replace(/^d_/,"")]=b[h]);e.modStatsParams=a}return a}},D={corsMetadata:function(){var e="none",a=!0;"undefined"!==typeof XMLHttpRequest&&XMLHttpRequest===Object(XMLHttpRequest)&&("withCredentials"in new XMLHttpRequest?e=
"XMLHttpRequest":(new Function("/*@cc_on return /^10/.test(@_jscript_version) @*/"))()?e="XMLHttpRequest":"undefined"!==typeof XDomainRequest&&XDomainRequest===Object(XDomainRequest)&&(a=!1),0<Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")&&(a=!1));return{corsType:e,corsCookiesEnabled:a}}(),getCORSInstance:function(){return"none"===this.corsMetadata.corsType?null:new window[this.corsMetadata.corsType]},submitRequest:function(e){q.registerRequest(D.createQueuedRequest(e));
return!0},createQueuedRequest:function(e){var a=q,b,h=e.callback,d="img",c;if(!w.isEmptyObject(s)){var g,f,p;for(g in s)s.hasOwnProperty(g)&&(f=s[g],null!=f&&""!==f&&g in e&&!(f in e||f in q.reservedKeys)&&(p=e[g],null!=p&&""!==p&&(e[f]=p)))}w.isValidPdata(e.sids)||(e.sids=[]);w.isValidPdata(e.pdata)||(e.pdata=[]);w.isValidLogdata(e.logdata)||(e.logdata={});e.logdataArray=t.convertObjectToKeyValuePairs(e.logdata,"=",!0);e.logdataArray.push("_ts="+(new Date).getTime());"function"!==typeof h&&(h=this.defaultCallback);
a.useJSONP=!0!==e.useImageRequest;a.useJSONP&&(d="script",b=a.callbackPrefix+"_"+k+"_"+(new Date).getTime());a=this.makeRequestSrcData(e,b);P&&!F||!(c=this.getCORSInstance())||(d="cors");return{tag:d,src:a.src,corsSrc:a.corsSrc,internalCallbackName:b,callbackFn:h,postCallbackFn:e.postCallbackFn,useImageRequest:!!e.useImageRequest,requestData:e,corsInstance:c,corsPostData:a.corsPostData}},defaultCallback:function(e,a){var b,h,d,c,g,f,k,u,n;if((b=e.stuff)&&b instanceof Array&&(h=b.length))for(d=0;d<
h;d++)if((c=b[d])&&c===Object(c)){g=c.cn;f=c.cv;k=c.ttl;if("undefined"===typeof k||""===k)k=Math.floor(t.getMaxCookieExpiresInMinutes()/60/24);u=c.dmn||"."+document.domain.replace(/^www\./,"");n=c.type;g&&(f||"number"===typeof f)&&("var"!==n&&(k=parseInt(k,10))&&!isNaN(k)&&t.setCookie(g,f,1440*k,"/",u,!1),J.stuffed[g]=f)}b=e.uuid;w.isPopulatedString(b)&&!w.isEmptyObject(p)&&(h=p.path,"string"===typeof h&&h.length||(h="/"),d=parseInt(p.days,10),isNaN(d)&&(d=100),t.setCookie(p.name||"aam_did",b,1440*
d,h,p.domain||"."+document.domain.replace(/^www\./,""),!0===p.secure));r||q.abortRequests||y.requestToProcess(e,a)},makeRequestSrcData:function(e,a){e.sids=w.removeEmptyArrayValues(e.sids||[]);e.pdata=w.removeEmptyArrayValues(e.pdata||[]);var b=q,h=b.platformParams,d=t.encodeAndBuildRequest(e.sids,","),c=t.encodeAndBuildRequest(e.pdata,","),f=(e.logdataArray||[]).join("&");delete e.logdataArray;var p=z.IS_HTTPS?"https://":"http://",u=b.declaredId.getDeclaredIdQueryString(),n=b.adms.instance?b.adms.getCustomerIDsQueryString(b.adms.getCustomerIDs()):
"",s;s=[];var m,r,v,A;for(m in e)if(!(m in b.reservedKeys)&&e.hasOwnProperty(m))if(r=e[m],m=encodeURIComponent(m),r instanceof Array)for(v=0,A=r.length;v<A;v++)s.push(m+"="+encodeURIComponent(r[v]));else s.push(m+"="+encodeURIComponent(r));s=s.length?"&"+s.join("&"):"";d="d_nsid="+h.d_nsid+u+n+(d.length?"&d_sid="+d:"")+(c.length?"&d_px="+c:"")+(f.length?"&d_ld="+encodeURIComponent(f):"");h="&d_rtbd="+h.d_rtbd+"&d_jsonv="+h.d_jsonv+"&d_dst="+h.d_dst;p=p+g+".demdex.net/event";c=b=p+"?"+d+(b.useJSONP?
h+"&d_cb="+(a||""):"")+s;2048<b.length&&(b=b.substring(0,2048).substring(0,b.lastIndexOf("&")));return{corsSrc:p+"?"+(O?"testcors=1&d_nsid="+k+"&":"")+"_ts="+(new Date).getTime(),src:b,originalSrc:c,corsPostData:d+h+s,isDeclaredIdCall:""!==u}},fireRequest:function(e){if("img"===e.tag)this.fireImage(e);else{var a=q.declaredId,a=a.declaredId.request||a.declaredId.init||{},a={dpid:a.dpid||"",dpuuid:a.dpuuid||""};"script"===e.tag?this.fireScript(e,a):"cors"===e.tag&&this.fireCORS(e,a)}},fireImage:function(e){var a=
q,c,h;a.abortRequests||(a.firing=!0,c=new Image(0,0),a.sent.push(e),c.onload=function(){a.firing=!1;a.fired.push(e);a.num_of_img_responses++;a.registerRequest()},h=function(c){d="imgAbortOrErrorHandler received the event of type "+c.type;b.push(d);a.abortRequests=!0;a.firing=!1;a.errored.push(e);a.num_of_img_errors++;a.registerRequest()},c.addEventListener?(c.addEventListener("error",h,!1),c.addEventListener("abort",h,!1)):c.attachEvent&&(c.attachEvent("onerror",h),c.attachEvent("onabort",h)),c.src=
e.src)},fireScript:function(a,c){var f=this,h=q,k,p,u=a.src,n=a.postCallbackFn,s="function"===typeof n,m=a.internalCallbackName;h.abortRequests||(h.firing=!0,window[m]=function(f){try{f!==Object(f)&&(f={});B&&(y.ibsDeleted.push(f.ibs),delete f.ibs);var l=a.callbackFn;h.firing=!1;h.fired.push(a);h.num_of_jsonp_responses++;l(f,c);s&&n(f,c)}catch(k){k.message="DIL jsonp callback caught error with message "+k.message;d=k.message;b.push(d);k.filename=k.filename||"dil.js";k.partner=g;DIL.errorModule.handleError(k);
try{l({error:k.name+"|"+k.message},c),s&&n({error:k.name+"|"+k.message},c)}catch(u){}}finally{h.requestRemoval({script:p,callbackName:m}),h.registerRequest()}},M||F?(h.firing=!1,h.requestRemoval({script:"no script created",callbackName:m})):(p=document.createElement("script"),p.addEventListener&&p.addEventListener("error",function(b){h.requestRemoval({script:p,callbackName:m});d="jsonp script tag error listener received the event of type "+b.type+" with src "+u;f.handleScriptError(d,a)},!1),p.type=
"text/javascript",p.src=u,k=DIL.variables.scriptNodeList[0],k.parentNode.insertBefore(p,k)),h.sent.push(a),h.declaredId.declaredId.request=null)},fireCORS:function(a,c){var f=this,h=q,k=this.corsMetadata.corsType,p=a.corsSrc,u=a.corsInstance,n=a.corsPostData,s=a.postCallbackFn,m="function"===typeof s;if(!h.abortRequests&&!R){h.firing=!0;try{u.open("post",p,!0),"XMLHttpRequest"===k&&(u.withCredentials=!0,u.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),u.onreadystatechange=function(){if(4===
this.readyState&&200===this.status)a:{var k;try{if(k=JSON.parse(this.responseText),k!==Object(k)){f.handleCORSError(a,c,"Response is not JSON");break a}}catch(p){f.handleCORSError(a,c,"Error parsing response as JSON");break a}B&&(y.ibsDeleted.push(k.ibs),delete k.ibs);try{var u=a.callbackFn;h.firing=!1;h.fired.push(a);h.num_of_cors_responses++;u(k,c);m&&s(k,c)}catch(n){n.message="DIL handleCORSResponse caught error with message "+n.message;d=n.message;b.push(d);n.filename=n.filename||"dil.js";n.partner=
g;DIL.errorModule.handleError(n);try{u({error:n.name+"|"+n.message},c),m&&s({error:n.name+"|"+n.message},c)}catch(q){}}finally{h.registerRequest()}}}),u.onerror=function(){f.handleCORSError(a,c,"onerror")},u.ontimeout=function(){f.handleCORSError(a,c,"ontimeout")},u.send(n)}catch(r){this.handleCORSError(a,c,"try-catch")}h.sent.push(a);h.declaredId.declaredId.request=null}},handleCORSError:function(a,b,c){q.num_of_cors_errors++;q.corsErrorSources.push(c);"ontimeout"===c||F||(a.tag="script",this.fireScript(a,
b))},handleScriptError:function(a,b){q.num_of_jsonp_errors++;this.handleRequestError(a,b)},handleRequestError:function(a,c){var d=q;b.push(a);d.abortRequests=!0;d.firing=!1;d.errored.push(c);d.registerRequest()}},w={isValidPdata:function(a){return a instanceof Array&&this.removeEmptyArrayValues(a).length?!0:!1},isValidLogdata:function(a){return!this.isEmptyObject(a)},isEmptyObject:function(a){if(a!==Object(a))return!0;for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},removeEmptyArrayValues:function(a){for(var b=
0,c=a.length,d,f=[],b=0;b<c;b++)d=a[b],"undefined"!==typeof d&&null!==d&&""!==d&&f.push(d);return f},isPopulatedString:function(a){return"string"===typeof a&&a.length}},t={addListener:function(){if(document.addEventListener)return function(a,b,c){a.addEventListener(b,function(a){"function"===typeof c&&c(a)},!1)};if(document.attachEvent)return function(a,b,c){a.attachEvent("on"+b,function(a){"function"===typeof c&&c(a)})}}(),convertObjectToKeyValuePairs:function(a,b,c){var d=[],f,g;b||(b="=");for(f in a)a.hasOwnProperty(f)&&
(g=a[f],"undefined"!==typeof g&&null!==g&&""!==g&&d.push(f+b+(c?encodeURIComponent(g):g)));return d},encodeAndBuildRequest:function(a,b){return this.map(a,function(a){return encodeURIComponent(a)}).join(b)},map:function(a,b){if(Array.prototype.map)return a.map(b);if(void 0===a||null===a)throw new TypeError;var c=Object(a),d=c.length>>>0;if("function"!==typeof b)throw new TypeError;for(var f=Array(d),g=0;g<d;g++)g in c&&(f[g]=b.call(b,c[g],g,c));return f},filter:function(a,b){if(!Array.prototype.filter){if(void 0===
a||null===a)throw new TypeError;var c=Object(a),d=c.length>>>0;if("function"!==typeof b)throw new TypeError;for(var f=[],g=0;g<d;g++)if(g in c){var k=c[g];b.call(b,k,g,c)&&f.push(k)}return f}return a.filter(b)},getCookie:function(a){a+="=";var b=document.cookie.split(";"),c,d,f;c=0;for(d=b.length;c<d;c++){for(f=b[c];" "===f.charAt(0);)f=f.substring(1,f.length);if(0===f.indexOf(a))return decodeURIComponent(f.substring(a.length,f.length))}return null},setCookie:function(a,b,c,d,f,g){var k=new Date;
c&&(c*=6E4);document.cookie=a+"="+encodeURIComponent(b)+(c?";expires="+(new Date(k.getTime()+c)).toUTCString():"")+(d?";path="+d:"")+(f?";domain="+f:"")+(g?";secure":"")},extendArray:function(a,b){return a instanceof Array&&b instanceof Array?(Array.prototype.push.apply(a,b),!0):!1},extendObject:function(a,b,c){var d;if(a===Object(a)&&b===Object(b)){for(d in b)!b.hasOwnProperty(d)||!w.isEmptyObject(c)&&d in c||(a[d]=b[d]);return!0}return!1},getMaxCookieExpiresInMinutes:function(){return((new Date(z.COOKIE_MAX_EXPIRATION_DATE)).getTime()-
(new Date).getTime())/1E3/60}};"error"===g&&0===k&&t.addListener(window,"load",function(){DIL.windowLoaded=!0});var S=!1,H=function(){S||(S=!0,q.registerRequest(),U(),r||q.abortRequests||y.attachIframe(),q.readyToRemove=!0,q.requestRemoval())},U=function(){r||setTimeout(function(){N||q.firstRequestHasFired||("function"===typeof I?K.afterResult(I).submit():K.submit())},DIL.constants.TIME_TO_DEFAULT_REQUEST)};C=document;"error"!==g&&(DIL.windowLoaded?H():"complete"!==C.readyState&&"loaded"!==C.readyState?
t.addListener(window,"load",function(){DIL.windowLoaded=!0;H()}):(DIL.windowLoaded=!0,H()));q.declaredId.setDeclaredId(u,"init");q.processVisitorAPI();this.api=K;this.getStuffedVariable=function(a){var b=J.stuffed[a];b||"number"===typeof b||(b=t.getCookie(a))||"number"===typeof b||(b="");return b};this.validators=w;this.helpers=t;this.constants=z;this.log=b;T&&(this.pendingRequest=m,this.requestController=q,this.setDestinationPublishingUrl=f,this.destinationPublishing=y,this.requestProcs=D,this.variables=
J,this.callWindowLoadFunctions=H)},function(){var a=document,c;null==a.readyState&&a.addEventListener&&(a.readyState="loading",a.addEventListener("DOMContentLoaded",c=function(){a.removeEventListener("DOMContentLoaded",c,!1);a.readyState="complete"},!1))}(),DIL.extendStaticPropertiesAndMethods=function(a){var c;if(a===Object(a))for(c in a)a.hasOwnProperty(c)&&(this[c]=a[c])},DIL.extendStaticPropertiesAndMethods({version:"6.5",jsonVersion:1,constants:{TIME_TO_DEFAULT_REQUEST:50},variables:{scriptNodeList:document.getElementsByTagName("script"),
scriptsRemoved:[],callbacksRemoved:[]},windowLoaded:!1,dils:{},isAddedPostWindowLoad:function(a){this.windowLoaded="function"===typeof a?!!a():"boolean"===typeof a?a:!0},create:function(a){try{return new DIL(a)}catch(c){return(new Image(0,0)).src="http://error.demdex.net/event?d_nsid=0&d_px=14137&d_ld=name%3Derror%26filename%3Ddil.js%26partner%3Dno_partner%26message%3DError%2520in%2520attempt%2520to%2520create%2520DIL%2520instance%2520with%2520DIL.create()%26_ts%3D"+(new Date).getTime(),Error("Error in attempt to create DIL instance with DIL.create()")}},
registerDil:function(a,c,b){c=c+"$"+b;c in this.dils||(this.dils[c]=a)},getDil:function(a,c){var b;"string"!==typeof a&&(a="");c||(c=0);b=a+"$"+c;return b in this.dils?this.dils[b]:Error("The DIL instance with partner = "+a+" and containerNSID = "+c+" was not found")},dexGetQSVars:function(a,c,b){c=this.getDil(c,b);return c instanceof this?c.getStuffedVariable(a):""},xd:{postMessage:function(a,c,b){var d=1;c&&(window.postMessage?b.postMessage(a,c.replace(/([^:]+:\/\/[^\/]+).*/,"$1")):c&&(b.location=
c.replace(/#.*$/,"")+"#"+ +new Date+d++ +"&"+a))}}}),DIL.errorModule=function(){var a=DIL.create({partner:"error",containerNSID:0,disableDestinationPublishingIframe:!0}),c={harvestererror:14138,destpuberror:14139,dpmerror:14140,generalerror:14137,error:14137,noerrortypedefined:15021,evalerror:15016,rangeerror:15017,referenceerror:15018,typeerror:15019,urierror:15020},b=!1;return{activate:function(){b=!0},handleError:function(d){if(!b)return"DIL error module has not been activated";d!==Object(d)&&
(d={});var f=d.name?(d.name+"").toLowerCase():"",g=[];d={name:f,filename:d.filename?d.filename+"":"",partner:d.partner?d.partner+"":"no_partner",site:d.site?d.site+"":document.location.href,message:d.message?d.message+"":""};g.push(f in c?c[f]:c.noerrortypedefined);a.api.pixels(g).logs(d).useImageRequest().submit();return"DIL error report sent"},pixelMap:c}}(),DIL.tools={},DIL.modules={helpers:{handleModuleError:function(a,c,b){var d="";c=c||"Error caught in DIL module/submodule: ";a===Object(a)?
d=c+(a.message||"err has no message"):(d=c+"err is not a valid object",a={});a.message=d;b instanceof DIL&&(a.partner=b.api.getPartner());DIL.errorModule.handleError(a);return this.errorMessage=d}}});
DIL.tools.getSearchReferrer=function(a,c){var b=DIL.getDil("error"),d=DIL.tools.decomposeURI(a||document.referrer),f="",g="",k={queryParam:"q"};return(f=b.helpers.filter([c===Object(c)?c:{},{hostPattern:/aol\./},{hostPattern:/ask\./},{hostPattern:/bing\./},{hostPattern:/google\./},{hostPattern:/yahoo\./,queryParam:"p"}],function(a){return!(!a.hasOwnProperty("hostPattern")||!d.hostname.match(a.hostPattern))}).shift())?{valid:!0,name:d.hostname,keywords:(b.helpers.extendObject(k,f),g=k.queryPattern?
(f=(""+d.search).match(k.queryPattern))?f[1]:"":d.uriParams[k.queryParam],decodeURIComponent(g||"").replace(/\+|%20/g," "))}:{valid:!1,name:"",keywords:""}};
DIL.tools.decomposeURI=function(a){var c=DIL.getDil("error"),b=document.createElement("a");b.href=a||document.referrer;return{hash:b.hash,host:b.host.split(":").shift(),hostname:b.hostname,href:b.href,pathname:b.pathname.replace(/^\//,""),protocol:b.protocol,search:b.search,uriParams:function(a,b){c.helpers.map(b.split("&"),function(b){b=b.split("=");a[b.shift()]=b.shift()});return a}({},b.search.replace(/^(\/|\?)?|\/$/g,""))}};
DIL.tools.getMetaTags=function(){var a={},c=document.getElementsByTagName("meta"),b,d,f,g,k;b=0;for(f=arguments.length;b<f;b++)if(g=arguments[b],null!==g)for(d=0;d<c.length;d++)if(k=c[d],k.name===g){a[g]=k.content;break}return a};
DIL.modules.siteCatalyst={dil:null,handle:DIL.modules.helpers.handleModuleError,init:function(a,c,b,d){try{var f=this,g={name:"DIL Site Catalyst Module Error"},k=function(a){g.message=a;DIL.errorModule.handleError(g);return a};this.options=d===Object(d)?d:{};this.dil=null;if(c instanceof DIL)this.dil=c;else return k("dilInstance is not a valid instance of DIL");g.partner=c.api.getPartner();if(a!==Object(a))return k("siteCatalystReportingSuite is not an object");window.AppMeasurement_Module_DIL=a.m_DIL=
function(a){var c="function"===typeof a.m_i?a.m_i("DIL"):this;if(c!==Object(c))return k("m is not an object");c.trackVars=f.constructTrackVars(b);c.d=0;c.s=a;c._t=function(){var a,b,c=","+this.trackVars+",",d=this.s,g,s=[];g=[];var r={},v=!1;if(d!==Object(d))return k("Error in m._t function: s is not an object");if(this.d){if("function"===typeof d.foreachVar)d.foreachVar(function(a,b){"undefined"!==typeof b&&(r[a]=b,v=!0)},this.trackVars);else{if(!(d.va_t instanceof Array))return k("Error in m._t function: s.va_t is not an array");
if(d.lightProfileID)(a=d.lightTrackVars)&&(a=","+a+","+d.vl_mr+",");else if(d.pe||d.linkType)a=d.linkTrackVars,d.pe&&(b=d.pe.substring(0,1).toUpperCase()+d.pe.substring(1),d[b]&&(a=d[b].trackVars)),a&&(a=","+a+","+d.vl_l+","+d.vl_l2+",");if(a){b=0;for(s=a.split(",");b<s.length;b++)0<=c.indexOf(","+s[b]+",")&&g.push(s[b]);g.length&&(c=","+g.join(",")+",")}g=0;for(b=d.va_t.length;g<b;g++)a=d.va_t[g],0<=c.indexOf(","+a+",")&&"undefined"!==typeof d[a]&&null!==d[a]&&""!==d[a]&&(r[a]=d[a],v=!0)}f.includeContextData(d,
r).store_populated&&(v=!0);v&&this.d.api.signals(r,"c_").submit()}}};a.loadModule("DIL");a.DIL.d=c;return g.message?g.message:"DIL.modules.siteCatalyst.init() completed with no errors"}catch(r){return this.handle(r,"DIL.modules.siteCatalyst.init() caught error with message ",this.dil)}},constructTrackVars:function(a){var c=[],b,d,f,g,k;if(a===Object(a)){b=a.names;if(b instanceof Array&&(f=b.length))for(d=0;d<f;d++)g=b[d],"string"===typeof g&&g.length&&c.push(g);a=a.iteratedNames;if(a instanceof Array&&
(f=a.length))for(d=0;d<f;d++)if(b=a[d],b===Object(b)&&(g=b.name,k=parseInt(b.maxIndex,10),"string"===typeof g&&g.length&&!isNaN(k)&&0<=k))for(b=0;b<=k;b++)c.push(g+b);if(c.length)return c.join(",")}return this.constructTrackVars({names:"pageName channel campaign products events pe pev1 pev2 pev3".split(" "),iteratedNames:[{name:"prop",maxIndex:75},{name:"eVar",maxIndex:250}]})},includeContextData:function(a,c){var b={},d=!1;if(a.contextData===Object(a.contextData)){var f=a.contextData,g=this.options.replaceContextDataPeriodsWith,
k=this.options.filterFromContextVariables,r={},v,s,p,n;"string"===typeof g&&g.length||(g="_");if(k instanceof Array)for(v=0,s=k.length;v<s;v++)p=k[v],this.dil.validators.isPopulatedString(p)&&(r[p]=!0);for(n in f)!f.hasOwnProperty(n)||r[n]||!(k=f[n])&&"number"!==typeof k||(n=("contextData."+n).replace(/\./g,g),c[n]=k,d=!0)}b.store_populated=d;return b}};
DIL.modules.GA={dil:null,arr:null,tv:null,errorMessage:"",defaultTrackVars:["_setAccount","_setCustomVar","_addItem","_addTrans","_trackSocial"],defaultTrackVarsObj:null,signals:{},hasSignals:!1,handle:DIL.modules.helpers.handleModuleError,init:function(a,c,b){try{this.tv=this.arr=this.dil=null;this.errorMessage="";this.signals={};this.hasSignals=!1;var d={name:"DIL GA Module Error"},f="";c instanceof DIL?(this.dil=c,d.partner=this.dil.api.getPartner()):(f="dilInstance is not a valid instance of DIL",
d.message=f,DIL.errorModule.handleError(d));a instanceof Array&&a.length?this.arr=a:(f="gaArray is not an array or is empty",d.message=f,DIL.errorModule.handleError(d));this.tv=this.constructTrackVars(b);this.errorMessage=f}catch(g){this.handle(g,"DIL.modules.GA.init() caught error with message ",this.dil)}finally{return this}},constructTrackVars:function(a){var c=[],b,d,f,g;if(this.defaultTrackVarsObj!==Object(this.defaultTrackVarsObj)){f=this.defaultTrackVars;g={};b=0;for(d=f.length;b<d;b++)g[f[b]]=
!0;this.defaultTrackVarsObj=g}else g=this.defaultTrackVarsObj;if(a===Object(a)){a=a.names;if(a instanceof Array&&(d=a.length))for(b=0;b<d;b++)f=a[b],"string"===typeof f&&f.length&&f in g&&c.push(f);if(c.length)return c}return this.defaultTrackVars},constructGAObj:function(a){var c={};a=a instanceof Array?a:this.arr;var b,d,f,g;b=0;for(d=a.length;b<d;b++)f=a[b],f instanceof Array&&f.length&&(f=[],g=a[b],f instanceof Array&&g instanceof Array&&Array.prototype.push.apply(f,g),g=f.shift(),"string"===
typeof g&&g.length&&(c[g]instanceof Array||(c[g]=[]),c[g].push(f)));return c},addToSignals:function(a,c){if("string"!==typeof a||""===a||null==c||""===c)return!1;this.signals[a]instanceof Array||(this.signals[a]=[]);this.signals[a].push(c);return this.hasSignals=!0},constructSignals:function(){var a=this.constructGAObj(),c={_setAccount:function(a){this.addToSignals("c_accountId",a)},_setCustomVar:function(a,b,c){"string"===typeof b&&b.length&&this.addToSignals("c_"+b,c)},_addItem:function(a,b,c,d,
f,g){this.addToSignals("c_itemOrderId",a);this.addToSignals("c_itemSku",b);this.addToSignals("c_itemName",c);this.addToSignals("c_itemCategory",d);this.addToSignals("c_itemPrice",f);this.addToSignals("c_itemQuantity",g)},_addTrans:function(a,b,c,d,f,g,k,r){this.addToSignals("c_transOrderId",a);this.addToSignals("c_transAffiliation",b);this.addToSignals("c_transTotal",c);this.addToSignals("c_transTax",d);this.addToSignals("c_transShipping",f);this.addToSignals("c_transCity",g);this.addToSignals("c_transState",
k);this.addToSignals("c_transCountry",r)},_trackSocial:function(a,b,c,d){this.addToSignals("c_socialNetwork",a);this.addToSignals("c_socialAction",b);this.addToSignals("c_socialTarget",c);this.addToSignals("c_socialPagePath",d)}},b=this.tv,d,f,g,k,r,v;d=0;for(f=b.length;d<f;d++)if(g=b[d],a.hasOwnProperty(g)&&c.hasOwnProperty(g)&&(v=a[g],v instanceof Array))for(k=0,r=v.length;k<r;k++)c[g].apply(this,v[k])},submit:function(){try{if(""!==this.errorMessage)return this.errorMessage;this.constructSignals();
return this.hasSignals?(this.dil.api.signals(this.signals).submit(),"Signals sent: "+this.dil.helpers.convertObjectToKeyValuePairs(this.signals,"=",!0)+this.dil.log):"No signals present"}catch(a){return this.handle(a,"DIL.modules.GA.submit() caught error with message ",this.dil)}},Stuffer:{LIMIT:5,dil:null,cookieName:null,delimiter:null,errorMessage:"",handle:DIL.modules.helpers.handleModuleError,callback:null,v:function(){return!1},init:function(a,c,b){try{this.callback=this.dil=null,this.errorMessage=
"",a instanceof DIL?(this.dil=a,this.v=this.dil.validators.isPopulatedString,this.cookieName=this.v(c)?c:"aam_ga",this.delimiter=this.v(b)?b:"|"):this.handle({message:"dilInstance is not a valid instance of DIL"},"DIL.modules.GA.Stuffer.init() error: ")}catch(d){this.handle(d,"DIL.modules.GA.Stuffer.init() caught error with message ",this.dil)}finally{return this}},process:function(a){var c,b,d,f,g,k;k=!1;var r=1;if(a===Object(a)&&(c=a.stuff)&&c instanceof Array&&(b=c.length))for(a=0;a<b;a++)if((d=
c[a])&&d===Object(d)&&(f=d.cn,g=d.cv,f===this.cookieName&&this.v(g))){k=!0;break}if(k){c=g.split(this.delimiter);"undefined"===typeof window._gaq&&(window._gaq=[]);d=window._gaq;a=0;for(b=c.length;a<b&&!(k=c[a].split("="),g=k[0],k=k[1],this.v(g)&&this.v(k)&&d.push(["_setCustomVar",r++,g,k,1]),r>this.LIMIT);a++);this.errorMessage=1<r?"No errors - stuffing successful":"No valid values to stuff"}else this.errorMessage="Cookie name and value not found in json";if("function"===typeof this.callback)return this.callback()},
submit:function(){try{var a=this;if(""!==this.errorMessage)return this.errorMessage;this.dil.api.afterResult(function(b){a.process(b)}).submit();return"DIL.modules.GA.Stuffer.submit() successful"}catch(c){return this.handle(c,"DIL.modules.GA.Stuffer.submit() caught error with message ",this.dil)}}}};
DIL.modules.Peer39={aid:"",dil:null,optionals:null,errorMessage:"",calledBack:!1,script:null,scriptsSent:[],returnedData:[],handle:DIL.modules.helpers.handleModuleError,init:function(a,c,b){try{this.dil=null;this.errorMessage="";this.calledBack=!1;this.optionals=b===Object(b)?b:{};b={name:"DIL Peer39 Module Error"};var d=[],f="";this.isSecurePageButNotEnabled(document.location.protocol)&&(f="Module has not been enabled for a secure page",d.push(f),b.message=f,DIL.errorModule.handleError(b));c instanceof
DIL?(this.dil=c,b.partner=this.dil.api.getPartner()):(f="dilInstance is not a valid instance of DIL",d.push(f),b.message=f,DIL.errorModule.handleError(b));"string"===typeof a&&a.length?this.aid=a:(f="aid is not a string or is empty",d.push(f),b.message=f,DIL.errorModule.handleError(b));this.errorMessage=d.join("\n")}catch(g){this.handle(g,"DIL.modules.Peer39.init() caught error with message ",this.dil)}finally{return this}},isSecurePageButNotEnabled:function(a){return"https:"===a&&!0!==this.optionals.enableHTTPS?
!0:!1},constructSignals:function(){var a=this,c=this.constructScript(),b=DIL.variables.scriptNodeList[0];window["afterFinished_"+this.aid]=function(){try{var b=a.processData(p39_KVP_Short("c_p","|").split("|"));b.hasSignals&&a.dil.api.signals(b.signals).submit()}catch(c){}finally{a.calledBack=!0,"function"===typeof a.optionals.afterResult&&a.optionals.afterResult()}};b.parentNode.insertBefore(c,b);this.scriptsSent.push(c);return"Request sent to Peer39"},processData:function(a){var c,b,d,f,g={},k=
!1;this.returnedData.push(a);if(a instanceof Array)for(c=0,b=a.length;c<b;c++)d=a[c].split("="),f=d[0],d=d[1],f&&isFinite(d)&&!isNaN(parseInt(d,10))&&(g[f]instanceof Array||(g[f]=[]),g[f].push(d),k=!0);return{hasSignals:k,signals:g}},constructScript:function(){var a=document.createElement("script"),c=this.optionals,b=c.scriptId,d=c.scriptSrc,c=c.scriptParams;a.id="string"===typeof b&&b.length?b:"peer39ScriptLoader";a.type="text/javascript";"string"===typeof d&&d.length?a.src=d:(a.src=document.location.protocol+
"//stags.peer39.net/"+this.aid+"/trg_"+this.aid+".js","string"===typeof c&&c.length&&(a.src+="?"+c));return a},submit:function(){try{return""!==this.errorMessage?this.errorMessage:this.constructSignals()}catch(a){return this.handle(a,"DIL.modules.Peer39.submit() caught error with message ",this.dil)}}};

/*
 Start ActivityMap Module

 The following module enables ActivityMap tracking in Adobe Analytics. ActivityMap
 allows you to view data overlays on your links and content to understand how
 users engage with your web site. If you do not intend to use ActivityMap, you
 can remove the following block of code from your AppMeasurement.js file.
 Additional documentation on how to configure ActivityMap is available at:
 https://marketing.adobe.com/resources/help/en_US/analytics/activitymap/getting-started-admins.html
*/
function AppMeasurement_Module_ActivityMap(f){function g(a,d){var b,c,n;if(a&&d&&(b=e.c[d]||(e.c[d]=d.split(","))))for(n=0;n<b.length&&(c=b[n++]);)if(-1<a.indexOf(c))return null;p=1;return a}function q(a,d,b,c,e){var g,h;if(a.dataset&&(h=a.dataset[d]))g=h;else if(a.getAttribute)if(h=a.getAttribute("data-"+b))g=h;else if(h=a.getAttribute(b))g=h;if(!g&&f.useForcedLinkTracking&&e&&(g="",d=a.onclick?""+a.onclick:"")){b=d.indexOf(c);var l,k;if(0<=b){for(b+=10;b<d.length&&0<="= \t\r\n".indexOf(d.charAt(b));)b++;
if(b<d.length){h=b;for(l=k=0;h<d.length&&(";"!=d.charAt(h)||l);)l?d.charAt(h)!=l||k?k="\\"==d.charAt(h)?!k:0:l=0:(l=d.charAt(h),'"'!=l&&"'"!=l&&(l=0)),h++;if(d=d.substring(b,h))a.e=new Function("s","var e;try{s.w."+c+"="+d+"}catch(e){}"),a.e(f)}}}return g||e&&f.w[c]}function r(a,d,b){var c;return(c=e[d](a,b))&&(p?(p=0,c):g(k(c),e[d+"Exclusions"]))}function s(a,d,b){var c;if(a&&!(1===(c=a.nodeType)&&(c=a.nodeName)&&(c=c.toUpperCase())&&t[c])&&(1===a.nodeType&&(c=a.nodeValue)&&(d[d.length]=c),b.a||
b.t||b.s||!a.getAttribute||((c=a.getAttribute("alt"))?b.a=c:(c=a.getAttribute("title"))?b.t=c:"IMG"==(""+a.nodeName).toUpperCase()&&(c=a.getAttribute("src")||a.src)&&(b.s=c)),(c=a.childNodes)&&c.length))for(a=0;a<c.length;a++)s(c[a],d,b)}function k(a){if(null==a||void 0==a)return a;try{return a.replace(RegExp("^[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+","mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+$",
"mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]{1,}","mg")," ").substring(0,254)}catch(d){}}var e=this;e.s=f;var m=window;m.s_c_in||(m.s_c_il=[],m.s_c_in=0);e._il=m.s_c_il;e._in=m.s_c_in;e._il[e._in]=e;m.s_c_in++;e._c="s_m";e.c={};var p=0,t={SCRIPT:1,STYLE:1,LINK:1,CANVAS:1};e._g=function(){var a,d,b,c=f.contextData,e=f.linkObject;(a=f.pageName||f.pageURL)&&(d=r(e,"link",f.linkName))&&(b=r(e,"region"))&&(c["a.activitymap.page"]=a.substring(0,
255),c["a.activitymap.link"]=128<d.length?d.substring(0,128):d,c["a.activitymap.region"]=127<b.length?b.substring(0,127):b,c["a.activitymap.pageIDType"]=f.pageName?1:0)};e.link=function(a,d){var b;if(d)b=g(k(d),e.linkExclusions);else if((b=a)&&!(b=q(a,"sObjectId","s-object-id","s_objectID",1))){var c,f;(f=g(k(a.innerText||a.textContent),e.linkExclusions))||(s(a,c=[],b={a:void 0,t:void 0,s:void 0}),(f=g(k(c.join(""))))||(f=g(k(b.a?b.a:b.t?b.t:b.s?b.s:void 0)))||!(c=(c=a.tagName)&&c.toUpperCase?c.toUpperCase():
"")||("INPUT"==c||"SUBMIT"==c&&a.value?f=g(k(a.value)):"IMAGE"==c&&a.src&&(f=g(k(a.src)))));b=f}return b};e.region=function(a){for(var d,b=e.regionIDAttribute||"id";a&&(a=a.parentNode);){if(d=q(a,b,b,b))return d;if("BODY"==a.nodeName)return"BODY"}}}
/* End ActivityMap Module */
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

AppMeasurement for JavaScript version: 1.7.0
Copyright 1996-2016 Adobe, Inc. All Rights Reserved
More info available at http://www.adobe.com/marketing-cloud.html
*/
function AppMeasurement(){var a=this;a.version="1.7.0";var k=window;k.s_c_in||(k.s_c_il=[],k.s_c_in=0);a._il=k.s_c_il;a._in=k.s_c_in;a._il[a._in]=a;k.s_c_in++;a._c="s_c";var q=k.AppMeasurement.Jb;q||(q=null);var r=k,n,t;try{for(n=r.parent,t=r.location;n&&n.location&&t&&""+n.location!=""+t&&r.location&&""+n.location!=""+r.location&&n.location.host==t.host;)r=n,n=r.parent}catch(u){}a.yb=function(a){try{console.log(a)}catch(b){}};a.Ha=function(a){return""+parseInt(a)==""+a};a.replace=function(a,b,d){return!a||
0>a.indexOf(b)?a:a.split(b).join(d)};a.escape=function(c){var b,d;if(!c)return c;c=encodeURIComponent(c);for(b=0;7>b;b++)d="+~!*()'".substring(b,b+1),0<=c.indexOf(d)&&(c=a.replace(c,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return c};a.unescape=function(c){if(!c)return c;c=0<=c.indexOf("+")?a.replace(c,"+"," "):c;try{return decodeURIComponent(c)}catch(b){}return unescape(c)};a.pb=function(){var c=k.location.hostname,b=a.fpCookieDomainPeriods,d;b||(b=a.cookieDomainPeriods);if(c&&!a.cookieDomain&&
!/^[0-9.]+$/.test(c)&&(b=b?parseInt(b):2,b=2<b?b:2,d=c.lastIndexOf("."),0<=d)){for(;0<=d&&1<b;)d=c.lastIndexOf(".",d-1),b--;a.cookieDomain=0<d?c.substring(d):c}return a.cookieDomain};a.c_r=a.cookieRead=function(c){c=a.escape(c);var b=" "+a.d.cookie,d=b.indexOf(" "+c+"="),f=0>d?d:b.indexOf(";",d);c=0>d?"":a.unescape(b.substring(d+2+c.length,0>f?b.length:f));return"[[B]]"!=c?c:""};a.c_w=a.cookieWrite=function(c,b,d){var f=a.pb(),e=a.cookieLifetime,g;b=""+b;e=e?(""+e).toUpperCase():"";d&&"SESSION"!=
e&&"NONE"!=e&&((g=""!=b?parseInt(e?e:0):-60)?(d=new Date,d.setTime(d.getTime()+1E3*g)):1==d&&(d=new Date,g=d.getYear(),d.setYear(g+5+(1900>g?1900:0))));return c&&"NONE"!=e?(a.d.cookie=a.escape(c)+"="+a.escape(""!=b?b:"[[B]]")+"; path=/;"+(d&&"SESSION"!=e?" expires="+d.toGMTString()+";":"")+(f?" domain="+f+";":""),a.cookieRead(c)==b):0};a.K=[];a.ha=function(c,b,d){if(a.Aa)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,m=["webkitvisibilitychange",
"visibilitychange"];g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.ia)for(a.ia=1,d=0;d<m.length;d++)a.d.addEventListener(m[d],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&(a.ia=0,a.delayReady())});f=1;e=0}else d||a.p("_d")&&(f=1);f&&(a.K.push({m:c,a:b,t:e}),a.ia||setTimeout(a.delayReady,a.maxDelay));return f};a.delayReady=function(){var c=(new Date).getTime(),b=0,d;for(a.p("_d")?b=1:a.va();0<a.K.length;){d=a.K.shift();if(b&&!d.t&&d.t>c){a.K.unshift(d);
setTimeout(a.delayReady,parseInt(a.maxDelay/2));break}a.Aa=1;a[d.m].apply(a,d.a);a.Aa=0}};a.setAccount=a.sa=function(c){var b,d;if(!a.ha("setAccount",arguments))if(a.account=c,a.allAccounts)for(b=a.allAccounts.concat(c.split(",")),a.allAccounts=[],b.sort(),d=0;d<b.length;d++)0!=d&&b[d-1]==b[d]||a.allAccounts.push(b[d]);else a.allAccounts=c.split(",")};a.foreachVar=function(c,b){var d,f,e,g,m="";e=f="";if(a.lightProfileID)d=a.O,(m=a.lightTrackVars)&&(m=","+m+","+a.ma.join(",")+",");else{d=a.g;if(a.pe||
a.linkType)m=a.linkTrackVars,f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(m=a[e].Hb,f=a[e].Gb));m&&(m=","+m+","+a.G.join(",")+",");f&&m&&(m+=",events,")}b&&(b=","+b+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!m||0<=m.indexOf(","+e+","))&&(!b||0<=b.indexOf(","+e+","))&&c(e,g)};a.r=function(c,b,d,f,e){var g="",m,p,k,w,n=0;"contextData"==c&&(c="c");if(b){for(m in b)if(!(Object.prototype[m]||e&&m.substring(0,e.length)!=e)&&b[m]&&(!d||0<=d.indexOf(","+(f?f+
".":"")+m+","))){k=!1;if(n)for(p=0;p<n.length;p++)m.substring(0,n[p].length)==n[p]&&(k=!0);if(!k&&(""==g&&(g+="&"+c+"."),p=b[m],e&&(m=m.substring(e.length)),0<m.length))if(k=m.indexOf("."),0<k)p=m.substring(0,k),k=(e?e:"")+p+".",n||(n=[]),n.push(k),g+=a.r(p,b,d,f,k);else if("boolean"==typeof p&&(p=p?"true":"false"),p){if("retrieveLightData"==f&&0>e.indexOf(".contextData."))switch(k=m.substring(0,4),w=m.substring(4),m){case "transactionID":m="xact";break;case "channel":m="ch";break;case "campaign":m=
"v0";break;default:a.Ha(w)&&("prop"==k?m="c"+w:"eVar"==k?m="v"+w:"list"==k?m="l"+w:"hier"==k&&(m="h"+w,p=p.substring(0,255)))}g+="&"+a.escape(m)+"="+a.escape(p)}}""!=g&&(g+="&."+c)}return g};a.usePostbacks=0;a.sb=function(){var c="",b,d,f,e,g,m,p,k,n="",r="",s=e="";if(a.lightProfileID)b=a.O,(n=a.lightTrackVars)&&(n=","+n+","+a.ma.join(",")+",");else{b=a.g;if(a.pe||a.linkType)n=a.linkTrackVars,r=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(n=a[e].Hb,r=a[e].Gb));
n&&(n=","+n+","+a.G.join(",")+",");r&&(r=","+r+",",n&&(n+=",events,"));a.events2&&(s+=(""!=s?",":"")+a.events2)}if(a.visitor&&1.5<=parseFloat(a.visitor.version)&&a.visitor.getCustomerIDs){e=q;if(g=a.visitor.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState));e&&(c+=a.r("cid",e))}a.AudienceManagement&&a.AudienceManagement.isReady()&&(c+=a.r("d",a.AudienceManagement.getEventCallConfigParams()));for(d=0;d<b.length;d++){e=b[d];
g=a[e];f=e.substring(0,4);m=e.substring(4);!g&&"events"==e&&s&&(g=s,s="");if(g&&(!n||0<=n.indexOf(","+e+","))){switch(e){case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e="D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e="aid";break;case "audienceManagerLocationHint":e="aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&
(a.pageURLRest=g.substring(255),g=g.substring(0,255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&(g="");break;case "charSet":e="ce";break;case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e=
"vvp";break;case "currencyCode":e="cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";break;case "cookiesEnabled":e="k";break;case "browserWidth":e="bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":s&&
(g+=(""!=g?",":"")+s);if(r)for(m=g.split(","),g="",f=0;f<m.length;f++)p=m[f],k=p.indexOf("="),0<=k&&(p=p.substring(0,k)),k=p.indexOf(":"),0<=k&&(p=p.substring(0,k)),0<=r.indexOf(","+p+",")&&(g+=(g?",":"")+m[f]);break;case "events2":g="";break;case "contextData":c+=a.r("c",a[e],n,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;
case "deleteLightProfiles":e="mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(c+=a.r("mts",a[e],n,e));g="";break;default:a.Ha(m)&&("prop"==f?e="c"+m:"eVar"==f?e="v"+m:"list"==f?e="l"+m:"hier"==f&&(e="h"+m,g=g.substring(0,255)))}g&&(c+="&"+e+"="+("pev"!=e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.e&&(c+=a.e)}return c};a.D=function(a){var b=a.tagName;if("undefined"!=""+a.Mb||"undefined"!=""+a.Cb&&"HTML"!=(""+a.Cb).toUpperCase())return"";b=b&&b.toUpperCase?b.toUpperCase():"";"SHAPE"==
b&&(b="");b&&(("INPUT"==b||"BUTTON"==b)&&a.type&&a.type.toUpperCase?b=a.type.toUpperCase():!b&&a.href&&(b="A"));return b};a.Da=function(a){var b=a.href?a.href:"",d,f,e;d=b.indexOf(":");f=b.indexOf("?");e=b.indexOf("/");b&&(0>d||0<=f&&d>f||0<=e&&d>e)&&(f=a.protocol&&1<a.protocol.length?a.protocol:l.protocol?l.protocol:"",d=l.pathname.lastIndexOf("/"),b=(f?f+"//":"")+(a.host?a.host:l.host?l.host:"")+("/"!=h.substring(0,1)?l.pathname.substring(0,0>d?0:d)+"/":"")+b);return b};a.L=function(c){var b=a.D(c),
d,f,e="",g=0;return b&&(d=c.protocol,f=c.onclick,!c.href||"A"!=b&&"AREA"!=b||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+f,"\r",""),"\n",""),"\t","")," ",""),g=2):"INPUT"==b||"SUBMIT"==b?(c.value?e=c.value:c.innerText?e=c.innerText:c.textContent&&(e=c.textContent),g=3):"IMAGE"==b&&c.src&&(e=c.src):e=a.Da(c),e)?{id:e.substring(0,100),type:g}:0};a.Kb=function(c){for(var b=a.D(c),d=a.L(c);c&&!d&&"BODY"!=b;)if(c=c.parentElement?c.parentElement:c.parentNode)b=
a.D(c),d=a.L(c);d&&"BODY"!=b||(c=0);c&&(b=c.onclick?""+c.onclick:"",0<=b.indexOf(".tl(")||0<=b.indexOf(".trackLink("))&&(c=0);return c};a.Bb=function(){var c,b,d=a.linkObject,f=a.linkType,e=a.linkURL,g,m;a.na=1;d||(a.na=0,d=a.clickObject);if(d){c=a.D(d);for(b=a.L(d);d&&!b&&"BODY"!=c;)if(d=d.parentElement?d.parentElement:d.parentNode)c=a.D(d),b=a.L(d);b&&"BODY"!=c||(d=0);if(d&&!a.linkObject){var p=d.onclick?""+d.onclick:"";if(0<=p.indexOf(".tl(")||0<=p.indexOf(".trackLink("))d=0}}else a.na=1;!e&&d&&
(e=a.Da(d));e&&!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var n=0,r=0,q;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(p=e.toLowerCase(),g=p.indexOf("?"),m=p.indexOf("#"),0<=g?0<=m&&m<g&&(g=m):g=m,0<=g&&(p=p.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),m=0;m<g.length;m++)(q=g[m])&&p.substring(p.length-(q.length+1))=="."+q&&(f="d");if(a.trackExternalLinks&&!f&&(p=e.toLowerCase(),a.Ga(p)&&(a.linkInternalFilters||(a.linkInternalFilters=
k.location.hostname),g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),n=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(m=0;m<g.length;m++)q=g[m],0<=p.indexOf(q)&&(r=1);r?n&&(f="e"):n||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.e="",d&&(f=a.pageName,e=1,d=d.sourceIndex,f||(f=a.pageURL,e=0),k.s_objectID&&(b.id=k.s_objectID,d=b.type=1),f&&b&&b.id&&c&&(a.e="&pid="+a.escape(f.substring(0,255))+
(e?"&pidt="+e:"")+"&oid="+a.escape(b.id.substring(0,100))+(b.type?"&oidt="+b.type:"")+"&ot="+c+(d?"&oi="+d:"")))};a.tb=function(){var c=a.na,b=a.linkType,d=a.linkURL,f=a.linkName;b&&(d||f)&&(b=b.toLowerCase(),"d"!=b&&"e"!=b&&(b="o"),a.pe="lnk_"+b,a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):"",c=1);a.abort&&(c=0);if(a.trackClickMap||a.trackInlineStats||a.ActivityMap){var b={},d=0,e=a.cookieRead("s_sq"),g=e?e.split("&"):0,m,p,k,e=0;if(g)for(m=0;m<g.length;m++)p=g[m].split("="),f=a.unescape(p[0]).split(","),
p=a.unescape(p[1]),b[p]=f;f=a.account.split(",");m={};for(k in a.contextData)k&&!Object.prototype[k]&&"a.activitymap."==k.substring(0,14)&&(m[k]=a.contextData[k],a.contextData[k]="");a.e=a.r("c",m)+(a.e?a.e:"");if(c||a.e){c&&!a.e&&(e=1);for(p in b)if(!Object.prototype[p])for(k=0;k<f.length;k++)for(e&&(g=b[p].join(","),g==a.account&&(a.e+=("&"!=p.charAt(0)?"&":"")+p,b[p]=[],d=1)),m=0;m<b[p].length;m++)g=b[p][m],g==f[k]&&(e&&(a.e+="&u="+a.escape(g)+("&"!=p.charAt(0)?"&":"")+p+"&u=0"),b[p].splice(m,
1),d=1);c||(d=1);if(d){e="";m=2;!c&&a.e&&(e=a.escape(f.join(","))+"="+a.escape(a.e),m=1);for(p in b)!Object.prototype[p]&&0<m&&0<b[p].length&&(e+=(e?"&":"")+a.escape(b[p].join(","))+"="+a.escape(p),m--);a.cookieWrite("s_sq",e)}}}return c};a.ub=function(){if(!a.Fb){var c=new Date,b=r.location,d,f,e=f=d="",g="",m="",k="1.2",n=a.cookieWrite("s_cc","true",0)?"Y":"N",q="",s="";if(c.setUTCDate&&(k="1.3",(0).toPrecision&&(k="1.5",c=[],c.forEach))){k="1.6";f=0;d={};try{f=new Iterator(d),f.next&&(k="1.7",
c.reduce&&(k="1.8",k.trim&&(k="1.8.1",Date.parse&&(k="1.8.2",Object.create&&(k="1.8.5")))))}catch(t){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;m=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;try{a.b.addBehavior("#default#homePage"),q=a.b.Lb(b)?"Y":"N"}catch(u){}try{a.b.addBehavior("#default#clientCaps"),s=a.b.connectionType}catch(x){}a.resolution=
d;a.colorDepth=f;a.javascriptVersion=k;a.javaEnabled=e;a.cookiesEnabled=n;a.browserWidth=g;a.browserHeight=m;a.connectionType=s;a.homepage=q;a.Fb=1}};a.P={};a.loadModule=function(c,b){var d=a.P[c];if(!d){d=k["AppMeasurement_Module_"+c]?new k["AppMeasurement_Module_"+c](a):{};a.P[c]=a[c]=d;d.Xa=function(){return d.ab};d.bb=function(b){if(d.ab=b)a[c+"_onLoad"]=b,a.ha(c+"_onLoad",[a,d],1)||b(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",{get:d.Xa,set:d.bb}):d._olc=1}catch(f){d._olc=
1}}b&&(a[c+"_onLoad"]=b,a.ha(c+"_onLoad",[a,d],1)||b(a,d))};a.p=function(c){var b,d;for(b in a.P)if(!Object.prototype[b]&&(d=a.P[b])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[c]&&d[c]()))return 1;return 0};a.wb=function(){var c=Math.floor(1E13*Math.random()),b=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=a.cookieRead(d);if(b){f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,c))return 0;f=c}if(f%1E4>v)return 0}return 1};a.Q=
function(c,b){var d,f,e,g,m,k;for(d=0;2>d;d++)for(f=0<d?a.wa:a.g,e=0;e<f.length;e++)if(g=f[e],(m=c[g])||c["!"+g]){if(!b&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(k in a[g])m[k]||(m[k]=a[g][k]);a[g]=m}};a.Qa=function(c,b){var d,f,e,g;for(d=0;2>d;d++)for(f=0<d?a.wa:a.g,e=0;e<f.length;e++)g=f[e],c[g]=a[g],b||c[g]||(c["!"+g]=1)};a.ob=function(a){var b,d,f,e,g,k=0,p,n="",q="";if(a&&255<a.length&&(b=""+a,d=b.indexOf("?"),0<d&&(p=b.substring(d+1),b=b.substring(0,d),e=b.toLowerCase(),f=0,"http://"==
e.substring(0,7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=b.substring(d),b=b.substring(0,d),0<=e.indexOf("google")?k=",q,ie,start,search_key,word,kw,cd,":0<=e.indexOf("yahoo.co")&&(k=",p,ei,"),k&&p)))){if((a=p.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=k.indexOf(","+e.substring(0,d)+",")?n+=(n?"&":"")+e:q+=(q?"&":"")+e;n&&q?p=n+"&"+q:q=""}d=253-(p.length-q.length)-b.length;a=b+(0<d?g.substring(0,d):"")+"?"+p}return a};
a.Wa=function(c){var b=a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];b||(b=a.d.webkitVisibilityState);if(b&&"prerender"==b){if(c)for(b=0;b<d.length;b++)a.d.addEventListener(d[b],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&c()});return!1}return!0};a.da=!1;a.I=!1;a.eb=function(){a.I=!0;a.j()};a.ba=!1;a.U=!1;a.$a=function(c){a.marketingCloudVisitorID=c;a.U=!0;a.j()};a.ea=!1;a.V=!1;a.fb=function(c){a.visitorOptedOut=c;a.V=!0;a.j()};a.Y=!1;
a.R=!1;a.Sa=function(c){a.analyticsVisitorID=c;a.R=!0;a.j()};a.aa=!1;a.T=!1;a.Ua=function(c){a.audienceManagerLocationHint=c;a.T=!0;a.j()};a.Z=!1;a.S=!1;a.Ta=function(c){a.audienceManagerBlob=c;a.S=!0;a.j()};a.Va=function(c){a.maxDelay||(a.maxDelay=250);return a.p("_d")?(c&&setTimeout(function(){c()},a.maxDelay),!1):!0};a.ca=!1;a.H=!1;a.va=function(){a.H=!0;a.j()};a.isReadyToTrack=function(){var c=!0,b=a.visitor,d,f,e;a.da||a.I||(a.Wa(a.eb)?a.I=!0:a.da=!0);if(a.da&&!a.I)return!1;b&&b.isAllowed()&&
(a.ba||a.marketingCloudVisitorID||!b.getMarketingCloudVisitorID||(a.ba=!0,a.marketingCloudVisitorID=b.getMarketingCloudVisitorID([a,a.$a]),a.marketingCloudVisitorID&&(a.U=!0)),a.ea||a.visitorOptedOut||!b.isOptedOut||(a.ea=!0,a.visitorOptedOut=b.isOptedOut([a,a.fb]),a.visitorOptedOut!=q&&(a.V=!0)),a.Y||a.analyticsVisitorID||!b.getAnalyticsVisitorID||(a.Y=!0,a.analyticsVisitorID=b.getAnalyticsVisitorID([a,a.Sa]),a.analyticsVisitorID&&(a.R=!0)),a.aa||a.audienceManagerLocationHint||!b.getAudienceManagerLocationHint||
(a.aa=!0,a.audienceManagerLocationHint=b.getAudienceManagerLocationHint([a,a.Ua]),a.audienceManagerLocationHint&&(a.T=!0)),a.Z||a.audienceManagerBlob||!b.getAudienceManagerBlob||(a.Z=!0,a.audienceManagerBlob=b.getAudienceManagerBlob([a,a.Ta]),a.audienceManagerBlob&&(a.S=!0)),c=a.ba&&!a.U&&!a.marketingCloudVisitorID,b=a.Y&&!a.R&&!a.analyticsVisitorID,d=a.aa&&!a.T&&!a.audienceManagerLocationHint,f=a.Z&&!a.S&&!a.audienceManagerBlob,e=a.ea&&!a.V,c=c||b||d||f||e?!1:!0);a.ca||a.H||(a.Va(a.va)?a.H=!0:a.ca=
!0);a.ca&&!a.H&&(c=!1);return c};a.o=q;a.u=0;a.callbackWhenReadyToTrack=function(c,b,d){var f;f={};f.jb=c;f.ib=b;f.gb=d;a.o==q&&(a.o=[]);a.o.push(f);0==a.u&&(a.u=setInterval(a.j,100))};a.j=function(){var c;if(a.isReadyToTrack()&&(a.cb(),a.o!=q))for(;0<a.o.length;)c=a.o.shift(),c.ib.apply(c.jb,c.gb)};a.cb=function(){a.u&&(clearInterval(a.u),a.u=0)};a.Ya=function(c){var b,d,f=q,e=q;if(!a.isReadyToTrack()){b=[];if(c!=q)for(d in f={},c)f[d]=c[d];e={};a.Qa(e,!0);b.push(f);b.push(e);a.callbackWhenReadyToTrack(a,
a.track,b);return!0}return!1};a.qb=function(){var c=a.cookieRead("s_fid"),b="",d="",f;f=8;var e=4;if(!c||0>c.indexOf("-")){for(c=0;16>c;c++)f=Math.floor(Math.random()*f),b+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;c=b+"-"+d}a.cookieWrite("s_fid",c,1)||(c=0);return c};a.t=a.track=function(c,b){var d,f=new Date,e="s"+Math.floor(f.getTime()/108E5)%10+Math.floor(1E13*Math.random()),g=f.getYear(),g="t="+a.escape(f.getDate()+"/"+f.getMonth()+
"/"+(1900>g?g+1900:g)+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+" "+f.getDay()+" "+f.getTimezoneOffset());a.visitor&&(a.visitor.getAuthState&&(a.authState=a.visitor.getAuthState()),!a.supplementalDataID&&a.visitor.getSupplementalDataID&&(a.supplementalDataID=a.visitor.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?!1:!0)));a.p("_s");a.Ya(c)||(b&&a.Q(b),c&&(d={},a.Qa(d,0),a.Q(c)),a.wb()&&!a.visitorOptedOut&&(a.analyticsVisitorID||a.marketingCloudVisitorID||(a.fid=
a.qb()),a.Bb(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&(a.abort||(a.trackOffline&&!a.timestamp&&(a.timestamp=Math.floor(f.getTime()/1E3)),f=k.location,a.pageURL||(a.pageURL=f.href?f.href:f),a.referrer||a.Ra||(a.referrer=r.document.referrer),a.Ra=1,a.referrer=a.ob(a.referrer),a.p("_g")),a.tb()&&!a.abort&&(a.ub(),g+=a.sb(),a.Ab(e,g),a.p("_t"),a.referrer=""))),c&&a.Q(d,1));a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=a.linkType=k.s_objectID=
a.pe=a.pev1=a.pev2=a.pev3=a.e=a.lightProfileID=0};a.tl=a.trackLink=function(c,b,d,f,e){a.linkObject=c;a.linkType=b;a.linkName=d;e&&(a.l=c,a.A=e);return a.track(f)};a.trackLight=function(c,b,d,f){a.lightProfileID=c;a.lightStoreForSeconds=b;a.lightIncrementBy=d;return a.track(f)};a.clearVars=function(){var c,b;for(c=0;c<a.g.length;c++)if(b=a.g[c],"prop"==b.substring(0,4)||"eVar"==b.substring(0,4)||"hier"==b.substring(0,4)||"list"==b.substring(0,4)||"channel"==b||"events"==b||"eventList"==b||"products"==
b||"productList"==b||"purchaseID"==b||"transactionID"==b||"state"==b||"zip"==b||"campaign"==b)a[b]=void 0};a.tagContainerMarker="";a.Ab=function(c,b){var d,f=a.trackingServer;d="";var e=a.dc,g="sc.",k=a.visitorNamespace;f?a.trackingServerSecure&&a.ssl&&(f=a.trackingServerSecure):(k||(k=a.account,f=k.indexOf(","),0<=f&&(k=k.substring(0,f)),k=k.replace(/[^A-Za-z0-9]/g,"")),d||(d="2o7.net"),e=e?(""+e).toLowerCase():"d1","2o7.net"==d&&("d1"==e?e="112":"d2"==e&&(e="122"),g=""),f=k+"."+e+"."+g+d);d=a.ssl?
"https://":"http://";e=a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks;d+=f+"/b/ss/"+a.account+"/"+(a.mobile?"5.":"")+(e?"10":"1")+"/JS-"+a.version+(a.Eb?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:"")+"/"+c+"?AQB=1&ndh=1&pf=1&"+(e?"callback=s_c_il["+a._in+"].doPostbacks&et=1&":"")+b+"&AQE=1";a.mb(d);a.ja()};a.Pa=/{(%?)(.*?)(%?)}/;a.Ib=RegExp(a.Pa.source,"g");a.nb=function(c){if("object"==typeof c.dests)for(var b=0;b<c.dests.length;++b)if(o=c.dests[b],"string"==
typeof o.c&&"aa."==o.id.substr(0,3))for(var d=o.c.match(a.Ib),b=0;b<d.length;++b){match=d[b];var f=match.match(a.Pa),e="";"%"==f[1]&&"timezone_offset"==f[2]?e=(new Date).getTimezoneOffset():"%"==f[1]&&"timestampz"==f[2]&&(e=a.rb());o.c=o.c.replace(match,a.escape(e))}};a.rb=function(){var c=new Date,b=new Date(6E4*Math.abs(c.getTimezoneOffset()));return a.k(4,c.getFullYear())+"-"+a.k(2,c.getMonth()+1)+"-"+a.k(2,c.getDate())+"T"+a.k(2,c.getHours())+":"+a.k(2,c.getMinutes())+":"+a.k(2,c.getSeconds())+
(0<c.getTimezoneOffset()?"-":"+")+a.k(2,b.getUTCHours())+":"+a.k(2,b.getUTCMinutes())};a.k=function(a,b){return(Array(a+1).join(0)+b).slice(-a)};a.ra={};a.doPostbacks=function(c){if("object"==typeof c)if(a.nb(c),"object"==typeof a.AudienceManagement&&"function"==typeof a.AudienceManagement.isReady&&a.AudienceManagement.isReady()&&"function"==typeof a.AudienceManagement.passData)a.AudienceManagement.passData(c);else if("object"==typeof c&&"object"==typeof c.dests)for(var b=0;b<c.dests.length;++b)dest=
c.dests[b],"object"==typeof dest&&"string"==typeof dest.c&&"string"==typeof dest.id&&"aa."==dest.id.substr(0,3)&&(a.ra[dest.id]=new Image,a.ra[dest.id].alt="",a.ra[dest.id].src=dest.c)};a.mb=function(c){a.i||a.vb();a.i.push(c);a.la=a.C();a.Na()};a.vb=function(){a.i=a.xb();a.i||(a.i=[])};a.xb=function(){var c,b;if(a.qa()){try{(b=k.localStorage.getItem(a.oa()))&&(c=k.JSON.parse(b))}catch(d){}return c}};a.qa=function(){var c=!0;a.trackOffline&&a.offlineFilename&&k.localStorage&&k.JSON||(c=!1);return c};
a.Ea=function(){var c=0;a.i&&(c=a.i.length);a.q&&c++;return c};a.ja=function(){if(a.q&&(a.B&&a.B.complete&&a.B.F&&a.B.ua(),a.q))return;a.Fa=q;if(a.pa)a.la>a.N&&a.La(a.i),a.ta(500);else{var c=a.hb();if(0<c)a.ta(c);else if(c=a.Ba())a.q=1,a.zb(c),a.Db(c)}};a.ta=function(c){a.Fa||(c||(c=0),a.Fa=setTimeout(a.ja,c))};a.hb=function(){var c;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;c=a.C()-a.Ka;return a.offlineThrottleDelay<c?0:a.offlineThrottleDelay-c};a.Ba=function(){if(0<a.i.length)return a.i.shift()};
a.zb=function(c){if(a.debugTracking){var b="AppMeasurement Debug: "+c;c=c.split("&");var d;for(d=0;d<c.length;d++)b+="\n\t"+a.unescape(c[d]);a.yb(b)}};a.Za=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};a.X=!1;var s;try{s=JSON.parse('{"x":"y"}')}catch(x){s=null}s&&"y"==s.x?(a.X=!0,a.W=function(a){return JSON.parse(a)}):k.$&&k.$.parseJSON?(a.W=function(a){return k.$.parseJSON(a)},a.X=!0):a.W=function(){return null};a.Db=function(c){var b,d,f;a.Za()&&2047<c.length&&("undefined"!=
typeof XMLHttpRequest&&(b=new XMLHttpRequest,"withCredentials"in b?d=1:b=0),b||"undefined"==typeof XDomainRequest||(b=new XDomainRequest,d=2),b&&(a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks)&&(a.X?b.xa=!0:b=0));!b&&a.Oa&&(c=c.substring(0,2047));!b&&a.d.createElement&&(0!=a.usePostbacks||a.AudienceManagement&&a.AudienceManagement.isReady())&&(b=a.d.createElement("SCRIPT"))&&"async"in b&&((f=(f=a.d.getElementsByTagName("HEAD"))&&f[0]?f[0]:a.d.body)?(b.type="text/javascript",
b.setAttribute("async","async"),d=3):b=0);b||(b=new Image,b.alt="",b.abort||"undefined"===typeof k.InstallTrigger||(b.abort=function(){b.src=q}));b.za=function(){try{b.F&&(clearTimeout(b.F),b.F=0)}catch(a){}};b.onload=b.ua=function(){b.za();a.lb();a.fa();a.q=0;a.ja();if(b.xa){b.xa=!1;try{a.doPostbacks(a.W(b.responseText))}catch(c){}}};b.onabort=b.onerror=b.Ca=function(){b.za();(a.trackOffline||a.pa)&&a.q&&a.i.unshift(a.kb);a.q=0;a.la>a.N&&a.La(a.i);a.fa();a.ta(500)};b.onreadystatechange=function(){4==
b.readyState&&(200==b.status?b.ua():b.Ca())};a.Ka=a.C();if(1==d||2==d){var e=c.indexOf("?");f=c.substring(0,e);e=c.substring(e+1);e=e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");1==d?(b.open("POST",f,!0),b.send(e)):2==d&&(b.open("POST",f),b.send(e))}else if(b.src=c,3==d){if(a.Ia)try{f.removeChild(a.Ia)}catch(g){}f.firstChild?f.insertBefore(b,f.firstChild):f.appendChild(b);a.Ia=a.B}b.F=setTimeout(function(){b.F&&(b.complete?b.ua():(a.trackOffline&&b.abort&&b.abort(),b.Ca()))},5E3);a.kb=c;a.B=k["s_i_"+
a.replace(a.account,",","_")]=b;if(a.useForcedLinkTracking&&a.J||a.A)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=250),a.ga=setTimeout(a.fa,a.forcedLinkTrackingTimeout)};a.lb=function(){if(a.qa()&&!(a.Ja>a.N))try{k.localStorage.removeItem(a.oa()),a.Ja=a.C()}catch(c){}};a.La=function(c){if(a.qa()){a.Na();try{k.localStorage.setItem(a.oa(),k.JSON.stringify(c)),a.N=a.C()}catch(b){}}};a.Na=function(){if(a.trackOffline){if(!a.offlineLimit||0>=a.offlineLimit)a.offlineLimit=10;for(;a.i.length>
a.offlineLimit;)a.Ba()}};a.forceOffline=function(){a.pa=!0};a.forceOnline=function(){a.pa=!1};a.oa=function(){return a.offlineFilename+"-"+a.visitorNamespace+a.account};a.C=function(){return(new Date).getTime()};a.Ga=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(c){var b,d,f;a.Eb=c;for(b=0;b<a._il.length;b++)if((d=a._il[b])&&"s_l"==d._c&&d.tagContainerName==c){a.Q(d);if(d.lmq)for(b=
0;b<d.lmq.length;b++)f=d.lmq[b],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(b in c=a[f],f=d.ml[f],f)!Object.prototype[b]&&("function"!=typeof f[b]||0>(""+f[b]).indexOf("s_c_il"))&&(c[b]=f[b]);if(d.mmq)for(b=0;b<d.mmq.length;b++)f=d.mmq[b],a[f.m]&&(c=a[f.m],c[f.f]&&"function"==typeof c[f.f]&&(f.a?c[f.f].apply(c,f.a):c[f.f].apply(c)));if(d.tq)for(b=0;b<d.tq.length;b++)a.track(d.tq[b]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,
getQueryParam:function(c,b,d){var f;b||(b=a.pageURL?a.pageURL:k.location);d||(d="&");return c&&b&&(b=""+b,f=b.indexOf("?"),0<=f&&(b=d+b.substring(f+1)+d,f=b.indexOf(d+c+"="),0<=f&&(b=b.substring(f+d.length+c.length+1),f=b.indexOf(d),0<=f&&(b=b.substring(0,f)),0<b.length)))?a.unescape(b):""}};a.G="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.g=a.G.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.ma="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.O=a.ma.slice(0);a.wa="account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData usePostbacks AudienceManagement".split(" ");
for(n=0;250>=n;n++)76>n&&(a.g.push("prop"+n),a.O.push("prop"+n)),a.g.push("eVar"+n),a.O.push("eVar"+n),6>n&&a.g.push("hier"+n),4>n&&a.g.push("list"+n);n="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest".split(" ");a.g=a.g.concat(n);a.G=a.G.concat(n);a.ssl=0<=k.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.offlineThrottleDelay=0;a.offlineFilename=
"AppMeasurement.offline";a.Ka=0;a.la=0;a.N=0;a.Ja=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.w=k;a.d=k.document;try{if(a.Oa=!1,navigator){var y=navigator.userAgent;if("Microsoft Internet Explorer"==navigator.appName||0<=y.indexOf("MSIE ")||0<=y.indexOf("Trident/")&&0<=y.indexOf("Windows NT 6"))a.Oa=!0}}catch(z){}a.fa=function(){a.ga&&(k.clearTimeout(a.ga),a.ga=q);a.l&&a.J&&a.l.dispatchEvent(a.J);a.A&&("function"==typeof a.A?a.A():a.l&&a.l.href&&(a.d.location=
a.l.href));a.l=a.J=a.A=0};a.Ma=function(){a.b=a.d.body;a.b?(a.v=function(c){var b,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||c&&c["s_fe_"+a._in])){if(a.ya)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.v,!1);else{a.b.removeEventListener("click",a.v,!0);a.ya=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=c.srcElement?c.srcElement:c.target;try{if(!a.clickObject||a.M&&a.M==a.clickObject||!(a.clickObject.tagName||a.clickObject.parentElement||a.clickObject.parentNode))a.clickObject=
0;else{var m=a.M=a.clickObject;a.ka&&(clearTimeout(a.ka),a.ka=0);a.ka=setTimeout(function(){a.M==m&&(a.M=0)},1E4);f=a.Ea();a.track();if(f<a.Ea()&&a.useForcedLinkTracking&&c.target){for(e=c.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.Ga(g)||(g=0),d=e.target,c.target.dispatchEvent&&g&&(!d||"_self"==d||"_top"==d||"_parent"==d||k.name&&d==k.name))){try{b=a.d.createEvent("MouseEvents")}catch(n){b=new k.MouseEvent}if(b){try{b.initMouseEvent("click",
c.bubbles,c.cancelable,c.view,c.detail,c.screenX,c.screenY,c.clientX,c.clientY,c.ctrlKey,c.altKey,c.shiftKey,c.metaKey,c.button,c.relatedTarget)}catch(q){b=0}b&&(b["s_fe_"+a._in]=b.s_fe=1,c.stopPropagation(),c.stopImmediatePropagation&&c.stopImmediatePropagation(),c.preventDefault(),a.l=c.target,a.J=b)}}}}}catch(r){a.clickObject=0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.v):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&
k.MouseEvent)&&(a.ya=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.v,!0)),a.b.addEventListener("click",a.v,!1))):setTimeout(a.Ma,30)};a.Ma();a.loadModule("ActivityMap")}
function s_gi(a){var k,q=window.s_c_il,r,n,t=a.split(","),u,s,x=0;if(q)for(r=0;!x&&r<q.length;){k=q[r];if("s_c"==k._c&&(k.account||k.oun))if(k.account&&k.account==a)x=1;else for(n=k.account?k.account:k.oun,n=k.allAccounts?k.allAccounts:n.split(","),u=0;u<t.length;u++)for(s=0;s<n.length;s++)t[u]==n[s]&&(x=1);r++}x||(k=new AppMeasurement);k.setAccount?k.setAccount(a):k.sa&&k.sa(a);return k}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var a=window,k=a.s_giq,q,r,n;if(k)for(q=0;q<k.length;q++)r=k[q],n=s_gi(r.oun),n.setAccount(r.un),n.setTagContainer(r.tagContainerName);a.s_giq=0}s_pgicq();

s.newDom=true;
