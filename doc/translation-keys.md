# Translation Keys by Component/View

This document provides a comprehensive list of all translation keys used in the Election Verification Site, organized by component and view.

## Translation System Overview

The project uses Vue I18n for internationalization with the following structure:
- **Main translation file**: `client/src/assets/translations.ts`
- **i18n configuration**: `client/src/lib/i18n.ts`
- **Translation usage**: Components use `$t('key.path')` syntax
- **Supported languages**: English (en), Spanish (es), German (de), Danish (da), and more

## Global Translation Keys

### Accessibility
```typescript
accessibility: {
  skip_to_content: "Skip to main content",
  help: "Help",
  main_navigation: "Main navigation",
  faq_navigation: "FAQ Navigation"
}
```

### Header
```typescript
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
    de: "Auf Deutsch umstellen"
  },
  election_logo_alt: "Election logo"
}
```

### Footer
```typescript
footer: {
  powered_by: "Powered by",
  av_img_alt: "Lumi global logo"
}
```

### Errors
```typescript
errors: {
  go_to_verification: "Go to the verification site",
  verify: {
    invalid_code: {
      title: "Testing code not found",
      description: "Verify you have entered the testing code correctly..."
    }
  },
  track: {
    invalid_code: {
      title: "Tracking code not found", 
      description: "Verify you have entered the tracking code correctly..."
    }
  }
}
```

---

## Views Translation Keys

### Welcome View (`Welcome.vue`)
```typescript
views.welcome: {
  title: "Election Verification Site",
  description: "This site provides overview of the election...",
  splash_alt: "Election splash screen",
  ballot_tester: {
    title: "Test your ballot",
    description: "I am voting and I want to check my choices",
    button: "Test my ballot"
  },
  ballot_tracker: {
    title: "Track your ballot", 
    description: "I have voted and I want to track my ballot",
    button: "Track my ballot"
  },
  about: {
    title: "About this site",
    ballot_tester: "Ballot Tester",
    ballot_tester_text: "Use this tab to independently verify...",
    ballot_tracker: "Ballot Tracker", 
    ballot_tracker_text: "Voters can use this tab to verify...",
    audit_log: "Audit Log",
    audit_log_text: "Election audit log is a representation..."
  }
}
```

### Ballot Verification Landing (`BallotVerificationLanding.vue`)
```typescript
views.verification: {
  title: "Ballot Tester",
  subtitle: "I am voting and I want to",
  subtitle_strong: "check my choices",
  description: "You can check that your choices were recorded correctly...",
  placeholder: "Testing Code",
  button: "Start the Test",
  tooltip_helper: "Where do I find the testing code",
  tooltip_text: "Your testing code is displayed on the voting page.",
  help: {
    title: "How does the ",
    title_strong: "test work?",
    steps: {
      step_1: "<strong>Input your testing code</strong> - Find it on the Voting Page",
      step_2: "<strong>Passkeys</strong> get displayed in both...",
      step_3: "On the voting page click on <strong>\"Does match\" or \"Does not match\"</strong>",
      step_4: "<strong>Your choices are now shown</strong> in the Ballot Tester...",
      step_5: "On the <strong>voting page click</strong> on \"Return to voting\"..."
    },
    footer: "All done!"
  }
}
```

### Ballot Verifier View (`BallotVerifierView.vue`)
```typescript
views.verifier: {
  found: {
    title: "Your ballot has been found!",
    description: "Go back to the voting app and follow the instructions..."
  },
  inprogress: {
    title: "Compare passkeys",
    description: "Does this passkey match the one shown on the voting page?",
    secondary_description: "Proceed to the voting page and check if the passkey is the same...",
    help: {
      title: "What's ",
      title_strong: "next?",
      p1: {
        title: "Go back to the voting page",
        description: "Click on Match / Do not Match button and follow instructions..."
      }
    },
    modal: {
      title: "Your session has expired due to inactivity",
      description: "Please follow instructions on the voting page to restart...",
      button: "Ok",
      labelled_by: "Session expired"
    }
  },
  spoiled: {
    title: "Check the Choices",
    description: "Your Ballot Choices",
    info: "The choices connected to the testing code are displayed below...",
    assigned: "Assigned: ",
    ballot_selection: "Ballot Selection ",
    finish: "Finish the test",
    help: {
      p1: {
        title: "Go back to the voting page",
        description: "Return to voting or abort the process."
      }
    }
  },
  blank_pile: "Blank"
}
```

