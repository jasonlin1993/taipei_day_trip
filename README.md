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
// 這裡描述開發過程
#### 部署
// 這裡描述部署過程

### 程式設計摘要
- **會員系統建立、登入狀態管理**
- **Application server 程式架構**
- **串接第三方金流**
