因為原本我就已經有 MySQL 練習環境，所以在 config/config.json 的 password 是 `root` ，助教在批改時候再看要不再改成 `password`
因為題目沒有要求搜尋功能，所以我先 disable 搜尋的功能

# 餐廳收藏資網站料庫 CRUD 操作作業
在伺服器啟動期間使用者在瀏覽器輸入 http://localhost:3000/ 會開啟網站頁面

## Features 網站功能
* 使用者可以新增一家餐廳
* 使用者可以瀏覽一家餐廳的詳細資訊
* 使用者可以瀏覽全部所有餐廳
* 使用者可以修改一家餐廳的資訊
* 使用者可以刪除一家餐廳

## Environment Requirement 環境需求
* 必須已經安裝 Nodejs 執行環境
* git 套件
* 已經安裝 MySQL Server

## Execution 執行方式
**Winsows 執行環境注意事項**
    其專案所在路徑不可以有空白字元 ex: `C:\alpha camp\my folder` 跟含有非英文非 ASCII 字元 ex: `C:\Users\吳柏毅\dev`

**步驟 Step**
1. 在 MySQL 建立資料庫
以下為建立資料庫的建議 SQL 語法
```sql
-- 建立資料庫
CREATE DATABASE `restaurant`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

2. 先用 git clone 從 github repositories 複製檔案，使用 ssh 協定。
```sh
git clone git@github.com:weijieChi/DevC4BackendM2TaskRestautantProjectRefactor.git
```
3. 進入專案所在目錄
```sh
cd ./DevC4BackendM2TaskRestautantProjectRefactor
```
4. 使用 npm 安裝執行所需的套件。
```sh
npm install
```
5. 使用 seuqelize-cli 建立 database table
```sh
npx sequelize db:migrate
```
6. 使用 seuqelize-cli 建立初始資料
```sh
npx sequelize db:seed:all
```
7. 將環境變數 NODE_ENV 設為 `development` 否則程式執行將會出現錯誤

**windws**
建議使用 powershell 來設定
```ps1
# 設定環境變數方式
$Env:NODE_ENV="development"  # 字串要用單引號或是雙引號包住，不然系統會認為是函式或是類別
# 查看環境變數是否設定正確
$env:NODE_ENV
```
**UNIX Like (Linux, Mac OSX, FreeBSD 等)**
```sh
# 設定環境變數
export NODE_ENV=development
# 查看環境變數是否設定正確
printenv NODE_ENV
```

8. 透過 npm 執行伺服器程式。
```sh
npm run start
```
9. 在瀏覽器網址列輸入 `http://localhost:3000/` 就可以打開網頁了

10. 最後要關閉伺服器就在 terminal 案 `ctrl` + `C` 再按 `y` + `enter` 關閉 nodejs 伺服器。

---

# 補充
## 環境變數設定方式

### windows
windows 開發環境使用者強烈建議使用 powershell ，因為 powershell 是現在微軟推薦並且有在維護的命令列環境工具，且 windows visual studio code 預設命令列工具就是 powershell
**Powershell 設定方式**

```ps1
# 顯示環境變數方式，前面的 env 可以是任意大小寫
$env:HomePath

# 設定環境變數方式
$Env:NODE_ENV="development"  # 字串要用單引號或是雙引號包住，不然系統會認為是函式或是類別

# 移除環境變數方式 powershell 沒有刪除環境變數的指令，而是透過因 windows 不允許環境變視為空字串或是空值，所以只要將已經存在的環境變數設回空字串，系統就會將該環境變數移除
$env:NODE_ENV=""
```

**命令提示字元 cmd.exe 設定方式**

```cmd
:: 顯示環境變數方式
echo %HomePath%

:: 設定環境變數方式
set NODE_ENV=development

:: 移除環境變數方式，一樣將環境變數設為空值即可，等號右邊沒有任何字元
set NODE_ENV=
```

### UNIX Like (Linux, Mac OSX, FreeBSD 等)

基本上 UNIX Like 作業系統 CLI 設定環境變數的方法大同小異

```sh
# 顯示環境變數，有兩種方式，範例分別如下
# 1
printenv HOME
# 2
echo $HOME

# 設定環境變數
export NODE_ENV=development

# 刪除環境變數
unset NODE_ENV
```