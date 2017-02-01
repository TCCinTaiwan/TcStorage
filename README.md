# [:octocat:TcStorage](https://github.com/TCCinTaiwan/TcStorage)

## Contents[↶](#)
* **[Introduction](#introduction)**
* **[History](#history)**

## Introduction[↶](#)
這是以寫[:octocat:舊版](https://github.com/TCCinTaiwan/file-manager)的經驗為基礎，重構的新版本。
![截圖](screenshot.png)
![截圖2](screenshot-2.png)

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
