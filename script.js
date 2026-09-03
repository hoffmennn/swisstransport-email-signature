/* =========================================================
   Swisstransport – Generátor e-mailových podpisov
   ---------------------------------------------------------
   Vygenerovaný podpis používa TABUĽKOVÝ layout a INLINE
   štýly (nie externé CSS triedy) – je to zámerné, pretože
   väčšina e-mailových klientov (Outlook, Gmail, ...) pri
   vložení podpisu ignoruje alebo orezáva <style> bloky a
   moderné CSS (flex/grid). Tabuľky + inline štýly sú jediný
   spôsob, ako zaručiť rovnaký vzhľad podpisu naprieč
   klientmi.
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     KONFIGURÁCIA
     - logoUrl: URL loga, ktoré sa vloží do e-mailu.
       DÔLEŽITÉ: musí ísť o verejne dostupnú (hostovanú) URL
       adresu obrázka (napr. na firemnom webe/CDN), nie
       o lokálnu cestu – inak sa logo príjemcom nezobrazí.
       Pre potreby živého náhľadu v tomto nástroji sa zatiaľ
       používa lokálny súbor z priečinka assets/.
     --------------------------------------------------------- */
  const CONFIG = {
    logoUrl: "https://raw.githubusercontent.com/hoffmennn/swisstransport-email-signature/refs/heads/main/assets/logo-horizontal.png",
    // Nastavuje sa len výška loga. Šírka sa dopočítava automaticky
    // podľa skutočného pomeru strán stiahnutého obrázka (viď
    // loadLogoAspectRatio nižšie) – logo tak nie je nikdy umelo
    // naťahované/stlačené, nech je zdrojový súbor akokoľvek veľký.
    logoHeight: 40,
    logoAspectRatio: null, // width / height; doplní sa asynchrónne
    colors: {
      navy: "#0f2438",
      red: "#e2231a",
      grayText: "#5b6470",
      border: "#dfe3e7"
    },
    company: {
      name: "SWISS TRANSPORT, s.r.o.",
      addressLine1: "Na Letisko 2088/15",
      addressLine2: "058 01 Poprad, Slovakia",
      web: "www.swisstransport.eu",
      webUrl: "https://www.swisstransport.eu",
      email: "info@swisstransport.eu"
    }
  };

  /* ---------------------------------------------------------
     DOM referencie
     --------------------------------------------------------- */
  const form = document.getElementById("signature-form");
  const fields = {
    meno: document.getElementById("field-meno"),
    pozicia: document.getElementById("field-pozicia"),
    telefon: document.getElementById("field-telefon"),
    email: document.getElementById("field-email")
  };
  const previewFrame = document.getElementById("preview-frame");
  const copyBtn = document.getElementById("copy-btn");
  const resetBtn = document.getElementById("reset-btn");
  const openTabBtn = document.getElementById("open-tab-btn");
  const statusMsg = document.getElementById("status-msg");

  /* ---------------------------------------------------------
     Pomocné funkcie
     --------------------------------------------------------- */

  // Základné escapovanie pre bezpečné vloženie textu do HTML
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Odstráni z tel. čísla medzery a znaky nevhodné pre tel: odkaz
  function telHref(tel) {
    return "tel:" + String(tel || "").replace(/[^\d+]/g, "");
  }

  function getValues() {
    return {
      meno: fields.meno.value.trim(),
      pozicia: fields.pozicia.value.trim(),
      telefon: fields.telefon.value.trim(),
      email: fields.email.value.trim()
    };
  }

  /* ---------------------------------------------------------
     Generovanie HTML podpisu (tabuľkový layout, inline štýly)
     --------------------------------------------------------- */
  function buildSignatureHtml(data) {
    const c = CONFIG.colors;
    const co = CONFIG.company;

    const meno = escapeHtml(data.meno || "Meno Priezvisko");
    // Veľké písmená posielame priamo v obsahu (nie cez CSS text-transform) –
    // Apple Mail a viacero e-mailových klientov pri vkladaní/odosielaní
    // podpisu CSS text-transform ignoruje alebo ho zdroj textu nezmení.
    const pozicia = escapeHtml((data.pozicia || "Pozícia").toUpperCase());
    const telefon = escapeHtml(data.telefon || "+421 900 000 000");
    const email = escapeHtml(data.email || "meno.priezvisko@swisstransport.eu");

    // Šírka = výška × reálny pomer strán obrázka. Kým sa pomer strán
    // asynchrónne nenačíta (loadLogoAspectRatio), použije sa fallback
    // 8.2 (aktuálny pomer horizontálneho loga, 1000×122 px), aby prvé
    // vykreslenie nebolo nikdy skreslené ani prázdne.
    const logoHeight = CONFIG.logoHeight;
    const logoWidth = Math.round(logoHeight * (CONFIG.logoAspectRatio || 8.2));

    return `
<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-bottom:6px;">
      <img src="${CONFIG.logoUrl}" width="${logoWidth}" height="${logoHeight}" alt="${escapeHtml(co.name)}" style="display:block;border:0;outline:none;text-decoration:none;width:${logoWidth}px;height:${logoHeight}px;">
    </td>
  </tr>
  <tr>
    <td style="border-top:3px solid ${c.red};font-size:0;line-height:0;padding-top:10px;">&nbsp;</td>
  </tr>
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:bold;color:${c.navy};padding-bottom:2px;">${meno}</td>
  </tr>
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;letter-spacing:.4px;text-transform:uppercase;color:${c.red};padding-bottom:9px;">${pozicia}</td>
  </tr>
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${c.navy};">
      T:&nbsp;<a href="${telHref(data.telefon)}" style="color:${c.navy};text-decoration:none;">${telefon}</a>
    </td>
  </tr>
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:${c.navy};padding-bottom:9px;">
      E:&nbsp;<a href="mailto:${email}" style="color:${c.navy};text-decoration:none;">${email}</a>
    </td>
  </tr>
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:17px;color:${c.grayText};border-top:1px solid ${c.border};padding-top:9px;">
      <b style="color:${c.navy};">${escapeHtml(co.name)}</b><br>
      ${escapeHtml(co.addressLine1)} <br>${escapeHtml(co.addressLine2)}<br>
      <a href="${co.webUrl}" style="color:${c.red};text-decoration:none;">${escapeHtml(co.web)}</a>
      &nbsp;·&nbsp;
      <a href="mailto:${co.email}" style="color:${c.red};text-decoration:none;">${escapeHtml(co.email)}</a>
    </td>
  </tr>
</table>`.trim();
  }

  // Textová (plain-text) verzia podpisu – používa sa ako fallback
  // pri kopírovaní (napr. do textových polí bez podpory HTML).
  function buildSignaturePlainText(data) {
    const co = CONFIG.company;
    const meno = data.meno || "Meno Priezvisko";
    const pozicia = data.pozicia || "Pozícia";
    const telefon = data.telefon || "+421 900 000 000";
    const email = data.email || "meno.priezvisko@swisstransport.eu";

    return [
      meno,
      pozicia,
      `T: ${telefon}`,
      `E: ${email}`,
      "",
      co.name,
      `${co.addressLine1}, ${co.addressLine2}`,
      `${co.web} | ${co.email}`
    ].join("\n");
  }

  /* ---------------------------------------------------------
     Live náhľad – vykresľuje sa v izolovanom <iframe>, aby
     štýly stránky nemohli ovplyvniť (ani skresliť) vzhľad
     podpisu tak, ako ho naozaj uvidí príjemca.
     --------------------------------------------------------- */
  function renderPreview(html) {
    const doc = previewFrame.contentDocument;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
      body{margin:0;padding:0;background:transparent;}
    </style></head><body>${html}</body></html>`);
    doc.close();

    // Prispôsobenie výšky iframe obsahu
    requestAnimationFrame(() => {
      const height = doc.body.scrollHeight;
      previewFrame.style.height = Math.max(height, 120) + "px";
    });
  }

  /* ---------------------------------------------------------
     Validácia povinných polí – tlačidlo kopírovania je
     aktívne až po vyplnení mena, pozície, telefónu a e-mailu.
     --------------------------------------------------------- */
  function validate() {
    const data = getValues();
    const requiredOk =
      data.meno.length > 0 &&
      data.pozicia.length > 0 &&
      data.telefon.length > 0 &&
      /\S+@\S+\.\S+/.test(data.email);

    [fields.meno, fields.pozicia, fields.telefon].forEach((el) => {
      el.classList.toggle("invalid", el.value.trim().length === 0 && el.dataset.touched === "1");
    });
    fields.email.classList.toggle(
      "invalid",
      fields.email.dataset.touched === "1" && !/\S+@\S+\.\S+/.test(data.email)
    );

    copyBtn.disabled = !requiredOk;
    return { data, requiredOk };
  }

  function update() {
    const { data } = validate();
    const html = buildSignatureHtml(data);
    renderPreview(html);
    return { data, html };
  }

  /* ---------------------------------------------------------
     Kopírovanie do schránky – vloží HTML aj plain-text verziu
     naraz (navigator.clipboard.write s ClipboardItem), aby sa
     pri vložení do e-mailu zachovalo formátovanie.
     --------------------------------------------------------- */
  async function copySignature() {
    const { data, requiredOk } = validate();
    if (!requiredOk) {
      showStatus("Najprv vyplňte všetky povinné polia.", "err");
      return;
    }

    const html = buildSignatureHtml(data);
    const text = buildSignaturePlainText(data);

    try {
      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" })
        });
        await navigator.clipboard.write([item]);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        // Fallback pre prehliadače bez podpory ClipboardItem
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API nie je v tomto prehliadači dostupné.");
      }
      showStatus("Podpis bol skopírovaný do schránky. Vložte ho (Ctrl+V) do nastavení podpisu vo vašom e-mailovom klientovi.", "ok");
    } catch (err) {
      console.error(err);
      showStatus("Kopírovanie zlyhalo. Skúste prosím podpis označiť v náhľade a skopírovať manuálne (Ctrl+C).", "err");
    }
  }

  /* ---------------------------------------------------------
     Zistenie reálneho pomeru strán loga – stiahne obrázok
     mimo DOM a z jeho naturalWidth/naturalHeight dopočíta
     CONFIG.logoAspectRatio, aby sa šírka v podpise nikdy
     nenastavovala natvrdo (a teda ani neťahala/nestláčala).
     --------------------------------------------------------- */
  function loadLogoAspectRatio() {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        CONFIG.logoAspectRatio = img.naturalWidth / img.naturalHeight;
        update();
      }
    };
    img.src = CONFIG.logoUrl;
  }

  /* ---------------------------------------------------------
     Otvorenie podpisu v novej karte (mimo iframe náhľadu) –
     záložná metóda pre Apple Mail: medziaplikačný prenos
     naformátovaného HTML cez Clipboard API býva nespoľahlivý
     (najmä z Chrome/Edge). Manuálne označenie (Cmd+A) a
     skopírovanie (Cmd+C) priamo z vykresleného dokumentu
     v Safari je najspoľahlivejšia cesta do Mail → Podpisy.
     --------------------------------------------------------- */
  function openSignatureInNewTab() {
    const { data, requiredOk } = validate();
    if (!requiredOk) {
      showStatus("Najprv vyplňte všetky povinné polia.", "err");
      return;
    }
    const html = buildSignatureHtml(data);
    const doc = `<!doctype html><html><head><meta charset="utf-8"><title>Podpis</title></head><body style="margin:0;padding:16px;background:#ffffff;">${html}</body></html>`;
    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = "status-msg " + (type || "");
    if (type === "ok") {
      clearTimeout(showStatus._t);
      showStatus._t = setTimeout(() => {
        statusMsg.textContent = "";
        statusMsg.className = "status-msg";
      }, 6000);
    }
  }

  function resetForm() {
    form.reset();
    Object.values(fields).forEach((el) => (el.dataset.touched = "0"));
    statusMsg.textContent = "";
    statusMsg.className = "status-msg";
    update();
  }

  /* ---------------------------------------------------------
     Event listeners
     --------------------------------------------------------- */
  Object.values(fields).forEach((el) => {
    el.addEventListener("input", () => {
      el.dataset.touched = "1";
      update();
    });
    el.addEventListener("blur", () => {
      el.dataset.touched = "1";
      validate();
    });
  });

  copyBtn.addEventListener("click", copySignature);
  resetBtn.addEventListener("click", resetForm);
  openTabBtn.addEventListener("click", openSignatureInNewTab);

  // Prvotné vykreslenie (ukážkové/placeholder údaje v náhľade)
  update();
  loadLogoAspectRatio();
})();
