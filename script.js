(() => {
  const slides  = [...document.querySelectorAll('.bg-slide')];
  const inner   = document.getElementById('word-inner');
  const dotsEl  = document.getElementById('dots');
  const words   = ['Bröllop', 'Drönarvy', 'Event', 'Mäklarbild'];
  const DELAY   = 3500;
  let current   = 0;
  let wordIndex = 0;

  /* ── Roterande ord ── */
  [...words, words[0]].forEach(w => {
    const s = document.createElement('span');
    s.className = 'word-item';
    s.textContent = w;
    inner.appendChild(s);
  });

  /* ── Prickar ── */
  const dots = words.map((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
    return d;
  });

  function getItemHeight() {
    return document.querySelector('.word-item').offsetHeight;
  }

  function syncWord(animate) {
    if (!animate) inner.style.transition = 'none';
    inner.style.transform = `translateY(${-wordIndex * getItemHeight()}px)`;
    if (!animate) {
      inner.offsetHeight;
      inner.style.transition = '';
    }
  }

  /* ── Aktiv toggle ── */
  function advance() {
    const prev = current;
    current = (current + 1) % slides.length;
    wordIndex++;

    slides[prev].classList.remove('active');
    slides[current].classList.add('active');

    syncWord(true);

    dots[prev].classList.remove('active');
    dots[current].classList.add('active');

    if (wordIndex === words.length) {
      setTimeout(() => {
        wordIndex = 0;
        syncWord(false);
      }, 850);
    }
  }

  /* ── Kör ── */
  syncWord(false);
  window.addEventListener('resize', () => syncWord(false));

  /* ── Fade:a in från start ── */
  slides[0].classList.add('first-load', 'active');
  setTimeout(() => {
    slides[0].classList.remove('first-load');
    setTimeout(() => setInterval(advance, DELAY), 1500);
  }, 700);
})();