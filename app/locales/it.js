export default {
  loading: '(Caricamento in corso)',
  classifier: {
    back: 'Indietro',
    close: 'Chiudi',
    continue: 'Continua',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Completato',
    doneAndTalk: 'Concludi e Commenta',
    dontShowMinicourse: 'Non mostrare più il mini corso',
    letsGo: 'Inizia!',
    next: 'Avanti',
    optOut: 'Rinuncia',
    talk: 'Talk',
    taskHelpButton: 'Hai bisogno di aiuto?',
    workflowAssignmentDialog: {
      declineButton: 'No, grazie'
    },
    interventions: {
      optOut: "Non mostrare più questi messaggi."
    }
  },
  project: {
    language: 'Lingua',
    loading: 'Caricamento progetto',
    disclaimer: "Questo progetto è stato creato con il Project Builder di Zooniverse, ma non è ancora un progetto ufficiale. Per questo motivo è possibile che domande su questo progetto dirette al Team Zooniverse non ricevano una risposta.",
    fieldGuide: 'Guida Pratica',
    about: {
      header: 'About',
      nav: {
        research: 'Ricerca',
        results: 'Risultati',
        faq: 'FAQ',
        education: 'Approfondimento',
        team: 'Il Team',
      }
    },
    nav: {
      about: 'A proposito',
      adminPage: 'Pagina di amministrazione',
      classify: 'Classifica',
      collections: 'Colleziona',
      exploreProject: 'Esplora il progetto',
      lab: 'Lab',
      recents: 'Recenti',
      talk: 'Forum',
    },
    classifyPage: {
      dark: 'scuro',
      light: 'chiaro',
      title: 'Classify',
      themeToggle: 'Passa al tema %(theme)s'
    },
    home: {
      organization: 'Organization',
      researcher: 'Parole dai ricercatori',
      about: 'A proposito di %(title)s',
      metadata: {
        statistics: 'Statistiche %(title)s',
        classifications: 'Classificazioni',
        volunteers: 'Volontari',
        completedSubjects: 'Soggetti completati',
        subjects: 'Soggetti'
      },
      talk: {
        zero: 'Nessuno sta parlando di **%(title)s** in questo momento.',
        one: '**1** persona sta parlando di **%(title)s** in questo momento.',
        other: '**%(count)s** persone stanno parlando di **%(title)s** in questo momento.'
      },
      joinIn: 'Partecipa',
      learnMore: 'Per saperne di piu',
      getStarted: 'Inizia ora',
      workflowAssignment: 'You\'ve unlocked level %(workflowDisplayName)s',
      visitLink: 'Visita il progetto',
      links: 'Link'
    }
  },
  organization: {
    error: 'Si è verificato un errore durante la ricerca dell\'organizzazione',
    home: {
      introduction: 'Introduzione',
      links: 'Link',
      metadata: {
        projects: 'Progetti'
      },
      projects: {
        error: 'There was an error loading organization projects.',
        loading: 'Caricamento progetti dell\'organizzazione in corso...',
        none: 'Non sono presenti progetti associati a questa organizzazione.'
      },
      readLess: 'Read Less',
      readMore: 'Read More',
      researcher: 'Words from a researcher',
      viewToggle: 'View As Volunteer'
    },
    loading: 'Caricamento dell\'organizzazione in corso',
    notFound: 'organizzazione non trovata.',
    pleaseWait: 'Attendere prego...'
  },
  tasks: {
    less: 'Di meno',
    more: 'Di più',
    shortcut: {
      noAnswer: "Nessuna risposta"
    }
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Gestione utenti',
      projectStatus: 'Set Project Status',
      grantbot: 'Grantbot',
      organizationStatus: 'Set Organization Status'
    },
    notAdminMessage: 'Non sei amministratore',
    notSignedInMessage: 'Non sei autenticato'
  },
  signIn: {
    title: 'Login/registrazione',
    withZooniverse: 'Accedi tramite account Zooniverse',
    whyHaveAccount: 'I volontari autenticati possono tenere traccia delle proprie attività e potranno venire citati nelle pubblicazioni accademiche.',
    signIn: 'Login',
    register: 'Registrazione',
    orThirdParty: 'Accedi tramite altro sistema',
    withFacebook: 'Accedi tramite account Facebook',
    withGoogle: 'Accedi tramite account Google'
  },
  notFoundPage: {
    message: 'Pagina non trovata'
  },
  emailSettings: {
    email: 'Indirizzo email',
    general: {
      section: 'Preferenze per Zooniverse',
      updates: 'Ricevi aggiornamenti generali su Zooniverse',
      classify: 'Ricevi aggiornamenti sui progetti a cui hai contribuito',
      note: 'Note: Unticking the box will not unsubscribe you from any of the projects',
      manual: 'Manage projects individually',
      beta: 'Diventa beta-tester e ricevi email sui progetti in beta',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'Preferenze per Talk',
      header: 'Mandami una email',
      frequency: {
        immediate: 'Immediatamente',
        day: 'Giornalmente',
        week: 'Settimanalmente',
        never: 'Mai'
      },
      options: {
        participating_discussions: 'Quando discussioni a cui partecipo vengono aggiornate',
        followed_discussions: 'Quando discussioni che seguo vengono aggiornate',
        mentions: 'Quando vengo nominato direttamente',
        group_mentions: 'Quando vengo nominato tramite un gruppo (@admins, @team, etc.)',
        messages: 'Quando ricevo un messaggio',
        started_discussions: 'Quando una discussione inizia in un pannello che seguo'
      }
    },
    project: {
      section: 'Preferenze email progetto',
      header: 'Progetto',
    }
  },
  lab: {
    help: {
      howToBuildProject: {
        title: '## Come realizzare un progetto utilizzando Project Builder'
      }
    }
  },
 userSettings: {
    account: {
      displayName: 'Nickname (obbligatorio)',
      displayNameHelp: 'Questo è il nome con cui apparirai agli altri utenti in Talk e nella tua pagina del profilo',
      realName: 'Nome reale (facoltativo)',
      realNameHelp: 'Pubblico; questo nome verrà utilizzato per ringraziare o citare i volontari. Es: pubblicazioni, poster scientifici, ecc...',
	  interventions: 'Show project intervention notifications.',
      interventionsHelp: 'Permetti ai progetti di notificare messaggi mentre stai classificando.',
      interventionsPreferences: 'Preferenze di notifica',
      changePassword: {
        heading: 'Modifica della password',
        currentPassword: 'Password attuale (campo obbligatorio)',
        newPassword: 'Nuova password (campo obbligatorio)',
        tooShort: 'La password è troppo corta',
        confirmNewPassword: 'Ridigitare la nuova password (campo obbligatorio)',
        doesntMatch: 'Le password non sono identiche',
        change: 'Modificare'
      }
    },
    profile: {
      dropImage: 'Trascina qui un\'immagine (oppure fai click per selezionarla).',
      changeAvatar: 'Modifica avatar',
      avatarImageHelp: 'Trascina qui un\'immagine (deve essere quadrata e più minore di %(size)s KB)',
      clearAvatar: 'Elimina avatar',
      changeProfileHeader: 'Change profile header',
      profileHeaderImageHelp: 'Trascina qui un\'immagine (è accettata qualsiasi dimensione, e più piccola di %(size)s KB)',
      clearHeader: 'Clear header'
    }
  }
};
