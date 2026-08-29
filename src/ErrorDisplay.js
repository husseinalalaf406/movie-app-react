import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";

const ErrorDisplay = ({ type = "404", message, onRetry, title }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";

  // Text content dictionary for error types
  const content = {
    "404": {
      title: isRtl ? "تائه في الفراغ السينمائي" : "Lost in the Cinematic Void",
      subtitle: isRtl 
        ? "يبدو أن المشهد الذي تبحث عنه قد تم حذفه في المونتاج النهائي أو لم يكن موجوداً من الأساس." 
        : "The scene you are looking for has been cut from the final edit or never existed in our script.",
      description: isRtl
        ? "الرمز 404 - لم يتم العثور على الصفحة المطلوبة. يرجى التأكد من الرابط أو العودة للشاشة الرئيسية لتصفح أحدث الأفلام."
        : "Error 404 - Page Not Found. Double check the address or return to our curated home screen to discover blockbuster titles.",
      ctaText: isRtl ? "العودة للرئيسية" : "Return to Main Feed",
      action: () => navigate("/"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="error-svg-icon neon-glow-red">
          <defs>
            <linearGradient id="glow-404" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="url(#glow-404)" />
          {/* Ticket styling decoration */}
          <path d="M4.5 12h3M16.5 12h3" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </svg>
      )
    },
    "offline": {
      title: isRtl ? "انقطع البث السينمائي" : "Cinematic Stream Severed",
      subtitle: isRtl
        ? "أنت غير متصل بالإنترنت حالياً. يرجى التحقق من اتصال شبكة الـ Wi-Fi أو البيانات."
        : "Your connection seems to have dropped. Check your Wi-Fi or cellular network to resume streaming.",
      description: isRtl
        ? "محرك البحث والسينما يحتاج إلى اتصال نشط بالإنترنت لتحديث ترشيحات الذكاء الاصطناعي وجلب أحدث الأفلام."
        : "Our curation engine and live TMDB sync require an active connection to fetch details, trailer streams, and assistant completions.",
      ctaText: isRtl ? "إعادة المحاولة" : "Retry Connection",
      action: onRetry || (() => window.location.reload()),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="error-svg-icon neon-glow-amber">
          <defs>
            <linearGradient id="glow-offline" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.5M5 12.5a10.94 10.94 0 015.83-2.84M8.53 16.03a6.97 6.97 0 013.47-.95M12 20a2 2 0 110-4 2 2 0 010 4z" stroke="url(#glow-offline)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    "network": {
      title: isRtl ? "تشويش في الاتصال بالشبكة" : "Transmission Disrupted",
      subtitle: isRtl
        ? "حدث خطأ غير متوقع أثناء محاولة الاتصال بالخادم الرقمي للأفلام."
        : "A communication barrier occurred while fetching the latest reels from our servers.",
      description: isRtl
        ? "قد يكون هذا بسبب ضعف اتصال الإنترنت أو مشكلة مؤقتة في نقل البيانات. انقر أدناه لإعادة إرسال الطلب."
        : "This is usually caused by momentary socket timeouts, packet losses, or request blocks. Try invoking a hard-reload.",
      ctaText: isRtl ? "تحديث الاتصال" : "Retry Request",
      action: onRetry || (() => window.location.reload()),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="error-svg-icon neon-glow-sky">
          <defs>
            <linearGradient id="glow-network" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#glow-network)" />
          <circle cx="12" cy="12" r="11" stroke="url(#glow-network)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      )
    },
    "api": {
      title: isRtl ? "عطل في خادم استوديو الأفلام" : "Studio Access Blocked",
      subtitle: isRtl
        ? "أرجعت قاعدة بيانات الأفلام (TMDB) أو مزود الذكاء الاصطناعي استجابة غير صالحة."
        : "The cinema databases or AI provider returned an unexpected status code response.",
      description: isRtl
        ? "ربما تم تجاوز الحد المسموح به للطلبات، أو خادم الأفلام يخضع للصيانة الدورية حالياً. يرجى المحاولة لاحقاً."
        : "This may stem from invalid environment credentials, temporary server overheads, or provider throttling. Tap reload below.",
      ctaText: isRtl ? "إعادة تحميل الصفحة" : "Reload Studio",
      action: onRetry || (() => window.location.reload()),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="error-svg-icon neon-glow-purple">
          <defs>
            <linearGradient id="glow-api" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="url(#glow-api)" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="url(#glow-api)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  };

  const current = content[type] || content["404"];
  const displayTitle = title || current.title;
  const displaySubtitle = message || current.subtitle;

  return (
    <div className="premium-error-container">
      <div className="premium-error-card">
        {/* Cinematic Scanlines Layer */}
        <div className="premium-error-scanlines" />
        
        {/* Dynamic Glowing Icon Wrapper */}
        <div className={`premium-error-icon-wrapper ${type}-glow-wrapper`}>
          {current.icon}
        </div>

        {/* Text Module */}
        <h2 className="premium-error-title">{displayTitle}</h2>
        <p className="premium-error-subtitle">{displaySubtitle}</p>
        <p className="premium-error-description">{current.description}</p>

        {/* Buttons / CTA Section */}
        <div className="premium-error-cta-group">
          <button onClick={current.action} className="premium-error-btn btn-primary-glow">
            <span className="btn-icon">⚡</span>
            <span className="btn-text">{current.ctaText}</span>
          </button>
          
          {type !== "404" && (
            <Link to="/" className="premium-error-btn btn-secondary-outline">
              <span>{isRtl ? "الذهاب للرئيسية" : "Home Screen"}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
