function listPath(path) {
    path = typeof path == "undefined" ? (typeof path_id == "undefined" ? 0 : path_id) : path;
    sessionStorage.setItem('path_id', path);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { // 確認 readyState
            if (xhr.status == 200) { // 確認 status
                console.log();
                var info = typeof xhr.response == "string" ?　JSON.parse(xhr.response) : xhr.response;
                fileList.innerHTML = "";
                path_id = info.path_info.id;
                var full_path_div = document.createElement("div");
                full_path_div.className = "fullPath";
                fileList.appendChild(full_path_div);
                if (info.path_info.root_id != null) {
                    var back_div = document.createElement("div");
                    back_div.className = "back";
                    back_div.path_id = info.path_info.root_id;
                    back_div.onclick = function() {
                        listPath(this.path_id);
                    }
                    back_div.innerText = "返回上層";
                    fileList.appendChild(back_div);
                }
                for (var folderIndex = 0; folderIndex < info.folders.length; folderIndex++) {
                    var folder_div = document.createElement("div");
                    folder_div.className = "folder";
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
                    folder_div.onclick = function(evt) {
                        listPath(this.path_id);
                    }
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
                    file_div.innerText = fileName;
                    file_div.extension;
                    file_div.file_id = info.files[fileIndex].id;
                    file_div.mime = info.files[fileIndex].mime;
                    file_div.onclick = function() {
                        if (this.mime.match(/^(image|audio|video)/g)) {
                            raw(this.file_id, this.innerText, this.mime);
                        } else if (this.mime.match(/^application\/octet-stream/g)) {
                            raw(this.file_id, this.innerText);
                        } else {
                            ace(this.file_id);
                        }
                    }
                    fileList.appendChild(file_div);
                }
                var elements = document.getElementsByClassName("fullPath");
                for (var index = 0; index < elements.length; index++) {
                    elements[index].innerText = info.path_info.full_path;
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
function downloadFile(url, file_name, target) {
    file_name = file_name || "";
    target = target || "";
    var link = document.createElement("a");
    link.href = url;
    link.target = target;
    link.download = file_name;
    link.click();
}
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
function raw(file_id, file_name, mime) {
    file_name = file_name || "";
    mime = mime || "";
    // image/
    // audio/
    // video/
    // application/octet-stream
    // file_name = prompt("是否儲存檔案?", (file_name == "" ? "new.txt" : file_name));
    // if (file_name == null) {
    //     return;
    // }
    // window.open('files/raw/' + file_id + '/' + file_name);

    if (mime.match(/^video/g)) {
        floatWindow.getElementsByTagName("video")[0].src = 'files/raw/' + file_id + '/' + file_name;
    } else if (mime.match(/^audio/g)) {
        floatWindow.getElementsByTagName("audio")[0].src = 'files/raw/' + file_id + '/' + file_name;
    } else if (mime.match(/^image/g)) {
        floatWindow.getElementsByTagName("img")[0].src = 'files/raw/' + file_id + '/' + file_name;
    } else {
        floatWindow.getElementsByTagName("iframe")[0].src = 'files/raw/' + file_id + '/' + file_name;

    }

    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4) { // 確認 readyState
    //         if (xhr.status == 200) { // 確認 status
    //         }
    //     }
    // };
    // xhr.open('POST', 'files/raw/' + file_name); // 傳資料給raw.php
    // var fd = new FormData();
    // fd.append('id', file_id);
    // fd.append('name', file_name);
    // xhr.send(fd);
}
function ace(file_id) {
    floatWindow.getElementsByTagName("iframe")[0].src = 'functions/ace.php?id=' + file_id;
    // window.open('functions/ace.php?id=' + file_id);
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4) { // 確認 readyState
    //         if (xhr.status == 200) { // 確認 status

    //         }
    //     }
    // };
    // xhr.open('POST', 'functions/ace.php'); // 傳資料給ace.php
    // var fd = new FormData();
    // fd.append('id', file_id);
    // xhr.send(fd);
}
fileList.ondragover = function(evt) { // 拖曳事件
    evt.preventDefault();
};
fileList.ondrop = function(evt) { // 放開事件
    evt.preventDefault();
    var xhr_upload = new XMLHttpRequest();
    var upload_fd = new FormData(); // 要傳過去給upload.php的資料
    var upload_files = evt.dataTransfer.files; // 要上傳的檔案
    upload_fd.append('path_id', path_id);
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
};
fileList.oncontextmenu = function(evt) {
//     document.getElementById("context").classList.add("show");
//     document.getElementById("context").style.top = evt.clientY + 'px';
//     document.getElementById("context").style.left = evt.clientX + 'px';
//     console.log(evt);
//     console.log(this);
//     evt.preventDefault();
};
fileList.onclick = function() {
    document.getElementById("context").classList.remove("show");
};
document.onselectstart = function(evt) {
    evt.preventDefault();
};
floatWindow.getElementsByTagName("iframe")[0].onload = function() {
    if (this.src != window.location && this.src != "about:blank") {
        floatWindow.classList.add("show");
        this.classList.add("show");
    }
};
floatWindow.getElementsByTagName("video")[0].onloadeddata = function() {
    if (this.src != window.location && this.src != "about:blank") {
        floatWindow.classList.add("show");
        this.classList.add("show");
        this.play();
    }
};
floatWindow.getElementsByTagName("audio")[0].onloadeddata = function() {
    if (this.src != window.location && this.src != "about:blank") {
        floatWindow.classList.add("show");
        this.classList.add("show");
        this.play();
    }
};
floatWindow.getElementsByTagName("img")[0].onload = function() {
    if (this.src != window.location && this.src != "about:blank") {
        floatWindow.classList.add("show");
        this.classList.add("show");
    }
};
floatWindow.getElementsByTagName("video")[0].onclick = function(evt) {
    evt.stopPropagation();
}
floatWindow.getElementsByTagName("audio")[0].onclick = function(evt) {
    evt.stopPropagation();
}
floatWindow.getElementsByTagName("img")[0].onclick = function(evt) {
    evt.stopPropagation();
}
floatWindow.onclick = function() {
    floatWindow.classList.remove("show");
    floatWindow.getElementsByTagName("iframe")[0].classList.remove("show");
    floatWindow.getElementsByTagName("video")[0].classList.remove("show");
    floatWindow.getElementsByTagName("audio")[0].classList.remove("show");
    floatWindow.getElementsByTagName("img")[0].classList.remove("show");
    floatWindow.getElementsByTagName("iframe")[0].src = "about:blank";
    floatWindow.getElementsByTagName("video")[0].src = "about:blank";
    floatWindow.getElementsByTagName("audio")[0].src = "about:blank";
    floatWindow.getElementsByTagName("img")[0].src = "about:blank";
};
listPath(sessionStorage.getItem('path_id') || 0);
