// Render halaman dari data/*.json. Tanpa build step; jalan langsung di GitHub Pages.
(function () {
  "use strict";

  var BASE = document.body.getAttribute("data-base") || "";
  var PAGE = document.body.getAttribute("data-page");
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  // Ikon garis per kategori (stroke = currentColor).
  var ICONS = {
    charging: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    suspensi: '<path d="M12 2v3M12 19v3M8 5h8M8 19h8M9 8l6 2-6 2 6 2-6 2"/>',
    rem: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M21 12h-3M12 21v-3M3 12h3"/>',
    body: '<path d="M4 18c2-6 5-10 8-12 3 2 6 6 8 12"/><path d="M4 18h16"/>',
    jok: '<path d="M4 14c0-3 3-4 8-4s8 1 8 4v2H4z"/><path d="M7 16v3M17 16v3"/>',
    lampu: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    gadget: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    "ban-tools": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>'
  };
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  function icon(slug) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[slug] || ICONS.gadget) + "</svg>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function getJSON(path) {
    return fetch(BASE + path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path + " " + r.status);
      return r.json();
    });
  }

  function formatMonth(iso) {
    var d = new Date(iso + "T00:00:00");
    return isNaN(d) ? "" : MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  function latestChecked(products) {
    return products.reduce(function (max, p) {
      return p.checked_at && p.checked_at > max ? p.checked_at : max;
    }, "");
  }

  function cardHTML(p, cats) {
    var cat = cats[p.category] || { name: "", slug: p.category };
    var media = p.img
      ? '<img class="card-img" src="' + BASE + "assets/img/" + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" width="400" height="300">'
      : '<div class="card-noimg">' + icon(cat.slug) + "<span>" + esc(cat.name) + "</span></div>";
    var tags = (p.top_pick ? '<span class="tag tag-top">Top pick</span>' : "") +
      (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
    var links = (p.links || []).filter(function (l) { return /^https:\/\/s\.shopee\.co\.id\//.test(l.url); });
    var actions = links.length
      ? links.map(function (l, i) {
          var label = links.length > 1 ? "Cek di " + esc(l.label) : "Cek di Shopee";
          return '<a class="btn ' + (i === 0 ? "btn-dark" : "btn-outline") + '" href="' + esc(l.url) + '" target="_blank" rel="sponsored noopener">' + label + ARROW + "</a>";
        }).join("")
      : '<span class="btn" aria-disabled="true">Link menyusul</span>';
    return '<article class="card">' + media +
      '<div class="card-body">' +
      (tags ? '<div class="tags">' + tags + "</div>" : "") +
      "<h3>" + esc(p.name) + "</h3>" +
      '<p class="hook">' + esc(p.hook) + "</p>" +
      (p.price_range ? '<p class="price">' + esc(p.price_range) + "</p>" : "") +
      '<div class="card-actions">' + actions + "</div>" +
      "</div></article>";
  }

  function indexCats(list) {
    var map = {};
    list.forEach(function (c) { map[c.slug] = c; });
    return map;
  }

  function setUpdated(products) {
    var el = document.getElementById("updated");
    var last = latestChecked(products);
    if (el && last) el.textContent = "Data produk terakhir dicek " + formatMonth(last) + ".";
  }

  function renderHome(products, catList, tips) {
    var cats = indexCats(catList);
    var counts = {};
    products.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });

    document.getElementById("cat-grid").innerHTML = catList.map(function (c) {
      var n = counts[c.slug] || 0;
      return '<a class="cat-tile" href="produk.html?kategori=' + c.slug + '">' + icon(c.slug) +
        "<span>" + esc(c.short) + "</span><small>" + (n ? n + " produk" : "segera") + "</small></a>";
    }).join("");

    var picks = products.filter(function (p) { return p.top_pick; });
    document.getElementById("top-picks").innerHTML = picks.map(function (p) { return cardHTML(p, cats); }).join("");

    var tipList = document.getElementById("tips-teaser");
    if (tipList) {
      tipList.innerHTML = tips.slice(0, 3).map(function (t) {
        return '<li class="tip"><a href="' + tipHref(t) + '"><strong>' + esc(t.title) + "</strong></a></li>";
      }).join("");
    }
    setUpdated(products);
  }

  function renderCatalog(products, catList) {
    var cats = indexCats(catList);
    var params = new URLSearchParams(location.search);
    var active = cats[params.get("kategori")] ? params.get("kategori") : "all";
    var query = "";

    var chipsEl = document.getElementById("chips");
    var listEl = document.getElementById("catalog");
    var countEl = document.getElementById("result-count");
    var input = document.getElementById("q");

    var chipData = [{ slug: "all", short: "Semua" }].concat(catList);
    chipsEl.innerHTML = chipData.map(function (c) {
      return '<button type="button" class="chip" data-slug="' + c.slug + '" aria-pressed="' + (c.slug === active) + '">' + esc(c.short) + "</button>";
    }).join("");

    function matches(p) {
      if (active !== "all" && p.category !== active) return false;
      if (!query) return true;
      var hay = [p.name, p.hook].concat(p.tags || []).join(" ").toLowerCase();
      return query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }

    function draw() {
      var shown = products.filter(matches);
      countEl.textContent = shown.length + " produk";
      if (!shown.length) {
        listEl.innerHTML = '<p class="empty">' + (products.some(function (p) { return p.category === active; }) || active === "all"
          ? "Produk tidak ditemukan. Coba kata kunci lain."
          : "Produk untuk kategori ini segera hadir.") + "</p>";
        return;
      }
      listEl.innerHTML = catList.map(function (c) {
        var items = shown.filter(function (p) { return p.category === c.slug; });
        if (!items.length) return "";
        return '<section class="cat-block" aria-labelledby="h-' + c.slug + '"><h2 id="h-' + c.slug + '">' + esc(c.name) + "</h2>" +
          '<div class="cards compact">' + items.map(function (p) { return cardHTML(p, cats); }).join("") + "</div></section>";
      }).join("");
    }

    chipsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      active = b.getAttribute("data-slug");
      chipsEl.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var url = active === "all" ? location.pathname : location.pathname + "?kategori=" + active;
      history.replaceState(null, "", url);
      draw();
    });
    input.addEventListener("input", function () {
      query = input.value.toLowerCase().trim();
      draw();
    });

    draw();
    setUpdated(products);
  }

  function tipHref(t) {
    return BASE + "tips/" + (t.status === "terbit" ? encodeURIComponent(t.id) + ".html" : "");
  }

  function renderTips(tips, catList, products) {
    var cats = indexCats(catList);
    document.getElementById("tip-list").innerHTML = tips.map(function (t) {
      var cat = cats[t.category];
      var live = t.status === "terbit";
      return '<li class="tip"><span class="badge">' + (live ? esc(cat ? cat.short : "Tips") : "Segera terbit") + "</span>" +
        "<h2>" + (live ? '<a href="' + tipHref(t) + '">' + esc(t.title) + "</a>" : esc(t.title)) + "</h2>" +
        '<p class="hook">' + esc(t.summary) + "</p>" +
        (live ? '<a href="' + tipHref(t) + '">Baca artikel</a>' : "") + "</li>";
    }).join("");
    setUpdated(products);
  }

  // Artikel: kartu produk terkait dari data-related="id1,id2".
  function renderArticle(products, catList) {
    var cats = indexCats(catList);
    var box = document.getElementById("related");
    if (box) {
      var ids = (box.getAttribute("data-related") || "").split(",").map(function (x) { return x.trim(); });
      var items = ids.map(function (id) {
        return products.filter(function (p) { return p.id === id; })[0];
      }).filter(Boolean);
      box.innerHTML = items.map(function (p) { return cardHTML(p, cats); }).join("");
    }
    setUpdated(products);
  }

  function fail(err) {
    var el = document.querySelector("[data-fallback]");
    if (el) el.innerHTML = '<p class="empty">Data gagal dimuat. Coba muat ulang halaman.</p>';
    if (window.console) console.error(err);
  }

  Promise.all([getJSON("data/products.json"), getJSON("data/categories.json"), getJSON("data/tips.json")])
    .then(function (r) {
      if (PAGE === "home") renderHome(r[0], r[1], r[2]);
      else if (PAGE === "catalog") renderCatalog(r[0], r[1]);
      else if (PAGE === "tips") renderTips(r[2], r[1], r[0]);
      else if (PAGE === "article") renderArticle(r[0], r[1]);
    })
    .catch(fail);
})();
