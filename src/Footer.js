import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const currentLang = i18n.language === "ar" ? "ar" : "en";

  // Local translations for Footer specific texts
  const footerTranslations = {
    en: {
      aboutText: "Your premium gateway to the cinematic universe. Discover blockbusters, television masterworks, and curated indies tailored specifically to your taste with our advanced AI recommendation engine.",
      newsletterTitle: "Cinematic Dispatch",
      newsletterSubtitle: "Subscribe to receive weekly curated releases, hidden gems, and premier content directly to your inbox.",
      subscribeBtn: "Subscribe",
      subscribeSuccess: "Welcome to the cinema club! Check your inbox soon. ✨",
      subscribeError: "Please enter a valid email address.",
      emailPlaceholder: "Enter your email address...",
      quickLinks: "Quick Navigation",
      categories: "Popular Genres",
      legal: "Legal & Support",
      contactUs: "Contact Support",
      contactText: "Have questions or feedback? Connect with our global support team 24/7.",
      contactEmail: "support@netmovies.io",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      allRightsReserved: "All rights reserved.",
      followUs: "Follow the Story",
      privacyTitle: "Privacy Policy",
      privacyContent: "At NetMovies, your privacy is paramount. We only store locally saved movie preferences and history on your device (using secure localStorage). No personal data or streaming analytics are tracked or shared with third parties. By using our AI recommendation engine, no search logs are permanently stored on our servers.",
      termsTitle: "Terms of Service",
      termsContent: "Welcome to NetMovies. By accessing our platform, you agree to comply with our standards of fair use. Content metadata and media resources are retrieved via the TMDB API and should not be used for commercial unauthorized distribution. The AI Movie Assistant is powered by OpenRouter and is provided on an 'as-is' basis for recreational purposes.",
      closeBtn: "Close"
    },
    ar: {
      aboutText: "بوابتك الفريدة إلى عالم السينما الساحر. اكتشف أحدث الأفلام، وروائع المسلسلات التلفزيونية، والأعمال المستقلة المختارة بعناية لتناسب ذوقك الخاص عبر محرك التوصيات الذكي.",
      newsletterTitle: "النشرة السينمائية",
      newsletterSubtitle: "اشترك معنا لتلقي قوائم أسبوعية منسقة، وجواهر خفية، وأحدث العروض الحصرية مباشرة إلى بريدك الإلكتروني.",
      subscribeBtn: "اشترك الآن",
      subscribeSuccess: "أهلاً بك في نادي السينما! تحقق من بريدك الإلكتروني قريباً. ✨",
      subscribeError: "يرجى إدخال بريد إلكتروني صحيح.",
      emailPlaceholder: "أدخل بريدك الإلكتروني هنا...",
      quickLinks: "روابط سريعة",
      categories: "التصنيفات الشائعة",
      legal: "القانونية والدعم",
      contactUs: "الاتصال بالدعم",
      contactText: "هل لديك أي استفسارات أو ملاحظات؟ تواصل مع فريق الدعم العالمي لدينا على مدار الساعة عبر البريد الإلكتروني.",
      contactEmail: "support@netmovies.io",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      contact: "اتصل بنا",
      allRightsReserved: "جميع الحقوق محفوظة.",
      followUs: "تابعنا على",
      privacyTitle: "سياسة الخصوصية",
      privacyContent: "في نت موفيز، خصوصيتك هي أولويتنا القصوى. نقوم فقط بحفظ تفضيلات الأفلام وسجل التصفح محلياً على جهازك (باستخدام التخزين المحلي الآمن). لا يتم تتبع أي بيانات شخصية أو مشاركتها مع أطراف ثالثة. عند استخدام مساعد الذكاء الاصطناعي، لا يتم تخزين سجلات البحث بشكل دائم على خوادمنا.",
      termsTitle: "شروط الخدمة",
      termsContent: "أهلاً بك في نت موفيز. باستخدامك لمنصتنا، فإنك توافق على الالتزام بمعايير الاستخدام العادل. يتم استرداد بيانات الأفلام والملصقات عبر واجهة TMDB البرمجية ويجب عدم استخدامها للتوزيع التجاري غير المصرح به. يتم تشغيل المساعد الذكي لنت موفيز عبر OpenRouter ويُقدم للأغراض الترفيهية فقط.",
      closeBtn: "إغلاق"
    }
  };

  const strings = footerTranslations[currentLang];

  // Interactive Newsletter State
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State for Legal Links
  const [activeModal, setActiveModal] = useState(null); // 'privacy', 'terms', 'contact'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || email.length < 5) {
      setSubStatus({
        type: "error",
        message: strings.subscribeError
      });
      return;
    }

    setIsSubmitting(true);
    setSubStatus({ type: "", message: "" });

    // Simulate seamless API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubStatus({
        type: "success",
        message: strings.subscribeSuccess
      });
      setEmail("");
    }, 1000);
  };

  return (
    <footer className="premium-footer" id="main-application-footer">
      <div className="footer-glass-background"></div>
      
      <div className="footer-container">
        {/* TOP SECTION: Logo, About & Newsletter */}
        <div className="footer-grid-top">
          {/* Brand Info */}
          <div className="footer-brand-column">
            <Link to="/" className="footer-logo">
              {t("logo") || "NetMovies"}
            </Link>
            <p className="footer-about-text">
              {strings.aboutText}
            </p>
            
            {/* Social Media Links */}
            <div className="footer-socials-block">
              <span className="socials-label">{strings.followUs}:</span>
              <div className="socials-icons-row">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn facebook" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn youtube" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn github" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="footer-newsletter-column">
            <h3 className="newsletter-heading">✨ {strings.newsletterTitle}</h3>
            <p className="newsletter-description">
              {strings.newsletterSubtitle}
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={strings.emailPlaceholder}
                  className="newsletter-email-input"
                  aria-label="Newsletter email subscription"
                />
                <button 
                  type="submit" 
                  className={`newsletter-submit-btn ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="newsletter-spinner"></span>
                  ) : (
                    strings.subscribeBtn
                  )}
                </button>
              </div>
              {subStatus.message && (
                <div className={`newsletter-status-feedback ${subStatus.type}`}>
                  {subStatus.type === "success" ? "✅" : "⚠️"} {subStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* MIDDLE SECTION: Navigation Links */}
        <div className="footer-grid-middle">
          {/* Quick Navigation Column */}
          <div className="footer-links-group">
            <h4 className="links-group-title">{strings.quickLinks}</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-nav-link">
                  {t("home") || "Home"}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="footer-nav-link">
                  {t("favorites") || "Favorites"}
                </Link>
              </li>
              <li>
                <Link to="/trending" className="footer-nav-link">
                  {t("trending") || "Trending"}
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="footer-nav-link">
                  {t("topRated") || "Top Rated"}
                </Link>
              </li>
              <li>
                <Link to="/upcoming" className="footer-nav-link">
                  {t("upcoming") || "Upcoming"}
                </Link>
              </li>
              <li>
                <Link to="/now-playing" className="footer-nav-link">
                  {t("nowPlaying") || "Now Playing"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Genres Column */}
          <div className="footer-links-group">
            <h4 className="links-group-title">{strings.categories}</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/ActionMovies" className="footer-nav-link">
                  {t("action") || "Action"}
                </Link>
              </li>
              <li>
                <Link to="/ComedyMovies" className="footer-nav-link">
                  {t("comedy") || "Comedy"}
                </Link>
              </li>
              <li>
                <Link to="/kids" className="footer-nav-link">
                  {t("kids") || "Kids & Family"}
                </Link>
              </li>
              <li>
                <Link to="/tv" className="footer-nav-link">
                  {t("tvShows") || "TV Shows"}
                </Link>
              </li>
              <li>
                <Link to="/Interests" className="footer-nav-link">
                  {t("interests") || "Interests"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Secondary Column */}
          <div className="footer-links-group">
            <h4 className="links-group-title">{strings.legal}</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => setActiveModal("privacy")} className="footer-text-button-link">
                  {strings.privacy}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("terms")} className="footer-text-button-link">
                  {strings.terms}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveModal("contact")} className="footer-text-button-link">
                  {strings.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Support Block */}
          <div className="footer-links-group contact-support-card">
            <h4 className="links-group-title">{strings.contactUs}</h4>
            <p className="contact-card-text">
              {strings.contactText}
            </p>
            <a href={`mailto:${strings.contactEmail}`} className="contact-mail-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mail-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{strings.contactEmail}</span>
            </a>
          </div>
        </div>

        <hr className="footer-divider-thin" />

        {/* BOTTOM SECTION: Copyright & Legal Badges */}
        <div className="footer-grid-bottom">
          <p className="footer-copyright-text">
            &copy; {new Date().getFullYear()} {t("logo") || "NetMovies"}. {strings.allRightsReserved}
          </p>
          <div className="footer-legal-badges">
            <span className="badge-item">100% Secure</span>
            <span className="badge-item">TMDB API Verified</span>
            <span className="badge-item">AI Personalization</span>
          </div>
        </div>
      </div>

      {/* POPUP LEGAL MODALS (State-based, beautiful dark blur glass overlays) */}
      {activeModal && (
        <div className="footer-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="footer-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setActiveModal(null)} className="footer-modal-close-btn" aria-label="Close modal">
              ✕
            </button>
            
            {activeModal === "privacy" && (
              <>
                <h3 className="modal-title">{strings.privacyTitle}</h3>
                <div className="modal-content">
                  <p>{strings.privacyContent}</p>
                </div>
              </>
            )}

            {activeModal === "terms" && (
              <>
                <h3 className="modal-title">{strings.termsTitle}</h3>
                <div className="modal-content">
                  <p>{strings.termsContent}</p>
                </div>
              </>
            )}

            {activeModal === "contact" && (
              <>
                <h3 className="modal-title">{strings.contact}</h3>
                <div className="modal-content">
                  <p>{strings.contactText}</p>
                  <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
                    <a href={`mailto:${strings.contactEmail}`} className="contact-mail-link highlighted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mail-icon">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>{strings.contactEmail}</span>
                    </a>
                  </div>
                </div>
              </>
            )}

            <button type="button" onClick={() => setActiveModal(null)} className="footer-modal-bottom-close">
              {strings.closeBtn}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
