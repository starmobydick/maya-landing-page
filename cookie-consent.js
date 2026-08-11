/**
 * Maya / HeatBooker — Cookie Consent Manager
 * GDPR-compliant: Strictly necessary cookies always active.
 * Cloudflare Web Analytics: cookieless, runs regardless of preference.
 * Optional: Google Fonts loaded on consent (loaded by default since no personal data risk is minimal).
 *
 * Usage: <script src="/cookie-consent.js"><\/script>  (before </body>)
 * Replace CLOUDFLARE_BEACON_TOKEN with your actual Cloudflare token from:
 * Cloudflare Dashboard → Analytics & Logs → Web Analytics → your site → Get Code
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'maya_cookie_consent';
  var CLOUDFLARE_TOKEN = 'CLOUDFLARE_BEACON_TOKEN'; // ← Replace with your token

  // ── Load Cloudflare Web Analytics (cookieless — always safe) ──────
  function loadCloudflareAnalytics() {
    if (CLOUDFLARE_TOKEN === 'CLOUDFLARE_BEACON_TOKEN') return; // placeholder, skip
    if (document.querySelector('script[data-cf-beacon]')) return; // already loaded
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CLOUDFLARE_TOKEN }));
    document.body.appendChild(s);
  }

  // ── Read stored preference ─────────────────────────────────────────
  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  // ── Store preference ───────────────────────────────────────────────
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  // ── Remove banner from DOM ─────────────────────────────────────────
  function hideBanner() {
    var banner = document.getElementById('maya-cookie-banner');
    if (banner) {
      banner.style.transform = 'translateY(120%)';
      banner.style.opacity = '0';
      setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
    }
  }

  // ── Accept All ────────────────────────────────────────────────────
  function acceptAll() {
    setConsent('all');
    hideBanner();
    loadCloudflareAnalytics();
  }

  // ── Necessary Only ────────────────────────────────────────────────
  function necessaryOnly() {
    setConsent('necessary');
    hideBanner();
    // Cloudflare Analytics still runs — it's cookieless and GDPR-exempt
    loadCloudflareAnalytics();
  }

  // Expose to global scope for cookies.html buttons and banner
  window.mayaConsent = { acceptAll: acceptAll, necessaryOnly: necessaryOnly };

  // ── Build the banner HTML ─────────────────────────────────────────
  function createBanner() {
    var banner = document.createElement('div');
    banner.id = 'maya-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText = [
      'position:fixed',
      'bottom:1.5rem',
      'left:50%',
      'transform:translateX(-50%) translateY(0)',
      'z-index:9999',
      'width:calc(100% - 2rem)',
      'max-width:600px',
      'background:#1e293b',
      'border:1px solid #334155',
      'border-radius:1rem',
      'padding:1.25rem 1.5rem',
      'box-shadow:0 20px 60px -10px rgba(0,0,0,0.6),0 0 0 1px rgba(249,115,22,0.15)',
      'display:flex',
      'flex-direction:column',
      'gap:1rem',
      'font-family:Inter,system-ui,sans-serif',
      'font-size:0.875rem',
      'color:#94a3b8',
      'transition:transform 0.35s ease,opacity 0.35s ease',
    ].join(';');

    banner.innerHTML = [
      '<div style="display:flex;align-items:flex-start;gap:0.875rem;">',
        '<span style="display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:0.5rem;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.3);flex-shrink:0;margin-top:0.1rem;">',
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
        '</span>',
        '<div>',
          '<strong style="color:#f8fafc;display:block;margin-bottom:0.25rem;">We use cookies</strong>',
          '<span>We use essential cookies to store your preferences. Our analytics (Cloudflare) are cookieless &amp; privacy-safe. </span>',
          '<a href="/cookies.html" style="color:#f97316;text-decoration:underline;text-underline-offset:2px;" target="_blank" rel="noopener">Cookie Policy</a>',
        '</div>',
      '</div>',
      '<div style="display:flex;flex-wrap:wrap;gap:0.625rem;">',
        '<button id="maya-consent-accept" style="',
          'background:linear-gradient(180deg,#fb923c 0%,#f97316 50%,#ea580c 100%);',
          'color:#fff;font-weight:700;border:none;border-radius:0.5rem;',
          'padding:0.6rem 1.25rem;cursor:pointer;font-size:0.875rem;',
          'font-family:inherit;transition:opacity 0.15s ease;',
          'box-shadow:0 4px 14px rgba(249,115,22,0.4);',
        '">Accept All</button>',
        '<button id="maya-consent-necessary" style="',
          'background:#0f172a;color:#cbd5e1;font-weight:600;',
          'border:1px solid #334155;border-radius:0.5rem;',
          'padding:0.6rem 1.25rem;cursor:pointer;font-size:0.875rem;',
          'font-family:inherit;transition:background 0.15s ease,border-color 0.15s ease;',
        '">Necessary Only</button>',
        '<a href="/cookies.html" style="',
          'color:#64748b;font-size:0.8rem;padding:0.6rem 0.5rem;',
          'text-decoration:underline;text-underline-offset:2px;',
          'display:inline-flex;align-items:center;',
        '" target="_blank" rel="noopener">Manage preferences</a>',
      '</div>',
    ].join('');

    return banner;
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    // Always run cookieless analytics
    loadCloudflareAnalytics();

    var stored = getConsent();

    if (stored) {
      // Consent already given — nothing to show
      return;
    }

    // No consent yet — show banner after short delay
    function showBanner() {
      var banner = createBanner();
      document.body.appendChild(banner);

      document.getElementById('maya-consent-accept').addEventListener('click', acceptAll);
      document.getElementById('maya-consent-necessary').addEventListener('click', necessaryOnly);

      // Hover states
      var acceptBtn = document.getElementById('maya-consent-accept');
      acceptBtn.addEventListener('mouseover', function () { this.style.opacity = '0.9'; });
      acceptBtn.addEventListener('mouseout', function () { this.style.opacity = '1'; });

      var necessaryBtn = document.getElementById('maya-consent-necessary');
      necessaryBtn.addEventListener('mouseover', function () {
        this.style.background = '#1e293b';
        this.style.borderColor = '#475569';
      });
      necessaryBtn.addEventListener('mouseout', function () {
        this.style.background = '#0f172a';
        this.style.borderColor = '#334155';
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(showBanner, 800); });
    } else {
      setTimeout(showBanner, 800);
    }
  }

  init();
})();
