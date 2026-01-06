(function() {
    var intervalTime = 300000; // 5分鐘
    var btnId = 'master-auto-refresh-btn';
    
    function injectToWindow(win) {
        try {
            /* 1. 檢查該視窗是否已經有按鈕，避免重複產生 */
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
                /* 嘗試兩種方式尋找按鈕 */
                var target = null;
                
                // 方式 A: 透過 DOM 屬性 (較通用)
                if (!target) target = win.document.querySelector('[aria-label="檢查新信"]');
                // 方式 B: 透過 SmartClient 全域變數 (特定框架用)
                if (!target && win.isc_ToolStripButton_12) target = win.isc_ToolStripButton_12;

                if (target) {
                    target.click();
                    uiBtn.style.backgroundColor = 'green';
                    console.log('✅ 已觸發檢查新信: ' + new Date().toLocaleTimeString());
                    setTimeout(function(){ uiBtn.style.backgroundColor = '#000'; }, 500);
                } else {
                    uiBtn.style.backgroundColor = 'red';
                    console.log('❌ 找不到檢查新信按鈕: ' + new Date().toLocaleTimeString());
                }
            };

            uiBtn.onclick = function() {
                if (timer) {
                    clearInterval(timer); timer = null;
                    uiBtn.innerText = "▶ 啟動自動收信";
                    uiBtn.style.backgroundColor = '#000';
                    console.log('⛔ 自動檢查已停止: ' + new Date().toLocaleTimeString());
                } else {
                    console.log('✅ 自動檢查已啟動！ 每 ' + (intervalTime/1000/60) + ' 分鐘執行一次。 (' + new Date().toLocaleTimeString() + ')');
                    doRefresh(); // 立即執行一次
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
