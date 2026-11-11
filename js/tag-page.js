/**
 * tag-page.js — 按 /tag-catalog.json 给 tags 页排序、加描述/颜色、隐藏 hidden。
 * 只在 /tags/ 的 .tag-cloud-list 页面生效；不依赖主题模板。
 */
(function () {
  'use strict'

  var CATALOG_URL = '/tag-catalog.json'

  function enhance(data) {
    var root = document.querySelector('.tag-cloud-list')
    if (!root || !data || !Array.isArray(data.tags)) return

    var byName = new Map()
    data.tags.forEach(function (t) {
      byName.set(t.name, t)
    })

    var links = Array.prototype.slice.call(root.querySelectorAll('a'))
    links.forEach(function (a) {
      var info = byName.get(a.textContent.trim())
      if (!info) return
      if (info.description) a.title = info.description
      if (info.color) a.style.backgroundColor = info.color
      if (info.hidden) a.hidden = true
      a.setAttribute('data-tag-order', String(info.order == null ? 9999 : info.order))
    })

    links.sort(function (a, b) {
      var ao = Number(a.getAttribute('data-tag-order') || 9999)
      var bo = Number(b.getAttribute('data-tag-order') || 9999)
      if (ao !== bo) return ao - bo
      return a.textContent.localeCompare(b.textContent)
    })
    links.forEach(function (a) {
      root.appendChild(a)
    })
  }

  function init() {
    if (!document.querySelector('.tag-cloud-list')) return
    fetch(CATALOG_URL)
      .then(function (r) { return r.ok ? r.json() : null })
      .then(function (data) { if (data) enhance(data) })
      .catch(function () { /* catalog 不可用时保持主题原样 */ })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
  document.addEventListener('pjax:complete', init)
})()
