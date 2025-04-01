export default {
  loading: '(Laden)',
  classifier: {
    back: 'Zurück',
    backButtonWarning: 'Das Zurückgehen wird Deine Arbeit in der derzeitigen Aufgabe löschen!',
    close: 'Schließen',
    continue: 'Weiter',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Fertig',
    doneAndTalk: 'Fertig & Diskutieren',
    dontShowMinicourse: 'Zeige den Mini-Kurs nicht mehr an.',
    letsGo: 'Los geht es!',
    next: 'Weiter',
    optOut: 'Nicht beteiligen',
    taskTabs: {
      taskTab: 'Aufgabe',
      tutorialTab: 'Tutorial'
    },
    recents: 'Deine kürzlichen Klassifikationen',
    talk: 'Diskutieren',
    taskHelpButton: 'Brauchst Du Hilfe?',
    miniCourseButton: 'Starte den Mini-Kurs noch einmal.',
    workflowAssignmentDialog: {
      promotionMessage: "Glückwunsch! Du hast den nächsten Workflow freigeschalten. Wenn Du lieber in diesem Workflow bleiben möchtest, kannst Du auswählen hier zu bleiben.",
      acceptButton: 'Bring mich zum nächsten Level!',
      declineButton: 'Nein, danke!'
    }
  },
  project: {
    language: 'Sprache',
    loading: 'Projekt wird geladen',
    disclaimer: 'Dieses Projekt wurde mit dem Zooniverse Project Builder gebaut, ist aber derzeit noch kein offizielles Zooniverse Projekt. Anfragen und Probleme bezüglich dieses Projekts an das Zooniverse Team könnten unbeantwortet bleiben.',
    fieldGuide: 'Benutzerhandbuch',
    about: {
      header: 'Über',
      nav: {
        research: 'Forschung',
        results: 'Ergebnisse',
        faq: 'FAQ',
        education: 'Bildung',
        team: 'Das Team',
      }
    },
    nav: {
      about: 'Über',
      adminPage: 'Admin-Seite',
      classify: 'Klassifizieren',
      collections: 'Sammeln',
      exploreProject: 'Erkunde das Projekt',
      lab: 'Lab',
      recents: 'Neueste',
      talk: 'Diskutieren',
      underReview: 'In Begutachtung',
      zooniverseApproved: 'Genehmigt von Zooniverse'
    },
    classifyPage: {
      dark: 'dunklen',
      light: 'hellen',
      title: 'Klassifizieren',
      themeToggle: 'Klicken für %(theme)s Hintergrund'
    },
    home: {
      organization: 'Organisation',
      researcher: 'Vom Forscherteam',
      about: 'Über %(title)s',
      metadata: {
        statistics: '%(title)s Statistik',
        classifications: 'Klassifikationen',
        volunteers: 'Freiwillige',
        completedSubjects: 'Fertige Subjekte',
        subjects: 'Subjekte'
      },
      talk: {
        zero: 'Gerade diskutiert niemand in **%(title)s**.',
        one: '**1** Person diskutiert gerade in **%(title)s**.',
        other: '**%(count)s** Personen diskutieren gerade in **%(title)s**.'
      },
      joinIn: 'Mach mit',
      learnMore: 'Erfahre mehr',
      getStarted: 'Fang an',
      workflowAssignment: 'Du hast %(workflowDisplayName)s freigeschalten.',
      visitLink: 'Besuche das Projekt',
      links: 'Externe Projektlinks'
    }
  },
  organization: {
    error: 'Es gab einen Fehler beim Aufrufen der Organisation.',
    home: {
      introduction: 'Einführung',
      links: 'Links',
      metadata: {
        projects: 'Projekte'
      },
      projects: {
        error: 'Es gab einen Fehler beim Laden der Projekte der Organisation.',
        loading: 'Laden der Projekte dieser Organisation...',
        none: 'Es gibt keine Projekte, die mit dieser Organisation assoziiert sind.'
      },
      readLess: 'Zeige weniger',
      readMore: 'Zeige mehr',
      researcher: 'Vom Forscherteam',
      viewToggle: 'Ansicht als Freiwilliger'
    },
    loading: 'Lade Organisation',
    notFound: 'Organisation nicht gefunden',
    notPermission: 'Wenn Du sicher bist, dass die URL korrekt ist, kann es sein, dass Du nicht berechtigt bist diese Organisation zu sehen.',
    pleaseWait: 'Bitte warten...'
  },
  tasks: {
    less: 'Weniger',
    more: 'Mehr',
    shortcut: {
      noAnswer: 'Keine Antwort'
    },
    survey: {
      clear: 'Löschen',
      clearFilters: 'Filter löschen',
      makeSelection: 'Triff eine Auswahl',
      showing: 'Zeigt %(count)s von %(max)s',
      confused: 'Oft verwechselt mit',
      dismiss: 'Verwerfen',
      itsThis: 'Ich denke, das ist es.',
      cancel: 'Zurückziehen',
      identify: 'Identifizieren',
      surveyOf: 'Überblick über %(count)s',
      identifications: {
        zero: 'Keine Identifikation',
        one: '1 Identifikation',
        other: '%(count)s Identifikationen'
      }
    }
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Verwalte Nutzer',
      projectStatus: 'Setze den Projektstatus',
      grantbot: 'Grantbot',
      organizationStatus: 'Setze den Organisationsstatus'
    },
    notAdminMessage: 'Du bist kein Administrator.',
    notSignedInMessage: 'Du bist nicht angemeldet.'
  },
  signIn: {
    title: 'Anmeldung/Registrierung',
    withZooniverse: 'Anmeldung mit Zooniverse Nutzerkonto',
    whyHaveAccount: 'Angemeldete Nutzer können ihre Arbeit nachverfolgen und werden in Publikationen einbezogen.',
    signIn: 'Anmeldung',
    register: 'Registrierung',
    orThirdParty: 'Oder melde Dich mit einem anderen Service an',
    withFacebook: 'Anmeldung mit Facebook',
    withGoogle: 'Anmeldung mit Google'
  },
  notFoundPage: {
    message: 'Nicht gefunden'
  },
  resetPassword: {
    heading: 'Passwort zurücksetzen',
    newPasswordFormDialog: 'Gib das gleiche Passwort zur Bestätigung zweimal ein. Passwörter müssen mindestens 8 Zeichen haben.',
    newPasswordFormLabel: 'Neues Passwort:',
    newPasswordConfirmationLabel: 'Wiederhole Dein Passwort zur Bestätigung:',
    enterEmailLabel: 'Bitte gib Deine E-Mail-Adresse hier ein und wir senden einen Link zur Zurücksetzung des Passwortes.',
    emailSuccess: 'Wir haben soeben eine E-Mail mit einem Link zur Zurücksetzung des Passwortes geschickt.',
    emailError: 'Es gab einen Fehler beim Zurücksetzen des Passwortes.',
    passwordsDoNotMatch: 'Die Passwörter stimmen nicht überein. Bitte versuch es nochmal.',
    loggedInDialog: 'Du bist derzeit angemeldet. Bitte melde Dich ab, wenn Du Dein Passwort ändern willst.',
    missingEmailsSpamNote: 'Bitte überprüfe im Spamordner, ob Du die E-Mail zum Zurücksetzen nicht erhalten hast.',
    missingEmailsAlternateNote: 'Wenn Du die E-Mail nicht erhalten hast, versuch bitte noch einmal die E-Mail-Adresse einzugeben, die mit Deinem Zooniverse Nutzerkonto verknüpft ist.'
  },
  workflowToggle: {
    label: 'Aktiv'
  },
  collections: {
    createForm: {
      private: 'Privat',
      submit: 'Neue Sammlung anlegen'
    }
  },
  emailSettings: {
    email: 'E-Mail-Adresse',
    general: {
      section: 'Zooniverse E-Mail-Präferenzen',
      updates: 'Erhalte allgemeine Zooniverse-Neuigkeiten per E-Mail',
      classify: 'Erhalte Projekt-Neuigkeiten per E-Mail, wenn Du beginnst in einem Projekt zu klassifizieren',
      note: 'Beachte: Nicht-Auswählen dieser Box wird keine Auswirkungen auf andere Projekte haben.',
      manual: 'Verwalte Projekte individuell',
      beta: 'Erhalte E-Mails über Projekte in der Beta-Testung und werde Beta-Tester!',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'E-Mail-Präferenzen für Talk',
      header: 'Sende mir eine E-Mail',
      frequency: {
        immediate: 'Sofort',
        day: 'Täglich',
        week: 'Wöchentlich',
        never: 'Niemals'
      },
      options: {
        participating_discussions: 'Wenn es ein Update gibt in Diskussionen, an denen ich teilnehme.',
        followed_discussions: 'Wenn es ein Update gibt in Diskussionen, denen ich folge.',
        mentions: 'Wenn mich jemand erwähnt.',
        group_mentions: 'Wenn ich von einer Gruppe erwähnt werde (@admins, @team, etc.).',
        messages: 'Wenn ich eine private Nachricht erhalten habe.',
        started_discussions: 'Wenn eine neue Diskussion startet in einem Forum, dem ich folge.'
      }
    },
    project: {
      section: 'E-Mail-Präferenzen im Projekt',
      header: 'Projekt',
    }
  },
  userSettings: {
    account: {
      displayName: 'Angezeigter Name (notwendig)',
      displayNameHelp: 'Wie Dein Name anderen Nutzern bei Talk und auf Deiner Profilseite angezeigt wird.',
      realName: 'Richtiger Name (optional)',
      realNameHelp: 'Öffentlich. Wir werden diesen Namen in wissenschaftlichen Veröffentlichungen und auf Postern etc. für Anerkennung der Mithilfe nutzen.',
      changePassword: {
        heading: 'Ändere Dein Passwort',
        currentPassword: 'Derzeitiges Passwort (notwendig)',
        newPassword: 'Neues Passwort (notwendig)',
        tooShort: 'Das ist zu kurz.',
        confirmNewPassword: 'Bestätige das neue Passwort (notwendig)',
        doesntMatch: 'Das stimmt nicht überein.',
        change: 'Änderung'
      }
    },
    profile: {
      dropImage: 'Ziehe ein Bild hierher (oder klicke auf Auswahl).',
      changeAvatar: 'Ändere das Profilbild',
      avatarImageHelp: 'Ziehe ein Bild hierher (quadratisch, weniger als %(size)s KB)',
      clearAvatar: 'Lösche das Profilbild',
      changeProfileHeader: 'Ändere den Profil-Header',
      profileHeaderImageHelp: 'Ziehe ein Bild hierher (jedes Maß, weniger als %(size)s KB)',
      clearHeader: 'Lösche den Header'
    }
  }
};
