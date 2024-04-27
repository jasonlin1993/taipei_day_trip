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
  - 使用 Html、SCSS / Sass、JavaScript 開發，並實踐 RWD、AJAX，沒有使用任何前端 UI 套件
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
     
3. #### 串接第三方金流
   - Client 會去跟 TapPay Server 取得一組專屬 Prime
   - 將 Prime 傳到後端 Server 作處理
   - 後端 Server 會用這組 Prime，去跟 TapPay Server 要求付款 ( TapPay 會去跟 Bank Server 去請求付款 )
   - 後端 Server 會接收 TapPay 付款結果，並回傳付款狀態回 Client

## 附錄

## 技術介紹
### 前端
- #### HTML
- #### Sass / SCSS
  使用 Sass / SCSS 預處理、靜態切版    
- #### JavaScript
  使用 JavaScript 操作 DOM 建立前端動態
- #### 專案細節
  - 實踐 RWD
  - 實踐 infinite scroll、carousel
  - 使用 Fetch API 實踐 AJAX
    
### 後端
- #### Python、Flask.py
  使用 Python、Flask.py 建立 Application server
- #### AWS EC2
  使用 AWS EC2 的服務建立一台 Linux 機器，作業系統選擇 Ubuntu Server，並執行 Application server
- #### RESTful API
  實踐 RESTful API 並更新資料庫
- #### JWT + Bear Token
  - 使用 PyJWT 套件，使用者登入時，資料庫檢查 Email 和密碼配對成功，將會員的編號、姓名、Email 等關鍵資訊利用 JWT 機制編碼簽名，取得簽名後的 Token ，回傳給前端
  - 前端程式登入成功後，接收後端回應的 Token，儲存在瀏覽器的 Local Storage
  - 當前端程式呼叫需要驗證會員身分的後端 API 時，透過 Authorization Header 傳送 Bearer Token 到後端
  - 驗證會員身分的後端程式，接收到前端請求後，可以從 Authorization Header 取得 Token，表示使用者已登入，同時可以取得登入時紀錄的關鍵資訊
- ### mysql-connector-python 套件
  - 使用 Connection Pool 穩定資料庫連線，避免閒置太久會中斷的問題產生。
- #### 資料庫結構
  ![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/database.png)      
  
 
### 開發工具
- ##### Git / GitHub
  使用 Git / GitHub 做版本控管，配合 pull request 實踐 GitHub Flow

## 專案介紹
「台北一日遊」為一旅遊電商網站，其提供使用者搜尋台北著名景點，進一步預約導覽行程時間，並提供信用卡付款。
 ![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/mainpage.png)

- ### 首頁
  - 在首頁中，使用者可以瀏覽臺北著名景點，並輸入關鍵字搜尋，實踐 inifinite scroll，向下滑動可自動載入下一頁資料，直到沒有相符的搜尋結果

  - 關鍵字搜尋
    ![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/search.gif)
  
  - inifinite scroll
    ![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/inifiniteScroll.gif)
  
- ### 登入 / 註冊 modal
  在各個頁面的導航列中，都可以透過「登入/註冊」按鈕顯示彈跳視窗，進一步登入、註冊帳戶。登入者，可使用導航列「登出」按鈕登出帳戶。
  ![](https://raw.githubusercontent.com/jasonlin1993/taipei_day_trip/main/static/picture/memberSignIn.gif)