### Ballot Tracking Landing (`BallotTrackingLanding.vue`)
```typescript
views.tracking: {
  title: "Ballot Tracker",
  subtitle: "I have voted and I want to",
  subtitle_strong: "track my ballot",
  description: "To verify that your ballot was casted and recorded...",
  placeholder: "Tracking code",
  button: "Track my ballot",
  tooltip_helper: "Where do I find my tracking code?",
  tooltip_text: "Your ballot tracking code is displayed on the election page...",
  help: {
    title: "Make sure your vote counts in ",
    title_strong: "2 easy steps",
    steps: {
      step_1: "<strong>Input your tracking code</strong> - Find it on the Voting Page",
      step_2: "Check that <strong>your ballot is registered</strong> in the Digital Ballot Box..."
    }
  }
}
```

### Ballot Tracker View (`BallotTrackerView.vue`)
```typescript
views.tracker: {
  title: "Ballot Tracker",
  info: {
    title: "Ballot Registered",
    description: "Your vote has been registered in digital ballot box.",
    extended_description: "Below you can see all the activity attached to the code..."
  },
  help: {
    title: "What's ",
    title_strong: "next?",
    p1: {
      title: "Congratulations!",
      text1: "You have tracked your ballot and helped to verify...",
      text2: "Now you can sit back and wait until the election results are in."
    },
    p2: {
      title: "Want to know more?",
      text: "You can also read more about why this type of verification..."
    }
  }
}
```

### Logs View (`LogsView.vue`)
```typescript
views.logs: {
  title: "Election Activity Logs",
  subtitle: "Public audit of the election",
  description: "All election activities are listed in this election activity log...",
  download_button: "Download the full election activity log (json)",
  config_only: "Configuration items only",
  hide_pending_items: "Hide pending",
  headers: {
    type: "Activity type",
    type_tooltip: "Type of the activity recorded on Digital Ballot Box",
    time: "Date and time",
    actor: "Actor",
    actor_tooltip: "Source of the activity type"
  },
  help: {
    title: "What are the ",
    title_strong: "logs for?",
    p1: {
      question: "What is an Election Activity log?",
      answer: "The log is visual representation of the Digital Ballot Box..."
    },
    p2: {
      question: "Why do we need one?",
      answer: "Thanks to the log the integrity of the election can be verified..."
    },
    p3: {
      question: "Who is the log for?",
      answer: "For everyone who is interested. Primarily, the log is used by auditors..."
    }
  },
  aria_labels: {
    first_page: "Go to first page",
    prev_page: "Previous page", 
    next_page: "Next page",
    last_page: "Go to last page"
  }
}
```

### Help/FAQ View (`HelpView.vue`)
```typescript
views.faq: {
  title: "Frequently Asked Questions",
  description: "Find answers to your questions and learn how the different parts...",
  navigation: {
    ballot_tester: "Ballot Tester",
    ballot_tracker: "Ballot Tracker",
    logs: "Election Logs",
    other: "Other"
  },
  questions: {
    ballot_tester: {
      q1: {
        title: "How does the Ballot Test work?",
        paragraphs: {
          p1: "The ballot test consists of 5 steps...",
          p2: "The Steps are:",
          p3: "1. Open ballot tester...",
          // ... more paragraphs
        }
      },
      // ... more questions q2-q8
    },
    ballot_tracker: {
      q1: {
        title: "How does the ballot tracking work?",
        paragraphs: {
          p1: "The ballot tracking is very simple...",
          p2: "The tracking code is shown on the voting page..."
        }
      },
      // ... more questions q2-q4
    },
    logs: {
      q1: {
        title: "What is an election activity log?",
        paragraphs: {
          p1: "As in physical voting, you have the ballot box...",
          p2: "In the election activity log you can see all the activities..."
        }
      },
      q2: {
        title: "Who is the election log for?",
        paragraphs: {
          p1: "For anyone, who is interesting in looking through..."
        }
      }
    },
    other: {
      q1: {
        title: "Why is end-to-end verification important?",
        paragraphs: {
          p1: "Soon..."
        }
      },
      // ... more questions q2-q6
    }
  },
  help: {
    title: "Why should I ",
    title_strong: "test and track my ballot?",
    p1: "By testing and tracking your ballot, you gain trust...",
    p2: "By verifying that your ballot was encrypted with the right choices...",
    p3: "Moreover, you also help to verify that the integrity..."
  }
}
```

---

## Components Translation Keys

