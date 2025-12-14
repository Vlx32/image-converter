export const AdBanner = () => {
  const isProduction = false;
  
  return (
    <div className="ad-banner">
      <div className="ad-content">
        {isProduction ? (
          <div id="yandex_rtb_demo"></div>
        ) : (
          <div className="ad-placeholder">
            <p className="ad-label">📢 Место для рекламы</p>
            <p className="ad-note">Временная заглушка</p>
          </div>
        )}
      </div>
    </div>
  );
};
