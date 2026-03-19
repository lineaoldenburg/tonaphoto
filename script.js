(() => {
  const slides    = [...document.querySelectorAll('.bg-slide')];
  const inner     = document.getElementById('word-inner');
  const dotsEl    = document.getElementById('dots');
  const words     = ['Bröllop', 'Drönarvy', 'Event', 'Mäklarbild'];
  const DELAY     = 3500;
  let current     = 0;
  let wordIndex   = 0;

  /* ── Bygg roterande ord ── */
  [...words, words[0]].forEach(w => {
    const s = document.createElement('span');
    s.className = 'word-item';
    s.textContent = w;
    inner.appendChild(s);
  });

  /* ── Bygg prickar ── */
  const dots = words.map((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(d);
    return d;
  });

  function getItemHeight() {
    return document.querySelector('.word-item').offsetHeight;
  }

  /* ── Ord-scroll med GSAP (ersätter transform + transition) ── */
  function syncWord(animate) {
    const y = -wordIndex * getItemHeight();
    if (animate) {
      gsap.to(inner, {
        y,
        duration: 0.8,
        ease: 'power3.inOut'   // motsvarar cubic-bezier(.76,0,.24,1)
      });
    } else {
      gsap.set(inner, { y });
    }
  }

  /* ── Slide-byte med GSAP (ersätter CSS opacity + transform transition) ── */
  function advance() {
    const prev = current;
    current = (current + 1) % slides.length;
    wordIndex++;

    // Fade ut föregående bild
    gsap.to(slides[prev], {
      opacity: 0,
      scale: 1.06,
      duration: 1.2,
      ease: 'power2.inOut'
    });

    // Fade in nästa bild
    gsap.fromTo(slides[current],
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.inOut' }
    );

    syncWord(true);

    // Prickar
    gsap.to(dots[prev], { scale: 1, backgroundColor: 'rgba(255,255,255,0.35)', duration: 0.4 });
    gsap.to(dots[current], { scale: 1.5, backgroundColor: '#ffffff', duration: 0.4 });

    if (wordIndex === words.length) {
      setTimeout(() => {
        wordIndex = 0;
        syncWord(false);
      }, 850);
    }
  }

  /* ── Intro-sekvens med gsap.timeline() ── */
  const tl = gsap.timeline();

  // 1. Första bilden fader in
  tl.to(slides[0], {
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: 'power2.out'
  })

  // 2. h1 glider upp (startar 0.3s in i tidslinjen)
  .to('#hero h1', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power2.out'
  }, 0.3)

  // 3. Ordkarusellen
  .to('#word-wrap', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power2.out'
  }, 0.5)

  // 4. Båda h2:orna på en gång
  .to('#hero h2', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.15   // liten fördröjning mellan de två h2:orna
  }, 0.75)

  // 5. Prickarna sist
  .to('#dots', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, 1.2)

  // 6. Starta slideshow när intro är klar
  .call(() => {
    syncWord(false);
    window.addEventListener('resize', () => syncWord(false));
    setTimeout(() => setInterval(advance, DELAY), 1500);
  });

})();