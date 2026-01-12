javascript:(function() {

    /* --- 設定區 --- */
    var intervalTime = 300000; // 5分鐘 (毫秒)
    var btnId = 'master-auto-refresh-btn';
    var lastUnreadCount = 0; // 用來記錄上次的未讀數量，避免重複通知

    /* 1. 請求通知權限 (首次執行會詢問) */
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    /* 2. 發送瀏覽器通知 */
    function sendNotification(count) {
        if (Notification.permission === "granted") {
            var n = new Notification("📧 收到新郵件！", {
                body: "收件匣目前有 " + count + " 封未讀信件",
                icon: 'https://webmail.tbts.edu.tw/images/icons/24/mail.png',
                tag: 'webmail-notify' // 避免產生太多堆疊通知
            });
            n.onclick = function() { window.focus(); };
        }
    }

    /* 3. 核心注入函式 (針對每個 Frame 執行) */
    function injectToWindow(win) {
        try {
            /* 防止重複注入 */
            if (win.document.getElementById(btnId)) return;

/* 定義：檢查未讀數量的邏輯 (修改為偵測「未讀取」) */
            function checkUnreadEmails() {
                // 搜尋該視窗內所有的 <nobr> 標籤
                var allNobrs = win.document.querySelectorAll('nobr');
                var found = false;

                for (var i = 0; i < allNobrs.length; i++) {
                    var el = allNobrs[i];

                    // --- 修改重點：這裡改成偵測 "未讀取" ---
                    // 為了保險，我加了 trim() 去除前後空白
                    var text = el.innerText.trim();

                    if (text && text.indexOf("未讀取") !== -1) {
                        found = true;

                        // 優化邏輯：嘗試直接從整段文字中抓取括號內的數字
                        // 這樣無論數字有沒有被 <b> 包起來，都能抓得到
                        // Regex 意思：抓取所有非數字字元之後的數字
                        var match = text.match(/\((\d+)\)/);

                        if (match && match[1]) {
                            var currentCount = parseInt(match[1], 10);

                            console.log("📬 偵測到[未讀取]數量: " + currentCount);

                            if (currentCount > 0) {
                                sendNotification(currentCount);
                            }
                        } else {
                            // 雖然找到了 "未讀取" 這個字，但找不到括號數字，通常代表 0
                            console.log("📭 [未讀取] 目前顯示無數字 (視為 0)");
                        }
                        break; // 找到目標就收工
                    }
                }
                return found;
            }

            /* 建立控制按鈕 UI */
            var timer = null;
            var uiBtn = win.document.createElement('button');
            uiBtn.id = btnId;
            uiBtn.innerText = "▶ 啟動系統";

            var s = uiBtn.style;
            s.position = 'fixed'; s.top = '28px'; s.right = '10px';
            s.zIndex = '2147483647'; s.padding = '5px 10px';
            s.backgroundColor = '#222'; s.color = '#fff';
            s.border = '2px solid #FFD700'; s.borderRadius = '5px';
            s.cursor = 'pointer'; s.fontSize = '13px'; s.fontWeight = 'bold';
            s.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';

            /* 定義：自動重新整理與檢查流程 */
            var doRefresh = function() {
               /* var target = win.document.querySelector('[aria-label="檢查新信"]') || win.isc_ToolStripButton_12; */

                if (window.isc_ToolStripButton_12) {
                    // 1. 執行點擊
                    isc_ToolStripButton_12.click();
                    uiBtn.style.backgroundColor = '#28a745'; // 變綠
                    uiBtn.innerText = "⟳ 收信中...";
                    console.log('✅ 觸發收信: ' + new Date().toLocaleTimeString());

                    // 2. 延遲 5 秒，等待網頁讀取完成後，再檢查未讀數字
                    setTimeout(function(){
                        uiBtn.style.backgroundColor = '#444';
                        uiBtn.innerText = "⏹ 運行中";

                        // 執行檢查
                        checkUnreadEmails();
                    }, 5000); // 這裡設定 5 秒，如果網頁跑比較慢可調大

                } else {
                    // 如果這個 Frame 裡沒有收信按鈕，但可能是左側選單 Frame，試著只跑檢查
                    // 讓有收信按鈕的 Frame 負責按，有選單的 Frame 負責檢查
                    checkUnreadEmails();
                }
            };

            /* 按鈕點擊事件 */
            uiBtn.onclick = function() {
                if (timer) {
                    clearInterval(timer); timer = null;
                    uiBtn.innerText = "▶ 啟動系統";
                    uiBtn.style.backgroundColor = '#222';
                    uiBtn.style.border = '2px solid #FFD700';
                } else {
                    doRefresh(); // 立即執行一次
                    timer = setInterval(doRefresh, intervalTime);
                    uiBtn.innerText = "⏹ 運行中";
                    uiBtn.style.backgroundColor = '#444';
                    uiBtn.style.border = '2px solid #0f0';

                    // 首次啟動順便請求權限
                    if (Notification.permission !== "granted") Notification.requestPermission();
                }
            };

            win.document.body.appendChild(uiBtn);
            // console.log('✅ UI 已注入至: ' + win.location.href);

        } catch(e) { }
    }

    /* 啟動邏輯：延遲注入以確保頁面載入 */
    setTimeout(function(){
        injectToWindow(window);
        for (var i = 0; i < window.frames.length; i++) {
            injectToWindow(window.frames[i]);
        }
    }, 2000);

})();
