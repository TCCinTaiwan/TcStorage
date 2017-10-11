/**
* Ace Editor Config
* @version 0.1.0
* @author TCC <john987john987@gmail.com>
* @date 2017-09-26
* @since 0.1.0 2017-09-26 TCC: $blockScrolling = Infinity;
* @since 0.1.0 2017-09-26 TCC: 補上ACE漏掉的擴充功能引用
*/
var files = files || [{id: null, name: '', content: '', sessions: null}];
var fileIndex = 0;
var tabContainer = document.getElementsByClassName("tabs")[0];
var info_div = document.getElementById("info");
var mode_select = info_div.getElementsByClassName("mode")[0];
var reloadMode_div = info_div.getElementsByClassName("reload_mode")[0];
var pos_div = info_div.getElementsByClassName("pos")[0];
var e_div = document.getElementById("e");
var e = ace.edit("e");
function newTab(index, filename) {
    index = typeof(index) == "undefined" ? files.length : index;
    if (typeof(files[index]) == "undefined") {
        filename = typeof(filename) == "undefined" ? '' : filename;
        files[index] = {id: null, name: '', content: '', sessions: null};
    }
    var tab_li = document.createElement("li");
    tab_li.innerHTML = files[index].name;
    tab_li.num = index;
    tab_li.onclick = function() {
        switchTab(this.num);
    };
    if (index == fileIndex) {
        tab_li.className = "on";
        files[index].session = e.getSession();
        files[index].session.setValue(files[index].content);
    } else {
        files[index].session = new ace.EditSession(files[index].content);
    }
    files[index].session.setMode(e.getModeForPath(files[index].name).mode);
    files[index].session.setUseWrapMode(true);
    tabContainer.appendChild(tab_li);
}
// newTab();
function switchTab(newIndex) {
    newIndex = typeof(newIndex) == "undefined" ? fileIndex : newIndex;
    if (newIndex == fileIndex) {
        rename();
    } else {
        e.setSession(files[newIndex].session);
        var tabs = tabContainer.getElementsByTagName("li");
        tabs[fileIndex].classList.remove("on");
        tabs[newIndex].classList.add("on");
        fileIndex = newIndex;
    }
}
function save() {
    if (files[fileIndex].id != null) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) { // 確認 readyState
                if (xhr.status == 200) { // 確認 status
                    alert(locale["Save!"]);
                }
            }
        };
        xhr.open('POST', 'modify.php'); // 傳資料給modify.php
        var fd = new FormData();
        fd.append('id', files[fileIndex].id);
        fd.append('content', e.getSession().getValue());
        xhr.send(fd);
    } else {
        var base64EncodeUnicode = function(content) {
            return btoa(
                encodeURIComponent(content).replace(
                    /%([0-9A-F]{2})/g,
                    function(match, byte) {
                        return String.fromCharCode('0x' + byte);
                    }
                )
            );
        }
        function base64DecodeUnicode(str) {
            return decodeURIComponent(
                Array.prototype.map.call(
                    atob(str),
                    function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }
                ).join('')
            );
        }

        var data2URL = function(content, isBase64, mimetype, charset) {
            mimetype = typeof(mimetype) == "undefined" ? "text/plain" : mimetype;
            charset = typeof(charset) == "undefined" ? "utf-8" : charset;
            isBase64 = typeof(isBase64) == "undefined" ? false : isBase64;
            return "data:" + mimetype + ";charset=" + charset + (isBase64 ? ";base64" : "") + "," + (isBase64 ? base64EncodeUnicode(content) : content);
        }
        window.open(data2URL(e.getSession().getValue(), true));
        var data2blob = function(content, mimetype, charset) {
            mimetype = typeof(mimetype) == "undefined" ? "text/plain" : mimetype;
            charset = typeof(charset) == "undefined" ? "utf-8" : charset;
            return new Blob(
                [content],
                {type: mimetype + ";charset=" + charset}
            );
        }
        window.open(URL.createObjectURL(data2blob(e.getSession().getValue())));
        console.log("尚未提供此服務，需要選路徑!!");
    }
}

function rename() {
    var _filename = prompt("重新命名", (files[fileIndex].name == "" ? "untitled.txt" : files[fileIndex].name));
    if (_filename == null) {
        return;
    } else {
        files[fileIndex].name = _filename;
        files[fileIndex].session.setMode(e.getModeForPath(files[fileIndex].name).mode);
        tabContainer.getElementsByTagName("li")[fileIndex].innerHTML = files[fileIndex].name;
        updateMode();
    }
}
function updateCursorPosition() {
    var pos = e.getCursorPosition();
    pos_div.innerHTML = "Line " + pos.row + ", Column " + pos.column;
}
function updateMode() {
    var mode = e.session.getMode();
    mode_select.value = mode.$id;
}
function reloadMode() {
    e.session.setMode(e.getModeForPath(files[fileIndex].name).mode);
}

e.$blockScrolling = Infinity;
e.on('changeSelection', updateCursorPosition);
e.on('changeMode', updateMode);
e.getModeForPath = ace.require("ace/ext/modelist").getModeForPath;
e.modesByName = ace.require("ace/ext/modelist").modesByName;

ace.require("ace/ext/settings_menu").init(e);
ace.require("ace/ext/hoverlink");
ace.require("ace/ext/language_tools");
ace.require("ace/ext/emmet");
ace.require("ace/ext/old_ie");
ace.require("ace/ext/linking");
ace.require("ace/ext/spellcheck");
ace.require("ace/ext/elastic_tabstops_lite");
e.setTheme("ace/theme/monokai");
e.setOptions({
    // readOnly: true,
    autoScrollEditorIntoView: true,
    displayIndentGuides: true,
    showPrintMargin: true,
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
                save();
            }
        }
    ]
);

new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "class") {
            var attributeValue = mutation.target.attributes[mutation.attributeName].value;
            var modeClassName = "ace-" + e.getTheme().split("/")[2];
            tabContainer.className = "tabs";
            tabContainer.classList.add(modeClassName);
            info_div.className = modeClassName;
        }
    });
}).observe(e_div,  {
    attributes: true
}); // 把編輯器的風格套用到標籤
for (var i = 0; i < files.length; i++) {
    newTab(i);
}
Object.keys(e.modesByName).map(function(objectKey, index) {
    var temp_option = document.createElement("option");
    temp_option.textContent = e.modesByName[objectKey].caption;
    temp_option.value = e.modesByName[objectKey].mode;
    mode_select.appendChild(temp_option);
});
mode_select.onchange = function() {
    e.session.setMode(this.value);
}
reloadMode_div.onclick = reloadMode;
e.setOption("printMarginColumn", Math.floor(e.session.getScreenWidth() / 2));
updateCursorPosition();
updateMode();