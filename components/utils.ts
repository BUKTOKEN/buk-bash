// utils.ts
export const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /android|iphone|ipad|ipod/i.test(userAgent) || (window.innerWidth <= 800 && window.innerHeight <= 600);
  };
  