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
      dbas: "Election Verification Site",
      verification: "Ballot Tester",
      tracking: "Ballot Tracker",
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
      open_menu_aria_label: "Open menu",
      close_menu_aria_label: "Close menu",
    },
    footer: {
      technology_by: "Technology by",
      av_img_alt: "Assembly Voting Logo",
    },
    components: {
      board_item: {
        registered_at: "Timestamp: ",
        identifier: "Short Address: ",
        author: "Actor: ",
        meaning: "What does this mean?",
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
          encryption_key: "Encryption key: ",
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
        aria_labels: {
          activity_type: "Activity",
          activity_registered: "Activity registered at",
          activity_author: "Activity authored by",
          activity_identifier: "Activity identifier",
        },
      },
      ballot_activity_list: {
        title: "Activity connected to the tracking code",
        type: "Activity type",
        type_tooltip: "Soon...",
        time: "Date and time",
        time_tooltip: "Soon...",
        actor: "Actor",
        actor_tooltip: "Soon...",
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
          details:
            "You have challenged the integrity of the voting system and performed the Ballot test.",
        },
        SessionExpiryItem: {
          type: "Explicit Session Expiry",
          author: "You",
          details: "You have explicitly expired your voter session.",
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
      timedown: {
        expire_text: "The passkey will expire in %{time}",
        alert: {
          title: "You are running out of time.",
          text: "Please confirm the passkeys match on the voting page before your session expires. If your session expires, you will need to re-seal your ballot and start over with a new testing code.",
        },
      },
    },
    views: {
      welcome: {
        title: "Election Verification Site",
        description:
          "This site provides overview of the election, allows voters to follow and verify their ballot and provides a file for the auditors.",
        ballot_tester: {
          title: "Test your ballot",
          description: "I am voting and I want to check my choices",
          button: "Test my ballot",
        },
        ballot_tracker: {
          title: "Track your ballot",
          description: "I have voted and I want to track my ballot",
          button: "Track my ballot",
        },
        about: {
          title: "About this site",
          ballot_tester: "Ballot Tester",
          ballot_tester_text:
            "Lorem ipsum dolor sit amet consectetur. Tortor pulvinar interdum curabitur lorem vitae tellus tincidunt. Et massa fringilla in est sapien. Feugiat neque morbi sed sit vestibulum.",
          ballot_tracker: "Ballot Tracker",
          ballot_tracker_text:
            "Lorem ipsum dolor sit amet consectetur. Tortor pulvinar interdum curabitur lorem vitae tellus tincidunt. Et massa fringilla in est sapien. Feugiat neque morbi sed sit vestibulum.",
          audit_log: "Audit Log",
          audit_log_text:
            "Lorem ipsum dolor sit amet consectetur. Tortor pulvinar interdum curabitur lorem vitae tellus tincidunt. Et massa fringilla in est sapien. Feugiat neque morbi sed sit vestibulum.",
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
      verifier: {
        found: {
          title: "Your ballot has been found!",
          description:
            "Go back to the voting app and follow the instructions there to continue the ballot test.",
        },
        inprogress: {
          title: "Compare passkeys",
          description: "Does this passkey match the one in the voting page?",
          secondary_description:
            "Proceed to the voting page and check if the passkey is the same. If it is the same, confirm it on the voting page. If it differs, please abort the process and report it to the election organiser here.",
          help: {
            title: "What's ",
            title_strong: "next?",
            p1: {
              title: "Go back to the voting page",
              description:
                "Click on Match / Do not Match button and follow instructions on the screen.",
            },
          },
          modal: {
            title: "Your session has expired due to inactivity",
            description:
              "Please follow instructions on the voting page to restart the ballot test again.",
            button: "Ok",
            labelled_by: "Session expired",
          },
        },
        spoiled: {
          title: "Check the Choices",
          description: "Your Ballot Choices",
          info: "The choices connected to the testing code are displayed below. Please check if those are the choices you made. After you check, go back to the voting page and select the option that suits you - confirm that the choices are correct or abort the voting process.",
          assigned: "Assigned: ",
          ballot_selection: "Ballot Selection ",
          finish: "Finish session",
          help: {
            p1: {
              title: "Go back to the voting page",
              description:
                "Confirm that the choices are yours or abort the process.",
            },
          },
        },
        blank_pile: "Blank",
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
      logs: {
        title: "Election Activity Logs",
        subtitle: "Public audit of the election",
        description:
          "All election activities are listed in this election activity log. You can go through it or download the whole activity log.",
        download_button: "Download the full election activity log (json)",
        config_only: "Configuration items only",
        headers: {
          type: "Activity type",
          type_tooltip: "Soon...",
          time: "Date and time",
          time_tooltip: "Soon...",
          actor: "Actor",
          actor_tooltip: "Soon...",
        },
        help: {
          title: "What are the ",
          title_strong: "logs for?",
          p1: {
            question: "What is an Election Activity log?",
            answer:
              "The log is visual representation of the Digital Ballot Box. It records every activity that was performed.",
          },
          p2: {
            question: "Why do we need one?",
            answer:
              "Thanks to the log the integrity of the election can be verified. Verification can be carried out by a voter, when they track their ballot or by auditors who go through the whole log and make sure that everything is as it should be.",
          },
          p3: {
            question: "Who is the log for?",
            answer:
              "For everyone who is interested. Primarily, the log is used by auditors who verify that the election was not tampered with. However, also voters or people who are interested can go through the logs and familiarise themselves with the activity types.",
          },
        },
        aria_labels: {
          first_page: "Go to first page",
          prev_page: "Previous page",
          next_page: "Next page",
          last_page: "Go to last page",
        },
      },
      faq: {
        title: "Frequently Asked Questions",
        description:
          "Find answers to your questions and learn how the different parts of the verification site play together and form easy and secure election environment.",
        navigation: {
          ballot_tester: "Ballot Tester",
          ballot_tracker: "Ballot Tracker",
          logs: "Election Logs",
          other: "Other",
        },
        questions: {
          ballot_tester: {
            q1: {
              title: "How does the Ballot Test work?",
              paragraphs: {
                p1: "The ballot test consists of 5 steps where you get to use both the voting page and the ballot tester. You can do so on the same device with different tabs, different windows or you can use two different devices.",
                p2: "The Steps are:",
                p3: "1. Open ballot tester (the voting page guides to it when you press the button “Test ballot”) and input your testing code.",
                p4: "2. Compare passkeys that are displayed in both ballot tester and on the voting page.",
                p5: "3. If they are the same, you need to click the button “match” on the voting page. If they don’t match, you need to click the button “don’t match” on the voting page. The voting page will then guide you in what to do.",
                p6: "4. If the passkeys matched then you can see your decrypted ballot in the ballot tester. Here you have an opportunity to see the choices that were recorded and check if they are the same ones you chose.",
                p7: "5. Now the final step is to confirm that the choices displayed in the ballot tester are correct. If they are not correct, then indicate that on the voting page.",
                p8: "The ballot test is now complete!",
              },
            },
            q2: {
              title: "Do I have to use two different devices for the test?",
              paragraphs: {
                p1: "The choice is up to you. The purpose of ballot test is to check that the voting page, nor your device is compromised. If you choose to use the same device, you are checking the voting page. If you use a different device you are checking both - the device and the voting page.",
                p2: "So whatever you decide to do, you still are helping ensure the integrity of the election.",
              },
            },
            q3: {
              title: "I cant find my testing code. What do I do?",
              paragraphs: {
                p1: "Go back to the voting page and try to see it there. When you see a button labeled Ballot Test - click it and then your testing code will appear.",
                p2: "Remember, that you can only perform ballot test before submitting your vote.",
              },
            },
            q4: {
              title: "My pairing codes do not match. What should I do?",
              paragraphs: {
                p1: "Go to the voting page and click on “don’t match”. Then the voting app will guide you through the process. You can choose to test again, or to abandon the voting process.",
              },
            },
            q5: {
              title:
                "The decrypted choices do not match the ones I chose. What do I do?",
              paragraphs: {
                p1: "Indicate so on the voting page. The voting page will guide you in what to do next. When the choices do not match, we recommend trying the test again. If they still do not match, then please contact your election organiser and report the issue. Do not submit the vote.",
              },
            },
            q6: {
              title: "Can I perform several tests in a row?",
              paragraphs: {
                p1: "You can perform the test as many times as you want.",
              },
            },
            q7: {
              title:
                "Why do I have to confirm my choices again after performing the test?",
              paragraphs: {
                p1: "Your ballot was decrypted during the test to display the choices. It needs to be encrypted again, therefore you get to see the overview of your choices to ensure those are the ones you want to submit. This new encryption allows for the anonymity to not be broken.",
              },
            },
            q8: {
              title: "Can I submit my ballot from this website?",
              paragraphs: {
                p1: "No, you can not submit your ballot through this website. You have to go back to the voting page and submit it there.",
              },
            },
          },
          ballot_tracker: {
            q1: {
              title: "How does the ballot tracking work?",
              paragraphs: {
                p1: "The ballot tracking is very simple. It is like tracking your shipment. You just open up the ballot tracker and input the tracking code. Maybe add something about how the ballot is located?",
                p2: "The tracking code is shown on the voting page after you submitted your ballot.",
              },
            },
            q2: {
              title: "I cant see my tracking code. Where can I find it?",
              paragraphs: {
                p1: "The tracking code is shown on the voting page after you submitted your ballot. Take a picture of it or write it down somewhere, so you can go back to it whenever you want to.",
                p2: "If you closed down the voting page and you did not stored your tracking code, there is unfortunately not a way to get to it again.",
              },
            },
            q3: {
              title: "My tracking code is not found. What do I do?",
              paragraphs: {
                p1: "First, make sure it is typed in correctly. The code is case sensitive, so check if the characters are spelled exactly as shown.",
                p2: "If after that, you still see an error, try to log in to the voting system and see if you already voted. If you did, contact the election organiser.",
              },
            },
            q4: {
              title:
                "Activity that is shown under my tracking code seems suspicious. Should I be worried?",
              paragraphs: {
                p1: "Activity types can be sometimes very hard to understand. Therefore make sure to read the description of the items. They should help you better understand what the activity actually is.",
                p2: "If you still feel that the activity does look suspicious, contact your election organiser.",
              },
            },
          },
          logs: {
            q1: {
              title: "What is an election activity log?",
              paragraphs: {
                p1: "As in physical voting, you have the ballot box, in the digital election you have digital ballot box that records every activity performed during the election. It does so, to ensure that the election is valid and was not compromised.",
                p2: "In the election activity log you can see all the activities. The log is mainly used by auditors or election scrutineers. But anybody can go in and follow what is happening. It is a public audit of the election.",
              },
            },
            q2: {
              title: "Who is the election log for?",
              paragraphs: {
                p1: "For anyone, who is interesting in looking through what has happened during an election.",
              },
            },
            q3: {
              title: "How do I use the log?",
              paragraphs: {
                p1: "You can use it however you feel like. Maybe you just want to browse around and get to know the activities?",
                p2: "If you are an auditor, you might want to download the log and audit the election that way.",
                p3: "It is up to you how you use it.",
              },
            },
          },
          other: {
            q1: {
              title: "Why is end-to-end verification important?",
              paragraphs: {
                p1: "Soon...",
              },
            },
            q2: {
              title:
                "What role do I, as a voter play in verifying that the election’s integrity is achieved?",
              paragraphs: {
                p1: "Soon...",
              },
            },
            q3: {
              title: "How is my anonymity assured?",
              paragraphs: {
                p1: "Soon...",
              },
            },
            q4: {
              title:
                "What is the difference between end-to-end verifiable voting and black box voting?",
              paragraphs: {
                p1: "Soon...",
              },
            },
            q5: {
              title: "Why is end-to-end verification important?",
              paragraphs: {
                p1: "Soon...",
              },
            },
            q6: {
              title:
                "What role do I, as a voter play in verifying that the election’s integrity is achieved?",
              paragraphs: {
                p1: "You play important role, because you as a voter can perform both the Ballot Test and Ballot Tracking which helps to ensure that the election’s integrity is achieved and that the election is trustworthy.",
              },
            },
          },
        },
        help: {
          title: "Why should I ",
          title_strong: "test and track my ballot?",
          p1: "By testing and tracking your ballot, you gain trust in the digital election. Digital or online voting can sometimes feel foreign and untrustworthy.",
          p2: "By verifying that your ballot was encrypted with the right choices and made it to the digital ballot box you ensure that your vote counts.",
          p3: "Moreover, you also help to verify that the integrity of the election was held.",
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
