/**
 * toc-collapse.js — 让 Butterfly 的侧栏 TOC 整卡可折叠（桌面端）
 *
 * 主题原生只有移动端的 TOC 开合按钮；桌面端没有整卡折叠。
 * 这里在 #card-toc 的标题栏加一个 chevron 按钮，用 localStorage 记住状态。
 *
 * 注意：不要用 display:none 收 .toc-content —— 主题 main.js 会把它设为
 * display:block；这里用 max-height:0 + overflow:hidden 来折叠。
 */
(function () {
  'use strict'

  const KEY = 'tgl-toc-collapsed'
  let card = null
  let btn = null

  const apply = collapsed => {
    if (!card) return
    card.classList.toggle('is-collapsed', collapsed)
    if (!btn) return
    btn.setAttribute('aria-expanded', String(!collapsed))
    btn.setAttribute('aria-label', collapsed ? 'Expand table of contents' : 'Collapse table of contents')
    btn.innerHTML = `<i class="fas fa-chevron-${collapsed ? 'down' : 'up'}"></i>`
  }

  const init = () => {
    card = document.getElementById('card-toc')
    if (!card) return
    const head = card.querySelector('.item-headline')
    if (!head) return

    btn = head.querySelector('.toc-collapse')
    if (!btn) {
      btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'toc-collapse'
      btn.innerHTML = '<i class="fas fa-chevron-up"></i>'
      btn.setAttribute('aria-controls', 'card-toc')
      head.appendChild(btn)
      btn.addEventListener('click', () => {
        const collapsed = !card.classList.contains('is-collapsed')
        apply(collapsed)
        try {
          localStorage.setItem(KEY, collapsed ? '1' : '0')
        } catch (e) { /* ignore private mode */ }
      })
    }

    let saved = false
    try {
      saved = localStorage.getItem(KEY) === '1'
    } catch (e) { /* ignore */ }
    apply(saved)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  document.addEventListener('pjax:complete', init)
})()
