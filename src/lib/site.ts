// Javna adresa weba. Dok domena nije prebačena, može se postaviti NEXT_PUBLIC_SITE_URL na Vercelu.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://maraton-ladja.hr").replace(/\/$/, "");
