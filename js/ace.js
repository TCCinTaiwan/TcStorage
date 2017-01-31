var files = files || [{id: null, name: '', content: '',sessions: null}];
var fileIndex = 0;
var tabContainer = document.getElementsByClassName("tabs")[0];
var e = ace.edit("e");
e.getModeForPath = ace.require("ace/ext/modelist").getModeForPath;
e.modesByName = ace.require("ace/ext/modelist").modesByName;

ace.require("ace/ext/hoverlink");
ace.require("ace/ext/language_tools");
ace.require("ace/ext/settings_menu").init(e);
ace.require("ace/ext/emmet");
ace.require("ace/ext/old_ie");
ace.require("ace/ext/linking");
e.setTheme("ace/theme/monokai");
e.setOptions({
    // readOnly: true,
    autoScrollEditorIntoView: true,
    displayIndentGuides: true,
    showPrintMargin: true,
    printMarginColumn: 50,
    showInvisibles: true,
    fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",

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
            exec: function(evt) {
                evt.showSettingsMenu();
            },
            readOnly: true
        },
        {
            name: "showKeyboardShortcuts",
            bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
            exec: function(evt) {
                ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                    module.init(evt);
                    evt.showKeyboardShortcuts();
                })
            }
        },
        {
            name: "save",
            bindKey: {win: "Ctrl-S", mac: "Command-S", sender: "editor|cli"},
            exec: function(evt) {
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
        files[i].session.setMode(e.getModeForPath(files[i].name).mode);
    } else {
        files[i].session = new ace.EditSession(files[i].content, {"path" : e.getModeForPath(files[i].name).mode});
    }
    files[i].session.setUseWrapMode(true);
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
function updateCursorPosition() {
    var pos = e.getCursorPosition();
    document.getElementById("info").getElementsByClassName("pos")[0].innerHTML = "Line " + pos.row + ", Column " + pos.column;
}
e.on('changeSelection', updateCursorPosition);
updateCursorPosition();
Object.keys(e.modesByName).map(function(objectKey, index) {
    var temp_option = document.createElement("option");
    temp_option.textContent = e.modesByName[objectKey].caption;
    temp_option.value = e.modesByName[objectKey].mode;
    document.getElementById("info").getElementsByClassName("mode")[0].appendChild(temp_option);
});
document.getElementById("info").getElementsByClassName("mode")[0].onchange = function() {
    e.session.setMode(this.value);
}
function updateMode() {
    var mode = e.session.getMode();
    document.getElementById("info").getElementsByClassName("mode")[0].value = mode.$id;
}
e.on('changeMode', updateMode);
document.getElementById("info").getElementsByClassName("reload_mode")[0].onclick = function() {
    e.session.setMode(e.getModeForPath(files[fileIndex].name).mode);
}