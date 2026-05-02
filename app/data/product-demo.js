export const PRODUCT_DEMO_PAYLOAD = {
  type: 'ProductRecommendation',
  heading: 'Recommended for you',
  products: [
    { id: 'p1', name: 'AirPods Pro 2',  desc: 'Active noise cancellation, adaptive audio',    price: '$249', badge: '⭐ Best Seller', img: '🎧' },
    { id: 'p2', name: 'MagSafe Charger', desc: 'Fast wireless charging for iPhone & AirPods', price: '$39',  badge: '🔥 Top Rated',  img: '🔋' },
    { id: 'p3', name: 'Apple Watch SE', desc: 'Fitness, safety, connectivity on your wrist',  price: '$249', badge: '💎 New',         img: '⌚' },
  ],
};

export const PRODUCT_DEMO_CODE = `// ProductRecommendationComponent.jsx
// ── How data flows to your backend ────────────────────────────────────────
// 1. YOUR BACKEND returns this JSON as the assistant response:
//    { "type": "ProductRecommendation", "heading": "...",
//      "products": [{ id, name, desc, price, badge, img }] }
//    ConvEngine passes it as the \`payload\` prop.
//
// 2. USER clicks "Add to Cart" on a product card.
//
// 3. Your component calls:
//    actions.submit(\`Add AirPods Pro 2 to my cart\`, {
//      action: "add_to_cart",
//      productId: "p1"
//    });
//
// 4. ConvEngine atomically:
//    a) Shows user bubble: "Add AirPods Pro 2 to my cart"
//    b) POSTs to /chat: { text: "...", inputParams: { action: "add_to_cart", productId: "p1" } }
//
// 5. YOUR BACKEND reads inputParams.action === "add_to_cart" and handles it.
// ─────────────────────────────────────────────────────────────────────────

function ProductRecommendationComponent({ payload, actions }) {
  const { heading, products = [] } = payload;

  return (
    <div className="ce-interactive-card">
      <p className="ce-interactive-question">{heading}</p>

      {products.map((p) => (
        <div key={p.id}>
          <span>{p.img}</span>
          <div>
            <p><strong>{p.name}</strong> — {p.price}</p>
            <p>{p.desc}</p>
            {p.badge && <span>{p.badge}</span>}
          </div>
          <button className="ce-interactive-submit"
            onClick={() =>
              actions.submit(\`Add \${p.name} to my cart\`, {
                action: 'add_to_cart',
                productId: p.id,
              })
            }>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export const productRecommendationRenderer = {
  key: 'ProductRecommendation',
  priority: 200,
  match: ({ effectiveType }) => effectiveType === 'ProductRecommendation',
  Component: ProductRecommendationComponent,
};

<ConvEngineChat config={{ renderers: [productRecommendationRenderer] }} />`;
