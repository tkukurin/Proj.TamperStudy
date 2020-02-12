// ==UserScript==
// @name         CaptionCopy
// @namespace    tkukurin
// @version      1.0
// @description  Copy captions from video.
// @author       Toni Kukurin
// @match        https://www.youtube.com/*
// @require      file:///home/toni/.config/tampermonkey/include.js
// @require      file:///home/toni/.config/tampermonkey/captions.js
// @grant        none
// ==/UserScript==

(function() {
  const captionTracker = new CaptionTracker(
    10, '#player-container', '.captions-text').reset(true);

  function copyUrl() {
    const secMinHr = ['s','m','h'];
    const id = /\?v\=([^&]+)/g.exec(window.location.search);
    // Hack: Fake double-click to show the bottom bar.
    // Updates current video time display.
    Q.doc('video').then(el => el.click() || el.click());
    Q.doc('.ytp-time-current')
      .then(el => el.innerText.split(':'))
      .then(times => times.reverse().map((nr, i) => nr + secMinHr[i]).reverse())
      .then(timesWithSmh => timesWithSmh.join(''))
      .then(t => ((id && `https://youtu.be/${id[1]}?t=${t}`)
        || window.location.href.replace(/&t\=[^&]+/, `&t=${t}`)))
      .then(url => `${url} ${captionTracker.get()}`.trim())
      .then(copyText => navigator.clipboard.writeText(copyText));
  }

  window.onkeyup = document.onkeyup = Shortcut.init({
    a: [
      Shortcut.fun('a', copyUrl),
      Shortcut.fun('l', copyUrl),

      Shortcut.sel('i', '.ytp-miniplayer-button'),
      Shortcut.sel('i', '.ytp-miniplayer-expand-watch-page-button'),

      Shortcut.sel('m', '.ytp-mute-button'),
      Shortcut.sel('t', '.ytp-size-button'),
      Shortcut.sel('s', '.ytp-subtitles-button'),
      Shortcut.sel('b', '.ytp-fullscreen-button'),

      Shortcut.fun('o', () => captionTracker.reset(!captionTracker.isActive)),
    ],
    m: [Shortcut.sel('b', '.ytp-fullscreen-button.ytp-button'),]
  });

})();