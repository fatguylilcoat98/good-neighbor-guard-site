/* The Good Neighbor Guard — central site configuration.
 * SINGLE SOURCE OF TRUTH for contact addresses and external links.
 * Nothing else in the site should hard-code an email address.
 *
 * EMAILS:
 *   Set `active:true` only for an inbox that ACTUALLY receives mail today.
 *   Any address with active:false is treated as not-yet-configured: the site
 *   will NOT publish it, and contact UI falls back to CONTACT.primary.
 *   >>> Chris: flip these to active:true (and confirm the address) once the
 *       business inboxes are set up. Do not publish a dead address. <<<
 */
window.GNG = {
  brand: "The Good Neighbor Guard",
  builder: "Chris Hughes",
  location: "Sacramento, CA",
  domain: "https://thegoodneighborguard.com",

  // The address that works TODAY. Used as the universal fallback.
  contactPrimary: { label: "Email", address: "christopher.hughes@thegoodneighborguard.com", active: true },

  // Business-domain inboxes. active:false => placeholder, NOT published yet.
  emails: {
    general:      { address: "chris@thegoodneighborguard.com",        active: false },
    partnerships: { address: "partnerships@thegoodneighborguard.com", active: false },
    acquisition:  { address: "partnerships@thegoodneighborguard.com", active: false },
    legal:        { address: "legal@thegoodneighborguard.com",        active: false },
    privacy:      { address: "privacy@thegoodneighborguard.com",      active: false },
    security:     { address: "security@thegoodneighborguard.com",     active: false }
  },

  social: {
    youtube:  "https://www.youtube.com/@TheGoodNeighborGuard",
    tiktok:   "https://www.tiktok.com/@stangman98",
    x:        "https://x.com/fatguylilcoat98",
    linkedin: "https://www.linkedin.com/in/chris-hughes-a2903a3b5"
  },

  projects: {
    lylo:    "https://mylylo.pro",
    aubs:    "https://aubs.thegoodneighborguard.com/local/",
    roztord: "https://roztord.thegoodneighborguard.com/"
  },

  // Resolve an email key to a working mailto, falling back to the primary
  // address when the business inbox isn't live yet. Returns {address, mailto}.
  mailto: function (key, subject) {
    var e = this.emails[key];
    var addr = (e && e.active) ? e.address : this.contactPrimary.address;
    var s = subject ? ("?subject=" + encodeURIComponent(subject)) : "";
    return { address: addr, href: "mailto:" + addr + s };
  }
};
