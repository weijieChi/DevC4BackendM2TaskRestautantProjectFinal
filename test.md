Meet expectations @WeiJie Chi 做的很好，程式碼的品質不錯，有注意很多小細節，像是使用 jsonschema 檢查使用者資料，README.md 寫的很清楚，以及錯誤處理。 下面有幾點有自己改就好，不用重交作業：
 1. config.json 字restautant 拼錯，應該是 restaurant
 2. `if() {}` 最後是沒有 ;
```js
  if (!result.valid) { ... }; // <- 沒有 ; 
``` 
至於你的問題是有關 error handling 的做法，請參閱：https://expressjs.com/en/guide/error-handling.html 我先提供幾點重點知識：
1. 大部分情況每一個 request 都要給出回應，以下是常見給出回應的方式： 
  1. res.end() 
  2. res.send() / res.sendFile() / res.sendStatus() 
  3. res.redirect() 轉到別的頁面 
  4. res.render() 若不提供 callback function 
  5. 使用 express 的 [Error Handling](https://expressjs.com/en/guide/error-handling.html) 機制，如下：
   ```js
   (req, res, next) => { next(new Error('some error')); }); 
   ``` 
2. 你的程式中有一個通用的 error-handling middleware ，位於：middlewares/error-handler.js，你的 application middleware 中，若寫到 next(err)，就是會跑到你寫的 error-handling middleware，所以你的 error-handling middleware 有責任做出回應。 
   ```js
   module.exports = (error, req, res, next) => { 
     console.log('\x1B[32m%s\x1b[0m', 'error-handler message')
     console.error(error);
     req.flash('error', error.errorMessage || '處理失敗:(');
   } /// next(error) 這是指本 error-handling middleware 不做出回應，丟往下一個 error-handling middleware res.redirect('back'); // 這做出跳轉到面的路由 }; 
   ```
3. res.redirect('back'); 後，browser 最終會回到 browser 前一頁，所以會看到 200。 res.redirect('back'); 這會回應 302 status code 和跳轉頁路徑 (header 中的 Location )給 browser，browser 收到後會再發 request 到 Location 指定頁（前一頁）。因為你是從 ”前一頁” 來的，很大的可能本來就該 200 ，你才會做作動。
4. res.status(500); 是設定回應時的 status code ，不是給出回應。因為 middlewares/error-handler.js 最終會 res.redirect('back'); ，會用 302 蓋掉你的設定。
5. 你若希望在 browser 收到你設定的 status code ，請自己實作 error-handling middleware，且你還要實作 browser 網頁收到回應後要怎麼呈現給使用者。 未來你會做 API server ，這時你伺服器就只剩給出 status code 和 json body ，browser 網頁呈現的工作就是前端開發者的工作了。
