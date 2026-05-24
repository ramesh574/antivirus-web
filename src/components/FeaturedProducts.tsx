'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
}

const featuredData: Record<string, { icon: string; devices: string; price: string; tagline: string }> = {
  'Norton Antivirus': { icon: 'fa-shield-alt', devices: '1 Device', price: '₹1,299/year', tagline: 'Complete protection for your PC' },
  'Kaspersky': { icon: 'fa-lock', devices: '1 Device', price: '₹999/year', tagline: 'Trusted virus removal & protection' },
  'McAfee': { icon: 'fa-user-shield', devices: '5 Devices', price: '₹1,499/year', tagline: 'Protect all your family devices' },
  'Bitdefender': { icon: 'fa-virus-slash', devices: '3 Devices', price: '₹1,099/year', tagline: 'AI-powered threat detection' },
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<AVProduct[]>([]);

  useEffect(() => {
    fetch('/api/antivirus/types')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.filter((p: AVProduct) => p.isActive).slice(0, 4));
        }
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="featured-products" id="products">
      <h1 className="heading">our <span>products</span></h1>
      <div className="featured-products-grid">
        {products.length === 0 ? (
          <div className="products-empty">
            <i className="fas fa-shield-virus"></i>
            <h3>Products loading...</h3>
            <p>Our antivirus plans will appear here shortly.</p>
          </div>
        ) : (
          products.map((product) => {
            const fallbackInfo = featuredData[product.antivirustypeIDP] || {
              icon: 'fa-shield-alt',
              devices: 'Contact us',
              price: 'Contact us',
              tagline: 'Comprehensive security solution',
            };

            const icon = product.icon || fallbackInfo.icon;
            const name = product.name || product.antivirustypeIDP;
            const devices = product.maxDevices ? `${product.maxDevices} Device${product.maxDevices > 1 ? 's' : ''}` : fallbackInfo.devices;
            const price = product.price ? `₹${product.price.toLocaleString()}/${product.validityInMonths ? product.validityInMonths + ' months' : 'year'}` : fallbackInfo.price;
            const tagline = product.description || fallbackInfo.tagline;

            return (
              <div key={product._id} className="featured-product-card av-card">
                <div className="fp-card-img">
                  <div className="av-icon-circle" style={product.image ? { background: 'none' } : {}}>
                    {product.image ? (
                      <img src={product.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <i className={`fas ${icon}`}></i>
                    )}
                  </div>
                </div>
                <div className="fp-card-info">
                  <h3>{name}</h3>
                  <p className="fp-category">{tagline}</p>
                  <div className="av-card-meta">
                    <span><i className="fas fa-laptop"></i> {devices}</span>
                    <span className="fp-current">{price}</span>
                  </div>
                  <Link href="/products" className="btn fp-buy-btn">
                    <i className="fas fa-shopping-cart"></i> Buy Now
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="fp-view-all">
        <Link href="/products" className="btn">
          View All Plans
        </Link>
      </div>
    </section>
  );
}
