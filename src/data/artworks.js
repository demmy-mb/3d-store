/**
 * Local catalogue used until a Shopify store is connected (see src/shop/shopify.js).
 * Shopify products are mapped to this same shape.
 *
 * status: 'available' | 'sold' | 'wip' (work in progress: preview only, not for sale)
 */
const ORIGINALS = [
  {
    id: 'art-01',
    title: 'CHROME REVOLT',
    subtitle: 'RRUDE BOY № 01',
    year: '2026',
    medium: 'Liquid chrome aerosol, industrial lacquer, and oil stick on primed Belgian linen',
    dimensions: '200 × 160 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$24,000 USD',
    description:
      'A ferocious collision of heavy-metal typography and liquid mirror spray. The central jagged chrome insignia pierces through deep carbon blacks, interrogating commercial rebellion in high luxury.',
    accentColor: '#e0e0e0',
  },
  {
    id: 'art-02',
    title: 'ANARCHY IN GOLD',
    subtitle: 'RRUDE BOY № 02',
    year: '2026',
    medium: '24K gold foil leaf, matte spray enamel, and tar drips on circular aluminum board',
    dimensions: '180 × 180 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$28,500 USD',
    description:
      'Hand-gilded street emblems fractured by thick matte asphalt strokes. An aggressive yet royal aesthetic inspired by deconstructed coronation regalia and underground subcultures.',
    accentColor: '#d4af37',
  },
  {
    id: 'art-03',
    title: 'HEAVY METAL SAINTS',
    subtitle: 'RRUDE BOY № 03',
    year: '2026',
    medium: 'Aerosol pigment, screenprint emulsion, and wax crayon on raw canvas',
    dimensions: '210 × 150 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$21,000 USD',
    description:
      'Gothic blackletter forms spray-painted over stark architectural silhouettes. Drips of crimson pigment trace downward like stained glass in a subterranean sanctuary.',
    accentColor: '#b82a24',
  },
  {
    id: 'art-04',
    title: 'TITANIUM RIOT',
    subtitle: 'RRUDE BOY № 04',
    year: '2026',
    medium: 'Brushed titanium dust, acrylic transfer, and charcoal on steel panel',
    dimensions: '190 × 130 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$19,500 USD',
    description:
      'A metallic composition exploring post-industrial tension. Razor-sharp geometric incisions cross hand-scrawled manifestos of sonic youth culture.',
    accentColor: '#4a90e2',
  },
  {
    id: 'art-05',
    title: 'SUBWAY GHOSTS: 03:00 AM',
    subtitle: 'RRUDE BOY № 05',
    year: '2026',
    medium: 'Distressed vinyl wheatpaste, soot pigment, and neon acrylic on heavy canvas',
    dimensions: '200 × 160 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$22,000 USD',
    description:
      'Layered train-yard stencils peeling back to reveal electric cyan and shocking vermilion underpaintings. Captures the ephemeral rush of nighttime tagging.',
    accentColor: '#00d2be',
  },
  {
    id: 'art-06',
    title: 'BARBED VELVET',
    subtitle: 'RRUDE BOY № 06',
    year: '2026',
    medium: 'Textured velvet flocking, chrome marker, and oil bar on distressed linen',
    dimensions: '180 × 140 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$18,500 USD',
    description:
      'Tactile contrast between soft couture velvet and violent barbed-wire geometry. The surface shifts dynamically as gallery spotlights sweep across its nap.',
    accentColor: '#8c2496',
  },
  {
    id: 'art-07',
    title: 'RAW DISPATCH // NO MASTERS',
    subtitle: 'RRUDE BOY № 07',
    year: '2026',
    medium: 'Aerosol stencil, torn billboard paper, and gloss resin on concrete composite',
    dimensions: '220 × 160 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$26,000 USD',
    description:
      'Monumental manifesto typography encased in crystal-clear resin blocks. A tactile archive of the voice of the streets preserved like ancient Roman inscriptions.',
    accentColor: '#f39c12',
  },
  {
    id: 'art-08',
    title: 'CONCRETE HALO: REBEL CUT',
    subtitle: 'RRUDE BOY № 08',
    year: '2026',
    medium: 'Graphite dust, industrial sealant, and gold leaf on primed cotton duck',
    dimensions: '190 × 150 cm',
    artist: 'RRUDE BOY',
    edition: '1 of 1 · Original Masterpiece',
    price: '$20,500 USD',
    description:
      'Garment pattern cut-lines and tailoring measurement grids tagged with golden graffiti crowns. The bridge between bespoke atelier tailoring and raw street culture.',
    accentColor: '#e74c3c',
  },
];

const priceValue = (price) => parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

const WORK_IN_PROGRESS = [
  {
    id: 'wip-01',
    title: 'UNTITLED (DORM TAPES)',
    subtitle: 'ON THE EASEL',
    year: '2026',
    medium: 'Aerosol and oil bar on raw canvas, still being worked',
    dimensions: '120 × 120 cm',
    artist: 'RRUDE BOY',
    edition: 'Work in progress',
    price: 'Not for sale yet',
    description: 'Still on the easel. Blocked-in colour and pencil lines for what comes next. Check back to watch it change.',
    accentColor: '#d90a0a',
  },
  {
    id: 'wip-02',
    title: 'SKETCH: NIGHT YARD',
    subtitle: 'PINNED STUDY',
    year: '2026',
    medium: 'Pencil and marker study',
    dimensions: '60 × 60 cm',
    artist: 'RRUDE BOY',
    edition: 'Work in progress',
    price: 'Not for sale yet',
    description: 'An early study pinned above the desk. Parts of it may end up in a finished piece.',
    accentColor: '#3a6ea5',
  },
];

export const LOCAL_ARTWORKS = [
  ...ORIGINALS.map((art, i) => ({
    ...art,
    pattern: i,
    priceValue: priceValue(art.price),
    // Demo only: one piece shows how a sold work looks
    status: art.id === 'art-05' ? 'sold' : 'available',
  })),
  ...WORK_IN_PROGRESS.map((art, i) => ({ ...art, pattern: i, priceValue: 0, status: 'wip' })),
];
