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

export const rejectedBallotStatus = {
  status: "rejected",
  activities: [
    {
      type: "VoterSessionItem",
      registered_at: "2023-03-14T13:26:54.211Z",
    },
    {
      type: "CastRequestItem",
      registered_at: "2023-03-14T13:26:55.101Z",
    },
    {
      type: "AffidavitRejectItem",
      registered_at: "2023-03-14T13:26:56.101Z",
    },
  ],
};

export const boardItemsPage1 = {
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
