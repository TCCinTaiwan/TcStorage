/**
* TcStorage
* @version 0.1.8
* @author TCC <john987john987@gmail.com>
* @date 2017-09-28
* @since 2017-09-25 0.1.0 TCC: 排除資料夾移動到自己
* @since 2017-09-25 0.1.0 TCC: 移除與finishSelect功能衝突部分程式
* @since 2017-09-25 0.1.0 TCC: 右鍵非選擇項目要先移除所選
* @since 2017-09-25 0.1.1 TCC: 快捷鍵：F2重新命名
* @since 2017-09-25 0.1.1 TCC: 拖曳複製(僅圖示無實現功能)
* @since 2017-09-25 0.1.1 TCC: 麵包屑不顯示右鍵選單
* @since 2017-09-26 0.1.2 TCC: 更新Google Analytics(移到index.php)
* @since 2017-09-26 0.1.2 TCC: 加入LRC歌詞
* @since 2017-09-26 0.1.2 TCC: LRC歌詞支援多行(必須相同時間)
* @since 2017-09-26 0.1.3 TCC: LRC歌詞播完清空
* @since 2017-09-26 0.1.3 TCC: 刪除功能實現
* @since 2017-09-26 0.1.4 TCC: Media播放完結束浮窗
* @since 2017-09-27 0.1.5 TCC: 把selectzone移到fileList底下
* @since 2017-09-27 0.1.5 TCC: 解決滾輪偏移
* @since 2017-09-27 0.1.5 TCC: 處理拖曳到自己顯示BUG
* @since 2017-09-27 0.1.5 TCC: 設定"回上一層"不可選
* @since 2017-09-27 0.1.6 TCC: mouseDownInfo轉變成mouseInfo(加了滑鼠位置)
* @since 2017-09-27 0.1.6 TCC: 選取框到邊邊滾動滾輪
* @since 2017-09-27 0.1.6 TCC: 修復"回上一層"不一定存在BUG
* @since 2017-09-27 0.1.6 TCC: 確保selectzone初始大小為一點
* @since 2017-09-27 0.1.6 TCC: 加入全選跟反選
* @since 2017-09-27 0.1.7 TCC: 快捷鍵：Ctrl+A全選
* @since 2017-09-27 0.1.7 TCC: 準備幾個快捷鍵
* @since 2017-09-27 0.1.7 TCC: 快捷鍵：Ctrl+I反選
* @since 2017-09-28 0.1.8 TCC: 修正麵包屑調整後selectzone偏移
* @since 2017-09-28 0.1.8 TCC: 調整載入歌詞位置
* @since 2017-09-28 0.1.8 TCC: back、breadcrumbs不觸發selectzone
*/
var mouseInfo = {
    down: {
        element: null,
        x: null,
        y: null
    },
    x: null,
    y: null
};
var selectedElements = [];
var clickTimer = null;
selectedElements.clearSelected = function() {
    var element = null;
    while (element = this.pop()) {
        element.classList.remove("select");
        element.draggable = false;
    }
}
selectedElements.addSelect = function(element) {
    // console.log("selectedElements add " + (element.path_id || element.file_id))
    element.draggable = true;
    element.classList.add("select");
    this.push(element);
}
selectedElements.removeSelected = function(element) {
    // console.log("selectedElements remove " + (element.path_id || element.file_id))
    element.draggable = false;
    element.classList.remove("select");
    this.splice(selectedElements.indexOf(element), 1);
}
selectedElements.type = function(element) {
    var type = "none";
    var element;
    for (var i = 0; i < selectedElements.length; i++) {
        element = selectedElements[i];
        if (element.classList.contains("folder")) {
            if (type == "none") {
                type = "folder";
            } else if (type == "folder") {
                type = "folders";
            } else if (type == "file" || type == "files") {
                return "multiple";
            }
        } else if (element.classList.contains("file")) {
            if (type == "none") {
                type = "file";
            } else if (type == "file") {
                type = "files";
            } else if (type == "folder" || type == "folders") {
                return "multiple";
            }
        }
    }
    return type;
}
function formatBytes(bytes, decimals) {
    if(bytes == 0) return '0 Byte';
    var k = 1024;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function github() {
    window.open('https://github.com/TCCinTaiwan/TcStorage');
}
function listPath(path) {
    path = typeof path == "undefined" ? (typeof path_id == "undefined" ? 0 : path_id) : path;
    sessionStorage.setItem('path_id', path);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { // 確認 readyState
            if (xhr.status == 200) { // 確認 status
                var info = typeof xhr.response == "string" ?　JSON.parse(xhr.response) : xhr.response;
                fileList.innerHTML = "";
                path_id = info.path_info.id;
                var breadcrumbs_ul = document.createElement("ul");
                breadcrumbs_ul.className = "breadcrumbs";
                fileList.appendChild(breadcrumbs_ul);
                if (info.path_info.root_id != null) {
                    var back_div = document.createElement("div");
                    back_div.className = "back";
                    back_div.path_id = info.path_info.root_id;
                    back_div.innerText = "返回上層";
                    fileList.appendChild(back_div);
                }
                for (var folderIndex = 0; folderIndex < info.folders.length; folderIndex++) {
                    var folder_div = document.createElement("div");
                    folder_div.className = "folder";
                    // folder_div.draggable = true;
                    if (info.folders[folderIndex].descendant | info.folders[folderIndex].file_count > 0) {
                        folder_div.className += " fullFolder";
                    } else if (info.folders[folderIndex].folder_count > 0) {
                        folder_div.className += " emptinessFolder";
                    } else {
                        folder_div.className += " emptyFolder";
                    }
                    // var img = new Image();
                    // img.src = "images/file types/svg/file.svg";
                    // folder_div.appendChild(img);
                    folder_div.innerHTML += info.folders[folderIndex].name;
                    folder_div.path_id = info.folders[folderIndex].id;
                    fileList.appendChild(folder_div);
                }
                for (var fileIndex = 0; fileIndex < info.files.length; fileIndex++) {
                    var file_div = document.createElement("div");
                    file_div.className = "file";
                    var fileName = info.files[fileIndex].name;
                    var extension = "";
                    if (fileName.split('.').length > 1) {
                        extension = fileName.split('.').pop();
                        file_div.classList.add(extension);
                    }
                    file_div.innerText = file_div.file_name = fileName;
                    file_div.extension = extension;
                    file_div.file_id = info.files[fileIndex].id;
                    file_div.mime = info.files[fileIndex].mime;
                    file_div.title = formatBytes(info.files[fileIndex].size);
                    // file_div.draggable = true;
                    fileList.appendChild(file_div);
                }
                var selectzone_div = document.createElement("div");
                selectzone_div.className = "selectzone";
                fileList.appendChild(selectzone_div);
                // 填充資訊
                // var elements = document.getElementsByClassName("fullPath");
                // for (var index = 0; index < elements.length; index++) {
                //     elements[index].innerText = info.path_info.full_path;
                // }
                var elements = document.getElementsByClassName("breadcrumbs");
                for (var index = 0; index < elements.length; index++) {
                    elements[index].innerHTML = info.path_info.breadcrumbs.map(function(elem){return "<li path_id='" + elem.id + "'>" + elem.name + "</li>";}).join("");
                }
                elements = document.getElementsByClassName("path");
                for (var index = 0; index < elements.length; index++) {
                    elements[index].innerText = info.path_info.name;
                }
            }
        }
    };
    xhr.open('POST', 'functions/list.php'); // 傳資料給list.php
    xhr.responseType = 'json';
    var fd = new FormData();
    fd.append('path_id', path);
    xhr.send(fd);
}
// function downloadFile(url, file_name, target) {
//     file_name = file_name || "";
//     target = target || "";
//     var link = document.createElement("a");
//     link.href = url;
//     link.target = target;
//     link.download = file_name;
//     link.click();
// }
function createNew(type, name) {
    type = (type || "folder") == "folder" ? "folder" : "file";
    name = name || null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { // 確認 readyState
            if (xhr.status == 200) { // 確認 status
                listPath();
            }
        }
    };
    xhr.open('POST', 'functions/new.php'); // 傳資料給new.php
    var fd = new FormData();
    if (name != null) {
        fd.append('name', name);
    }
    fd.append('path_id', path_id);
    fd.append('type', type);
    xhr.send(fd);
}
function move(element, old_path, new_path) {
    type = getElementType(element);
    id = element.path_id || element.file_id || null;
    new_path = new_path || null;
    console.log("move " + type + "(" + id + ") to " + new_path);
    if (id && new_path) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) { // 確認 readyState
                if (xhr.status == 200) { // 確認 status
                    listPath();//有時沒跑到這http://127.0.0.1/TcStorage/functions/move.php?id=33&new_path=7&type=file
                }
            }
        };
        var fd = new FormData();
        fd.append('id', id);
        fd.append('new_path', new_path);
        fd.append('type', type);
        xhr.open('POST', 'functions/move.php'); // 傳資料給move.php
        xhr.send(fd);
    }
}
function raw(file_id, file_name, mime) {
    file_name = file_name || "";
    mime = mime || "";
    // image/
    // audio/
    // video/
    // application/octet-stream
    if (mime.match(/^video/g)) {
        video.src = 'files/raw/' + file_id + '/' + file_name;
    } else if (mime.match(/^audio/g)) {
        audio.src = 'files/raw/' + file_id + '/' + file_name;
    } else if (mime.match(/^image/g)) {
        img.style.backgroundImage = 'url("files/raw/' + file_id + '/' + file_name + '"';
        img.classList.add("show");
        floatWindow.classList.add("show");
    } else {
        iframe.src = 'files/raw/' + file_id + '/' + file_name;

    }
}
function ace(file_id) {
    iframe.src = 'functions/ace.php?id=' + file_id;
}
function reCalc(x = null, y = null) {
    var selectzone = document.getElementsByClassName("selectzone")[0];
    if (!selectzone.limit) {
        selectzone.limit = {
            top: fileList.offsetTop + (document.getElementsByClassName("back").length ? document.getElementsByClassName("back")[0].offsetHeight : 0),
            bottom: fileList.offsetTop + fileList.scrollHeight - 2, // 頂部 + 高度 - 框線寬度
            left: fileList.offsetLeft,
            right: fileList.offsetLeft + fileList.clientWidth - 2
        };
    }
    if (y && x) {
        selectzone.top = Math.max(Math.min(mouseInfo.down.y, y), selectzone.limit.top) - fileList.offsetTop;
        selectzone.height = Math.min(Math.max(mouseInfo.down.y, y), selectzone.limit.bottom) - fileList.offsetTop - selectzone.top;
        selectzone.left = Math.max(Math.min(mouseInfo.down.x, x), selectzone.limit.left) - fileList.offsetLeft;
        selectzone.width = Math.min(Math.max(mouseInfo.down.x, x), selectzone.limit.right) - fileList.offsetLeft - selectzone.left;
    } else { // 開始選取
        if (mouseInfo.down.y >= selectzone.limit.top && mouseInfo.down.y <= selectzone.limit.bottom) {
            if (mouseInfo.down.x >= selectzone.limit.left && mouseInfo.down.x <= selectzone.limit.right) {
                selectzone.top = mouseInfo.down.y - fileList.offsetTop;
                selectzone.height = 2;
                selectzone.left = mouseInfo.down.x - fileList.offsetLeft;
                selectzone.width = 2;
                selectzone.style.display = "block";
            }
        }
    }
    selectzone.style.top = selectzone.top + 'px';
    selectzone.style.height = selectzone.height + 'px';
    selectzone.style.left = selectzone.left + 'px';
    selectzone.style.width = selectzone.width + 'px';
    // console.log({x: x, y: y}, mouseInfo.down, mouseInfo, {
    //     top: selectzone.top,
    //     left: selectzone.left,
    //     height: selectzone.height,
    //     width: selectzone.width
    // });
}
function preview(element) {
    element = typeof element == "undefined" ? (selectedElements.length > 0 ? selectedElements[0] : null) : element;
    if (element.mime.match(/^(image|audio|video)/g)) {
        raw(element.file_id, element.file_name, element.mime);
    } else if (element.mime.match(/^application\/octet-stream/g)) {
        // raw(element.file_id, element.file_name, 'audio/mpeg');
        raw(element.file_id, element.file_name, 'video/mpeg'); // 由於可能會有畫面，就先導向Video
        // raw(element.file_id, element.file_name, element.mime);
    } else if (element.mime.match(/^(text|inode\/x-empty)/g)) {
        ace(element.file_id);
    } else {
        raw(element.file_id, element.file_name, element.mime);
        // ace(evt.target.file_id);
    }
}
function getElementType(element) {
    return element.classList.contains("folder") ? "folder" : (element.classList.contains("file") ? "file" : null);
}
function remove() {
    for (var i = 0; i < selectedElements.length; i++) {
        var element = selectedElements[i];
        var type = getElementType(element);
        var id = element.path_id || element.file_id || null;
        console.log("remove " + type + "(" + id + ")\"" + element.innerText + "\"");
        if (id && type) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) { // 確認 readyState
                    if (xhr.status == 200) { // 確認 status
                        listPath();
                    }
                }
            };
            xhr.open('POST', 'functions/remove.php', false); // 傳資料給remove.php
            var fd = new FormData();
            fd.append('id', id);
            fd.append('type', type);
            xhr.send(fd);
        }
    }
}
function rename() {
    var new_name = null;
    if (selectedElements.length == 0) {
        alert("沒有選擇檔案");
    } else {
        // TODO: 假如是多檔案，有可能要保持檔名，不同副檔名
        new_name = prompt("重新命名" + (typeof selectedElements[0].file_id == "undefined" ? "資料夾" : "檔案"), selectedElements[0].innerText);
        if (new_name == selectedElements[0].innerText) {
            new_name = null;
        }
    }
    for (var i = 0; i < selectedElements.length; i++) {
        var element = selectedElements[i];
        var type = getElementType(element);
        var id = element.path_id || element.file_id || null;
        console.log("rename " + type + "(" + id + ")\"" + element.innerText + "\"");
        if (id && new_name && type) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) { // 確認 readyState
                    if (xhr.status == 200) { // 確認 status
                        listPath();
                    }
                }
            };
            xhr.open('POST', 'functions/rename.php', false); // 傳資料給rename.php 非同步是因為會取到相同名字 TODO: 之後非同步要淘汰
            var fd = new FormData();
            fd.append('id', id);
            fd.append('new_name', new_name);
            fd.append('type', type);
            xhr.send(fd);
        }
    }
}
function download(element) {
    element = typeof element == "undefined" ? (selectedElements.length > 0 ? selectedElements[0] : null) : element;
    window.open('files/download/' + element.file_id + '/' + element.file_name);

}
function selectAll() {
    selectedElements.clearSelected();
    document.querySelectorAll(".folder,.file").forEach(function(element) {
        selectedElements.addSelect(element);
    })
}
function inverseSelect() {
    document.querySelectorAll(".folder,.file").forEach(function(element) {
        if (selectedElements.includes(element)) {
            selectedElements.removeSelected(element);
        } else {
            selectedElements.addSelect(element);
        }
    })
}
function finishSelect(evt) {
    // TODO: Shift鍵連續選取
    if (document.getElementsByClassName("selectzone")[0].style.display != "") {
        document.getElementsByClassName("selectzone")[0].style.display = "";
        var zone = {
            top: parseInt(document.getElementsByClassName("selectzone")[0].style.top.replace("px", "")),
            left: parseInt(document.getElementsByClassName("selectzone")[0].style.left.replace("px", "")),
            height: parseInt(document.getElementsByClassName("selectzone")[0].style.height.replace("px", "")),
            width: parseInt(document.getElementsByClassName("selectzone")[0].style.width.replace("px", ""))
        };
        // console.log("finishSelect");
        // console.dir(evt);
        if (evt.button == 0) { // 滑鼠右鍵
            if (!evt.ctrlKey) {
                selectedElements.clearSelected();
            }
            elements = fileList.getElementsByTagName("div");
            for (var index = 0; index < elements.length; index++) {
                if (zone.top < elements[index].offsetTop + elements[index].offsetHeight) {
                    if (zone.top + zone.height > elements[index].offsetTop) {
                        // console.log(index, zone.top + zone.height , elements[index].offsetTop);
                        if (evt.ctrlKey) {
                            if (selectedElements.includes(elements[index])) {
                                selectedElements.removeSelected(elements[index]);
                            } else {
                                selectedElements.addSelect(elements[index]);
                            }
                        } else {
                            selectedElements.addSelect(elements[index]);
                        }
                    }
                }
            }
        }
    }
}
document.onkeydown = function(evt) {
    console.log(evt.key + "(" + evt.keyCode + ")");

    if (evt.ctrlKey) { // Ctrl
        if (evt.keyCode == 65) { // A
            selectAll();
            evt.preventDefault();
        } else if (evt.keyCode == 73) { // I
            inverseSelect();
        }
    } else {
        if (evt.keyCode == 113) { // F2
            rename();
            evt.preventDefault();
        } else if (evt.keyCode == 46) { // Delete
        } else if (evt.keyCode == 33) { // PageUp
        } else if (evt.keyCode == 34) { // PageDown
        } else if (evt.keyCode == 36) { // Home
        } else if (evt.keyCode == 35) { // End
        } else if (evt.keyCode == 13) { // Enter
        } else if (evt.keyCode == 27) { // Escape
        } else if (evt.keyCode == 179) { // MediaPlayPause
        } else if (evt.keyCode == 177) { // MediaTrackPrevious
        } else if (evt.keyCode == 176) { // MediaTrackNext
        } else if (evt.keyCode == 178) { // MediaStop
        } else if (evt.keyCode == 175) { // AudioVolumeUp
        } else if (evt.keyCode == 174) { // AudioVolumeDown
        } else if (evt.keyCode == 173) { // AudioVolumeMute
        }
    }
}
document.ondragover = function(evt) { // 拖曳經過 TODO: 旁邊顯示目的地資料夾名稱
    if (evt.dataTransfer.types.includes("application/json")) { // Firfox: includes->contains
        if (evt.target.classList.contains("folder")) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = evt.ctrlKey ? 'copy' : selectedElements.includes(evt.target) ? 'none' : 'move'; // 排除拖曳到自己
        } else if (evt.target.classList.contains("back")) {
            evt.preventDefault();
            // evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.dropEffect = evt.ctrlKey ? 'copy' : 'move';
        } else {
            // evt.preventDefault();
            // evt.dataTransfer.dropEffect = 'copy';
        }
    } else if (evt.dataTransfer.types.includes("Files")) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }
};
document.ondragenter = function(evt) { // 拖曳進入
    if (evt.target.classList.contains("folder") || evt.target.classList.contains("back")) {
        document.getElementById("dropzone").classList.remove("show");
        evt.target.classList.add("drop");
    } else {
        if (evt.dataTransfer.types.includes("Files")) {
            document.getElementById("dropzone").classList.add("show");
        }
    }
}
document.ondragleave = function(evt) { // 拖曳離開
    if (evt.clientX == 0 && evt.clientY == 0) { // 取消
        document.getElementById("dropzone").classList.remove("show");
    }
    if (evt.target.classList.contains("folder") || evt.target.classList.contains("back")) {
        evt.target.classList.remove("drop");
    }
}
fileList.ondragstart = function(evt) { // 開始拖曳
    if (evt.target.classList.contains("file") || evt.target.classList.contains("folder")) {
        // if (!selectedElements.includes(evt.target)) {
        //     if (!evt.ctrlKey) {
        //         selectedElements.clearSelected();
        //     }
        //     selectedElements.addSelect(evt.target);
        // }
        document.getElementsByClassName("selectzone")[0].style.display = "";
        for (var i = 0; i < selectedElements.length; i++) {
            selectedElements[i].classList.add("drag");
        }
        evt.dataTransfer.setData(
            "application/json",
            JSON.stringify("select")
        );
        evt.dataTransfer.effectAllowed = 'copyMove';
    }
}
fileList.ondragend = function(evt) { // 結束拖曳
    // evt.target.classList.remove("drag");
    for (var i = 0; i < selectedElements.length; i++) {
        selectedElements[i].classList.remove("drag");
    }
}
fileList.ondrop = function(evt) { // 放下拖曳
    evt.preventDefault();
    document.getElementById("dropzone").classList.remove("show");
    if (evt.dataTransfer.types.includes("Files")) {
        var xhr_upload = new XMLHttpRequest();
        var upload_fd = new FormData(); // 要傳過去給upload.php的資料
        var upload_files = evt.dataTransfer.files; // 要上傳的檔案
        upload_fd.append('path_id', evt.target.classList.contains("folder") || evt.target.classList.contains("back") ? evt.target.path_id : path_id);
        for (var file_index in upload_files) {
            if (typeof(upload_files[file_index].type) != "undefined") { // 判斷是檔案
                console.log(upload_files[file_index]);
                upload_fd.append('files[]', upload_files[file_index]);
            }
        }
        xhr_upload.onload = function() {
            // 上傳完成
            listPath();
        };
        xhr_upload.onprogress = function (evt) {
            // 上傳進度
            if (evt.lengthComputable) {
                var complete = (evt.loaded / evt.total * 100 | 0);
                if(100 == complete) {
                    complete = 99.9;
                }
                console.log(complete);
            }
        }
        xhr_upload.open('POST', 'functions/upload.php'); // 傳資料給upload.php
        xhr_upload.send(upload_fd); // 開始上傳
    } else if (evt.dataTransfer.types.includes("application/json")) {
        if (evt.target.classList.contains("folder") || evt.target.classList.contains("back")) {
            evt.preventDefault();
            var data = JSON.parse(evt.dataTransfer.getData("application/json"));
            if (data == "select") {
                if (!selectedElements.includes(evt.target)) { // 排除拖曳到自己
                    for (var i = 0; i < selectedElements.length; i++) {
                        var element = selectedElements[i]; // , type, id
                        /*
                         TODO: ctrlKey ? copy : [self] ? none : move;
                            if self {
                                if ctrl {
                                    copy to same path
                                }
                            } else {
                                if ctrl {
                                    copy to sub path
                                } else {
                                    move to sub path
                                }
                            }
                        */
                        move(element, path_id, evt.target.path_id);
                    }
                }
            }
        }
    }
};
document.onselectstart = function(evt) { //開始選擇
    evt.preventDefault();
};
document.onmouseup = finishSelect;
fileList.onmousedown = function(evt) {
    if (document.getElementById("context").classList.contains("show")) {
        document.getElementById("context").classList.remove(selectedElements.type());
        document.getElementById("context").classList.remove("show");
        fileList.classList.remove("context");
        if (!selectedElements.includes(evt.target)) {
            selectedElements.clearSelected();
        }
    } else {
        if (evt.button == 1) { // 滑鼠中鍵
            evt.preventDefault();
        } else if (evt.button == 0) { // 滑鼠右鍵
            mouseInfo.down = {
                element: evt.target,
                x: evt.clientX,
                y: evt.clientY + fileList.scrollTop
            }
            if (evt.target.classList.contains("file") || evt.target.classList.contains("folder")) {
                if (evt.offsetX <= 34) { // 點的位置是ICON
                    evt.target.draggable = true;
                    return;
                }
            }
            reCalc();
            // console.log(evt);
        }
    }
};
document.getElementById("context").onclick = function(evt) {
    if (document.getElementById("context").classList.contains("show")) {
        document.getElementById("context").classList.remove(selectedElements.type());
        document.getElementById("context").classList.remove("show");
        fileList.classList.remove("context");
        if (!selectedElements.includes(evt.target)) {
            selectedElements.clearSelected();
        }
    }
};
window.onmousemove = function(evt) {
    mouseInfo.x = evt.x, mouseInfo.y = evt.y + fileList.scrollTop;
    if (mouseInfo.down.x != null) {
        if (evt.buttons == 0) { // 沒有按鍵
            finishSelect(evt);
            mouseInfo.down = {
                element: null,
                x: null,
                y: null
            };
        } else {
            function animate(element, propertie, value, step = 100, stop_condition = null) { // jQuery.animate模擬
                if (value == element[propertie]) return;
                var step = (value < element[propertie] ? -1 : 1) * Math.abs(step), id = null;
                function frame() {
                    // console.log("animate " + element[propertie] + " " + step);
                    element[propertie] += step;
                    if (stop_condition || element[propertie] == value) {
                        clearInterval(id);
                    }
                }
                id = setInterval(frame, 10);
            }
            // 選取框到邊邊滾動滾輪 TODO: 區分點擊跟選取 TODO: 捲動更滑順
            if (evt.y < fileList.clientTop + 50) {
                animate(fileList, "scrollTop", 0, 35, function() {return mouseInfo.y >= fileList.clientTop + 50}); // 往上
            } else if (evt.y > fileList.clientTop + fileList.clientHeight - 50) {
                animate(fileList, "scrollTop", fileList.scrollHeight - fileList.offsetHeight, 35, function() {return mouseInfo.y <= fileList.clientTop + fileList.clientHeight - 50}); // 往下
            }
            reCalc(evt.clientX, evt.clientY + fileList.scrollTop);
        }
    }
};
fileList.onmouseup = function(evt) {
    if (evt.button == 1) { // 滑鼠中鍵
        if (evt.target.classList.contains("file")) {
            window.open('files/raw/' + evt.target.file_id + '/' + evt.target.file_name);
            evt.preventDefault();
        }  else if (evt.target.classList.contains("folder") || evt.target.classList.contains("back")) {
            listPath(evt.target.path_id);
            evt.preventDefault();
        }
    } else if (evt.button == 0) { // 滑鼠右鍵
        if (evt.target.classList.contains("file") || evt.target.classList.contains("folder")) {
            evt.target.draggable = false;
            if (mouseInfo.down.element == evt.target) {
                if (!evt.ctrlKey) {
                    if (selectedElements.length == 1 && selectedElements.includes(evt.target)) { // 單擊已選擇，且不是多選 TODO: 移到mousedown效果應該比較好
                        if (evt.detail == 1) { // 預留時間判斷單擊雙擊
                            clickTimer = setTimeout(rename, 300); // .bind(null, evt.target)
                        } else {
                            clearTimeout(clickTimer);
                        }
                    }
                }
            }
        } else if (evt.target.nodeName == "LI") {
            if (!evt.ctrlKey) {
                listPath(evt.target.attributes["path_id"].value);
            }
        }
        // else if (evt.target.classList.contains("back")) {
        //     if (mouseInfo.down.element == evt.target) {
        //         if (!evt.ctrlKey) {
        //             listPath(evt.target.path_id);
        //         }
        //     }
        // }
    }
    mouseInfo.down = {
        element: null,
        x: null,
        y: null
    };
};
fileList.ondblclick = function(evt) {
    if (evt.target.classList.contains("file")) {
        if (evt.button == 0) { // 滑鼠右鍵
            preview(evt.target);
        }
    } else if (evt.target.classList.contains("folder") || evt.target.classList.contains("back")) {
        if (evt.button == 0) { // 滑鼠右鍵
            listPath(evt.target.path_id);
        }
    }
};
fileList.onmouseover = function(evt) {
    if (fileList.classList.contains("context")) { // 當已經有右鍵就不顯示Hover
        evt.preventDefault();
    }
};
fileList.onmouseout = function(evt) {
    mouseInfo.down.element = null;
    if (!selectedElements.includes(evt.target)) {
        evt.target.draggable = false;
    }
};
fileList.oncontextmenu = function(evt) {
    if (!document.getElementsByClassName("breadcrumbs")[0].contains(evt.target)) { // 麵包屑不顯示選單
        if (!selectedElements.includes(evt.target)) {
            selectedElements.clearSelected(); //右鍵非選擇項目要先移除所選
            selectedElements.addSelect(evt.target);
        }
        fileList.classList.add("context");
        document.getElementById("context").classList.add("show");
        document.getElementById("context").classList.add(selectedElements.type());
        document.getElementById("context").style.top = evt.clientY + 'px';
        // console.log(fileList.scrollLeft + fileList.clientWidth, evt.clientX + document.getElementById("context").clientWidth);
        console.log(evt, fileList.offsetLeft, fileList.clientWidth, evt.clientX, document.getElementById("context").clientWidth);
        if (fileList.offsetLeft + fileList.clientWidth < evt.clientX + document.getElementById("context").clientWidth) {
            document.getElementById("context").style.left = fileList.offsetLeft + fileList.clientWidth - document.getElementById("context").clientWidth + 'px';
        } else {
            document.getElementById("context").style.left = evt.clientX + 'px';
        }
        evt.preventDefault();
    }
};
document.oncontextmenu = function(evt) {
    evt.preventDefault();
};
iframe.onload = function() {
    if (this.src != window.location && this.src != "about:blank") {
        if (this.contentDocument) {
            console.log(this.contentDocument.contentType);
            if (this.contentDocument.contentType.match(/^video/g)) {
                video.src = this.src;
                this.src = "about:blank";
                return;
            } else if (this.contentDocument.contentType.match(/^audio/g)) {
                audio.src = this.src;
                this.src = "about:blank";
                return;
            } else if (this.contentDocument.contentType.match(/^image/g)) {
                img.style.backgroundImage = 'url("' + this.src + '"';
                this.src = "about:blank";
                return;
            }
        }
        floatWindow.classList.add("show");
        this.classList.add("show");
    }
};
video.onloadeddata = function() {
    if (this.src != window.location && this.src != "about:blank") {
        if (this.videoHeight + this.videoWidth == 0) { // 假如無法抓到畫面，就改用音源播放
            audio.src = this.src;
            this.src = "about:blank";
        } else {
            floatWindow.classList.add("show");
            lyric.classList.add("show");
            this.classList.add("show");
            this.play();
        }
    }
};
audio.onloadeddata = function() {
    if (this.src != window.location && this.src != "about:blank") {
        getLyric(file_id);
        floatWindow.classList.add("show");
        lyric.classList.add("show");
        canvas.classList.add("show");
        this.classList.add("show");
        // extIndex = this.src.lastIndexOf('.');
        // if (extIndex != -1) {
        //     console.log(this.src.substr(0, extIndex) + ".lrc");
        //     getLyric(this.src.substr(0, extIndex) + ".lrc");
        // }
        this.play();
    }
};
audio.ontimeupdate = function(evt) {
    if (lyric.lyric) {
        var i = 0;
        for (; i < lyric.lyric.length && this.currentTime >= lyric.lyric[i][0]; ++i) {}
        if (--i >= 0 && i < lyric.lyric.length) {
            lyric.children[0].innerText = lyric.lyric[i][1];
        }
    }
}
function getLyric(id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { // 確認 readyState
            if (xhr.status == 200) { // 確認 status
                lyric.lyric = parseLyric(xhr.response.split("\n"));
            }
        }
    };
    xhr.responseType = 'text';
    xhr.open('POST', "functions/lyric.php"); // 傳資料給lyric.php
    var fd = new FormData();
    fd.append('id', id);
    xhr.send(fd);
}
function parseLyric(lines) {
    var pattern = /\[\d{2}:\d{2}.\d{2}\]/g, result = [];
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(value) {
        // [mm:ss.ms]
        var time = value.match(pattern), value = value.replace(pattern, '');
        time.forEach(function(value2) {
            var time = value2.slice(1, -1).split(':');
            time = parseInt(time[0], 10) * 60 + parseFloat(time[1]);
            var i = 0;
            for (; i < result.length && result[i][0] <= time; ++i) { // 按照順序插入(升冪)
                if (result[i][0] == time) {
                    result[i][1] += value;
                    return;
                }
            }
            // console.log(i, value);
            result.splice(i, 0, [time, value]);
        });
    });
    return result;
}
function exitAudio() {
    exitFloat();
    audio.classList.remove("show");
    canvas.classList.remove("show");
    lyric.classList.remove("show");
    lyric.children[0].innerText = "";
    lyric.lyric = null;
    audio.src = "about:blank";
}
function exitVideo() {
    exitFloat();
    video.classList.remove("show");
    canvas.classList.remove("show");
    lyric.classList.remove("show");
    lyric.children[0].innerText = "";
    lyric.lyric = null;
    video.src = "about:blank";
}
function exitFloat() {
    floatWindow.classList.remove("show");
}
audio.onended = exitAudio;
video.onended = exitVideo;
video.onclick = function(evt) {
    if (this.paused) {
        this.play();
    } else {
        this.pause();
    }
    evt.stopPropagation();
};
audio.onclick = function(evt) {
    if (this.paused) {
        this.play();
    } else {
        this.pause();
    }
    evt.stopPropagation();
};
img.onclick = function(evt) {
    evt.stopPropagation();
};
floatWindow.onclick = function(evt) {
    if (iframe.classList.contains("show")) {
        exitFloat();
        iframe.classList.remove("show");
        iframe.src = "about:blank";
    } else if (audio.classList.contains("show")) {
        exitAudio();
    } else if (video.classList.contains("show")) {
        exitVideo();
    } else if (img.classList.contains("show")) {
        exitFloat();
        img.classList.remove("show");
        img.src = "about:blank";
    }
    evt.stopPropagation();
};
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

// audio visualizer with controls  https://github.com/wayou/audio-visualizer-with-controls
window.onload = function() {
    var audio = document.getElementsByTagName('audio')[0];
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = document.getElementsByTagName('canvas')[0],
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 6, //width of the meters in the spectrum
        gap = 1, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 150, //count of the meters
        // meterNum = 800 / (10 + 2), //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#f00');
    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); //sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * (meterWidth + gap), cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * (meterWidth + gap), cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
            ctx.fillRect(i * (meterWidth + gap) /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();
};
listPath(sessionStorage.getItem('path_id') || 0);
// document.onselectstart = function() {
//     window.getSelection().removeAllRanges();
// };