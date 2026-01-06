javascript:(function(){
    /* 這裡填入您的 GitHub Raw 連結 (請注意下方關於 token 的提醒) */
    var rawUrl = 'https://raw.githubusercontent.com/Daniel7932/web/refs/heads/main/AutoRefresh_v4.js';

    /* 使用 Fetch 下載純文字，然後用 eval 執行 */
    fetch(rawUrl)
        .then(function(response){ 
            return response.text(); 
        })
        .then(function(code){ 
            console.log("程式碼下載成功，準備執行...");
            window.eval(code); 
        })
        .catch(function(err){
            alert('❌ 載入失敗：網站可能也封鎖了外部連線 (connect-src)。\n錯誤訊息: ' + err);
            console.error(err);
        });
})();
