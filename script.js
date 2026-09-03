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
    logoUrl: "assets/swisstransport-logo.png", // TODO: pred nasadením nahradiť plnou verejnou URL (napr. https://www.swisstransport.eu/podpis/logo.png)
    logoWidth: 108,
    colors: {
      navy: "#0f2438",
      red: "#e2231a",
      grayText: "#5b6470",
      border: "#dfe3e7"
    },
    company: {
      name: "Swisstransport s.r.o.",
      addressLine1: "Na Letisko 2088/15",
      addressLine2: "058 01 Poprad",
      web: "www.swisstransport.eu",
      webUrl: "https://www.swisstransport.eu",
      email: "invoice@swisstransport.eu"
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
    const pozicia = escapeHtml(data.pozicia || "Pozícia");
    const telefon = escapeHtml(data.telefon || "+421 900 000 000");
    const email = escapeHtml(data.email || "meno.priezvisko@swisstransport.eu");

    return `
<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:18px;border-right:3px solid ${c.red};" valign="middle">
      <img src="${CONFIG.logoUrl}" width="${CONFIG.logoWidth}" alt="${escapeHtml(co.name)}" style="display:block;border:0;outline:none;text-decoration:none;">
    </td>
    <td style="padding-left:18px;" valign="middle">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:bold;color:${c.navy};padding-bottom:2px;">${meno}</td>
        </tr>
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:bold;letter-spacing:.4px;text-transform:uppercase;color:${c.red};padding-bottom:9px;">${pozicia}</td>
        </tr>
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:${c.navy};">
            T:&nbsp;<a href="${telHref(data.telefon)}" style="color:${c.navy};text-decoration:none;">${telefon}</a>
          </td>
        </tr>
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:${c.navy};padding-bottom:9px;">
            E:&nbsp;<a href="mailto:${email}" style="color:${c.navy};text-decoration:none;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:17px;color:${c.grayText};border-top:1px solid ${c.border};padding-top:9px;">
            <b style="color:${c.navy};">${escapeHtml(co.name)}</b><br>
            ${escapeHtml(co.addressLine1)}, ${escapeHtml(co.addressLine2)}<br>
            <a href="${co.webUrl}" style="color:${c.red};text-decoration:none;">${escapeHtml(co.web)}</a>
            &nbsp;·&nbsp;
            <a href="mailto:${co.email}" style="color:${c.red};text-decoration:none;">${escapeHtml(co.email)}</a>
          </td>
        </tr>
      </table>
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

  // Prvotné vykreslenie (ukážkové/placeholder údaje v náhľade)
  update();
})();
