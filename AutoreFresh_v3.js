javascript:(function(){
    var intervalTime = 30000;
    var btnId = 'master-auto-refresh-btn';
    
    function injectToWindow(win) {
        try {
            /* 1. 檢查該視窗是否已經有按鈕 */
            if (win.document.getElementById(btnId)) return;

            var timer = null;
            var uiBtn = win.document.createElement('button');
            uiBtn.id = btnId;
            uiBtn.innerText = "▶ 啟動自動收信";
            
            /* 樣式設定 */
            var s = uiBtn.style;
            s.position = 'fixed'; s.top = '10px'; s.right = '10px';
            s.zIndex = '2147483647'; s.padding = '10px';
            s.backgroundColor = '#000'; s.color = '#fff';
            s.border = '2px solid yellow'; s.borderRadius = '5px';
            s.cursor = 'pointer'; s.fontSize = '13px'; s.display = 'block';

            var doRefresh = function() {
                /* 同時尋找當前視窗及所有子視窗的按鈕 */
               /* var target = win.document.querySelector('[aria-label="檢查新信"]') || window.isc_ToolStripButton_12; */
                if (window.isc_ToolStripButton_12) {
                    isc_ToolStripButton_12.click();
                    uiBtn.style.backgroundColor = 'green';
                    console.log('✅ 已觸發檢查新信: ' + new Date().toLocaleTimeString());
                    setTimeout(function(){ uiBtn.style.backgroundColor = '#000'; }, 500);
                } else if (window.isc_ToolStripButton_12) {
                    /* SmartClient 的備用觸發方式 */
                    isc_ToolStripButton_12.click();
                    console.log('✅ 已觸發檢查新信 (透過 SC 物件): ' + new Date().toLocaleTimeString());
                } else {
                    uiBtn.style.backgroundColor = 'red';
                    console.log('❌ 找不到檢查新信按鈕');
                }
            };

            uiBtn.onclick = function() {
                if (timer) {
                    clearInterval(timer); timer = null;
                    uiBtn.innerText = "▶ 啟動自動收信";
                    uiBtn.style.backgroundColor = '#000';
                    alert('⛔ 自動檢查已停止');
                } else {
                    doRefresh();
                    timer = setInterval(doRefresh, intervalTime);
                    uiBtn.innerText = "⏹ 運行中...";
                    uiBtn.style.backgroundColor = '#444';
                }
            };

            win.document.body.appendChild(uiBtn);
            console.log('✅ 已在視窗 ' + win.location.href + ' 插入按鈕');
        } catch(e) {
            /* 忽略跨網域視窗限制 */
        }
    }

    /* 執行：嘗試在主視窗和所有 iframe 注入 */
    injectToWindow(window);
    for (var i = 0; i < window.frames.length; i++) {
        injectToWindow(window.frames[i]);
    }

})();
