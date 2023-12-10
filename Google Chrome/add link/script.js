// Copyright 2018 Vanyo Georgiev <vanyog@gmail.com>
// https://www.gnu.org/licenses/gpl.html

function url_params(q){
    q = q.split("#")[0];
    var i = q.indexOf("?");
    var a = q.substring(i+1).split("&");
    var r = {};
    a.forEach(function(e){
        var b = e.split("=");
        r[b[0]] = b[1];
    });
    return r;
}

document.addEventListener(
            'DOMContentLoaded',
            () => {
                var ln = document.links[0];
                ln.onclick = function () { chrome.tabs.create( {active:true, url:ln.href} ); };
                chrome.tabs.query(
                    {active:true, currentWindow:true},
                    (tabs) => {
                        var url = tabs[0].url;
                        var us = url.substring(0,22);
                        if( (us!="https://sci.vanyog.com") && (us!="http://sci/index.php?l") ){
                            var t = tabs[0].title;
                            chrome.storage.sync.get("scips", function (p) {
                                if( typeof(p["scips"])=="undefined" || 
                                    (p["scips"].pid!="6") || 
                                    (p["scips"].lid=="undefined") 
                                   )
                                {
                                    document.getElementById("message").innerText = "Click the link and navigate to the link group you want to add new links in "
                                                                                 + "than click this button again. " + JSON.stringify(p["scips"].pid);
                                    document.forms["add_link_form"].style.display = "none";
                                }
                                else {
                                    document.forms["add_link_form"].action      = p["scips"].url;
                                    document.forms["add_link_form"].link.value  = url;
                                    document.forms["add_link_form"].up.value    = p["scips"].lid;
                                    document.forms["add_link_form"].title.value = t;
                                }
                            });
//                            alert(url+"\n\n"+t);
                        }
                        else {
                            var p = url_params(url);
                            p.url = url;
                            if((p.pid!=6) || (p.lid=="undefined")){
                                document.getElementById("message").innerText = "Navigate to the link group you want to add new links in "
                                                                             + "and click this button again.";
                            }
                            else {
                                document.getElementById("message").innerText = "Open in other tap the page you want to add as a new link in the choosen group "
                                                                             + "and click this button again.";
                            }
                            chrome.storage.sync.set({"scips":p});
                            document.forms["add_link_form"].style.display = "none";
                        }
                    });
            });
