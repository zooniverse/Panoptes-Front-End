export default {
  loading: '(Chargement)',
  aboutPages: {
    missingContent: {
      education: "Ce projet n\'a pas de ressources éducatives pour l\'instant.",
      faq: "Ce projet ne comporte pas de questions fréquentes pour l\'instant.",
      research: "Ce projet n\'a pas de description de recherche pour l\'instant.",
      results: "Ce projet n\'a pas de résultats à partager pour l\'instant.",
      team: "Ce projet n\'a pas d'information sur l\'équipe pour l\'instant."
    }
  },
  projectRoles: {
    title: 'L\'équipe',
    owner: 'Administrateur/trice',
    collaborator: 'Collaborateur/trice',
    translator: 'Traducteur/trice',
    scientist: 'Chercheur/e',
    moderator: 'Modérateur/trice',
    tester: 'Testeur/e',
    expert: 'Expert/èrte',
    museum: 'Musée'
  },
  classifier: {
    back: 'Retour',
    backButtonWarning: 'Retourner en arrière va effacer le travail fait sur cette tâche.',
    close: 'Fermer',
    continue: 'Continuer',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Valider',
    doneAndTalk: 'Valider & Discussion',
    dontShowMinicourse: 'Ne plus montrer le petit tutoriel dans le futur',
    interventions: {
      optOut: 'Ne plus me montrer de messages.',
      studyInfo: 'Je ne souhaite pas recevoir ces messages.'
    },
    letsGo: 'À vos marques, prêts, partez!',
    miniCourseButton: 'Relancer le petit tutoriel du projet',
    next: 'Suivant',
    optOut: 'Annuler',
    recents: 'Vos classifications récentes',
    talk: 'Discussions',
    taskHelpButton: "Avez-vous besoin d\'aide?",
    taskTabs: {
      taskTab: 'Tache',
      tutorialTab: 'Tutoriel'
    },
    workflowAssignmentDialog: {
      acceptButton: 'Passer au prochain module!',
      declineButton: 'Non, merci',
      promotionMessage: 'Bravo! Vous avez débloqué le prochain module. Si vous préférez rester dans ce module, vous pouvez choisir de rester.'
    }
  },
  feedback: {
    categories: {
      correct: 'Exacts',
      falsepos: 'Faux positifs',
      incorrect: 'Inexacts'
    }
  },
  project: {
    about: {
      header: 'À propos',
      nav: {
        education: 'Éducation',
        faq: 'FAQ',
        research: 'Recherche',
        results: 'Résultats',
        team: 'Équipe'
      }
    },
    classifyPage: {
      dark: 'foncé',
      light: 'clair',
      themeToggle: 'Passer au thème %(theme)s',
      title: 'Classifier'
    },
    disclaimer: "Ce projet a été créé avec le Zooniverse Project Builder mais n\'est pas encore un projet officiel de Zooniverse. Les questions et problèmes à propos de ce projet adressés à l\'équipe de Zooniverse peut ne pas recevoir de réponse.",
    fieldGuide: 'Guide Pratique',
    home: {
      about: 'À propos de %(title)s',
      getStarted: 'À vos marques, prêts, partez!',
      joinIn: 'Les rejoindre',
      learnMore: 'En savoir plus',
      links: 'Liens externes du projet',
      metadata: {
        classifications: 'Classifications',
        completedSubjects: 'Sujets complétés',
        statistics: 'Statistiques de %(title)s',
        subjects: 'Sujets',
        volunteers: 'Volontaires'
      },
      organization: 'Organisation',
      researcher: "Quelques mots de l\'équipe de recherche",
      talk: {
        one: '1 personne parle de %(title)s en ce moment.',
        other: '%(count)s personnes parlent de %(title)s en ce moment.',
        zero: 'Personne ne parle de %(title)s en ce moment.'
      },
      visitLink: 'Visiter le project',
      workflowAssignment: 'Vous avez débloquez le module %(workflowDisplayName)s'
    },
    language: 'Langue',
    loading: 'Chargement du projet',
    nav: {
      about: 'À propos',
      adminPage: 'Page Administrateur',
      classify: 'Classifier',
      collections: 'Collectionner',
      exploreProject: 'Explorer le project',
      lab: 'Lab',
      recents: 'Récents',
      talk: 'Discussions',
      underReview: 'En cours de révision',
      zooniverseApproved: 'Approuvé par Zooniverse'
    }
  },
  projects: {
    welcome: {
      heading: "Bienvenue! Nous sommes ravis de vous voir ici",
      scrollDown: "Faire défiler vers le bas pour en découvrir davantage",
      talk: "Pensez à consulter également Talk où vous pourrez discuter avec des bénévoles qui ont le même état d\'esprit.",
      thanks: "Merci de votre intérêt pour participer à nos recherches. Nous avons rassemblé ici plusieurs projets pour lesquels nous avons besoin de votre aide. Parcourez davantage d\'options en faisant défiler la page vers le bas afin de découvrir tous nos projets actifs."
    }
  },
  organization: {
    error: 'Il y a eu une erreur en récupérant l\'organisation',
    home: {
      introduction: 'Introduction',
      links: 'Liens',
      metadata: {
        projects: 'Projets'
      },
      projects: {
        error: 'Il y a eu une erreur en chargeant les projets de l\'organisation.',
        loading: 'Chargement des projets de l\'organisation...',
        none: 'Il n\'y a pas de projets liés à cette organisation.'
      },
      readLess: 'Lire moins',
      readMore: 'Lire plus',
      researcher: 'Quelques mots de l\'équipe de recherche',
      viewToggle: 'Vue comme volontaire'
    },
    loading: 'Chargement de l\'organisation',
    notFound: 'Organisation pas trouvée.',
    notPermission: 'Si vous êtes sûr que l\'url est correct, vous n\'avez peut-être pas l\'autorisation de voir cette organisation.',
    pleaseWait: 'Merci d\'attendre...'
  },
  tasks: {
    hidePreviousMarks: 'Masquer les marques précédentes %(count)s',
    less: 'Moins',
    more: 'Plus',
    shortcut: {
      noAnswer: 'Pas de réponse'
    },
    survey: {
      clear: 'Effacer',
      clearFilters: 'Effacer les filtres',
      makeSelection: 'Sélectionner',
      showing: 'Montrer %(count)s de %(max)s',
      confused: 'Souvent confondu avec',
      dismiss: 'Rejeter',
      itsThis: 'Je pense que c\'est ça',
      cancel: 'Annuler',
      identify: 'Identifier',
      surveyOf: 'Sondage de %(count)s',
      identifications: {
        zero: 'Pas d\'identification',
        one: '1 identification',
        other: '%(count)s identifications'
      }
    }
  },
  userAdminPage: {
    header: 'Administrateur',
    nav: {
      createAdmin: 'Gérer les utilisateurs',
      projectStatus: 'Définir le statut du projet',
      grantbot: 'Grantbot',
      organizationStatus: 'Définir le statut de l\'organisation'
    },
    notAdminMessage: 'Vous n\'êtes pas un administrateur',
    notSignedInMessage: 'Vous n\'êtes pas connecté'
  },
  signIn: {
    title: 'Se connecter/S\'inscrire',
    withZooniverse: 'Se connecter avec votre compte Zooniverse',
    whyHaveAccount: 'Les volontaires connectés peuvent suivre leur travail et seront crédités dans toutes les publications.',
    signIn: 'Se connecter',
    register: "S\'inscrire"
  },
  notFoundPage: {
    message: 'Pas trouvé'
  },
  resetPassword: {
    heading: 'Réinitialiser le mot de passe',
    newPasswordFormDialog: 'Entrez le mot de passe deux fois pour pouvoir vous lancer dans la recherche. Le mot de passe doit contenir au moins 8 charactères.',
    newPasswordFormLabel: 'Nouveau mot de passe:',
    newPasswordConfirmationLabel: 'Répéter votre mot de passe pour confirmer:',
    enterEmailLabel: 'Merci d\'entrez votre adresse e-mail ici et nous vous enverrons un lien que vous pourrez suivre pour réinitialiser le mot de passe.',
    emailSuccess: 'Nous vous avons envoyé un e-mail avec un lien pour réinitialiser votre mot de passe.',
    emailError: 'Il y a eu une erreur en réinitialisant votre mot de passe.',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas, merci d\'essayer à nouveau.',
    loggedInDialog: 'Vous etes actuellement connecté. Merci de vous déconnecter si vous voulez réinitialiser votre mot de passe.',
    missingEmailsSpamNote: 'Merci de contrôler votre dossier spam si vous n\'avez pas reçu l\'e-mail de réinitialisation.',
    missingEmailsAlternateNote: 'Si vous n\'avez toujours pas reçu d\'e-mail, merci d\'essayez toutes les autres adresses emails avec lesquelles vous auriez pu vous inscrire.'
  },
  workflowToggle: {
    label: 'Actif'
  },
  collections: {
    createForm: {
      private: 'Privée',
      submit: 'Ajouter une collection'
    }
  },
  emailSettings: {
    email: 'Adresse e-mail',
    general: {
      section: 'Préférence pour les e-mails de Zooniverse',
      updates: 'Recevoir les nouvelles génerales de Zooniverse par e-mail',
      classify: 'Recevoir un e-mail quand vous avez fait une première classification dans un projet.',
      note: 'Note: Décocher la case ne vas vous désabonner à aucun des projets',
      manual: 'Gérer les projets individuellement',
      beta: 'Recevoir les nouvelles sur le projet beta et devenir un testeur beta.',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'Préférence pour les e-mails de la section Discussions',
      header: 'Envoyez-moi un e-mail',
      frequency: {
        immediate: 'Tout de suite',
        day: 'journalier',
        week: 'hebdomadaire',
        never: 'jamais'
      },
      options: {
        participating_discussions: 'Quand les discussions auxquelles j\'ai participé sont mises à jour',
        followed_discussions: 'Quand les discussions que je suis sont mises à jour',
        mentions: 'Quand je suis mentionné',
        group_mentions: 'Quand un de mes groupes est mentioné (@admins, @team, etc...)',
        messages: 'Quand je reçois un message personnel',
        started_discussions: 'Quand une nouvelle discussion est ouverte sur une page du forum que je suis'
      }
    },
    project: {
      section: 'Préférence pour les e-mails du projet',
      header: 'Projet'
    }
  },
  userSettings: {
    account: {
      displayName: 'Identifiant (requis)',
      displayNameHelp: 'C\'est le nom qui apparaitra dant les forum de discussion et sur votre profil',
      realName: 'Prénom et Nom (optionnel)',
      realNameHelp: 'Publique; nous utiliserons ce nom dans les remerciements des articles scientifiques, sur des posters, etc.',
      changePassword: {
        heading: 'Changer de mot de passe',
        currentPassword: 'Mot de passe actuel (requis)',
        newPassword: 'Nouveau mot de passe (requis)',
        tooShort: 'Votre mot de passe est trop court',
        confirmNewPassword: 'Confirmez votre nouveau mot de passe (requis)',
        doesntMatch: 'Les mots de passe ne correspondent pas',
        change: 'Changer'
      }
    },
    profile: {
      dropImage: 'Glissez une image ici (ou cliquez pour sélectionner).',
      changeAvatar: 'Changer d\'avatar',
      avatarImageHelp: 'Glissez une image ici (carrée, moins de %(size)s KB)',
      clearAvatar: 'Supprimer l\'avatar',
      changeProfileHeader: 'Changer d/image d\'en-tête du profil',
      profileHeaderImageHelp: 'Glissez une image ici (n\'importe quelles dimensions, moins de %(size)s KB)',
      clearHeader: 'Supprimer l\'image d\'en-tête'
    }
  }
}
