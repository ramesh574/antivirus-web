'use client';

export default function Footer() {
  return (
    <div className="site-footer">
      <div className="site-footer-inner">
        <span>
          &copy; 2026 SecureGuard Antivirus. All rights reserved. | Created by{' '}
          <a
            href="https://www.linkedin.com/in/ramesh-kumar-7ba5311a5/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ramesh Kumar
          </a>
        </span>
        <span className="site-footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> |{' '}
          <a href="#">Refund Policy</a>
        </span>
      </div>
    </div>
  );
}