### Header Component (`Header.vue`)
```typescript
header: {
  dbas: "Election Verification Site",
  verification: "Ballot Tester",
  tracking: "Ballot Tracker",
  logs: "Election Activity Log", 
  help: "FAQ",
  contact: "Contact",
  election_logo_alt: "Election logo"
}

accessibility: {
  main_navigation: "Main navigation"
}
```

### Footer Component (`Footer.vue`)
```typescript
footer: {
  powered_by: "Powered by",
  av_img_alt: "Lumi global logo"
}
```

### Content Layout Component (`ContentLayout.vue`)
```typescript
accessibility: {
  help: "Help"
}

header: {
  election_logo_alt: "Election logo"
}
```

### Board Item Component (`BoardItem.vue`)
```typescript
components.board_item: {
  registered_at: "Timestamp: ",
  identifier: "Short Address: ",
  author: "Actor: ",
  meaning: "What does this mean?",
  expand: "Click to read more",
  collapse: "Click to read less",
  aria_labels: {
    activity_type: "Activity",
    activity_registered: "Activity registered at",
    activity_author: "Activity authored by", 
    activity_identifier: "Activity identifier"
  },
  // ... BoardItem specific types (SegmentsConfigItem, SpoilRequestItem, etc.)
}
```

### Ballot Activity Component (`BallotActivity.vue`)
```typescript
components.ballot_activity: {
  registered_at: "Timestamp: ",
  author: "Actor: ",
  meaning: "What does this mean?",
  // ... Activity specific types (AffidavitRejectItem, SpoilRequestItem, etc.)
}

components.board_item.aria_labels: {
  activity_type: "Activity",
  activity_registered: "Activity registered at",
  activity_author: "Activity authored by"
}
```

### Ballot Activity List Component (`BallotActivityList.vue`)
```typescript
components.ballot_activity_list: {
  type: "Activity type",
  type_tooltip: "Type of the activity recorded on Digital Ballot Box",
  time: "Date and time",
  actor: "Actor",
  actor_tooltip: "Source of the activity type"
}
```

### Tracked Ballot Manager Component (`TrackedBallotManager.vue`)
```typescript
components.tracked_ballot_manager: {
  currently_tracking: "You are currently tracking",
  cancel_cross_label: "Cancel tracking {trackingCode}"
}
```

### Timedown Component (`Timedown.vue`)
```typescript
components.timedown: {
  expire_text: "The passkey will expire in {time}",
  alert: {
    title: "You are running out of time.",
    text: "Please confirm the passkeys match on the voting page..."
  }
}
```

### Drop Down Component (`DropDown.vue`)
```typescript
header.change_locale: {
  label: "Change locale" // Note: This key might need to be added to translations
}
```

---

## Additional Translation Keys

### Locales
```typescript
locales: {
  en: "English",
  de: "Deutsch", 
  da: "Dansk",
  es: "Español"
}
```

### Offline Messages (Component Library)
```typescript
// These are used by the @assemblyvoting/electa-ui component library
components: {
  AVSpinner: {
    loading: "Loading..."
  }
}

accessibility: {
  skip_to_content: "Skip to main content"
}
```

---

## Usage Patterns

### In Vue Components
```vue
<!-- Basic usage -->
{{ $t('views.welcome.title') }}

<!-- With attributes -->
:alt="$t('header.election_logo_alt')"

<!-- With nested keys -->
{{ $t('views.verifier.inprogress.help.title') }}

<!-- With parameters -->
{{ $t('components.timedown.expire_text', { time: '5 minutes' }) }}
```

### In TypeScript/JavaScript
```typescript
import i18n from '@/lib/i18n';

// Access current locale
const currentLocale = i18n.global.locale.value;

// Change locale
i18n.global.locale.value = 'es';
```

---

## Notes for Translators

1. **Key Structure**: Follow the pattern `category.component.property` for consistency
2. **HTML Content**: Some translations contain HTML tags (e.g., `<strong>`) - preserve these in translations
3. **Parameters**: Some keys accept parameters (e.g., `{time}`, `{trackingCode}`) - maintain these placeholders
4. **Context**: Consider the context where each translation is used for accurate meaning
5. **Consistency**: Use consistent terminology across related keys (e.g., "Ballot Tester", "Ballot Tracker")

---

## File Structure Reference

```
client/src/
├── assets/
│   └── translations.ts          # Main translation definitions
├── lib/
│   └── i18n.ts                 # i18n configuration
├── components/                 # Vue components using translations
└── views/                      # Vue views using translations
```

This document serves as a comprehensive reference for all translation keys in the Election Verification Site.
