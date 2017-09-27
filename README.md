# [:octocat:TcStorage](https://github.com/TCCinTaiwan/TcStorage)

## Contents[↶](#)
* **[Introduction](#introduction)**
* **[Installation](#installation)**
* **[ShortKey](#shortkey)**
* **[Todo](#todo)**
* **[History](#history)**
* **[Contributing](#contributing)**

## Introduction[↶](#)
這是以寫[:octocat:舊版](https://github.com/TCCinTaiwan/file-manager)的經驗為基礎，重構的新版本，多媒體參考[:octocat:TcTube](https://github.com/TCCinTaiwan/TcTube)部分內容，目前主要是在Chrome環境中執行，其他瀏覽器不一定支援。
![截圖-選取功能](screenshot/selection.png)
![截圖-影片功能](screenshot/video.png)
![截圖-音樂功能](screenshot/audio.png)
![截圖-Ace Editor功能](screenshot/ace-editor.png)

## Installation[↶](#)
1. Clone the repository to your web server's document root

    Use command:

    ```bash
    cd C:/www/
    git clone https://github.com/TCCinTaiwan/TcStorage
    ```

    Or:

    [ ![Download from Github](setup/download-from-github.png)](https://github.com/TCCinTaiwan/TcStorage/archive/master.zip)
2. Create mysql database and import [TcStorage.sql](TcStorage.sql)
3. Modify [functions/connect.example.inc](functions/connect.example.inc) to set the correct database connection information
>Make sure the user has permission to view and modify the database
4. Ok, now you can open the browser using this system
>The URL should like: http://127.0.0.1/TcStorage

## ShortKey[↶](#)
* <kbd>F2</kbd> 重新命名
* <kbd>Ctrl</kbd> + <kbd>A</kbd> 全選
* <kbd>Ctrl</kbd> + <kbd>I</kbd> 反選

## Todo[↶](#)
* 多選 - shift
* 預覽
* 帳戶
* 使用提示

## History[↶](#)
* 2017-01-25
    - 整理網頁，簡單重寫檔案管理
* 2017-01-26
    - 增加raw讀檔，並用.htaccess在網址中加入檔名
* 2017-01-27
    - 加入Ace
* 2017-01-28
    - raw合併下載
    - Ace加入標籤
* 2017-01-29
    - 命名為TcStorage
    - Ace改為多檔讀取
    - 改善IE 11相容性問題:xhr.response json vs object,函數預設值
* 2017-01-30
    - Ace開啟檔案編輯
    - 右鍵選單顯示並設定位置
    - 加入上傳檔案功能
    - 上傳Github
    - 調整上傳限制
    - Ace中文字型
    - 音樂影片開啟(含application/octet-stream)
    - 改善開啟多媒體檔案
* 2017-01-31
    - 加入指定mime
    - 讓raw媒體檔案Seekable
    - 修正編輯器跑版
    - Ace點擊url修正(加入相對位址)
    - Ace加入行列資訊
    - Ace加入語法選擇
    - Ace標籤調整顏色濾鏡(較明顯)
    - Ace加入重新讀取檔名選擇語法
    - 引用ajaxorg/ace
    - 將網址改為引用Repo
    - 移除原本ace-builds引用
    - 加入Font-Awesome引用
* 2017-02-01
    - Ace 網址自動格式化
    - Ace檔案存在修正
    - Ace.js整理
    - Ace檔案重新命名
    - Ace Base64編碼修正
    - 網站首頁選單加入Github連結
    - 修正檔名流水號錯誤問題
* 2017-02-02
    - Zip簡單讀取
    - Mime Type測試
    - 加入Mime Type清單更新
    - 建立函數引用檔
* 2017-02-03
    - 優化拖曳
    - 啟用Move
    - 加入可讀檔案大小
    - 優化拖曳流程
    - 整理事件
    - 優化UX
    - 加入多選(測試中)
* 2017-02-09
    - 安裝專案草案
    - 安裝目錄權限
* 2017-02-25
    - 加入breadcrumbs預備元素
* 2017-02-26
    - 上一層資料夾改為雙擊
    - 修正修改檔案失敗
    - 加入breadcrumbs
    - breadcrumbs點擊
    - 修正圖片預覽
    - flv圖示
    - 右鍵部分功能實現
* 2017-02-27
    - 重命名微調
    - 實現選擇區域
    - 選擇區域切換視窗微調
    - 檔名重導向中文問題修正
    - 加入音頻預覽視覺化效果
    - 音頻視覺化微調
    - 擴充附檔名圖示
* 2017-09-24
    - 整理.htaccess
    - 正名floatWindow底下物件(減少擴充功能衝突)
    - 解決iframe.contentDocument為null錯誤(像是PDF Viewer擴充功能會噴錯)
* 2017-09-25
    - 加入video/audio按一下播放暫停
    - 修正move為直接傳element
    - 重新命名檔案/資料夾功能簡單實現
    - 修正移動檔案錯誤
    - 流水號檔名判斷，假如已經是流水號檔名，則繼續編號
    - 開始寫檔頭/函數註解
    - 排除資料夾移動到自己
    - 移除與finishSelect功能衝突部分程式
    - 右鍵非選擇項目要先移除所選
    - F2快捷鍵
    - 拖曳複製(僅圖示無實現功能)
    - 麵包屑不顯示右鍵選單
* 2017-09-26
    - 加入LRC歌詞
    - 更新Google Analytics
    - $blockScrolling = Infinity;
    - 補上ACE漏掉的擴充功能引用(移到index.php)
    - LRC歌詞播完清空
    - 同路徑才使用(Query的先不管)
    - 刪除功能實現
    - Lyric搜尋文字先轉小寫
    - 複製功能草稿
    - Media播放完結束浮窗
* 2017-09-27
    - 把selectzone移到fileList底下
    - 解決滾輪偏移
    - 處理拖曳到自己顯示BUG
    - 設定"回上一層"不可選
    - 修改"回上一層"顏色
    - mouseDownInfo轉變成mouseInfo(加了滑鼠位置)
    - 選取框到邊邊滾動滾輪
    - 修復"回上一層"不一定存在BUG
    - 確保selectzone初始大小為一點
    - README.md資訊增加
    - 補上[connect.example.inc](connect.example.inc)
    - 加入全選跟反選
    - 快捷鍵：Ctrl+A全選
    - 整理raw.php讀檔
    - 啟用讀檔紀錄
    - 準備幾個快捷鍵
    - 快捷鍵：Ctrl+I反選
    - 選單按鍵部分靠右對齊

## Contributing[↶](#)
1. Create an issue and describe your idea
2. [![GitHub forks](https://img.shields.io/github/forks/TCCinTaiwan/TcTube.svg?style=social&label=Fork&maxAge=2592000)](https://github.com/TCCinTaiwan/TcTube/network) it!
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a Pull Request
