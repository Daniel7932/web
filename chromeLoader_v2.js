javascript:(function(){
    var scriptUrl = '把你的_RAW_連結_貼在這裡';
    
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
