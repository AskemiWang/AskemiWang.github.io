/**
 * runtime.js —— 页脚「本站已运行」计时
 *
 * 由 NExT 的 source/_data/footer.njk 里那段 show_runtime() 改写而来：
 *   - 不再依赖 NExT 的 footer 注入，改为由 Butterfly 的 inject.bottom 加载；
 *   - 用 setInterval 持续更新，PJAX 重绘页脚后也能自动接上；
 *   - 建站日期：2026/06/24 00:00:00（与原来一致，需要就改这里）。
 */
(function () {
  'use strict';

  var BIRTH = new Date(2026, 5, 24, 0, 0, 0); // 2026-06-24 00:00:00（月份从 0 开始）
  var timer = null;

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = String(value);
  }

  function tick() {
    // 页脚没渲染出来（或被 PJAX 替换掉了）就跳过，下一轮再试
    if (!document.getElementById('runtime_days')) return;

    var diff = Date.now() - BIRTH.getTime();
    if (diff < 0) diff = 0;

    var total = Math.floor(diff / 1000);
    var days = Math.floor(total / 86400);
    var hours = Math.floor((total % 86400) / 3600);
    var mins = Math.floor((total % 3600) / 60);
    var secs = total % 60;

    setText('runtime_days', days);
    setText('runtime_hours', hours);
    setText('runtime_mins', mins);
    setText('runtime_secs', secs);
  }

  function start() {
    if (timer) return;
    tick();
    timer = setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // Butterfly 若启用 PJAX，页脚会被替换；这里在页面切换后重新起一轮
  document.addEventListener('pjax:complete', start);
  document.addEventListener('pjax:success', start);
})();
