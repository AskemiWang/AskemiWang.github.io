/**
 * tag-cloud.js — 放大 /tags/ 页 tag 字号差异，突出高频 tag。
 *
 * Butterfly 的 cloudTags 已经按文章数生成 1.2–1.5em 的 font-size；
 * 但跨度太小，看起来像一样大。这里保留原始比例，重新映射到
 * 0.95–2.15em（手机 0.95–1.75em），并给前 25% 加 tag-hot。
 *
 * 不修改主题模板；只在存在 .tag-cloud-list 的页面生效。
 */
(function () {
  'use strict'

  const MIN = 0.95
  const MAX_DESKTOP = 2.15
  const MAX_MOBILE = 1.75

  const getMax = () => (window.innerWidth < 768 ? MAX_MOBILE : MAX_DESKTOP)

  const rescale = () => {
    const links = Array.from(document.querySelectorAll('.tag-cloud-list a'))
    if (!links.length) return

    const values = []
    links.forEach(a => {
      if (!a.dataset.tagEm) {
        const em = parseFloat(a.style.fontSize)
        if (!Number.isNaN(em)) a.dataset.tagEm = String(em)
      }
      const em = parseFloat(a.dataset.tagEm || '')
      if (!Number.isNaN(em)) values.push(em)
    })
    if (!values.length) return

    const lo = Math.min(...values)
    const hi = Math.max(...values)
    const max = getMax()

    links.forEach(a => {
      const em = parseFloat(a.dataset.tagEm || '')
      if (Number.isNaN(em)) return
      const t = hi === lo ? 0.5 : (em - lo) / (hi - lo)
      a.style.fontSize = (MIN + t * (max - MIN)).toFixed(2) + 'em'
      a.classList.toggle('tag-hot', t >= 0.75)
    })
  }

  const init = () => {
    if (!document.querySelector('.tag-cloud-list')) return
    rescale()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  document.addEventListener('pjax:complete', init)
  window.addEventListener('resize', () => {
    if (document.querySelector('.tag-cloud-list')) rescale()
  })
})()
