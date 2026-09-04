# Swisstransport Email Signature Generator

A small static web tool for SWISS TRANSPORT employees to generate a consistent
HTML email signature. Fill in your name, position, phone, and email, then
copy the signature into your mail client.

## How it works

- `index.html` / `style.css` — the tool's own UI (form and live preview).
- `script.js` — builds the signature as an HTML table with inline styles
  (no external CSS, no flexbox/grid). This is required for the signature to
  render consistently across email clients such as Outlook, Gmail, and Apple
  Mail, which strip `<style>` blocks and modern CSS.
- The signature logo is loaded from a public URL (see `CONFIG.logoUrl` in
  `script.js`) so it displays for recipients regardless of their mail
  client. Its width is computed automatically from the image's real aspect
  ratio, so it is never stretched or squashed.

For Apple Mail specifically, see the (How to add the signature to Apple Mail) instructions inside the tool —
copying from Safari and unchecking "Always match my default message font"
avoids the most common formatting issues.

