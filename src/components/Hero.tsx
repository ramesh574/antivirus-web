'use client';
import { useEffect, useState, useRef } from 'react';

const sliders = [
  {
    id: 1,
    image: 'images/home-slide1.jpg',
    heading: 'Complete Virus Protection for Your Devices',
    tagline: 'Stay Safe Online with SecureGuard Antivirus',
    subtext: 'Real-time Protection • Malware Removal • Secure Browsing',
  },
  {
    id: 2,
    image: 'images/home-slide2.jpg',
    heading: 'Protect Your Family from Cyber Threats',
    tagline: 'Trusted by 10,000+ Users Across India',
    subtext: 'Parental Controls • Firewall • Anti-Ransomware',
  },
  {
    id: 3,
    image: 'images/home-slide3.jpg',
    heading: 'Affordable Antivirus Plans for Everyone',
    tagline: 'Plans Starting at Just ₹499/Year',
    subtext: 'Multi-Device Support • Instant License Delivery',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let swiperInstance: any = null;

    const initSwiper = async () => {
      try {
        const Swiper = (await import('swiper')).default;
        const { Autoplay, Navigation, Pagination } = await import('swiper/modules');

        swiperInstance = new Swiper('.home-slider', {
          modules: [Autoplay, Navigation, Pagination],
          autoplay: { delay: 3000, disableOnInteraction: false },
          grabCursor: true,
          loop: true,
          effect: 'fade',
          fadeEffect: { crossFade: true },
          navigation: {
            nextEl: '#hero-next',
            prevEl: '#hero-prev',
          },
          pagination: {
            el: '.hero-slider-pagination',
            clickable: true,
            renderBullet: (_: number, className: string) => `<span class="${className}"></span>`,
          },
          on: {
            slideChange: (s: any) => {
              setCurrentSlide(s.realIndex);
            },
          },
        });

        swiperRef.current = swiperInstance;
      } catch (err) {
        console.error('Swiper init error:', err);
        initialized.current = false;
      }
    };

    initSwiper();

    return () => {
      if (swiperInstance && typeof swiperInstance.destroy === 'function') {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
    };
  }, []);

  return (
    <section className="home" id="home">
      <div className="swiper home-slider">
        <div className="swiper-wrapper">
          {sliders.map((slide, index) => (
            <div
              key={slide.id}
              className={`swiper-slide slide ${currentSlide === index ? 'active' : ''}`}
              style={{
                backgroundImage: `url("${slide.image}")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content-wrapper">
                <div className="hero-badge">
                  <span className="hero-badge-icon"><i className="fas fa-shield-alt"></i></span>
                  <span>Trusted Antivirus Solution • Since 2015</span>
                </div>
                <h3 className="hero-heading">{slide.heading}</h3>
                <div className="hero-tagline">
                  <span className="hero-tagline-text">{slide.tagline}</span>
                </div>
                <p className="hero-subtext">{slide.subtext}</p>
                <div className="hero-cta-group">
                  <a href="/products" className="hero-cta-primary">
                    <span>View Plans</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                  <a href="/contact" className="hero-cta-secondary">
                    <span>Contact Us</span>
                    <i className="fas fa-phone"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="hero-slider-pagination swiper-pagination"></div>

      <div className="hero-scroll-indicator">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel"></div>
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
}
