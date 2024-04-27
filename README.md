# 臺北一日遊專案

## 目錄
1. [專案展示](#專案展示)
2. [專案摘要](#專案摘要)
3. [開發介紹](#開發介紹)
   - [網站架構及摘要](#網站架構及摘要)
     - 前端開發
     - 後端開發
     - 開發工具
   - [目錄架構](#目錄架構)
   - [開發、部署流程](#開發部署流程)
     - 開發
     - 部署
   - [程式設計摘要](#程式設計摘要)
     - a. 會員系統建立、登入狀態管理
     - b. Application server 程式架構
     - c. 串接第三方金流
4. [附錄](#附錄)
    - [技術介紹](#技術介紹)
    - [專案介紹](#專案介紹)
        - [首頁](#首頁)
        - [登入/註冊 modal](#登入註冊-modal)
        - [行程簡介頁](#行程簡介頁)
        - [預定行程頁](#預定行程頁)

## 專案展示
   - 專案網址：[http://54.214.247.228:3000/](http://54.214.247.228:3000/)
   - 測試帳號：test@test.com
   - 測試密碼：test

| Payment            | set|
|------------------|----------|
| `卡片號碼` | `4242-4242-4242-4242` |
| `過期日` | `12/31` |
| `CCV` | `123` |

## 專案摘要
「臺北一日遊」為旅遊電商網站，提供使用者搜尋臺北景點，進一步預約導覽行程時間，並提供信用卡付款。

![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/mainpage.png)

## 開發介紹
### 網站架構及摘要
![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/Architecture.png)


- **前端開發**
  - 使用 Html、SCSS / SASS、JavaScript 開發，並實踐 RWD、AJAX，沒有使用任何前端 UI 套件
- **後端開發**
  - 專案使用 AWS EC2 雲端部屬
  - 使用 Python flask 建立 Application server
  - MySQL 關聯式資料庫儲存景點、會員資料及訂單
  - 開發購物車系統，結合 TapPay 第三方金流服務 
- **開發工具**
  - 使用 Git / GitHub 做版本管控

### 目錄架構
   - 專案目錄下有 static 目錄供 Python server 套件 Flask.py 取得靜態檔案; templates 目錄下的 HTML 檔案使用 Jinja2 樣板引擎渲染
   - static 目錄下分成 JavaScript、styles、picture 子目錄
     - Javascript: 依照功能拆分檔案
     - styles: 依照頁面拆分檔案; 全域顏色儲存在 _variable.scss、全域 styles 儲存在 _mixin.scss
     - picture: 儲存首頁以及 README 圖片     

### 開發、部署流程
![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/development.png)

#### 開發
   - 以 GitHub Flow 為基礎進行開發，包含要求 reviewer 同意 pull request 實踐 GitHub Flow
   - 根據後端規格文件建立 MySQL 資料庫、開發 RESTful API
   - 篩選臺北旅遊網 Open API 的原始資料，並建立 MySQL 資料庫中的 attractions 資料表
#### 部署
   - 使用 AWS EC2 的服務建立一台 Linux 機器，作業系統選擇 Ubuntu Server，並執行由 Python、Flask.py 編寫之 Application server
   - 在 AWS EC2 建立 MySQL 資料庫
   - 使用 nohup 指令讓 Application server 在 AWS EC2 背景運作

### 程式設計摘要
1. #### 會員系統建立、登入狀態管理
   - 使用 MySQL 資料庫 users 資料表建立會員系統
   - 使用 Flask.py、PyJWT、Bearer Token 判斷使用者登入狀態，實踐會員登入、登出功能
     
2. #### Application server 程式架構
   - 使用 Flask.py 建立 Routing system
   - 配合規格文件實踐 RESTful API，依照不同 HTTP 方法的請求，執行對應的程式碼
     
4. #### 串接第三方金流
   - Client 會去跟 TapPay Server 取得一組專屬 Prime
   - 將 Prime 傳到後端 Server作處理
   - 後端 Server 會用這組 Prime，去跟 TapPay Server 要求付款 ( TapPay 會去跟 Bank Server 去請求付款 )
   - 後端 Server 會接收 TapPay 付款結果，並回傳付款狀態回 Client
  
