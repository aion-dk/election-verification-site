export const fallbackMessages = {
  en: {
    locales: {
      en: "English",
      de: "Deutsch",
      da: "Dansk",
      es: "Español",
    },
    errors: {
      verify: {
        invalid_code: {
          title: "Testing code not found",
          description:
            "The testing code does not exist in this election. Please try the test again, or vote again. If that does not help, please contact the election organizer.",
        },
      },
      track: {
        invalid_code: {
          title: "Tracking code not found",
          description:
            "Please check that the tracking code was entered correctly. The code is case sensitive. If you are checking to make sure your ballot was recorded correctly before submitting, use the ballot test instead. Still having problems? Contact the election organizer.",
        },
      },
    },
    header: {
      dbas: "Ballot Verification Site",
      verification: "Ballot Tester",
      tracking: "Ballot Tracker",
      about: "About",
      logs: "Election Activity Log",
      help: "FAQ",
      contact: "Contact",
      change_locale: {
        en: "Switch to English",
        es: "Cambiar a Español",
        da: "Skift til Dansk",
        de: "Auf Deutsch umstellen",
      },
      election_logo_alt: "Election logo",
    },
    footer: {
      technology_by: "Technology by",
      av_img_alt: "Assembly Voting Logo",
    },
    components: {
      item_identifier: {
        tooltip: "Click to copy",
        copied: "Copied",
      },
      board_item: {
        info: "What does this mean?",
        expand: "Click to read more",
        collapse: "Click to read less",
        SegmentsConfigItem: {
          type: "Segments configured",
          author: "Election Official",
          info: "The election official has configured the segments that is publicized about the voters.",
        },
        SpoilRequestItem: {
          type: "Spoil Request",
          author: "Voter",
          info: "A voter has tested their vote to verify the integrity of the system.",
        },
        SessionExpiryItem: {
          type: "Explicit Session Expiry",
          author: "Voter",
          info: "A session has explicitly been expired.",
        },
        ExtractionDataItem: {
          type: "Extracted votes",
          author: "Election Official",
          info: "Extracted and decrypted votes.",
        },
        ExtractionConfirmationItem: {
          type: "Extraction confirmation",
          author: "Trustees",
          info: "Confirmation item indicating that the Trustees decrypted the votes in the previous extraction intent item.",
        },
        ExtractionIntentItem: {
          type: "Extraction intent",
          author: "Election Official",
          info: "Election official intents to extract and decrypt votes. Following items will confirm if this has happened successfully.",
        },
        AffidavitRejectItem: {
          type: "Rejected affidavit",
          author: "Election Official",
          info: "An affidavit has been rejected",
        },
        AffidavitAcceptItem: {
          type: "Accepted affidavit",
          author: "Election Official",
          info: "An affidavit has been accepted",
        },
        GenesisItem: {
          type: "Genesis item",
          author: "Election Official",
          info: "The election has been created",
        },
        VoterAuthorizationConfigItem: {
          type: "Voter authorization config",
          author: "Election Official",
          info: "Voter authorization has been configured",
        },
        ContestConfigItem: {
          type: "Contest config",
          author: "Election Official",
          info: "Contest information has been updated",
        },
        VotingRoundConfigItem: {
          type: "Voting round config",
          author: "Election Official",
          info: "A voting round has been configured",
        },
        BallotConfigItem: {
          type: "Ballot config",
          author: "Election Official",
          info: "Ballot information has been updated",
        },
        ElectionConfigItem: {
          type: "Election config",
          author: "Election Official",
          info: "The election information has been updated",
        },
        ThresholdConfigItem: {
          type: "Ballot encryption key",
          author: "Trustee",
          info: "Ballot encryption key has been generated",
        },
        CastRequestItem: {
          type: "Ballot cast",
          author: "Voter",
          info: "A ballot has been cast and received",
        },
        VoterSessionItem: {
          type: "Voter session",
          author: "Voter",
          info: "A voter has authenticated",
        },
        BallotCryptogramsItem: {
          type: "Ballot cryptogram",
          author: "Voter",
          info: "Voter and Digital Ballot Box have exchanged cryptographic information establishing trust.",
        },
        BoardEncryptionCommitmentItem: {
          type: "Encryption commitment",
          author: "Digital Ballot Box",
          info: "Voter and Digital Ballot Box have exchanged cryptographic information establishing trust.",
        },
        VoterEncryptionCommitmentItem: {
          type: "Encryption commitment",
          author: "Voter",
          info: "Voter and Digital Ballot Box have exchanged cryptographic information establishing trust.",
        },
      },
      ballot_activity_list: {
        title: "Activity connected to the tracking code",
        type: "Activity type",
        time: "Date and time",
        actor: "Actor",
        identifier: "Identifier",
      },
      ballot_activity: {
        registered_at: "Timestamp: ",
        author: "Actor: ",
        meaning: "What does this mean?",
        AffidavitRejectItem: {
          type: "Affidavit Rejected",
          author: "Election Official",
          details:
            "Your affidavit has been rejected. Please contact your Election Officials office to cure your affidavit.",
        },
        SpoilRequestItem: {
          type: "Spoil Request",
          author: "You",
          info: "You have challenged the integrity of the voting system and performed the Ballot test.",
        },
        SessionExpiryItem: {
          type: "Explicit Session Expiry",
          author: "You",
          info: "You have explicitly expired your voter session.",
        },
        AffidavitAcceptItem: {
          type: "Affidavit Accepted",
          author: "Election Official",
          details:
            "Your affidavit has been accepted. A new item will appear here when it has been extracted for tallying.",
        },
        CastRequestItem: {
          type: "Ballot Cast",
          author: "You",
          details: "Your ballot has been received.",
        },
        VoterSessionItem: {
          type: "Sign in",
          author: "You",
          details: "You have authenticated your self and signed in.",
        },
      },
      tracked_ballot_manager: {
        currently_tracking: "You are currently tracking",
        cancel_cross_label: "Cancel tracking %{trackingCode}",
      },
    },
    views: {
      verifier: {
        inprogress: {
          title: "Compare passkeys",
          description: "Does this passkey match the one in the voting page?",
          info: "Proceed to the voting page and check if the passkey is the same. If it is the same, confirm it on the voting page. If it differs, please abort the process and report it to the election organiser here.",
        },
        spoiled: {
          title: "Check the Choices",
          description: "Your Ballot Choices",
          info: "The choices connected to the testing code are displayed below. Please check if those are the choices you made. After you check, go back to the voting page and select the option that suits you - confirm that the choices are correct or abort the voting process.",
        },
        blank_pile: "Blank",
      },
      help: {
        title: "Frequently Asked Questions",
        info: "Find answers to your questions and learn how the different parts of the verification site play together and form easy and secure election environment.",
      },
      logs: {
        title: "Election Activity Logs",
        description: "Public audit of the election",
        intro:
          "All election activities are listed in this election activity log. You can go through it or download the whole activity log.",
        download_button: "Download the full election activity log (json)",
        config_only: "Configuration items only",
      },
      tracker: {
        title: "Ballot Tracker",
        info: {
          title: "Ballot Registered",
          description: "Your vote has been registered in digital ballot box.",
          extended_description:
            "Below you can see all the activity attached to the code you are tracking. You can learn more about each activity by opening it up and reading the description.",
        },
        help: {
          title: "What's ",
          title_strong: "next?",
          p1: {
            title: "Congratulations!",
            text1:
              "You have tracked your ballot and helped to verify that the election is running correctly.",
            text2:
              "Now you can sit back and wait until the election results are in.",
          },
          p2: {
            title: "Want to know more?",
            text: "You can also read more about why this type of verification is important - know your rights and help us raise the industry standard around the world.",
          },
        },
      },
      welcome: {
        title: "Ballot Verification Site",
        description:
          "This site provides overview of the election, allows voters to follow and verify their ballot and provides a file for the auditors.",
        ballot_tester: {
          title: "Ballot Tester",
          subtitle: "I am voting and I want to",
          subtitle_strong: "check my choices",
          description:
            "To test that your choices were recorded correctly, you need to input the testing code that is shown on the voting page.",
          placeholder: "Testing Code",
          button: "Start the Test",
          tooltip_helper: "Where do I find the testing code",
          tooltip_text:
            "Your testing code is displayed on the voting page after you decided to test your ballot. In case it is not there, go back to the voting page and try to test your ballot again.",
        },
        ballot_tracker: {
          title: "Ballot Tracker",
          subtitle: "I have voted and I want to",
          subtitle_strong: "track my ballot",
          description:
            "To verify that your ballot was casted and is recorded in the Digital Ballot Box, you need to input the tracking code shown on the voting page.",
          placeholder: "Tracking Code",
          button: "Track my ballot",
          tooltip_helper: "I don’t have my tracking code",
          tooltip_text:
            "Your ballot tracking code is displayed on the election page after you submitted your ballot. It is 7 character code.",
        },
      },
      verification: {
        title: "Ballot Tester",
        subtitle: "I am voting and I want to",
        subtitle_strong: "check my choices",
        description:
          "You can check that your choices were recorded correctly. Input the testing code that is shown on the voting page and follow the instructions shown on the screen.",
        placeholder: "Testing Code",
        button: "Start the Test",
        tooltip_helper: "Where do I find the testing code",
        tooltip_text:
          "Your testing code is displayed on the voting page after you decided to test your ballot. In case it is not there, go back to the voting page and try to test your ballot again.",
        help: {
          title: "How does the ",
          title_strong: "test work?",
          steps: {
            step_1:
              "<strong>Input your testing code</strong> - Find it on the Voting Page",
            step_2:
              "<strong>Passkeys</strong> get displayed in both - Voting app and Ballot Tester - check if they <strong>match</strong>",
            step_3:
              "On the voting page click on <strong>“Match” or “Do not match”</strong>",
            step_4:
              "<strong>Your choices are now shown</strong> in the Ballot Tester. Check if they are all correct.",
            step_5:
              "On the <strong>voting page register</strong> if they are your choices or not",
          },
          footer: "All done!",
        },
      },
      tracking: {
        title: "Ballot Tracker",
        subtitle: "I have voted and I want to",
        subtitle_strong: "track my ballot",
        description:
          "To verify that your ballot was casted and recorded in the Digital Ballot Box, you need to input the tracking code showed at the end of the voting process on the voting page.",
        placeholder: "Tracking code",
        button: "Track my ballot",
        tooltip_helper: "Where do I find my tracking code?",
        tooltip_text:
          "Your ballot tracking code is displayed on the election page after you submitted your ballot. It is 7 character code.",
        help: {
          title: "Make sure your vote counts in ",
          title_strong: "2 easy steps",
          steps: {
            step_1:
              "<strong>Input your tracking code</strong> - Find it on the Voting Page",
            step_2:
              "Check that <strong>your ballot is registered</strong> in the Digital Ballot Box",
          },
          bonus: {
            title: "Bonus:",
            description: "See all the activity connected to your tracking code",
            q1: "When did you sign in?",
            q2: "Did you try to test your choices?",
            q3: "How many times?",
          },
        },
      },
    },
  },
  es: {
    header: {
      dbas: "Sitio de verificación",
      verification: "Testeo de Boleta",
      tracking: "Seguimiento de Boleta",
      about: "Ayuda",
      logs: "Registro de la elección",
      help: "Preguntas Frecuentes",
      contact: "Contacto",
      change_locale: {
        en: "Switch to English",
        es: "Cambiar a Español",
        da: "Skift til Dansk",
        de: "Auf Deutsch umstellen",
      },
      election_logo_alt: "Logo de la elección",
    },
  },
};
