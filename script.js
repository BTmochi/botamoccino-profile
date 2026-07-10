    // ---- Fanart data ----
    // Only artwork confirmed safe-for-work is included here.
    var fanartData = [
      { img: "img/fanart-01.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "まいくろびきに…", url: "https://x.com/waa_waa_wa/status/2038611814959997062" },
      { img: "img/fanart-02.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "この服好きっていう絵", url: "https://x.com/waa_waa_wa/status/2039351999247097992" },
      { img: "img/fanart-03.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "ぼたもちーのさん！", url: "https://twitter.com/waa_waa_wa/status/2037991706080243868" },
      { img: "img/fanart-04.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "", url: "https://twitter.com/waa_waa_wa/status/2038992333040148721" },
      { img: "img/fanart-05.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "ぱーかー", url: "https://x.com/waa_waa_wa/status/2040731745520329167" },
      { img: "img/fanart-06.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "にこにこかわいい", url: "https://twitter.com/waa_waa_wa/status/2040778678997811213" },
      { img: "img/fanart-07.jpg", author: "古都こと", handle: "@waa_waa_wa", date: "", caption: "もちーのせーらー", url: "https://x.com/waa_waa_wa/status/2043287362814525817" },
      { img: "img/fanart-08.jpg", author: "ことさぶ郎", handle: "@furuichi_koto25", date: "", caption: "抱き枕(非売品)", url: "https://x.com/furuichi_koto25/status/2043697074458550380" },
      { img: "img/fanart-09.jpg", author: "古都こと", handle: "waa_waa_wa", date: "", caption: "もちもち～", url: "https://x.com/waa_waa_wa/status/2045863876210909664" },
      { img: "img/fanart-10.jpg", author: "ちの", handle: "@chino2047", date: "", caption: "可愛すぎて描いた", url: "https://twitter.com/chino2047/status/2061335771102203921" }
    ];

    function getAvatarUrl(item) {
      if (item.avatar) return item.avatar;
      if (!item.handle) return '';
      return 'https://unavatar.io/x/' + item.handle.replace(/^@/, '');
    }

    function createUserIcon(item) {
      var icon = document.createElement('span');
      icon.className = 'user-icon';

      var fallback = document.createElement('span');
      fallback.className = 'user-icon-fallback';
      fallback.textContent = (item.author || '?').charAt(0);

      var avatarUrl = getAvatarUrl(item);
      if (!avatarUrl) {
        icon.appendChild(fallback);
        return icon;
      }

      var avatar = document.createElement('img');
      avatar.src = avatarUrl;
      avatar.alt = '';
      avatar.loading = 'lazy';
      avatar.referrerPolicy = 'no-referrer';
      avatar.addEventListener('error', function () {
        avatar.remove();
        icon.appendChild(fallback);
      }, { once: true });

      icon.appendChild(avatar);
      return icon;
    }

    // ---- Render grid ----
    (function () {
      var grid = document.getElementById('fanart-grid');

      fanartData.forEach(function (item, i) {
        var thumb = document.createElement('div');
        thumb.className = 'fanart-thumb animate-in';
        thumb.style.animationDelay = (0.65 + i * 0.04) + 's';
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('aria-label', item.author + 'さんのファンアートを見る');

        if (item.img) {
          var img = document.createElement('img');
          img.src = item.img;
          img.alt = item.caption || (item.author + 'のファンアート');
          img.loading = 'lazy';
          thumb.appendChild(img);
        } else {
          var ph = document.createElement('div');
          ph.className = 'placeholder-icon';
          ph.textContent = item.icon || '🎨';
          thumb.appendChild(ph);
        }

        var credit = document.createElement('div');
        credit.className = 'thumb-credit';
        credit.appendChild(createUserIcon(item));
        var creditName = document.createElement('span');
        creditName.className = 'thumb-credit-name';
        creditName.textContent = item.author;
        credit.appendChild(creditName);
        thumb.appendChild(credit);

        thumb.addEventListener('click', function () { openLightbox(i); });
        thumb.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
        });

        grid.appendChild(thumb);
      });
    })();

    // ---- Lightbox ----
    (function () {
      var overlay = document.getElementById('lightbox-overlay');
      var imageWrap = document.getElementById('lightbox-image-wrap');
      var creditEl = document.getElementById('lightbox-credit');
      var dateEl = document.getElementById('lightbox-date');
      var linkEl = document.getElementById('lightbox-link');
      var closeBtn = document.getElementById('lightbox-close');

      window.openLightbox = function (index) {
        var item = fanartData[index];
        imageWrap.innerHTML = '';
        if (item.img) {
          var img = document.createElement('img');
          img.src = item.img;
          img.alt = item.caption || (item.author + 'のファンアート');
          imageWrap.appendChild(img);
        } else {
          var ph = document.createElement('div');
          ph.className = 'placeholder-icon';
          ph.textContent = item.icon || '🎨';
          imageWrap.appendChild(ph);
        }
        creditEl.innerHTML = '';
        creditEl.appendChild(createUserIcon(item));
        var creditText = document.createElement('span');
        creditText.className = 'lightbox-credit-text';
        creditText.textContent = item.author + ' (' + item.handle + ')' + (item.caption ? ' — ' + item.caption : '');
        creditEl.appendChild(creditText);
        dateEl.textContent = item.date;
        dateEl.style.display = item.date ? '' : 'none';
        linkEl.href = item.url;

        overlay.classList.add('open');
      };

      function closeLightbox() {
        overlay.classList.remove('open');
      }

      closeBtn.addEventListener('click', closeLightbox);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    })();

    // ---- Animate-in stagger on scroll / IntersectionObserver ----
    (function () {
      var els = document.querySelectorAll('.animate-in');
      if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.animationPlayState = 'running';
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        els.forEach(function (el) {
          el.style.animationPlayState = 'paused';
          obs.observe(el);
        });
      } else {
        els.forEach(function (el) { el.style.opacity = 1; });
      }
    })();
