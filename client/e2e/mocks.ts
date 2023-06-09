// import fallbackTranslations from '../src/assets/translations.json'

export const latestConfig = {
  items: {
    electionConfig: {
      content: {
        locales: ["en", "es"],
        title: {
          en: "Funny Election",
          es: "Elección divertida",
        },
      },
    },
  },
};

export const verificationCodeFound = {};

export const foundBallotStatus = {
  status: "found",
  activities: [
    {
      type: "VoterSessionItem",
      registered_at: "2023-03-14T13:26:54.211Z",
    },
    {
      type: "CastRequestItem",
      registered_at: "2023-03-14T13:26:55.101Z",
    },
  ],
};

export const boardItemsPage1: any = {
  items: [
    {
      address:
        "00dd8a9310e8d572e53fb297e96758ded086f424df7ad63dd9ee5639ce13d281",
      registeredAt: "2023-03-14T14:39:27.137Z",
      type: "AffidavitRejectItem",
    },
    {
      address:
        "fb4a1b2563362666e693e244cb33d081997fc2da922a91f3875459ff23eba115",
      registeredAt: "2023-03-14T14:39:26.137Z",
      type: "AffidavitAcceptItem",
    },
  ],
  meta: {
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 2,
    total_count: 4,
  },
};

export const boardItemsPage2 = {
  items: [
    {
      address:
        "08ade15bc26d1b5466a0dfe9fb5705b75c28e81983876c4ebfab970365b1d019",
      registeredAt: "2023-03-14T14:39:25.137Z",
      type: "VoterSessionItem",
    },
    {
      address:
        "00417ce2677cf340e814bcf6d5d3653957ee216d74ebc402bb018a42bd3f6380",
      registeredAt: "2023-03-14T14:39:24.137Z",
      type: "CastRequestItem",
    },
  ],
  meta: {
    current_page: 2,
    next_page: 2,
    prev_page: 1,
    total_pages: 2,
    total_count: 4,
  },
};

// export const translations = {
//   en: JSON.parse(fallbackTranslations as any),
//   es: {
//     header: {
//       dbas: "Digital Ballot Audit Site",
//       about: "Información",
//       logs: "Registros",
//       help: "Ayuda",
//       contact: "Contacto"
//     }
//   }
// };

export const status = {
  election: {
    id: 2,
    slug: "93b0d474",
    title: {
      en: "Funny Election",
      es: "Elección divertida",
    },
    description: {
      en: "This is an election example, it shows what an election could look like.",
      da: "Dette er et valgeksempel, det viser, hvordan et valg kunne se ud.",
      de: "Dies ist ein Wahlbeispiel, es zeigt, wie eine Wahl aussehen könnte.",
      es: "Esta es una elección de ejemplo, muestra como puede lucir una elección.",
    },
    mode: "demo",
    trustMode: "verifiable",
    enabledLocales: ["en", "da", "de", "es"],
    readyForVoting: true,
    boardSlug: "voting_93b0d474",
    boardUrl: "http://dbb:3003/voting_93b0d474",
    dbasUrl: "http://localhost:3010",
    electionClientUrl: "http://localhost:9080/#/e/voting/93b0d474",
    statisticsClientUrl: "http://localhost:5173/voting/93b0d474",
    hide_dbas: false,
    hideBenaloh: false,
  },
};
