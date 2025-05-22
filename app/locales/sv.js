export default {
  loading: '(Laddar)',
  aboutPages: {
    missingContent: {
      education: 'Det finns inga utbildningsresurser för det här projektet ännu.',
      faq: 'Det finns inga vanliga frågor för det här projektet ännu.',
      research: 'Det här projektet har inget vetenskapligt fall ännu.',
      results: 'Det här projektet har inga resultat att rapportera ännu.',
      team: 'Det här projektet har ingen information om teamet.'
    }
  },
  classifier: {
    back: 'Tillbaka',
    backButtonWarning: 'Om du går tillbaka sparas inte ditt arbete med den aktuella uppgiften.',
    close: 'Stäng',
    continue: 'Fortsätt',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Klart',
    doneAndTalk: 'Klart & diskutera',
    dontShowMinicourse: 'Visa inte snabbkursen igen',
    letsGo: 'Då kör vi!',
    next: 'Nästa',
    optOut: 'Avvisa',
    taskTabs: {
      taskTab: 'Uppgift',
      tutorialTab: 'Snabbkurs'
    },
    recents: 'Dina senaste klassificeringar',
    talk: 'Prata',
    taskHelpButton: 'Behöver du hjälp med den här uppgiften?',
    miniCourseButton: 'Starta om snabbkursen för projektet',
    workflowAssignmentDialog: {
      promotionMessage: 'Grattis! Du har låst upp nästa arbetsflöde. Om du hellre vill fortsätta med detta arbetsflöde kan du välja att stanna kvar.',
      acceptButton: 'Ta mig till nästa nivå!',
      declineButton: 'Nej tack'
    },
    interventions: {
      optOut: 'Visa inte fler meddelanden.',
      studyInfo: 'Jag vill inte delta i meddelandeundersökningen.'
    }
  },
  projects: {
    welcome: {
      heading: 'Välkommen! Vi är så glada att du är här.',
      thanks: 'Tack för att du vill hjälpa till med riktig forskning. Här har vi samlat några project som verkligen skulle kunna få nytta av din hjälp just nu. För fler möjligheter, bläddra nedåt så ser du alla våra aktiva projekt.',
      talk: 'Se till att kolla in [Prata](/talk) där du kan chatta med andra likasinnade frivilliga.',
      scrollDown: 'Bläddra ner för ännu mer'
    }
  },
  project: {
    language: 'Språk',
    loading: 'Laddar projekt',
    disclaimer: 'Detta projekt har byggs med hjälp av Zooniverse Project Buildermen är ännu något officiellt Zooniverse-project. Frågor och problem som rapporteras till Zooniverse-teamet kanske inte får svar.',
    fieldGuide: 'Field Guide',
    about: {
      header: 'Om',
      nav: {
        research: 'Forskning',
        results: 'Resultat',
        faq: 'Vanliga frågor',
        education: 'Bakgrund',
        team: 'Teamet'
      }
    },
    nav: {
      about: 'Om',
      adminPage: 'Adminsidan',
      classify: 'Klassificera',
      collections: 'Samla',
      exploreProject: 'Utforska projektet',
      lab: 'Labb',
      recents: 'Senaste',
      talk: 'Prata',
      underReview: 'Under granskning',
      zooniverseApproved: 'Zooniverse-godkänt'
    },
    classifyPage: {
      dark: 'mörkt',
      light: 'ljust',
      title: 'Klassificera',
      themeToggle: 'Byt till %(theme)s tema'
    },
    home: {
      organization: 'Organisation',
      researcher: 'Forskaren har ordet',
      about: 'Om %(title)s',
      metadata: {
        statistics: '%(title)s statistik',
        classifications: 'Klassificeringar',
        volunteers: 'Frivilliga',
        completedSubjects: 'Avslutade ämnen',
        subjects: 'Ämnen'
      },
      talk: {
        zero: 'Ingen diskuterar %(title)s just nu.',
        one: '1 person diskuterar %(title)s just nu.',
        other: '%(count)s personer diskuterar %(title)s just nu.'
      },
      joinIn: 'Gå med',
      learnMore: 'Lär dig mer',
      getStarted: 'Kom igång',
      workflowAssignment: 'Du har låst upp %(workflowDisplayName)s',
      visitLink: 'Besök projektet',
      links: 'Externa projektlänkar'
    }
  },
  projectRoles: {
    collaborator: 'Samarbetspartner',
    expert: 'Expert',
    moderator: 'Moderator',
    museum: 'Museum',
    owner: 'Ägare',
    scientist: 'Forskare',
    tester: 'Testare',
    title: 'Teamet',
    translator: 'Översättare'
  },
  organization: {
    error: 'Ett fel uppstod när organisationen skulle hämtas',
    home: {
      about: 'Om %(title)s',
      introduction: '%(title)s inledning',
      learn: 'Lär dig mer om %(title)s',
      links: 'Ta kontakt med %(title)s',
      metadata: {
        complete: 'Andel klart (procent)',
        heading: 'Organisationsstatistik',
        numbers: 'I siffror',
        projects: 'Projekt',
        subtitle: 'Håll koll på hur långt du och andra frivilliga har kommit med projektet.',
        text: 'Varje klick räknas! Gå med i %(title)s-communityt för att göra klart projektet och hjälpa forskarna att få fram viktiga resultat.'
      },
      projects: {
        active: 'Aktiva projekt',
        all: 'Alla',
        error: 'Ett fel uppstod när organisationens projekt skulle hämtas.',
        finished: 'Avslutade projekt',
        hideSection: 'Dölj avsnitt',
        loading: 'Laddar organisationens projekt...',
        none: 'Det finns inga %(state)s %(category)s projekt hos den här organisationen.',
        paused: 'Pausade projekt',
        projectCategory: 'Projektkategori',
        showSection: 'Visa avsnitt'
      },
      researcher: 'Meddelande från forskaren',
      viewToggle: 'Se som frivillig'
    },
    loading: 'Laddar organisation',
    notFound: 'organisation hittas inte.',
    notPermission: 'Om du är säker på att adressen är rätt, du kanske inte har behörighet att se denna organisation.',
    pleaseWait: 'Vänta...',
    stats: {
      adjustParameters: 'Justera parametrar',
      byTheNumbers: 'I siffror',
      byTheNumbersContent: {
        classifications: 'Klassificeringar',
        firstProject: 'Första projektet',
        firstProjectLaunch: 'Första projektets lanseringsdatum',
        liveProjects: 'Pågående projekt',
        pausedProjects: 'Pausade projekt',
        retiredProjects: 'Pensionerade projekt',
        retiredSubjects: 'Avslutade ämnen',
        subjects: 'Ämnen'
      },
      classifications: 'Klassificeringar',
      comments: 'Kommentarer',
      dateRange: 'Spann i datum',
      expandWorkflowStats: 'Expandera statistik för arbetsflöde',
      for: 'för',
      hidden: 'Statistik dold',
      hourly: 'Data timme för timme finns endast för de senaste 2 veckorna.',
      organizationStatistics: '%(title)s statistik',
      perclassifications: 'Klassificeringar',
      percomments: 'Kommentar per',
      projectStats: 'Pågående projekt (%(count)s)',
      reset: 'Återställ'
    }
  },
  tasks: {
    hidePreviousMarks: 'Dölj tidigare markeringar %(count)s',
    less: 'Mindre',
    more: 'Mer',
    shortcut: {
      noAnswer: 'Inget svar'
    },
    survey: {
      clear: 'Rensa',
      clearFilters: 'Rensa filter',
      makeSelection: 'Välj',
      showing: 'Visar %(count)s av %(max)s',
      confused: 'Förväxlas ofta med',
      dismiss: 'Stäng',
      itsThis: 'Jag tror att det är det här',
      cancel: 'Avbryt',
      identify: 'Identifiera',
      surveyOf: 'Kartläggning av %(count)s',
      identifications: {
        zero: 'Inga identifikationer',
        one: '1 identifikation',
        other: '%(count)s identifikationer'
      }
    }
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Hantera användare',
      projectStatus: 'Hantera projektstatus',
      grantbot: 'Grantbot',
      organizationStatus: 'Hantera organisationsstatus'
    },
    notAdminMessage: 'Du är inte administratör',
    notSignedInMessage: 'Du är inte inloggad'
  },
  signIn: {
    title: 'Logga in/registrera',
    withZooniverse: 'Logga in med ditt Zooniverse-konto',
    whyHaveAccount: 'Inloggade frivilliga kan hålla koll på sitt arbete och erkännas i eventuella forskningsartiklar.',
    signIn: 'Logga in',
    register: 'Registrera dig'
  },
  notFoundPage: {
    message: 'Hittas inte'
  },
  resetPassword: {
    heading: 'Återställ lösenord',
    newPasswordFormDialog: 'Skriv in samma lösenord två gånger så att du kan återgå till din forskning. Lösenordet ska vara minst 8 tecken långt.',
    newPasswordFormLabel: 'Nytt lösenord:',
    newPasswordConfirmationLabel: 'Skriv lösenordet en gång till för att bekräfta:',
    enterEmailLabel: 'Skriv in din epostadress så skickar vi en länk som du kan använda för att återställa.',
    emailSuccess: 'Nu har vi skickat mejl med en länk för att återställa lösenordet.',
    emailError: 'Ett fel uppstod när ditt lösenord skulle återställas.',
    passwordsDoNotMatch: 'Lösenorden stämmer inte överens. Försök igen.',
    loggedInDialog: 'Du är inloggad just nu. Logga ut först om du vill återställa ditt lösenord.',
    missingEmailsSpamNote: 'Kolla i din skräppost om du inte har fått återställningsmejlet.',
    missingEmailsAlternateNote: 'Om du fortfarande inte har fått mejl, prova med någon annan epostadress som du kanske registrerade dig med.'
  },
  workflowToggle: {
    label: 'Aktiv'
  },
  collections: {
    createForm: {
      private: 'Privat',
      submit: 'Lägg till samling'
    }
  },
  emailSettings: {
    email: 'Epostadress',
    general: {
      section: 'Epost från Zooniverse: preferenser',
      updates: 'Få allmänna uppdateringar från Zooniverse via epost',
      classify: 'Få uppdateringar med epost när du börjar klassificera för ett projekt',
      note: 'Obs: Om du avbockar här avslutas inte din prenumeration på något av projekten',
      manual: 'Hantera varje projekt för sig',
      beta: 'Få mejl om betaprojekt och bli en betatestare',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'Epost-preferenser för Prata',
      header: 'Skicka epost',
      frequency: {
        immediate: 'På en gång',
        day: 'Dagligen',
        week: 'Varje vecka',
        never: 'Aldrig'
      },
      options: {
        participating_discussions: 'När diskussioner där jag deltar uppdateras',
        followed_discussions: 'Där diskussioner som jag följer uppdateras',
        mentions: 'När jag blir omnämnd',
        group_mentions: 'När jag omnämns av gruppens (@admins, @team, mm.)',
        messages: 'När jag får ett provat meddelande',
        started_discussions: 'När en diskussion startas i en anslagstavla som jag följer'
      }
    },
    project: {
      section: 'Epost-preferenser för projekt',
      header: 'Projekt'
    }
  },
  userSettings: {
    account: {
      displayName: 'Namn eller smeknamn (obligatoriskt)',
      displayNameHelp: 'Ditt namn visas för andra användare i Talk och på din profilsida',
      realName: 'Ditt riktiga namn (frivilligt)',
      realNameHelp: 'Här kan du uppge ditt riktiga namn som vi använder om vi behöver tacka dig i forskningsartiklar, planscher, med mera.',
      interventions: 'Visa projektmeddelanden',
      interventionsHelp: 'Tillåt projekt ett visa meddelanden medan du klassificerar.',
      interventionsPreferences: 'Meddelandeinställingar',
      changePassword: {
        heading: 'Ändra lösenord',
        currentPassword: 'Nuvarande lösenord (obligatoriskt)',
        newPassword: 'Nytt password (obligatoriskt)',
        tooShort: 'Det var för kort',
        confirmNewPassword: 'Bekräfta nytt lösenord (obligatoriskt)',
        doesntMatch: 'Dessa lösenord är olika',
        change: 'Ändra'
      }
    },
    profile: {
      dropImage: 'Släpp en bild här (eller klicka för att välja).',
      changeAvatar: 'Ändra avatar',
      avatarImageHelp: 'Släpp en bild här (kvadratisk, mindre än %(size)s KB)',
      clearAvatar: 'Rensa avatar',
      changeProfileHeader: 'Ändra rubrik för profil',
      profileHeaderImageHelp: 'Släpp en bild här (mindre än %(size)s KB)',
      clearHeader: 'Rensa rubrik'
    }
  },
  feedback: {
    categories: {
      correct: 'Lyckat',
      incorrect: 'Mindre lyckat',
      falsepos: 'Falskt positiv'
    }
  }
}
