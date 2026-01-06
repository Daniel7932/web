javascript:(function(){
  var d=300000,e="master-auto-refresh-btn";
  function f(a){
    try{if(a.document.getElementById(e))return;
        var b=null,c=a.document.createElement("button");
        c.id=e;c.innerText="▶ 啟動自動收信";
        var g=c.style;
        g.position="fixed";
        g.top="10px";
        g.right="10px";
        g.zIndex="2147483647";
        g.padding="10px";
        g.backgroundColor="#000";
        g.color="#fff";
        g.border="2px solid yellow";
        g.borderRadius="5px";
        g.cursor="pointer";
        g.fontSize="13px";
        g.display="block";
        var h=function(){
          var k=null;
          k||(k=a.document.querySelector('[aria-label="檢查新信"]'));
          !k&&a.isc_ToolStripButton_12&&(k=a.isc_ToolStripButton_12);
          k?(k.click(),g.backgroundColor="green",console.log("✅ 已觸發檢查新信: "+(new Date).toLocaleTimeString()),setTimeout(function(){g.backgroundColor="#000"},500)):(g.backgroundColor="red",console.log("❌ 找不到檢查新信按鈕: "+(new Date).toLocaleTimeString()))};
        c.onclick=function(){b?(clearInterval(b),b=null,c.innerText="▶ 啟動自動收信",g.backgroundColor="#000",console.log("⛔ 自動檢查已停止: "+(new Date).toLocaleTimeString())):(console.log("✅ 自動檢查已啟動！ 每 "+d/1E3/60+" 分鐘執行一次。 ("+(new Date).toLocaleTimeString()+")"),h(),b=setInterval(h,d),c.innerText="⏹ 運行中...",g.backgroundColor="#444")};
        a.document.body.appendChild(c);
        console.log("✅ 已在視窗 "+a.location.href+" 插入按鈕: "+(new Date).toLocaleTimeString())}catch(k){}}f(window);
  for(var l=0;l<window.frames.length;l++)f(window.frames[l]);
})();
