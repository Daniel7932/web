javascript:(function(){
    var scriptUrl = 'https://raw.githubusercontent.com/Daniel7932/web/refs/heads/main/AutoRefresh_v4.js?token=GHSAT0AAAAAADRX3VWQU43FOBVIIX5BVWME2K4YKNA';
    
    /* 加入時間戳記避免瀏覽器快取舊程式碼 */
    var nocacheUrl = scriptUrl + '?t=' + new Date().getTime();
    
    var script = document.createElement('script');
    script.src = nocacheUrl;
    script.onload = function() {
        console.log("腳本載入成功");
    };
    script.onerror = function() {
        alert("無法載入腳本，可能是網頁安全性政策 (CSP) 阻擋，或連結錯誤。");
    };
    document.body.appendChild(script);
})();
