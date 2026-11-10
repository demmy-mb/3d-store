import React, { useEffect, useState } from 'react';
import RudeBoysMuseum from './components/RudeBoysMuseum';
import { createCheckoutUrl, shopifyEnabled } from './shop/shopify';

export default function App() {
  // The museum is the whole site. LandingPage and AtelierShowroom stay in
  // src/components but are deliberately not linked from anywhere.

  // Bag of one-of-one pieces; checkout happens on Shopify
  const [bag, setBag] = useState([]);
  const [toast, setToast] = useState(null);

  const handleAddToBag = (item) => {
    if (bag.some((b) => b.name === item.name)) {
      setToast(`${item.name} is already in your bag`);
      return;
    }
    setBag((prev) => [...prev, item]);
    setToast(`${item.name} added to bag · ${item.price}`);
  };

  const handleCheckout = async () => {
    const variantIds = bag.map((b) => b.variantId).filter(Boolean);
    if (!bag.length) {
      setToast('Your bag is empty');
      return;
    }
    if (!shopifyEnabled || !variantIds.length) {
      setToast('Checkout opens once the Shopify store is connected');
      return;
    }
    try {
      window.location.href = await createCheckoutUrl(variantIds);
    } catch {
      setToast('Checkout could not start. Please try again.');
    }
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <RudeBoysMuseum bagCount={bag.length} onAddToBag={handleAddToBag} onCheckout={handleCheckout} />

      {toast && (
        <div className="bag-toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
