const myWindow = globalThis as unknown as {
  __APP_CONFIG__: {
    VITE_LOGO_URL: string;
    VITE_DBB_URL: string;
    VITE_CONFERENCE_URL: string;
    VITE_CONTACT_URL: string;
  };
};

export default {
  dbbUrl: myWindow.__APP_CONFIG__.VITE_DBB_URL || "http://dbb.localhost:3003",
  conferenceUrl:
    myWindow.__APP_CONFIG__.VITE_CONFERENCE_URL ||
    "http://electa.localhost:3016",
};
