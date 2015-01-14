// document.getElementById('action').onclick = function() {
(function () {

function parse_uri(sourceUri){
    // stolen with pride: http://blog.stevenlevithan.com/archives/parseuri-split-url
    var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"],
    uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri),
    uri = {};
    for(var i = 0; i < 10; i++)
        uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
    if(uri.directoryPath.length > 0)
        uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
    return uri;
}

function get_active_tab_url() {
    var ret = jQuery.Deferred();
    chrome.tabs.query({active:true,windowType:"normal",currentWindow:true}, function(tabres){
    if (tabres.length!=1) {
        $('#usermessage').html("Error: bug in tab selector");
        console.log(tabres);
        throw "plugin bug";
    } else
        ret.resolve(tabres[0].url);
    });
    return ret;
}

function copy_to_clipboard(mimetype, data) {
    document.oncopy = function(event) {
        event.clipboardData.setData(mimetype, data);
        event.preventDefault();
    };
    document.execCommand("Copy", false, null);
    document.oncopy=null;
}

var mpw=null;
var session_store={};

function recalculate() {
    $('#usermessage').html("Please wait...");
    if ($('#sitename').val()==null || $('#sitename').val()=="") {
        $('#usermessage').html("need sitename");
        return;
    }
    if (!mpw)
        mpw = new MPW(
        session_store.username,
        session_store.masterkey);


    console.log("calc password "+$('#sitename').val()+" . "+parseInt($('#passwdgeneration').val())+" . "+$('#passwdtype').val());
    mpw.generatePassword($('#sitename').val(), parseInt($('#passwdgeneration').val()), $('#passwdtype').val())
    .then(function(pass){
        console.log('Got password');
        var i,s="";
        for (i=0;i<pass.length;i++)s+="&middot;";

        $('#thepassword').html(pass);

        copy_to_clipboard("text/plain",pass);
        $('#usermessage').html("Password for "+$('#sitename').val()+" copied to clipboard");
    });
}

function update_with_settings_for(domain) {
    if (session_store['sites']===undefined) return;
    if (session_store.sites[domain]===undefined) return;

    // TODO: figure out a way to visualize multiple settings on domain
    // for now, just loop through and ignore that there might be more than one
    $.each(session_store.sites[domain], function(key,val) {
        $('#sitename').val(key);
        $('#passwdgeneration').val(val.generation);
        $('#passwdtype').val(val.type);
    });
}

function popup(session_store_) {
    var recalc=false;
    session_store = session_store_;
    if (session_store.username==null || session_store.masterkey==null) {
        $('#main').hide();
        $('#sessionsetup').show();
        if (session_store.username==null)
            $('#username').focus();
        else {
            $('#username').val(session_store.username);
            $('#masterkey').focus();
        }
    } else
        recalc=true;
    get_active_tab_url().then(function(url){
        var domain = parse_uri(url)['domain'].split("."),
            significant_parts=2;
        if (domain.length>2 && domain[domain.length-2].toLowerCase()=="co")
            significant_parts=3;
        while(domain.length>1 && domain.length>significant_parts)domain.shift();
        domain=domain.join(".");
        $('.domain').attr('value',domain);
        update_with_settings_for(domain);
        if(recalc)
            recalculate();
    });
}
window.addEventListener('load', function () {
    popup(chrome.extension.getBackgroundPage().session_store);
},false);

$('#sessionsetup > form').on('submit', function(){
    if ($('#username').val().length < 2) {
        $('#usermessage').html('<span style="color:red">Please enter a name (>2 chars)</span>');
        $('#username').focus();
        return false;
    }
    if ($('#masterkey').val().length < 2) {
        $('#usermessage').html('<span style="color:red">Please enter a master key (>2 chars)</span>');
        $('#masterkey').focus();
        return false;
    }
    session_store.username=$('#username').val();
    session_store.masterkey=$('#masterkey').val();
    chrome.extension.getBackgroundPage().store_update(session_store);

    $('#sessionsetup').hide();
    $('#main').show();
    recalculate();
    return false;
});

$('#generatepassword').on('click', function(){

});
$('#siteconfig_show').on('click', function(){
    $('#siteconfig').show();
    $(this).hide();
    return false;
});

function save_site_changes_and_recalc(){
    var domain = $('#domain').val();
    if (session_store['sites']===undefined)
        session_store.sites={};
    if (session_store.sites[domain]===undefined)
        session_store.sites[domain]={};

    session_store.sites[domain][$('#sitename').val()] = {
        generation:$('#passwdgeneration').val(),
        type:$('#passwdtype').val()
    };
    chrome.extension.getBackgroundPage().store_update(session_store);
    recalculate();
}

$('#siteconfig').on('change','select,input',save_site_changes_and_recalc);
$('#sitename').on('change',save_site_changes_and_recalc);

}());

