import { LOCAL_ARTWORKS } from '../data/artworks';

/**
 * Shopify Storefront connection.
 *
 * Set these in a `.env.local` file (see `.env.example`) to load the art from Shopify:
 *   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   VITE_SHOPIFY_STOREFRONT_TOKEN=<public Storefront API access token>
 *
 * Without them the museum shows the local catalogue in src/data/artworks.js.
 *
 * How products become artworks:
 * - Product image            -> the picture on the canvas
 * - Product 3D model (.glb)  -> replaces the flat canvas with the scan
 * - Price                    -> where it hangs (pricier = further back)
 * - Sold out                 -> red sold cross, no buy button
 * - Tag "wip"                -> shown in the studio as a preview, not for sale
 * - Metafields custom.medium, custom.dimensions, custom.year -> the details panel
 */
const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = '2026-04';

export const shopifyEnabled = Boolean(DOMAIN && TOKEN);

const WIP_TAGS = ['wip', 'in-progress', 'work-in-progress'];

const PRODUCTS_QUERY = `
  query Artworks {
    products(first: 100) {
      nodes {
        id
        title
        description
        productType
        tags
        availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url(transform: { maxWidth: 2048 }) }
        media(first: 10) {
          nodes {
            mediaContentType
            ... on Model3d { sources { url format } }
          }
        }
        variants(first: 1) { nodes { id } }
        metafields(identifiers: [
          { namespace: "custom", key: "medium" }
          { namespace: "custom", key: "dimensions" }
          { namespace: "custom", key: "year" }
        ]) { key value }
      }
    }
  }
`;

const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

async function storefront(query, variables) {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify responded ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

function toArtwork(product, index) {
  const tags = product.tags.map((t) => t.toLowerCase());
  const wip = tags.some((t) => WIP_TAGS.includes(t));
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const priceValue = parseFloat(amount);
  const meta = Object.fromEntries(product.metafields.filter(Boolean).map((m) => [m.key, m.value]));
  const model = product.media.nodes
    .find((m) => m.mediaContentType === 'MODEL_3D')
    ?.sources.find((s) => s.format === 'glb');
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(priceValue);

  return {
    id: product.id,
    title: product.title.toUpperCase(),
    subtitle: wip ? 'WORK IN PROGRESS' : product.productType || 'RRUDE BOY',
    year: meta.year ?? '',
    medium: meta.medium ?? '',
    dimensions: meta.dimensions ?? '',
    artist: 'RRUDE BOY',
    edition: wip ? 'Work in progress' : '1 of 1 · Original',
    price: wip ? 'Not for sale yet' : `${price} ${currencyCode}`,
    priceValue,
    description: product.description,
    accentColor: '#d90a0a',
    pattern: index,
    imageUrl: product.featuredImage?.url,
    modelUrl: model?.url,
    status: wip ? 'wip' : product.availableForSale ? 'available' : 'sold',
    variantId: product.variants.nodes[0]?.id,
  };
}

/** Artworks from Shopify when connected, otherwise the local catalogue. */
export async function loadArtworks() {
  if (!shopifyEnabled) return LOCAL_ARTWORKS;
  try {
    const data = await storefront(PRODUCTS_QUERY);
    const artworks = data.products.nodes.map(toArtwork);
    return artworks.length ? artworks : LOCAL_ARTWORKS;
  } catch (err) {
    console.warn('Could not load artworks from Shopify, showing the local catalogue.', err);
    return LOCAL_ARTWORKS;
  }
}

/** Creates a Shopify cart for the given variants and returns its checkout page. */
export async function createCheckoutUrl(variantIds) {
  const data = await storefront(CART_CREATE, {
    lines: variantIds.map((merchandiseId) => ({ merchandiseId, quantity: 1 })),
  });
  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length) throw new Error(userErrors[0].message);
  return cart.checkoutUrl;
}
