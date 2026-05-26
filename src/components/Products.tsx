'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AVProduct {
  _id: string;
  antivirustypeIDP: string;
  name?: string;
  price?: number;
  validityInMonths?: number;
  maxDevices?: number;
  icon?: string;
  features?: string[];
  description?: string;
  isActive: boolean;
  image?: string;
}

export default function Products() {
  const [products, setProducts] = useState<AVProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/antivirus/types')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.filter((p: AVProduct) => p.isActive));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const productDetails: Record<string, { price: string; features: string[]; icon: string; devices: string }> = {
    'Norton Antivirus': { price: '₹1,299/year', devices: '1 Device', features: ['Real-time Protection', 'Password Manager', 'Smart Firewall', '100GB Cloud Backup'], icon: 'fa-shield-alt' },
    'Kaspersky': { price: '₹999/year', devices: '1 Device', features: ['Virus Removal Tool', 'Privacy Cleaner', 'Safe Browsing', 'Multi-Device Support'], icon: 'fa-lock' },
    'McAfee': { price: '₹1,499/year', devices: '5 Devices', features: ['Identity Protection', 'WebAdvisor', 'Encrypted Storage', 'Parental Controls'], icon: 'fa-user-shield' },
    'Bitdefender': { price: '₹1,099/year', devices: '3 Devices', features: ['Advanced Threat Defense', 'Anti-Phishing', 'Battery Mode', 'VPN Included'], icon: 'fa-virus-slash' },
    'Windows Defender': { price: 'Free', devices: 'Windows Only', features: ['Free Basic Protection', 'Windows Integration', 'Firewall Monitor', 'Regular Updates'], icon: 'fa-windows' },
  };

  return (
    <section className="products-section" id="products">
      <div className="container">
        <h1 className="heading">our <span>products</span></h1>

        {loading ? (
          <div className="products-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <i className="fas fa-shield-virus"></i>
            <h3>No products available right now</h3>
            <p>Check back soon for our antivirus plans</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const fallbackDetails = productDetails[product.antivirustypeIDP] || {
                price: 'Contact for pricing',
                devices: 'Contact us',
                features: ['Comprehensive Protection', 'Instant Support'],
                icon: 'fa-shield-alt',
              };
              
              const icon = product.icon || fallbackDetails.icon;
              const name = product.name || product.antivirustypeIDP;
              const devices = product.maxDevices ? `${product.maxDevices} Device${product.maxDevices > 1 ? 's' : ''}` : fallbackDetails.devices;
              const price = product.price ? `₹${product.price.toLocaleString()}/${product.validityInMonths ? product.validityInMonths + ' months' : 'year'}` : fallbackDetails.price;
              const features = (product.features && product.features.length > 0) ? product.features : fallbackDetails.features;

              return (
                <div key={product._id} className="product-card">
                  <div className="product-card-icon" style={product.image ? { background: 'none' } : {}}>
                    {product.image ? (
                      <img src={product.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className={`fas ${icon}`}></i>
                    )}
                  </div>
                  <h3>{name}</h3>
                  <p className="product-devices">{devices}</p>
                  <p className="product-price">{price}</p>
                  <ul className="product-features">
                    {features.map((f, i) => (
                      <li key={i}><i className="fas fa-check"></i> {f}</li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn product-btn">
                    <i className="fas fa-shopping-cart"></i> Buy Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="products-cta">
          <h2>Need a Custom Plan?</h2>
          <p>Contact us for bulk licensing, enterprise solutions, or custom security packages.</p>
          <Link href="/contact" className="btn">
            <i className="fas fa-phone"></i> Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
