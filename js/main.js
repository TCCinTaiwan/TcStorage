var mouseDownInfo = {
    element: null,
    x: null,
    y: null
};
var selectedElements = [];
selectedElements.clearSelected = function() {
    var element = null;
    while (element = this.pop()) {
        element.classList.remove("select");
        element.draggable = false;
    }
}
selectedElements.addSelect = function(element) {
    element.draggable = true;
    element.classList.add("select");
    this.push(element);
}
selectedElements.removeSelected = function(element) {
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
                // var full_path_div = document.createElement("div");
                // full_path_div.className = "fullPath";
                // fileList.appendChild(full_path_div);
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
                var elements = document.getElementsByClassName("fullPath");
                for (var index = 0; index < elements.length; index++) {
                    elements[index].innerText = info.path_info.full_path;
                }
                var elements = document.getElementsByClassName("breadcrumbs");
                for (var index = 0; index < elements.length; index++) {
                    elements[index].innerHTML = info.path_info.breadcrumbs.map(function(elem){return "<li path_id='" + elem.id + "'>" + elem.name + "</li>";}).join("");
                }
                // <ul id="breadcrumbs">
                //     <li><a href="">Lorem ipsum</a></li>
                //     <li><a href="">Vivamus nisi eros</a></li>
                //     <li><a href="">Nulla sed lorem risus</a></li>
                //     <li><a href="">Nam iaculis commodo</a></li>
                //     <li><a href="" class="current">Current crumb</a></li>
                // </ul>
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
function move(type, id, old_path, new_path) {
    // alert("move " + type + "(" + id + ") to " + evt.target.path_id);
    type = (type || "folder") == "folder" ? "folder" : "file";
    id = id || null;
    old_path = old_path || path_id;
    new_path = new_path || null;
    if (id && old_path && new_path) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) { // 確認 readyState
                if (xhr.status == 200) { // 確認 status
                    listPath();
                }
            }
        };
        xhr.open('POST', 'functions/move.php'); // 傳資料給new.php
        var fd = new FormData();
        fd.append('id', id);
        fd.append('from', old_path);
        fd.append('to', new_path);
        fd.append('type', type);
        xhr.send(fd);
    }
}
function raw(file_id, file_name, mime) {
    file_name = file_name || "";
    mime = mime || "";
    // image/
    // audio/
    // video/
    // file_name = prompt("是否儲存檔案?", (file_name == "" ? "new.txt" : file_name));
    // if (file_name == null) {
    //     return;
    // }
    // window.open('files/raw/' + file_id + '/' + file_name);

    // application/octet-stream
    if (mime.match(/^(video|audio)/g)) {
        floatWindow.getElementsByTagName("video")[0].src = 'files/raw/' + file_id + '/' + file_name;
    } else if (mime.match(/^image/g)) {
        floatWindow.getElementsByTagName("div")[0].style.backgroundImage = 'url("files/raw/' + file_id + '/' + file_name + '"';
        floatWindow.getElementsByTagName("div")[0].classList.add("show");
        floatWindow.classList.add("show");
    } else {
        floatWindow.getElementsByTagName("iframe")[0].src = 'files/raw/' + file_id + '/' + file_name;

    }
}
function ace(file_id) {
    floatWindow.getElementsByTagName("iframe")[0].src = 'functions/ace.php?id=' + file_id;
}
function reCalc(x1, y1, x2, y2) {
    var minX = Math.max(Math.min(x1, x2), fileList.offsetLeft);
    var maxX = Math.min(Math.max(x1, x2), fileList.offsetLeft + fileList.clientWidth - 2);
    var minY = Math.max(Math.min(y1, y2), fileList.offsetTop + document.getElementsByClassName("breadcrumbs")[0].offsetHeight);
    var maxY = Math.min(Math.max(y1, y2), fileList.offsetTop + fileList.clientHeight - 2);
    document.getElementById("selectzone").style.left = minX + 'px';
    document.getElementById("selectzone").style.top = minY + 'px';
    document.getElementById("selectzone").style.width = maxX - minX + 'px';
    document.getElementById("selectzone").style.height = maxY - minY + 'px';
}
function preview(element) {
    element = typeof element == "undefined" ? (selectedElements.length > 0 ? selectedElements[0] : null) : element;
    if (element.mime.match(/^(image|audio|video)/g)) {
        raw(element.file_id, element.file_name, element.mime);
    } else if (element.mime.match(/^application\/octet-stream/g)) {
        raw(element.file_id, element.file_name, 'video/mpeg');
    } else if (element.mime.match(/^(text|inode\/x-empty)/g)) {
        ace(element.file_id);
    } else {
        raw(element.file_id, element.file_name, element.mime);
        // ace(evt.target.file_id);
    }
}
function download(element) {
    element = typeof element == "undefined" ? (selectedElements.length > 0 ? selectedElements[0] : null) : element;
    window.open('files/raw/' + element.file_id + '/' + element.file_name);

}
function finishSelect(evt) {
    if (document.getElementById("selectzone").style.display != "") {
        var zone = {
            top: parseInt(document.getElementById("selectzone").style.top.replace("px", "")),
            left: parseInt(document.getElementById("selectzone").style.left.replace("px", "")),
            height: parseInt(document.getElementById("selectzone").style.height.replace("px", "")),
            width: parseInt(document.getElementById("selectzone").style.width.replace("px", ""))
        };
        document.getElementById("selectzone").style.display = "";
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
document.ondragover = function(evt) { // 拖曳經過
    if (evt.dataTransfer.types.includes("application/json")) { // Firfox: includes->contains
        if (evt.target.classList.contains("folder")) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'move';
            // evt.dataTransfer.dropEffect = evt.ctrlKey ? 'copy' : 'move';
        } else if (evt.target.classList.contains("back")) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'move';
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
        document.getElementById("selectzone").style.display = "";
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
        xhr_upload.open('POST', 'functions/upload.php'); // 傳資料給upload.php
        // xhr_upload.upload.onprogress = function (evt) {
        //     // 上傳進度
        //     if (evt.lengthComputable) {
        //         var complete = (evt.loaded / evt.total * 100 | 0);
        //         if(100 == complete) {
        //             complete = 99.9;
        //         }
        //     }
        // }
        xhr_upload.send(upload_fd); // 開始上傳
    } else if (evt.dataTransfer.types.includes("application/json")) {
        if (evt.target.classList.contains("folder") || evt.target.classList.contains("back")) {
            evt.preventDefault();
            var data = JSON.parse(evt.dataTransfer.getData("application/json"));
            if (data == "select") {
                for (var i = 0; i < selectedElements.length; i++) {
                    var element = selectedElements[i], type, id;
                    if (element.classList.contains("folder")) {
                        type = "folder";
                        id = element.path_id;
                    } else if (element.classList.contains("file")) {
                        type = "file";
                        id = element.file_id;
                    }
                    move(type, id, path_id, evt.target.path_id)
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
            mouseDownInfo = {
                element: evt.target,
                x: evt.clientX,
                y: evt.clientY
            }
            if (evt.target.classList.contains("file") || evt.target.classList.contains("folder")) {
                if (evt.offsetX <= 34) { // 點的位置是ICON
                    evt.target.draggable = true;
                    return;
                }
            }
            document.getElementById("selectzone").style.display = "block";
            // console.log(evt);
            reCalc(mouseDownInfo.x, mouseDownInfo.y, mouseDownInfo.x, mouseDownInfo.y);
            // document.getElementById("selectzone").style.top =  + "px";
            // document.getElementById("selectzone").style.left =  + "px";
            // document.getElementById("selectzone").style.width = "0px";
            // document.getElementById("selectzone").style.height = "0px";
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
onmousemove = function(evt) {
    if (mouseDownInfo.x != null) {
        if (evt.buttons == 0) {
            finishSelect(evt);
        } else {
            reCalc(mouseDownInfo.x, mouseDownInfo.y, evt.clientX, evt.clientY);
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
            if (mouseDownInfo.element == evt.target) {
                if (evt.ctrlKey) {
                    if (selectedElements.includes(evt.target)) {
                        selectedElements.removeSelected(evt.target);
                    } else {
                        selectedElements.addSelect(evt.target);
                    }
                } else {
                    if (selectedElements.includes(evt.target)) { // 單擊已選擇
                        console.log("rename");
                    } else {
                        selectedElements.clearSelected();
                        selectedElements.addSelect(evt.target); // 單擊未選擇
                    }
                }
            }
        } else if (evt.target.nodeName == "LI") {
            if (!evt.ctrlKey) {
                listPath(evt.target.attributes["path_id"].value);
            }
        }
        // else if (evt.target.classList.contains("back")) {
        //     if (mouseDownInfo.element == evt.target) {
        //         if (!evt.ctrlKey) {
        //             listPath(evt.target.path_id);
        //         }
        //     }
        // }
    }
    mouseDownInfo = {
        element: null,
        x: null,
        y: null
    };
};
fileList.ondblclick = function(evt) {
    if (evt.target.classList.contains("file")) {
        if (evt.button == 0) { // 滑鼠右鍵
            preview(evt.target);
            // if (evt.target.mime.match(/^(image|audio|video)/g)) {
            //     raw(evt.target.file_id, evt.target.file_name, evt.target.mime);
            // } else if (evt.target.mime.match(/^application\/octet-stream/g)) {
            //     raw(evt.target.file_id, evt.target.file_name, 'video/mpeg');
            // } else if (evt.target.mime.match(/^(text|inode\/x-empty)/g)) {
            //     ace(evt.target.file_id);
            // } else {
            //     raw(evt.target.file_id, evt.target.file_name, evt.target.mime);
            // }
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
    mouseDownInfo.element = null;
    if (!selectedElements.includes(evt.target)) {
        evt.target.draggable = false;
    }
};
fileList.oncontextmenu = function(evt) {
    if (!selectedElements.includes(evt.target)) {
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
};
document.oncontextmenu = function(evt) {
    evt.preventDefault();
}
floatWindow.getElementsByTagName("iframe")[0].onload = function() {
    if (this.src != window.location && this.src != "about:blank") {
        if (this.contentDocument.contentType.match(/^(video|audio)/g)) {
            floatWindow.getElementsByTagName("video")[0].src = this.src;
            this.src = "about:blank";
        } else if (this.contentDocument.contentType.match(/^image/g)) {
            floatWindow.getElementsByTagName("div")[0].style.backgroundImage = 'url("' + this.src + '"';
            this.src = "about:blank";
        } else {
            floatWindow.classList.add("show");
            this.classList.add("show");
        }
    }
};
floatWindow.getElementsByTagName("video")[0].onloadeddata = function() {
    if (this.src != window.location && this.src != "about:blank") {
        floatWindow.classList.add("show");
        this.classList.add("show");
        this.play();
    }
};
// floatWindow.getElementsByTagName("img")[0].onload = function() {
//     if (this.src != window.location && this.src != "about:blank") {
//         floatWindow.classList.add("show");
//         this.classList.add("show");
//     }
// };
floatWindow.getElementsByTagName("video")[0].onclick = function(evt) {
    evt.stopPropagation();
}
floatWindow.getElementsByTagName("div")[0].onclick = function(evt) {
    evt.stopPropagation();
}
floatWindow.onclick = function(evt) {
    floatWindow.classList.remove("show");
    if (floatWindow.getElementsByTagName("iframe")[0].classList.contains("show")) {
        floatWindow.getElementsByTagName("iframe")[0].classList.remove("show");
        floatWindow.getElementsByTagName("iframe")[0].src = "about:blank";
    } else if (floatWindow.getElementsByTagName("video")[0].classList.contains("show")) {
        floatWindow.getElementsByTagName("video")[0].classList.remove("show");
        floatWindow.getElementsByTagName("video")[0].src = "about:blank";
    } else if (floatWindow.getElementsByTagName("div")[0].classList.contains("show")) {
        floatWindow.getElementsByTagName("div")[0].classList.remove("show");
        floatWindow.getElementsByTagName("div")[0].src = "about:blank";
    }
    evt.stopPropagation();
};
listPath(sessionStorage.getItem('path_id') || 0);
// document.onselectstart = function() {
//     window.getSelection().removeAllRanges();
// };