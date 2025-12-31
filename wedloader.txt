javascript:(function(){
    /* 1. 設定時間 (毫秒) - 放在全域變數讓外部腳本讀取 */
    window.externalIntervalTime = 30000; 

    /* 2. 建立 Script 標籤來載入外部程式碼 */
    var script = document.createElement('script');
    /* ↓↓↓ 下面這行換成你在 raw.githack.com 產生的網址 ↓↓↓ */
    script.src = 'https://raw.githack.com/使用者帳號/專案名稱/分支/auto-refresh.js'; 
    /* ↑↑↑↑↑↑ */
    
    /* 3. 避免重複載入 */
    var old = document.getElementById('my-auto-refresh-script');
    if (old) old.remove();
    script.id = 'my-auto-refresh-script';
    
    document.body.appendChild(script);
})();
