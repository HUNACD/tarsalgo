!function(e){"use strict";var n,a,i=window.addEventListener?"addEventListener":"attachEvent",t=window[i],o="attachEvent"==i?"onmessage":"message";console.log("Have created event listener"),t(o,function(e){"samlLogin"==e.data&&window.appUser&&(window.appUser.loginFromSaml(),console.log("Have contacted app user 2"))},!1),window.app=e.querySelector("#app");var s=function(n){var a=localStorage.getItem("yp-user-locale");window.locale=a||n;var i,t=window.location.href.split("locale=");t&&t[1]&&(i=t[1]),i&&2==i.length&&(window.locale=i,localStorage.setItem("yp-user-locale",i));var o=window.locale;i18next.use(i18nextXHRBackend).init({lng:o,fallbackLng:"en",backend:{loadPath:"/locales/{{lng}}/{{ns}}.json"}},function(n){window.i18nTranslation=i18next,"undefined"!=typeof moment&&moment?moment.locale([o,"en"]):setTimeout(function(){"undefined"!=typeof moment&&moment&&moment.locale([o,"en"])},500),console.log("Changed language to "+o),e.dispatchEvent(new CustomEvent("lite-signal",{bubbles:!0,compose:!0,detail:{name:"yp-language",data:{type:"language-loaded",language:o}}})),setTimeout(function(){console.log("setTimeout 1"),e.dispatchEvent(new CustomEvent("lite-signal",{bubbles:!0,compose:!0,detail:{name:"yp-language",data:{type:"language-loaded",language:o}}}))},500),setTimeout(function(){console.log("setTimeout 2"),e.dispatchEvent(new CustomEvent("lite-signal",{bubbles:!0,compose:!0,detail:{name:"yp-language",data:{type:"language-loaded",language:o}}}))},5e3),setTimeout(function(){r()},720)})},l=function(){return window.innerWidth<420},d=window.location.hostname;if(d.indexOf("betrireykjavik")>-1)s("is"),l()&&((a=e.createElement("div")).id="splashCore",(n=e.createElement("div")).id="splashSub",n.innerHTML='<span class="loadingText">Hleð inn...</span><br><span class="loadingHostname">'+window.location.hostname+"</span>",n.innerHTML+='<img width="280px" src="https://s3.amazonaws.com/yrpri-direct-asset/betrireykjavik_merki2_fb400_splash.png">',n.innerHTML+='<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif">',n.className="js-fade fade-in",a.onclick=r,a.appendChild(n),e.body.appendChild(a),e.title="Betri Reykjavík");else if(d.indexOf("betraisland")>-1)s("is"),l()&&((a=e.createElement("div")).id="splashCore",(n=e.createElement("div")).id="splashSub",n.innerHTML='<span class="loadingText">Hleð inn...</span><br><span class="loadingHostname">'+window.location.hostname+"</span>",n.innerHTML+='<img src="https://s3.amazonaws.com/yrpri-direct-asset/BI_Splash_1.png">',n.innerHTML+='<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif">',n.className="js-fade fade-in",a.onclick=r,a.appendChild(n),e.body.appendChild(a),e.title="Betra Ísland");else if(l()&&((a=e.createElement("div")).id="splashCore",(n=e.createElement("div")).id="splashSub",n.innerHTML='<div><div class="loadingText">Loading...</div><br><div class="loadingHostname">'+window.location.hostname+"</div>",window.location.hostname.indexOf("forzanazzjonali")>-1?n.innerHTML+='<img style="width:200px; padding-top: 8px; padding-bottom: 8px" src="https://s3-eu-west-1.amazonaws.com/yrpri-eu-direct-assets/malta/malta_splash-2.jpg"><br>':window.location.hostname.indexOf("forbrukerradet")>-1?n.innerHTML+='<img style="width:200px; padding-top: 8px; padding-bottom: 8px" src="https://s3-eu-west-1.amazonaws.com/yrpri-eu-direct-assets/ForbLogoSmall.jpg"><br>':window.location.hostname.indexOf("idea-synergy.com")>-1?n.innerHTML+='<img style="width:200px; padding-top: 8px; padding-bottom: 8px" width="230" height="230" src="https://www.idea-synergy.com/wp-content/uploads/2017/12/Idea_Synergy_Logo_Orange_on_WhiteGreenBulb.png"><br>':n.innerHTML+='<img src="https://s3-eu-west-1.amazonaws.com/yrpri-eu-direct-assets/yrprLogo.png">',n.innerHTML+='<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif"></div>',n.className="js-fade fade-in",a.onclick=r,a.appendChild(n),e.body.appendChild(a),e.title="Your Priorities"),d.indexOf("forbrukerradet")>-1)s("no");else if(d.indexOf("bolja-pula")>-1)s("hr");else if(d.indexOf("waag.org")>-1)s("nl");else if(d.indexOf("boljikarlovac")>-1)s("hr");else if(d.indexOf("boljilosinj")>-1)s("hr");else if(d.indexOf("pulaodlucuje")>-1)s("hr");else if(window.location.href.indexOf("group/801")>-1)s("sl");else{s({".fr":"fr",".hr":"hr",".hu":"hu",".is":"is",".nl":"nl",".no":"no",".pl":"pl",".tw":"zh_TW"}[d.substring(d.lastIndexOf("."))]||"en")}function r(){console.log("removing splash screen");var n=e.getElementById("splashCore");n?n.parentNode.removeChild(n):setTimeout(function(){console.log("Remove splash with delay"),(n=e.getElementById("splashCore"))&&n.parentNode.removeChild(n)},250),e.body.classList.remove("loading")}window.addEventListener("WebComponentsReady",function(e){r()})}(document);