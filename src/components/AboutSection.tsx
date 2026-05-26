'use client';
import Link from 'next/link';
import Image from 'next/image';

const aboutData = {
  tagline: 'Welcome to SecureGuard Antivirus',
  heading: 'We Protect Your Digital World',
  description:
    'SecureGuard Antivirus has been a trusted name in cybersecurity since 2015. We provide comprehensive protection against viruses, malware, ransomware, and all emerging cyber threats. Our mission is simple: keep you and your family safe online.',
  image: 'images/about.jpg',
  fullContent:
    'Founded in 2015, SecureGuard Antivirus has grown into one of India\'s most trusted names in cybersecurity. Our journey began with a simple vision: to make world-class virus protection accessible to everyone.\n\nWhat sets us apart is our unwavering commitment to security. Our team of expert security researchers works around the clock to identify and neutralize the latest threats before they can harm your devices. We use advanced AI-powered detection engines that catch even zero-day vulnerabilities.\n\nWe believe in transparent pricing with no hidden costs. Our license keys are delivered instantly via email, and every purchase comes with our 24/7 customer support and a 30-day money-back guarantee.',
  stats: [
    { number: '10+', label: 'Years Experience' },
    { number: '10,000+', label: 'Happy Users' },
    { number: '99.9%', label: 'Threat Detection' },
    { number: '24/7', label: 'Support Available' },
  ],
  whyChooseUs: [
    {
      title: 'Real-Time Protection',
      description: 'Our advanced engine provides 24/7 protection against all known and unknown threats.',
      icon: 'fa-shield-alt',
    },
    {
      title: 'AI-Powered Detection',
      description: 'Machine learning algorithms detect and block zero-day threats instantly.',
      icon: 'fa-brain',
    },
    {
      title: 'Multi-Device Support',
      description: 'Protect all your devices — PC, Mac, Android, and iOS — with one license.',
      icon: 'fa-laptop-mobile',
    },
    {
      title: 'Instant Delivery',
      description: 'Receive your license key via email within minutes of purchase.',
      icon: 'fa-bolt',
    },
  ],
};

interface AboutSectionProps {
  standalone?: boolean;
}

export default function AboutSection({ standalone = false }: AboutSectionProps) {
  const paragraphs = aboutData.fullContent.split('\n').map((p, i) => <p key={i}>{p}</p>);

  if (standalone) {
    return (
      <div className="about-section-full">
        <div className="about-full-hero">
          <div className="about-full-image">
            <Image src="/images/about.jpg" alt="About SecureGuard Antivirus" width={600} height={400} />
            <div className="about-full-image-overlay" />
          </div>
          <div className="about-full-intro">
            <p className="about-full-tagline">{aboutData.tagline}</p>
            <h1>{aboutData.heading}</h1>
            <p className="about-full-desc">{aboutData.description}</p>
          </div>
        </div>

        <div className="about-full-story">
          <div className="about-full-story-label">
            <span className="about-label-line" />
            <span>Our Story</span>
          </div>
          <div className="about-full-story-content">{paragraphs}</div>
        </div>

        <div className="about-full-stats">
          {aboutData.stats.map((stat, i) => (
            <div key={i} className="about-full-stat">
              <span className="about-full-stat-number">{stat.number}</span>
              <span className="about-full-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="about-full-why">
          <div className="about-full-section-header">
            <h2>Why Choose <span>Us</span></h2>
          </div>
          <div className="about-full-why-grid">
            {aboutData.whyChooseUs.map((item, i) => (
              <div key={i} className="about-full-why-item">
                <div className="about-full-why-icon">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="about" id="about">
      <h1 className="heading"> <span>about</span> us</h1>
      <div className="row">
        <div className="image">
          <Image src="/images/about.jpg" alt="About SecureGuard" width={600} height={400} />
        </div>
        <div className="content">
          <span>{aboutData.tagline}</span>
          <h3>{aboutData.heading}</h3>
          <p>{aboutData.description}</p>
          <Link href="/about" className="btn">read more</Link>
        </div>
      </div>
    </section>
  );
}
