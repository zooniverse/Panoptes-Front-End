export default {
  counterpart: {
    names: {
      days: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
      abbreviated_days: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
      months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
      abbreviated_months: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov', 'dec'],
      am: 'a.m.',
      pm: 'p.m.'
    },
    pluralize: require('pluralizers/en'),

    formats: {
      date: {
        'default': '%a, %e %b %Y',
        long: '%A, %B %o, %Y',
        short: '%b %e'
      },

      time: {
        'default': '%H:%M',
        long: '%H:%M:%S %z',
        short: '%H:%M'
      },

      datetime: {
        'default': '%a, %e %b %Y %H:%M',
        long: '%A, %B %o, %Y %H:%M:%S %z',
        short: '%e %b %H:%M'
      }
    }

  },
  loading: '(Laden)',
  classifier: {
    back: 'Terug',
    backButtonWarning: 'Let op! Niet opgeslagen gegevens gaan verloren.',
    close: 'Sluiten',
    continue: 'Doorgaan',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Afronden',
    doneAndTalk: 'Afronden & Bespreken',
    dontShowMinicourse: 'Verberg de uitleg in het vervolg.',
    letsGo: 'Laten we beginnen!',
    next: 'Volgende',
    optOut: 'Opt-out',
    taskTabs: {
      taskTab: 'Taak',
      tutorialTab: 'Uitleg'
    },
    recents: 'Je recente waarnemingen',
    talk: 'Overleg',
    taskHelpButton: 'Hulp nodig met deze taak?',
    miniCourseButton: 'Herhaal de uitleg',
  },
  project: {
    language: 'Taal',
    loading: 'Project wordt geladen',
    disclaimer: 'Dit project is gemaakt met de Zooniverse projectbouwer maar nog geen officieel Zooniverse project. Vragen over het project die gestuurd worden aan het Zooniverseteam worden mogelijk niet beantwoord.',
    fieldGuide: 'Field Guide',
    about: {
      header: 'Over',
      nav: {
        research: 'Onderzoek',
        results: 'Resultaten',
        faq: 'Veelgestelde vragen',
        education: 'Onderwijs',
        team: 'Het team',
      }
    },
    nav: {
      about: 'Over',
      classify: 'Classificeren',
      talk: 'Forum',
      collections: 'Verzamelingen',
      recents: 'Mijn waarnemingen',
      lab: 'Lab',
      adminPage: 'Administratie',
      underReview: 'Wacht op controle',
      zooniverseApproved: 'Goedgekeurd door Zooniverse'
    },
    classifyPage: {
      dark: 'donker',
      light: 'licht',
      title: 'Classificeren',
      themeToggle: 'Wissel naar %(theme)s thema'
    },
    home: {
      researcher: 'Citaat van de onderzoeker',
      about: 'Over %(title)s',
      metadata: {
        statistics: '%(title)s statistieken',
        classifications: 'Waarnemingen',
        volunteers: 'Vrijwilligers',
        completedSubjects: 'Voltooide taken',
        subjects: 'Taken'
      },
      talk: {
        zero: 'Niemand praat over **%(title)s** op dit moment.',
        one: '**1** persoon praat over **%(title)s** op dit moment.',
        other: '**%(count)s** mensen praten over **%(title)s** op dit moment.'
      },
      joinIn: 'Doe mee!',
      learnMore: 'Lees meer',
      getStarted: 'Beginnen',
      visitLink: 'Bezoek het project',
      links: 'Links'
    }
  },
  organization: {
    loading: 'Organisatie wordt geladen',
    error: 'Er ging iets mis bij het laden van de organisatie',
    notFound: 'Organisatie werd niet gevonden.',
    notPermission: 'Als je zeker weet dat de URL correct is, heb je wellicht geen toestemming om deze organisatie te zien.',
    pleaseWait: 'Een ogenblik geduld...',
    home: {
      projects: {
        loading: 'Projecten van deze organisatie worden geladen...',
        error: 'Er ging iets mis bij het laden van de projecten van deze organisatie.',
        none: 'Er zijn geen projecten voor deze organisatie.'
      },
      viewToggle: 'Bekijk als vrijwilliger',
      introduction: 'Introductie',
      readMore: 'Lees meer',
      readLess: 'Lees minder',
      links: 'Links'
    },
  },
  tasks: {
    less: 'Minder',
    more: 'Meer',
    shortcut: {
      noAnswer: "Geen antwoord"
    },
    survey: {
      clear: 'Wissen',
      clearFilters: 'Wis filters',
      makeSelection: 'Maak een keuze',
      showing: 'Toont %(count)s van %(max)s',
      confused: 'Word vaak verward met',
      dismiss: 'Sluiten',
      itsThis: 'Volgens mij het deze',
      cancel: 'Annuleren',
      identify: 'Selecteren',
      surveyOf: 'Waarneming van %(count)s',
      identifications: {
        zero: 'Geen waarnemingen',
        one: '1 waarneming',
        other: '%(count)s waarnemingen'
      }
    }
  },
  security: {
    title: 'Zooniverse Beveiligingsbeleid',
  },
  userAdminPage: {
    header: 'Administratie',
    nav: {
      createAdmin: 'Beheer gebruikers',
      projectStatus: 'Wijzig projectstatus',
      grantbot: 'Grantbot',
      organizationStatus: 'Wijzig organisatiestatus'
    },
    notAdminMessage: 'Je bent geen beheerder',
    notSignedInMessage: 'Je bent niet ingelogd'
  },
  signIn: {
    title: 'Inloggen/registreren',
    withZooniverse: 'Log in met je Zooniverse account',
    whyHaveAccount: 'Ingelogde vrijwilligers kunnen hun eigen waarnemingen bijhouden en worden vermeld in publicaties.',
    signIn: 'Inloggen',
    register: 'Registreren',
    orThirdParty: 'Of log in met een andere dienst',
    withFacebook: 'Log in met Facebook',
    withGoogle: 'Log in met Google'
  },
  notFoundPage: {
    message: 'Niet gevonden'
  },
  resetPassword: {
    heading: 'Wachtwoord vergeten',
    newPasswordFormDialog: 'Voer hetzelfde wachtwoord twee keer in om de toegang tot je account te herstellen. Een wachtwoord moet tenminste 8 tekens lang zijn.',
    newPasswordFormLabel: 'Nieuw wachtwoord:',
    newPasswordConfirmationLabel: 'Herhaal, ter controle:',
    enterEmailLabel: 'Voer het e-mailadres in waarop je een link wilt ontvangen om je wachtwoord te herstellen.',
    emailSuccess: 'We hebben je zojuist een e-mail met een herstellink gestuurd.',
    emailError: 'Er ging iets mis bij het herstellen van je wachtwoord.',
    passwordsDoNotMatch: 'De wachtwoorden komen niet overeen, probeer het alstublieft opnieuw.',
    loggedInDialog: 'Je bent op dit moment ingelogd. Log uit om je wachtwoord te herstellen.',
    missingEmailsSpamNote: 'Als je geen e-mail hebt ontvangen, controleer dan of het bericht wellicht in je spamfolder terecht is gekomen.',
    missingEmailsAlternateNote: 'Als je nog steeds geen e-mail ontvangen hebt, controleer dan of je misschien een ander e-mailadres voor je Zooniverse account hebt gebruikt.'
  },
  workflowToggle: {
    label: 'Actief'
  },
  collections: {
    createForm: {
      private: 'Privé',
      submit: 'Maak verzameling'
    }
  }
};
