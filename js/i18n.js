/* =====================================================================
   WWE Travel CY · "Kipar koji poznajemo" · ALL VISIBLE TEXT (EDITABLE)
   ---------------------------------------------------------------------
   One build, two languages. The language comes from the page URL:
     index.html            → Serbian (default)
     index.html?lang=sr    → Serbian
     index.html?lang=en    → English
   Optional: ?cta=/some-page sends the button to https://www.wwe-cy.com/some-page
   (only paths on www.wwe-cy.com are accepted), e.g. ?lang=en&cta=/contact

   Region texts are keyed by the region id from js/data.js.
   Numbers, coordinates, transfer times, photos and map positions stay in
   js/data.js, because they are the same in every language.
   ===================================================================== */
(function () {
  'use strict';

  var CTA_DEFAULT = 'https://www.wwe-cy.com/tailored-program-package-request';   // enquiry page, both languages

  var STRINGS = {

    /* ---------------------------------------------------------------- SR */
    sr: {
      htmlLang: 'sr-Latn',
      docTitle: 'Kipar koji poznajemo · WWE Travel CY',
      metaDescription: 'Kipar, region po region: interaktivna karta regiona, aerodroma i transfera. WWE Travel CY, na Kipru od 1999.',
      eyebrow: 'Destinacija iz prve ruke',
      titleLines: [ 'Kipar,', 'region po region.' ],
      intro: 'Od aerodroma do svih glavnih destinacija na Kipru — organizujemo privatne transfere, smeštaj, izlete i lokalne usluge širom ostrva.',
      meta: [ '05 regiona', '02 aerodroma', 'EN · GR · SR' ],
      mapCaption: 'Kipar: pet regiona, dva međunarodna aerodroma',
      mapTitle: 'Karta Kipra sa pet regiona i aerodromima Larnaka i Pafos',
      legendRegion: 'Region',
      legendAirport: 'Aerodrom',
      north: 'S',
      regionsLabel: 'Regioni Kipra',
      hint: 'Kliknite na region koji vas zanima, ili pratite obilazak ostrva',
      hintAfter: 'Kliknite drugi region za poređenje',
      of: 'od',
      coverKicker: 'Region',
      island: 'Kipar',
      labels: {
        transfer: 'Transfer od aerodroma',
        stay: 'Smeštaj',
        experiences: 'Iskustva',
        idealFor: 'Idealno za'
      },
      /* trust line: plain text, with { to, from, suffix } for a counting number */
      trust: [
        [ 'Na Kipru od ', { to: 1999, from: 1975 }, '.' ],
        [ 'Lokalna podrška na ', { to: 3, from: 0 }, ' jezika: EN · GR · SR' ],
        [ { to: 50, from: 0, suffix: '+' }, ' lokalnih partnera' ]
      ],
      cta: 'Pošaljite upit',
      ctaUrl: CTA_DEFAULT,
      airports: { LCA: 'Aerodrom Larnaka', PFO: 'Aerodrom Pafos' },
      regions: {
        larnaka: {
          name: 'Larnaka',
          short: 'Larnaka',
          tagline: 'Grad palmi i prvi susret sa ostrvom: opušten, autentičan i na korak od aerodroma.',
          stay: 'Gradski i butik hoteli, apartmani uz šetalište, resort hoteli u Larnačkom zalivu',
          experiences: [
            'Šetalište Finikudes i plaža Makenzi',
            'Crkva Svetog Lazara iz IX veka',
            'Slano jezero i flamingosi (zima)',
            'Ronjenje do olupine Zenobia'
          ],
          idealFor: [ 'Parove', 'Porodice', 'Kraće boravke', 'Ronioce' ],
          captions: [ 'Plaža Finikudes, Larnaka', 'More kod Larnake' ]
        },
        'aja-napa-protaras': {
          name: 'Aja Napa & Protaras',
          short: 'Aja Napa',
          tagline: 'Tirkizno more i najlepše plaže ostrva, od živahne Aja Nape do mirnog, porodičnog Protarasa.',
          stay: 'Resort i all-inclusive hoteli na plaži, porodični apartmani, vile sa bazenom',
          experiences: [
            'Plaže Nisi, Makronisos i Fig Tri Bej',
            'Resort hoteli na samoj plaži',
            'Krstarenje brodom uz tirkiznu obalu',
            'Manastir Aja Napa i noćni život'
          ],
          idealFor: [ 'Porodice', 'Mlade i grupe', 'Parove', 'Letovanje' ],
          captions: [ 'Plaža Nisi, Aja Napa', 'Resort hotel na plaži, Aja Napa' ]
        },
        nikozija: {
          name: 'Nikozija',
          short: 'Nikozija',
          tagline: 'Prestonica unutar venecijanskih zidina: muzeji, stari grad i poslovni puls ostrva.',
          stay: 'Poslovni i butik hoteli u centru, seoske kuće u podnožju Trodosa',
          experiences: [
            'Stari grad i ulica Ledra',
            'Kiparski muzej i venecijanske zidine',
            'Planina Trodos i manastir Kikos',
            'Tradicionalna sela i lokalna kuhinja'
          ],
          idealFor: [ 'Poslovna putovanja', 'Kulturne ture', 'Grupe', 'Gradski odmor' ],
          captions: [ 'Venecijanske zidine, Nikozija', 'Ulica Ledra, Nikozija' ]
        },
        limasol: {
          name: 'Limasol',
          short: 'Limasol',
          tagline: 'Kosmopolitski grad na moru: marina, vrhunska gastronomija i vinski putevi u zaleđu.',
          stay: 'Luksuzni hoteli uz more, gradski hoteli, rezidencije u marini, smeštaj u vinskim selima',
          experiences: [
            'Marina i srednjovekovni zamak',
            'Antički Kurion iznad mora',
            'Vinarije i sela na obroncima Trodosa',
            'Gastronomske ture i festival vina'
          ],
          idealFor: [ 'Poslovne skupove', 'Luksuzna putovanja', 'Parove', 'Porodice' ],
          captions: [ 'Limasol, grad na moru', 'Marina Limasol' ]
        },
        pafos: {
          name: 'Pafos',
          short: 'Pafos',
          tagline: 'Grad pod zaštitom UNESKO-a, na obali gde je, kaže mit, iz pene rođena Afrodita.',
          stay: 'Resort i spa hoteli, butik hoteli kod stare luke, vile sa bazenom, agroturizam',
          experiences: [
            'Mozaici Arheološkog parka',
            'Kraljevske grobnice',
            'Afroditina stena',
            'Poluostrvo Akamas i Plava laguna'
          ],
          idealFor: [ 'Parove i medeni mesec', 'Venčanja', 'Porodice', 'Grupe' ],
          captions: [ 'Plaža kod Afroditine stene', 'Stara luka, Pafos' ]
        }
      }
    },

    /* ---------------------------------------------------------------- EN */
    en: {
      htmlLang: 'en',
      docTitle: 'Cyprus, region by region · WWE Travel CY',
      metaDescription: 'Cyprus, region by region: an interactive map of regions, airports and transfers. WWE Travel CY, in Cyprus since 1999.',
      eyebrow: 'Cyprus, first-hand',
      titleLines: [ 'Cyprus,', 'region by region.' ],
      intro: 'From the airports to all major destinations across Cyprus — we arrange private transfers, accommodation, tours and local services throughout the island.',
      meta: [ '05 regions', '02 airports', 'EN · GR · SR' ],
      mapCaption: 'Cyprus: five regions, two international airports',
      mapTitle: 'Map of Cyprus with five regions and the Larnaca and Paphos airports',
      legendRegion: 'Region',
      legendAirport: 'Airport',
      north: 'N',
      regionsLabel: 'Regions of Cyprus',
      hint: 'Click a region that interests you, or follow the island tour',
      hintAfter: 'Click another region to compare',
      of: 'of',
      coverKicker: 'Region',
      island: 'Cyprus',
      labels: {
        transfer: 'Transfer from airport',
        stay: 'Accommodation',
        experiences: 'Experiences',
        idealFor: 'Ideal for'
      },
      trust: [
        [ 'In Cyprus since ', { to: 1999, from: 1975 } ],
        [ 'Local support in ', { to: 3, from: 0 }, ' languages: EN · GR · SR' ],
        [ { to: 50, from: 0, suffix: '+' }, ' local partners' ]
      ],
      cta: 'Send an enquiry',
      ctaUrl: CTA_DEFAULT,
      airports: { LCA: 'Larnaca Airport', PFO: 'Paphos Airport' },
      regions: {
        larnaka: {
          name: 'Larnaca',
          short: 'Larnaca',
          tagline: 'City of palms and the island’s first welcome: relaxed, authentic and minutes from the airport.',
          stay: 'City and boutique hotels, seafront apartments, resort hotels on Larnaca Bay',
          experiences: [
            'Finikoudes promenade and Mackenzie',
            'Church of Saint Lazarus (9th c.)',
            'Salt Lake flamingos (winter)',
            'Diving the Zenobia wreck'
          ],
          idealFor: [ 'Couples', 'Families', 'Short breaks', 'Divers' ],
          captions: [ 'Finikoudes Beach, Larnaca', 'The sea at Larnaca' ]
        },
        'aja-napa-protaras': {
          name: 'Ayia Napa & Protaras',
          short: 'Ayia Napa',
          tagline: 'Turquoise sea and the best beaches, from lively Ayia Napa to calm Protaras.',
          stay: 'Beach resorts, all-inclusive hotels, family apartments, pool villas',
          experiences: [
            'Nissi, Makronissos, Fig Tree Bay',
            'Resorts right on the beach',
            'Boat trips on the turquoise coast',
            'Ayia Napa Monastery, nightlife'
          ],
          idealFor: [ 'Families', 'Friends and groups', 'Couples', 'Summer holidays' ],
          captions: [ 'Nissi Beach, Ayia Napa', 'Beachfront resort, Ayia Napa' ]
        },
        nikozija: {
          name: 'Nicosia',
          short: 'Nicosia',
          tagline: 'The capital within its Venetian walls: museums, the old town and the island’s business heart.',
          stay: 'Business and boutique hotels in the centre, village houses in the Troodos foothills',
          experiences: [
            'Old town and Ledra Street',
            'Cyprus Museum and Venetian walls',
            'Troodos and Kykkos Monastery',
            'Village life and local cuisine'
          ],
          idealFor: [ 'Business travel', 'Cultural tours', 'Groups', 'City breaks' ],
          captions: [ 'Venetian walls, Nicosia', 'Ledra Street, Nicosia' ]
        },
        limasol: {
          name: 'Limassol',
          short: 'Limassol',
          tagline: 'A cosmopolitan city by the sea: marina, fine dining and wine routes in the hills.',
          stay: 'Luxury seafront hotels, city hotels, marina residences, stays in wine villages',
          experiences: [
            'The marina and medieval castle',
            'Ancient Kourion above the sea',
            'Wineries and Troodos hill villages',
            'Food tours and the wine festival'
          ],
          idealFor: [ 'Business events', 'Luxury travel', 'Couples', 'Families' ],
          captions: [ 'Limassol, a city by the sea', 'Limassol Marina' ]
        },
        pafos: {
          name: 'Paphos',
          short: 'Paphos',
          tagline: 'A UNESCO-listed town on the shore where, legend says, Aphrodite rose from the sea foam.',
          stay: 'Resort and spa hotels, boutique hotels by the old harbour, villas with pools, agritourism',
          experiences: [
            'Mosaics of the Archaeological Park',
            'Tombs of the Kings',
            'Aphrodite’s Rock',
            'Akamas and the Blue Lagoon'
          ],
          idealFor: [ 'Couples and honeymooners', 'Weddings', 'Families', 'Groups' ],
          captions: [ 'Beach by Aphrodite’s Rock', 'Old harbour, Paphos' ]
        }
      }
    }
  };

  /* ---------------------------------------------------------------
     Language and CTA from the URL
     --------------------------------------------------------------- */
  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search || '');
    if (!m) return '';
    try { return decodeURIComponent(m[1].replace(/\+/g, ' ')).trim(); } catch (e) { return ''; }
  }

  var requested = param('lang').toLowerCase().slice(0, 2);
  var lang = STRINGS[requested] ? requested : 'sr';
  var t = STRINGS[lang];

  /* ?cta=/path → a page on www.wwe-cy.com (no other domains) */
  var ctaPath = param('cta');
  if (/^\/[A-Za-z0-9\-_\/]*$/.test(ctaPath) && ctaPath.indexOf('//') === -1) {
    t.ctaUrl = 'https://www.wwe-cy.com' + ctaPath;
  }

  /* ---------------------------------------------------------------
     Fill the static markup (elements with data-i18n="key")
     --------------------------------------------------------------- */
  function get(key) {
    return key.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, t);
  }

  function buildTrust(p) {
    p.textContent = '';
    t.trust.forEach(function (parts, n) {
      if (n) {
        var sep = document.createElement('span');
        sep.className = 'trust__sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = '·';
        p.appendChild(sep);
      }
      var item = document.createElement('span');
      item.className = 'trust__item';
      parts.forEach(function (part) {
        if (typeof part === 'string') { item.appendChild(document.createTextNode(part)); return; }
        var b = document.createElement('b');
        b.className = 'count';
        b.setAttribute('data-to', part.to);
        b.setAttribute('data-from', part.from || 0);
        if (part.suffix) b.setAttribute('data-suffix', part.suffix);
        b.textContent = part.to + (part.suffix || '');
        item.appendChild(b);
      });
      p.appendChild(item);
    });
  }

  function apply(doc) {
    doc.documentElement.lang = t.htmlLang;
    doc.title = t.docTitle;
    var md = doc.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t.metaDescription);

    Array.prototype.forEach.call(doc.querySelectorAll('[data-i18n]'), function (node) {
      var v = get(node.getAttribute('data-i18n'));
      if (typeof v === 'string') node.textContent = v;
    });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-i18n-aria]'), function (node) {
      var v = get(node.getAttribute('data-i18n-aria'));
      if (typeof v === 'string') node.setAttribute('aria-label', v);
    });

    var title = doc.getElementById('wwe-title');
    if (title) {
      title.setAttribute('aria-label', t.titleLines.join(' '));
      Array.prototype.forEach.call(title.querySelectorAll('.title__in'), function (line, n) {
        line.textContent = t.titleLines[n] || '';
      });
    }
    var meta = doc.getElementById('head-meta');
    if (meta) {
      meta.textContent = '';
      t.meta.forEach(function (m) {
        var s = doc.createElement('span');
        s.textContent = m;
        meta.appendChild(s);
      });
    }
    var trust = doc.getElementById('trust');
    if (trust) buildTrust(trust);
    var cta = doc.getElementById('cta');
    if (cta) cta.href = t.ctaUrl;
  }

  /* region texts merged into the shared data (data.js) */
  function localizeRegions(regions) {
    regions.forEach(function (r) {
      var tr = t.regions[r.id] || {};
      ['name', 'short', 'tagline', 'stay', 'experiences', 'idealFor'].forEach(function (k) {
        if (tr[k] != null) r[k] = tr[k];
      });
      (r.photos || []).forEach(function (p, n) {
        if (tr.captions && tr.captions[n]) p.caption = tr.captions[n];
      });
    });
  }

  window.WWE_I18N = { lang: lang, t: t, apply: apply, localizeRegions: localizeRegions, strings: STRINGS };
})();
