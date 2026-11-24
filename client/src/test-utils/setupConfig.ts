const typedGlobal = globalThis as unknown as {
  __APP_CONFIG__: {
    VITE_LOGO_URL: string;
    VITE_DBB_URL: string;
    VITE_CONFERENCE_URL: string;
    VITE_CONTACT_URL: string;
  };
};

typedGlobal.__APP_CONFIG__ = {
  VITE_LOGO_URL: "",
  VITE_DBB_URL: "http://dbb.localhost:3003",
  VITE_CONFERENCE_URL: "http://electa.localhost:3016",
  VITE_CONTACT_URL: "",
};
