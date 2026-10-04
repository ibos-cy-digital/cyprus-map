/* =====================================================================
   WWE Travel CY · "Kipar koji poznajemo" · REGION DATA (EDITABLE)
   ---------------------------------------------------------------------
   The language-independent data: ids, coordinates, transfer times,
   airports, photos, colours and map positions.
   ALL VISIBLE TEXT (names, descriptions, captions, labels) is in
   js/i18n.js, in Serbian and English, keyed by the region id below.

   - Transfer times are APPROXIMATE and must be verified by the owner.
     Enter them in minutes (105 = "1h 45 min"); the section formats them.
   - "route" is the airport the animated flight path starts from.
   - "map" holds the marker position on the island drawing (SVG units,
     the drawing is 1000 × 624). Only change it to move a marker.
   - Photos: see IMAGES below and README.md → "Photos". Their captions
     are in js/i18n.js (regions.<id>.captions, in the same order).
   - "tone" colours the region's cover card (warm gradient behind the
     two postcard photos): [light, middle, deep, hint].
   ===================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     IMAGES
     A photo can be given in two ways:
       1) a full image URL, for example
          'https://images.unsplash.com/photo-1234567890-abcdef?auto=format&fit=crop&w=1400&q=75'
          (on unsplash.com: right-click the photo → "Copy image address")
       2) an Unsplash photo ID, the last part of an unsplash.com/photos/... link,
          for example 'PDoWMD5cy9I'. It loads through Unsplash's own download
          link, which redirects to images.unsplash.com in the requested width.
     3) a local file in assets/photos/, for example 'assets/photos/limasol-marina.webp'
        (lowercase file names, no spaces). This is the most reliable option.
     4) an empty string '' while a photo is still missing.
     If a photo is missing or fails to load, the postcard shows a styled
     warm card with the place name instead, so it never looks empty or broken.

     Postcards should show what clients book: sea, beaches, turquoise water,
     resorts with pools, seaside promenades, old towns. Avoid rocks/cliffs-only,
     abstract architecture and mountains-only shots.
     --------------------------------------------------------------- */
  function photo(src, width) {
    var w = width || 900;
    if (!src) return '';
    if (/^https?:\/\//.test(src) || /[\/.]/.test(src)) return src;   // full URL or local file
    return 'https://unsplash.com/photos/' + src + '/download?force=true&w=' + w;
  }

  /* ---------------------------------------------------------------
     AIRPORTS (plane icons on the map)
     --------------------------------------------------------------- */
  var airports = {
    LCA: { code: 'LCA', map: { x: 560, y: 446 }, label: { dx: -22, dy: 8, anchor: 'end' } },
    PFO: { code: 'PFO', map: { x: 132, y: 520 }, label: { dx: 20, dy: 4, anchor: 'start' } }
  };

  /* ---------------------------------------------------------------
     REGIONS (the order here is the order 01–05)
     --------------------------------------------------------------- */
  var regions = [
    {
      id: 'larnaka',
      coords: '34°55′N · 33°38′E',
      transfer: [ { code: 'LCA', min: 15 }, { code: 'PFO', min: 105 } ],
      route: 'LCA',
      tone: [ '#F7D5BF', '#F09A79', '#E8593C', '#F3B48F' ],      // coral
      photos: [
        // Unsplash: people on the beach at Finikoudes, Larnaka
        { src: photo('PDoWMD5cy9I') },
        // Owner's photo
        { src: photo('assets/photos/larnaka-more.webp') }
      ],
      map: { x: 598, y: 392 }, label: { dx: -22, dy: -12, anchor: 'end' }
    },
    {
      id: 'aja-napa-protaras',
      coords: '34°59′N · 34°00′E',
      transfer: [ { code: 'LCA', min: 40 }, { code: 'PFO', min: 135 } ],
      route: 'LCA',
      tone: [ '#F8D6BE', '#EE9A7C', '#D9694C', '#7CC3BD' ],      // sunset coral, turquoise hint
      photos: [
        // Unsplash (Secret Travel Guide): aerial view of Nissi beach, Ayia Napa
        { src: photo('fmZTiJ64QCw') },
        // Owner's photo
        { src: photo('assets/photos/aja-napa-resort-hotel.webp') }
      ],
      map: { x: 738, y: 372 }, label: { dx: 0, dy: -30, anchor: 'middle' }
    },
    {
      id: 'nikozija',
      coords: '35°10′N · 33°22′E',
      transfer: [ { code: 'LCA', min: 45 }, { code: 'PFO', min: 105 } ],
      route: 'LCA',
      tone: [ '#F3E1C8', '#DDAE84', '#B8693F', '#E9C9A0' ],      // warm sand, terracotta
      photos: [
        // Owner's photos
        { src: photo('assets/photos/nikozija-venecijanske-zidine.jpg') },
        { src: photo('assets/photos/nikozija-ulica-ledra.jpg') }
      ],
      map: { x: 471, y: 292 }, label: { dx: 0, dy: -32, anchor: 'middle' }
    },
    {
      id: 'limasol',
      coords: '34°41′N · 33°02′E',
      transfer: [ { code: 'LCA', min: 50 }, { code: 'PFO', min: 50 } ],
      route: 'PFO',
      tone: [ '#F6CFC4', '#E3837A', '#C24E5A', '#EFA79A' ],      // deep coral to rose
      photos: [
        // Unsplash: Limassol seafront, town next to the water
        { src: photo('JbU8a2dpw3s') },
        // Owner's photo
        { src: photo('assets/photos/limasol-marina.webp') }
      ],
      map: { x: 350, y: 516 }, label: { dx: 0, dy: 50, anchor: 'middle' }
    },
    {
      id: 'pafos',
      coords: '34°46′N · 32°25′E',
      transfer: [ { code: 'PFO', min: 20 }, { code: 'LCA', min: 100 } ],
      route: 'PFO',
      tone: [ '#F0CDB4', '#E7A98C', '#D9785C', '#F2BFA0' ],      // coral (original)
      photos: [
        // Unsplash (Kamil Molendys): beach and sea at Petra tou Romiou, Paphos district
        { src: photo('sFqG1PvlsL8') },
        // Owner's photo
        { src: photo('assets/photos/pafos-stara-luka.webp') }
      ],
      map: { x: 104, y: 460 }, label: { dx: 0, dy: -32, anchor: 'middle' }
    }
  ];

  /* ---------------------------------------------------------------
     SECTION SETTINGS
     --------------------------------------------------------------- */
  var settings = {
    defaultRegion: 'larnaka',   // selected on load
    autoAdvanceMs: 7000         // time per region while nobody has interacted
    // the button text and link are in js/i18n.js (ctaUrl), per language
  };

  window.WWE_SECTION_DATA = { regions: regions, airports: airports, settings: settings };
})();
