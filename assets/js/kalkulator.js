// Kalkulator charging Fox 350 (kalkulator.html). Semua angka perkiraan; asumsi dijelaskan di halaman.
(function () {
  "use strict";

  var form = document.getElementById("calc");
  if (!form) return;

  var BATTERY_KWH = 3.75; // LiFePO4 72V 52Ah (Polytron)
  var LOSS = 1.1; // energi dari PLN ±10% lebih besar dari yang masuk baterai (perkiraan)
  // Daya ke baterai (kW) per charger.
  var CHARGERS = {
    bawaan: { kw: BATTERY_KWH / 4.5, name: "charger bawaan" }, // Polytron: 0–100% ±4–5 jam
    fast: { kw: 72 * 25 / 1000, name: "fast charger 25A" },
    normal: { kw: 72 * 13.5 / 1000, name: "fast charger 13,5A" },
    slow: { kw: 72 * 7 / 1000, name: "fast charger 7A" }
  };
  // Tarif rumah tangga non-subsidi PLN Okt–Des 2026 (Rp/kWh), per daya VA.
  var TARIF = { "900": 1352, "1300": 1445, "2200": 1445, "3500": 1700 };
  var TIPS = ' Baca <a href="tips/charging-di-rumah.html">Charging di rumah tanpa jeglek</a>.';

  var from = document.getElementById("calc-from");
  var to = document.getElementById("calc-to");
  var fromOut = document.getElementById("calc-from-out");
  var toOut = document.getElementById("calc-to-out");
  var tarif = document.getElementById("calc-tarif");
  var custom = document.getElementById("calc-custom");
  var customInput = document.getElementById("calc-custom-input");
  var timeEl = document.getElementById("calc-time");
  var costEl = document.getElementById("calc-cost");
  var detailEl = document.getElementById("calc-detail");
  var warnEl = document.getElementById("calc-warn");

  function num(n, digits) {
    return n.toLocaleString("id-ID", { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
  }

  function duration(hours) {
    var mins = Math.round(hours * 60 / 5) * 5;
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    if (!h) return m + " menit";
    return h + " jam" + (m ? " " + m + " menit" : "");
  }

  function update() {
    var a = Number(from.value);
    var b = Number(to.value);
    fromOut.textContent = a + "%";
    toOut.textContent = b + "%";

    var key = (form.querySelector('input[name="charger"]:checked') || {}).value || "bawaan";
    var ch = CHARGERS[key];
    custom.hidden = tarif.value !== "custom";
    var rate = tarif.value === "custom" ? Math.max(0, Number(customInput.value) || 0) : TARIF[tarif.value];

    if (b <= a) {
      timeEl.textContent = "-";
      costEl.textContent = "-";
      detailEl.textContent = "Persen tujuan harus lebih besar dari baterai sekarang.";
      warnEl.hidden = true;
      return;
    }

    var kwhBattery = BATTERY_KWH * (b - a) / 100;
    var kwhGrid = kwhBattery * LOSS;
    var cost = Math.round(kwhGrid * rate / 100) * 100;

    timeEl.textContent = "± " + duration(kwhBattery / ch.kw);
    costEl.textContent = rate ? "± Rp" + num(cost) : "Isi tarif";
    detailEl.textContent = "Energi masuk baterai sekitar " + num(kwhBattery, 2) + " kWh, listrik dari PLN sekitar " +
      num(kwhGrid, 2) + " kWh dengan " + ch.name + ". Cas penuh 0–100% sekitar Rp" +
      num(Math.round(BATTERY_KWH * LOSS * rate / 100) * 100) + ".";

    var va = Number(tarif.value) || 0;
    var draw = num(ch.kw * LOSS, 1) + " kW";
    var warn = "";
    if (va === 900) {
      warn = "Polytron merekomendasikan daya rumah minimal 1.300 VA untuk Fox 350. Di 900 VA risiko jeglek tinggi.";
    } else if (key === "fast" && va === 1300) {
      warn = "Setelan Fast menarik daya sekitar " + draw + ", melebihi batas rumah 1.300 VA. Pakai setelan Slow 7A atau charger bawaan.";
    } else if (key === "fast" && va === 2200) {
      warn = "Setelan Fast menarik daya sekitar " + draw + ", hampir seluruh daya rumah 2.200 VA. Matikan alat besar lain selama mengecas, atau turunkan ke Normal 13,5A.";
    } else if (key === "normal" && va === 1300) {
      warn = "Setelan Normal menarik daya sekitar " + draw + ", hampir seluruh daya rumah 1.300 VA. Matikan alat besar lain selama mengecas, atau turunkan ke Slow 7A.";
    }
    warnEl.innerHTML = warn ? warn + TIPS : "";
    warnEl.hidden = !warn;
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
})();
