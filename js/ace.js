var files = files || [{id: null, name: '', content: '',sessions: null}];
var fileIndex = 0;
var tabContainer = document.getElementsByClassName("tabs")[0];
var modelist = ace.require("ace/ext/modelist");
ace.require("ace/ext/language_tools");
ace.require("ace/ext/emmet");
ace.require("ace/ext/settings_menu").init(e);
ace.require("ace/ext/old_ie");
var e = ace.edit("e");
e.setTheme("ace/theme/monokai");
e.getSession().setUseWrapMode(true);
e.setOptions({
    // readOnly: true,
    autoScrollEditorIntoView: true,
    displayIndentGuides: true,
    showPrintMargin: true,
    showInvisibles: true,

    enableLinking: true,

    enableMultiselect: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableEmmet: true,
    enableSnippets: true,
    spellcheck: true,
    useElasticTabstops: true,
});
e.commands.addCommands(
    [
        {
            name: "showSettingsMenu",
            bindKey: {win: "esc", mac: "Command-q"},
            exec: function(e) {
                e.showSettingsMenu();
            },
            readOnly: true
        },
        {
            name: "showKeyboardShortcuts",
            bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
            exec: function(e) {
                ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                    module.init(e);
                    e.showKeyboardShortcuts();
                })
            }
        },
        {
            name: "save",
            bindKey: {win: "Ctrl-S", mac: "Command-S", sender: "editor|cli"},
            exec: function() {
                // var _filename = prompt("是否儲存檔案?", (files[fileIndex].name == "" ? "new.txt" : files[fileIndex].name));
                // if (_filename == null) {
                //     return;
                // } else {
                //     files[fileIndex].name = _filename;
                // }

                // var data2objectURL = function(content) {
                //     return "data:text/plain;charset=utf-8," + content;
                // }
                // window.open(data2objectURL(content));

                // var data2blob = function(data, isBase64 = false, type = "text/plain;charset=utf-8") {
                //     return new Blob([isBase64 ? window.atob(data) : data], {type: type});
                // }
                // window.open(URL.createObjectURL(data2blob(content)));
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) { // 確認 readyState
                        if (xhr.status == 200) { // 確認 status
                            alert("save!!");
                        }
                    }
                };
                xhr.open('POST', 'modify.php'); // 傳資料給modify.php
                var fd = new FormData();
                fd.append('id', files[fileIndex].id);
                fd.append('content', e.getSession().getValue());
                xhr.send(fd);
            }
        }
    ]
);
e.on("linkClick",function(data){

    if(data && data.token){
        var url = getURL(data.token.value);
        if (url) {
            console.log(url);
            window.open(url, "_blank");
        }
    }

});
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "class") {
            var attributeValue = mutation.target.attributes[mutation.attributeName].value;
            var modeClassName = "ace-" + e.getTheme().split("/")[2];
            tabContainer.className = "tabs";
            tabContainer.classList.add(modeClassName);
            document.getElementById("info").className = modeClassName;
        }
    });
}).observe(document.getElementById("e"),  {
    attributes: true
}); // 把編輯器的風格套用到標籤
for (var i = 0; i < files.length; i++) {
    var tab_li = document.createElement("li");
    tab_li.innerHTML = files[i].name;
    tab_li.num = i;
    tab_li.onclick = function() {
        switchTab(this.num);
    };
    if (i == 0) {
        tab_li.className = "on";
        files[i].session = e.getSession();
        files[i].session.setValue(files[i].content);
        files[i].session.setMode(modelist.getModeForPath(files[i].name).mode);
    } else {
        files[i].session = new ace.EditSession(files[i].content, {"path" : modelist.getModeForPath(files[i].name).mode});
    }
    tabContainer.appendChild(tab_li);
}
function switchTab(newIndex) {
    fileIndex = typeof(newIndex) == "undefined" ? fileIndex : newIndex;
    e.setSession(files[fileIndex].session);
    for (var tabs = tabContainer.getElementsByTagName("li"), index = 0; index < tabs.length; index++) {
        if (fileIndex == index) {
            tabs[fileIndex].classList.add("on");
        } else {
            tabs[index].classList.remove("on");
        }
    }
}
function getURL(text) {
    return (text.match(/^["']/g) ? text.replace(/(^["']|["']$)/g, '') : text).match("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i")[0];
}