export default {
  loading: '(Chargement)',
  classifier: {
    back: 'Retour',
    backButtonWarning: 'Retourner en arrière va effacer le travail fait sur cette tâche.',
    close: 'Fermer',
    continue: 'Continuer',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Fini',
    doneAndTalk: 'Fini & Discussion',
    dontShowMinicourse: 'Ne plus montrer le petit tutoriel dans le futur',
    letsGo: 'À vos marques, prêts, partez!',
    next: 'Suivant',
    optOut: 'Annuler',
    taskTabs: {
      taskTab: 'Tache',
      tutorialTab: 'Tutoriel'
    },
    recents: 'Vos classifications récentes',
    talk: 'Discussions',
    taskHelpButton: 'Avez-vous besoin d\'aide?',
    miniCourseButton: 'Relancer le petit tutoriel du projet',
    workflowAssignmentDialog: {
      promotionMessage: "Bravo! Vous avez débloqué le prochain module. Si vous préférez rester dans ce module, vous pouvez choisir de rester.",
      acceptButton: 'Passer au prochain module!',
      declineButton: 'Non, merci'
    }
  },
  project: {
    language: 'Langue',
    loading: 'Chargement du projet',
    disclaimer: 'Ce projet a été créé avec le Zooniverse Project Builder mais ce n\'est pas encore un projet officiel de Zooniverse. Les questions et problèmes a propos de ce projet adressés à l\'équipe de Zooniverse peut ne pas recevoir de réponse.',
    about: {
      header: 'À propos',
      nav: {
        research: 'Recherche',
        results: 'Résultats',
        faq: 'FAQ',
        education: 'Éducation',
        team: 'L\'Équipe',
      }
    },
    nav: {
      about: 'À propos',
      adminPage: 'Page Administrateur',
      classify: 'Classifier',
      collections: 'Collectioner',
      exploreProject: 'Explorer le project',
      lab: 'Lab',
      recents: 'Récents',
      talk: 'Discussions',
      underReview: 'En cours de révision',
      zooniverseApproved: 'Approuvé par Zooniverse'
    },
    classifyPage: {
      dark: 'foncé',
      light: 'clair',
      title: 'Classifier',
      themeToggle: 'Passer au thème %(theme)s'
    },
    home: {
      organization: 'Organisation',
      researcher: 'Quelques mots de l\'équipe de recherche',
      about: 'À propos de %(title)s',
      metadata: {
        statistics: 'Les statistiques de %(title)s',
        classifications: 'Classifications',
        volunteers: 'Volontaires',
        completedSubjects: 'Sujets complétés',
        subjects: 'Sujets'
      },
      talk: {
        zero: 'Personne ne parle de **%(title)s** en ce moment.',
        one: '**1** personne parle de **%(title)s** en ce moment.',
        other: '**%(count)s** personnes parlent de **%(title)s** en ce moment.'
      },
      joinIn: 'Les rejoindre',
      learnMore: 'En savoir plus',
      getStarted: 'À vos marques, prêts, partez!',
      workflowAssignment: 'Vous avez débloquez le module %(workflowDisplayName)s',
      visitLink: 'Visiter le project',
      links: 'Liens externes du projet'
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
  privacy: {
    title: 'Zooniverse User Agreement and Privacy Policy',
    userAgreement: {
      summary: '## User Agreement\n**Summary**\n\nThe Zooniverse is a suite of citizen science projects operated by research groups in several institutions which support scientific research by involving members of the public - you - in the processes of analyzing and discussing data. Data from these projects is used to study online community design and theory, interface design, and other topics. This document describes what will happen to your contributions if you choose to contribute and what data we collect, how we use it and how we protect it.',
      contribution: '**What you agree to if you contribute to the Zooniverse**\n\nProjects involving the public are needed to enable researchers to cope with the otherwise unmanageable flood of data. The web provides a means of reaching a large audience willing to devote their free time to projects that can add to our knowledge of the world and the Universe.\n\nThe major goal for this project is for the analyzed data to be available to the researchers for use, modification and redistribution in order to further scientific research. Therefore, if you contribute to the Zooniverse, you grant us and our collaborators permission to use your contributions however we like to further this goal, trusting us to do the right thing with your data. However, you give us this permission non-exclusively, meaning that you yourself still own your contribution.\n\nWe ask you to grant us these broad permissions, because they allow us to change the legal details by which we keep the data available; this is important because the legal environment can change and we need to be able to respond without obtaining permission from every single contributor.\n\nFinally, you must not contribute data to the Zooniverse that you do not own. For example, do not copy information from published journal articles. If people do this, it can cause major legal headaches for us.',
      data: '**What you may do with Zooniverse data**\n\nYou retain ownership of any contribution you make to the Zooniverse, and any recorded interaction with the dataset associated with the Zooniverse. You may use, distribute or modify your individual contribution in any way you like. However, you do not possess ownership of the dataset itself. This license does not apply to data about you, covered in the Privacy Policy.',
      legal: '**Legal details**\n\nBy submitting your contribution to the Zooniverse, you agree to grant us a perpetual, royalty-free, non-exclusive, sub-licensable license to: use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and exercise all copyright and publicity rights with respect to your contribution worldwide and/or to incorporate your contribution in other works in any media now known or later developed for the full term of any rights that may exist in your contribution.\n\nIf you do not want to grant to us the rights set out above, you cannot interact with the Zooniverse.\n\nBy interacting with the Zooniverse, you:\n\n* Warrant that your contribution contains only data that you have the right to make available to us for all the purposes specified above, is not defamatory, and does not infringe any law; and\n\n* Indemnify us against all legal fees, damages and other expenses that may be incurred by us as a result of your breach of the above warranty; and\n\n* Waive any moral rights in your contribution for the purposes specified above.\n\nThis license does not apply to data about you, covered in the Privacy Policy.'
    },
    privacyPolicy: {
      intro: '## Privacy Policy\n\nIn addition to the contributions you make towards the scientific goals of the Zooniverse, we collect additional data about you to support and improve the operation of the project. We also conduct experiments on the design of the website that we evaluate based on your reactions and behavior. This Privacy Policy describes what data we collect, how we use it and how we protect it.\n\nWe respect the privacy of every individual who participates in the Zooniverse. We operate in accordance with the General Data Protection Regulation and the Freedom of Information Act 2000, as well as with United Kingdom and United States regulations regarding protection of human subjects in research.',
      data: '**Data we collect**\n\n_Identifying information_: If you register with the Zooniverse, we ask you to create a username and supply your e-mail address. Your e-mail address is not visible to other users, but others will see your username in various contexts. Notably, your username is associated with any classifications or other contributions you make, including on comments submitted to Talk, the discussion forums hosted by the Zooniverse. You may optionally provide your real name to be included when we publically thank participants, e.g., in presentations, publications or discoveries.\n\n_Usage information_: We also monitor how people use our website, and aggregate general statistics about users and traffic patterns as well as data about how users respond to various site features. This includes, among other things, recording:\n\n* When you log in.\n\n* Pages you request.\n\n* Classifications you make.\n\n* Other contributions, such as posts on Talk pages.\n\nIf you register and log in, the logs associate these activities with your username. Otherwise, they are solely associated with your IP address. In order to collect this data, we may use software such as Google Analytics that collects statistics from IP data. This software can determine what times of day people access our site, which country they access the websites from, how long they visit for, along with technical details of their computer (browser, screen type, processor).',
      info: '**What we do with the information we gather**\n\nUsage information is collected to help us improve our website, and for the following reasons:\n\n* Internal record keeping.\n\n* If you agree, we will periodically send email promoting new research-related projects or other information relating to our research. Information about these contacts is given below. We will not use your contact information for commercial purposes.\n\n* We will use the information to customize the website.\n\n* To conduct experiments regarding the use of site features.',
      thirdParties: '**What is shared with third parties**\n\nWe will never release e-mail addresses to third parties without your express permission. We will also never share data we collect about your use of the site unless (a) it cannot be associated with you or your username, and (b) it is necessary to accomplish our research goals. Specifically, we can share your anonymized data with research study participants, other researchers, or in scholarly work describing our research. For example, we might use one of your classifications as an illustration in a paper, show some of your classifications to another user to see if they agree or disagree, or publish statistics about user interaction.\n\n If you choose to give us a `Publishable Name\' on registration, this is available to research teams in projects you have participated in for purposes of giving credit for your work in published papers and elsewhere.\n\nContributions you make to the Talk pages are widely available to others. Aside from the above, information is held within our secured database. Passwords are hashed rather than being stored in plain text.',
      cookies: '**How we use cookies**\n\nIn some areas of our site, a cookie might be placed on your computer. A cookie is a small file that resides on your computer\'s hard drive that allows us to improve the quality of your visit to our websites by responding to you as an individual.\n\nWe use cookies to identify which pages are being used and improve our website. We only use this information for statistical analysis purposes, they are not shared with other sites and are not used for advertisements.\n\nYou can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, if you choose to decline cookies from the Zooniverse then functionality, including your ability to log-in and participate, will be impaired.\n\nAcceptance of cookies is implied if you continue to access our website without adjusting your browser settings.',
      dataStorage: '**Where we store your data**\n\nWe use Amazon Web Services so we can quickly and reliably serve our website to an unpredictable number of people. This means that your data will be stored in multiple locations, including the United States of America (USA). Amazon is a participant in the Privacy Shield program developed by the USA Department of Commerce and the European Union (EU). \n\nOur mailing list server, which contains a copy of subscribed email addresses and no other personal data, is hosted on a virtual private server with Linode in the UK.',
      security: '**Security measures**\n\nMembers of the research teams are made aware of our privacy policy and practices by reviewing this statement upon joining the team. We follow industry best practices to secure user data, and access to the database and logs are limited to members of the research group and system administrative staff.',
      dataRemoval: '**Removing your data**\n\nDue to the way in which we archive data, it is generally not possible to completely remove your personal data from our systems. However, if you have specific concerns, please contact us and we will see what we can do.',
      contactUser: '**When we will contact you**\n\nIf you do not register, we will never contact you. If you do register, we will contact you by e-mail in the following circumstances:\n\n* Occasionally, we will send e-mail messages to you highlighting a particular aspect of our research, announcing new features, explaining changes to the system, or inviting you to special events.\n\n* We might also use your email to contact you for the purpose of research into our site\'s operation, and we might ask for additional information at that time. Any additional information will be held consitently with this policy, and participation in such studies is entirely optional and participating or otherwise will in no way affect your use of the site.\n\n* We might contact you with a newsletter about the progress of the project.\n\nYou can \'opt out\' of communications from any project or from the Zooniverse as a whole at any time by visiting the Zooniverse [unsubscribe](https://www.zooniverse.org/unsubscribe) page.',
      furtherInfo: '**Further information and requests**\n\nThe Data Controller is the Department of Physics, University of Oxford. For a copy of the information we hold on you please contact the project team at the address below:\n\nProfessor Chris Lintott\nOxford Astrophysics\nDenys Wilkinson Building\nKeble Road\nOxford, OX1 3RH\nUnited Kingdom'
    },
    youthPolicy: {
      title: 'Advice for Volunteers Under 16 Years Old and Their Parent/Guardian',
      content: 'Please note that it is the parents’/guardians’ responsibility to explain the user agreement and privacy policy in simple terms to their child if signing up under 16s. There is no minimum age for signing up children as Zooniverse would like to encourage public engagement with research for all ages, though the platform may be more suitable for older children. Parents and guardians must supervise children if they are contributing to any message boards.'
    }
  },
  security: {
    title: 'Zooniverse Security',
    intro: 'The Zooniverse takes very seriously the security of our websites and systems, and protecting our users and their personal information is our highest priority. We take every precaution to ensure that the information you give us stays secure, but it is also important that you take steps to secure your own account, including:\n\n* Do not use the same password on different websites. The password you use for your Zooniverse account should be unique to us.\n* Never give your password to anyone. We will never ask you to send us your password, and you should never enter your Zooniverse password into any website other than ours. Always check your browser\'s address bar to make sure you have a secure connection to _www.zooniverse.org_.\n\nFor general advice and information about staying safe online, please visit:\n\n* [Get Safe Online](https://www.getsafeonline.org)\n* [Stay Safe Online](https://www.staysafeonline.org)\n* [US-CERT - Tips](https://www.us-cert.gov/ncas/tips)',
    details: '## Reporting Security Issues\n\nThe Zooniverse supports [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) of vulnerabilities. If you believe you have discovered a security vulnerability in any Zooniverse software, we ask that this first be reported to [security@zooniverse.org](mailto:security@zooniverse.org) to allow time for vulnerabilities to be fixed before details are published.\n\n## Known Vulnerabilities and Incidents\n\nWe believe it is important to be completely transparent about security issues. A complete list of fixed vulnerabilities and past security incidents is given below:\n\n* December 11, 2018: [Cross-Site Scripting Vulnerability on Project Page\'s External Links](https://blog.zooniverse.org/2018/12/20/fixed-cross-site-scripting-vulnerability-on-project-pages-external-links/)\n\n* June 21, 2018: [Cross-site scripting on project home pages](https://blog.zooniverse.org/2018/07/03/fixed-cross-site-scripting-vulnerability-on-project-home-pages/)\n\nNew vulnerabilities and incidents will be announced via the [Zooniverse blog in the "technical" category](http://blog.zooniverse.org/category/technical/).'
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
    register: 'S\'inscrire',
    orThirdParty: 'Ou se connecter avec un autre compte',
    withFacebook: 'Se connecter avec Facebook',
    withGoogle: 'Se connecter avec Google'
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
      beta: 'Recevoir les nouvelles sur le projet beta et devenir un testeur beta.'
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
      header: 'Projet',
    }
  },
  about: {
    index: {
      header: 'À propos',
      title: 'À propos',
      nav: {
        about: 'À propos',
        publications: 'Publications',
        ourTeam: 'Notre équipe',
        acknowledgements: 'Remerciements',
        contact: 'Nous contacter',
        faq: 'FAQ',
        resources: 'Ressources'
      }
    },
    home: {
      title: '## Zooniverse, qu\'est-ce que c\'est?',
      whatIsZooniverse: 'Zooniverse est la plateforme de recherche citoyenne la plus grande et la plus populaire. Cette recherche est rendue possible par des volontaires - plus d’un million de personnes à travers le monde qui se rassemblent pour aider des chercheurs professionnels. Notre objectif est de permettre des recherches qui seraient autrment impossibles ou impraticables. Les résultats de la recherche faites sur Zooniverse se traduisent par de nouvelles découvertes, des jeux de données utiles pour la communauté scientifique au sens large et [de nombreuses publications](/about /publications).',
      anyoneCanResearch: '### Chez Zooniverse, tout le monde peut être un chercheur\n\nVous n\'avez besoin d\'aucune spécialistaion, formation ou expertise pour participer à un projet de Zooniverse. Nous permettons à quiconque de contribuer facilement à de vrais recherches universitaires, sur son propre ordinateur et à sa convenance. \n\nVous pourrez étudier de réels objets d’études récoltés par des scientifiques, tels que des images de galaxies lointaines, des archives historiques et des des journaux intimes ou des vidéos d\'animaux dans leurs habitats naturels. En répondant à des questions simples, vous contribuerez à la compréhension de notre monde, de notre histoire, de notre univers et plus encore.\n\nGrâce a notre vaste et croissante collection de projets, qui couvre de nombreuses disciplines et sujets à travers les sciences et les sciences humaines, il y a une place pour que tout le monde explore, apprenne et s\'amuse chez Zooniverse. Pour vous porter volontaire, allez simplement sur la page [Projets](/projets), choisissez-en un qui vous plait et commencez.',
      accelerateResearch: '### Nous accélérons la recherche en travaillant ensemble\n\nLe défi majeur de la recherche au 21ème siècle est de gérer une quantité importante de données que nous pouvons collecter à propos du monde autour de nous. Les ordinateurs peuvent aider, mais dans de nombreux domaines les capacités humaines pour la reconnaissance de motifs - et notre capacité à être surpris -  nous rendent meilleurs. Avec l\'aide des volontaires de Zooniverse, les chercheurs peuvent analyser leurs données plus rapidement et plus précisément, gagner du temps et des ressources, améliorer la capacité des ordinateurs à effectuer les même tâches, et conduire à des progrès plus rapides et à une meilleure compréhension du monde, leur permettant d\'obtenir des résultats passionnants plus rapidement.\n\nNos projets combinent les contribution de nombreux volontaires individuels, reposant sur une idée de "sagesse des foules" pour produire des données fiables et précises. Lorsque plusieurs individus traitent le même groupe de données, cela permet aussi d\'estimer la probabilité de commettre une erreur. Le produit d’un projet Zooniverse est souvent exactement ce qui est nécessaire pour faire des progrès dans de nombreux domaines de recherche.',
      discoveries: '### Les volontaires et les professionnels font ensemble de véritables découvertes\n\nLes projets Zooniverse sont créés dans le but de convertir les efforts des volontaires en résultats quantifiables. Ces projets ont produit un grand nombre [d\’articles scientifiques publiés](/about/publications), ainsi que plusieurs ensembles en open-source (Code source libre) de données analysées. Dans certains cas, les volontaires de Zooniverse ont même fait d\’importantes découvertes scientifiques totalement inattendues. \n\nUne partie importante de ces recherches ont lieu sur les forums de discussion Zooniverse, où les volontaires peuvent travailler ensemble et avec l\’équipe de chercheurs. Ces discussions sont intégrées dans le forum du projet pour permettre de contribuer facilement aux recherches et à l\’étiquetage d\’information (# ou hashtag) jusqu\’à une analyse collaborative plus détaillée. Il y a également un forum de discussion central de Zooniverse, pour les discussions à propos de Zooniverse en général.\n\nBeaucoup des découvertes les plus intéressantes faites sur des projets Zooniverse sont venues de discussion entre volontaires et chercheurs.  Nous encourageons tous les utilisateurs à joindre les discussions sur le forum pour une participation plus approfondie.'

    },
    publications: {
      nav: {
        showAll: 'Tout afficher',
        space: 'Espace',
        physics: 'Physique',
        climate: 'Climat',
        humanities: 'Sciences humaines',
        nature: 'Nature',
        medicine: 'Médecine',
        meta: 'Méta',
      },
      content: {
        header: {
          showAll: 'Toutes les publications'
        },
        submitNewPublication: 'Pour soumettre une nouvelle publication ou éditer une publication existante,  merci d\’utiliser [ce formulaire](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). Notre objectif est de poster des liens vers des articles scientifiques publiés accessibles par tout le monde. Les articles acceptés pour publication mais pas encore publiés peuvent également être postés.'
      },
      publication: {
        viewPublication: 'Voir la publication.',
        viewOpenAccess: 'Voir la version libre d\'accès.'
      }

    },
    team: {
      nav: {
        showAll: 'Tout afficher',
        oxford: 'Oxford',
        chicago: 'Le Planétarium Adler',
        minnesota: 'Minnesota',
        portsmouth: 'Portsmouth',
        california: 'Californie',
        hilo: 'Hilo',
        alumni: 'Anciens membres'
      },
      content: {
        header: {
          showAll: 'Zooniverse Team'
        },
        adamMcMaster: {
          title: 'Infrastructure Engineer',
          bio: `Adam is responsible for managing the Zooniverse's web hosting infrastructure.,
          He has a computer science degree and has worked in web hosting and development for many years.
          He's also working on a degree in astronomy with the OU.`
        },
        alexBowyer: {
          title: 'Web Science Architect',
          bio: `Alex worked remotely for Zooniverse from his home in Northumberland.
          He designed and ran Zooniverse experiments and developed infrastructure and front-end code. Alex
          is a Dad of three, an improv player, a board gamer, and is running five half-marathons in 2016.`
        },
        alexWeiksnar: {
          title: 'Developer',
          bio: `Alex previously attended University of Miami, where he studied Psychology,
          Biology, and English. Alex enjoys reading, coding, and sailing in his free time.`
        },
        aliSwanson: {
          title: 'Researcher',
          bio: `Ali spent most of her PhD chasing lions around the Serengeti. She finished
          her PhD in Ecology, Evolution, and Behavior at the University of Minnesota in 2014,
          and joined the Zooniverse as a Postdoc in Ecology and Citizen Science.`
        },
        amyBoyer: {
          title: 'Developer',
          bio: `Amy has been a Zooniverse developer at the Adler since November 2015. She holds a BS and
          MS in computer science and has over a decade of industry experience. An aspiring astronomer as
          a child, she couldn't be happier to have landed here.`
        },
        andreaSimenstad: {
          title: 'Developer',
          bio: `Andrea joined Zooniverse as a developer at the University of Minnesota in 2015. When she is not captivated by code, she can be found enjoying snow on skis and exploring lakes by kayak. She graduated from Carleton College with a degree in Cognitive Science.`
        },
        arfonSmith: {
          title: 'Technical Lead',
          bio: `Arfon was co-founder and Technical Lead of the Zooniverse for the first five years of the project.
          Arfon served as Director of Citizen Science at the Adler Planetarium and co-lead of the Zooniverse until fall 2013.`
        },
        beckyRother: {
          title: 'Visual Designer',
          bio: `Becky joined the Zooniverse team as designer in 2017. With a background in mobile apps and product design and a degree in journalism, she's excited to use her powers for good with the Zooniverse team.`
        },
        beverleyNewing: {
          title: 'Web Developer Intern',
          bio: `Beverley is an English and German literature graduate and worked as a Web Developer Intern at Zooniverse. In her spare time she's an avid fan of geese and enjoys motorbiking.`
        },
        brianCarstensen: {
          title: 'UX Developer',
          bio: `Brian Carstensen moved from Chicago to Oxford and back again. Brian has a degree
          in graphic design from Columbia College in Chicago, and worked in that field for a
          number of years before finding a niche in web development.`
        },
        brookeSimmons: {
          title: 'Researcher',
          bio: `Brooke is an astrophysicist studying black holes, galaxies, and how citizen
          science can be applied to other non-traditional problems.`
        },
        camAllen: {
          title: 'Developer',
          bio: `Responsible for building the Zooniverse's API infrastructure.
          Cam considers himself a music and fine wine connoisseur - others do not.
          In his spare time he enjoys playing an obscure form of rugby.`
        },
        chrisLintott: {
          title: 'Zooniverse PI',
          bio: `Astronomer and co-founder of both Galaxy Zoo and the Zooniverse that grew from it,
          Chris is interested in how galaxies form and evolve, how citizen science can change the
          world, and whether the Chicago Fire can get their act together.`
        },
        chrisSnyder: {
          title: 'Project Manager',
          bio: `Chris Snyder began working on the Zooniverse team in fall 2012 as a web developer. In July 2013,
          he became the technical project manager. He received a degree in computer science from the University of Dayton.`
        },
        christopherDoogue: {
          title: 'Project Assistant',
          bio: `Chris supported the Zooniverse Oxford team from 2014-16. He had been with the Department
          of Astrophysics for over 2 years administratively supporting various projects. A former trained actor,
          he has the ability to look like he's smiling in the face of adversity!`
        },
        colemanKrawczyk: {
          title: 'Data Scientist',
          bio: `Coleman is helping to create new data analysis and visualization tools for existing Zooniverse
          projects as well as identifying new projects within the University of Portsmouth. He received
          his PhD in astrophysics from Drexel University.`
        },
        darrenMcRoy: {
          title: 'Community Manager',
          bio: `Darren (DZM) served as a liaison to the Zooniverse community and assisted with strategic
          content for projects. A Northwestern University graduate in journalism, he is also a golf addict,
          amateur author, and hopeless animal lover.`
        },
        darrylWright: {
          title: 'Researcher',
          bio: 'Darryl is doing machine learning research with the Zooniverse, based in Minnesota.'
        },
        grantMiller: {
          title: 'Communications Lead',
          bio: `A former exoplanetary scientist, Grant is now responsible for communicating with our volunteers and researchers. He is also behind the Zooniverse's presence on
          social media and publishes the Daily Zooniverse blog.`
        },
        hannahSewell: {
          title: 'Web Development placement student',
          bio: `Hannah is a PhD student in plant genetics from The University of Sheffield.
          She is visiting Zooniverse on a placement to learn web development for a few months and is definitely not an intern.`
        },
        helenSpiers: {
          title: 'Researcher',
          bio: `After finishing a PhD studying the molecular basis of human brain development, Helen joined the Zooniverse as a Postdoc in citizen science and medical research.`
        },
        gregHines: {
          title: 'Data Scientist',
          bio: `Greg used machine learning and statistics to help projects analyse their volunteer
          classifications. He has a PhD in Computer Science from University of Waterloo, Canada.
          Greg loves to eat pancakes with real maple syrup and run ultramarathons.`

        },
        heathVanSingel: {
          title: 'Designer',
          bio: `Heath was the UX/UI Designer at the Zooniverse where he worked to craft thoughtful and
          engaging user experiences. Apart from design, Heath also enjoys illustration, a good sci-fi or fantasy
          novel, and exploring his new home in the Pacific Northwest.`
        },
        hughDickinson: {
          title: 'Researcher',
          bio: `Hugh is a postdoc studying the Zooniverse.`
        },
        jamesArtz: {
          title: 'Developer',
          bio: `James joined the Zooniverse team in 2017. Before discovering his passion for code,
          he received a Ph.D in Mediterranean Archaeology from SUNY Buffalo, focusing on ancient Greece.
          In his free time he enjoys wood working and the ancient art of fermentation.`
        },
        jimODonnell: {
          title: 'UX Developer',
          bio: `Professional cynic but his heart's not in it. Web developer for the Zooniverse,
          Web Standards organiser, Amnesty UK activist.`
        },
        jenGupta: {
          title: 'Educator',
          bio: `Jen works on Galaxy Zoo education in her role as the SEPnet/Ogden Outreach Officer
          for the Institute of Cosmology and Gravitation, and has a PhD in astrophysics. Active
          galactic nuclei were her first love.`
        },
        jordanMartin: {
          title: 'Visual Designer',
          bio: `Jordan joined at the Adler Planetarium as Zooniverse's Visual Designer
          starting in 2015. She spent her time making our user interfaces beautiful,
          engaging, and a rewarding experience. At home she spends time with her
          two cats and many houseplants.`
        },
        julieFeldt: {
          title: 'Educator',
          bio: `Julie has a background in space physics and museum studies. She works on educational
          experiences, and Skype in the Classroom lessons for the Zooniverse. She loves to run, mostly
          to compensate for her love of cupcakes and chocolate.`
        },
        karenMasters: {
          title: 'Researcher',
          bio: `Karen is an astronomer and the Project Scientist of Galaxy Zoo, which she's been
          involved in as a researcher since 2008. She's particularly interested in the evolution of
          spiral galaxies.`
        },

        kellyBorden: {
          title: 'Educator',
          bio: `With a background in museum education, Kelly joined the Zooniverse in 2011 to bring
          an educator's perspective and spread the word amongst teachers and students. She's fond of
          several C's: chocolate, cats, coffee, and more chocolate.`
        },
        kyleWillett: {
          title: 'Researcher',
          bio: `Kyle is an astronomer who studies galaxies, masers, and black holes (although he's
          been getting more into data science). He worked on both Galaxy Zoo and Radio Galaxy Zoo,
          and developed advanced tools for the volunteers.`
        },
        lauraTrouille: {
          title: 'Zooniverse co-I',
          bio: `In July 2015, Laura became Director of Citizen Science at the Adler Planetarium and
          co-I of the Zooniverse. While earning her Ph.D. in 2010 studying galaxy evolution,
          she embodied cosmic collisions as a roller derby queen aptly named ‘The Big Bang’.`
        },
        lauraWhyte: {
          title: 'Adler Planetarium Zooniverse Director',
          bio: `Laura was the Director of Citizen Science at Adler Planetarium and co-lead of the
          Zooniverse from fall 2013 to summer 2015.`

        },
        lucyFortson: {
          title: 'University of Minnesota Zooniverse Director',
          bio: `Associate Professor of Physics and Astronomy at the University of Minnesota. One of the Zooniverse
          co-founders, she helps with project wrangling (aka management) and strategic planning while trying
          to squeeze a bit of galaxy evolution science in.`
        },
        mariamSaeedi: {
          title: 'Web Developer Intern',
          bio: `Mariam is the 2017 Web Development Intern at Zooniverse.
          She is proficient with HTML and CSS and is currently learning JavaScript and Rails.`
        },
        markBouslog: {
          title: 'Developer',
          bio: `Mark is a front-end web developer for the Zooniverse team at the Adler Planetarium. Joining in
          November 2015 from a career in accounting, he’s thrilled to focus his number crunching to 1’s and 0’s
          and is constantly inspired and humbled by the power of programming, citizen science and coffee.`
        },
        martenVeldthuis: {
          title: 'Developer',
          bio: `Marten joined the development team in 2015. He has a degree in
          computer science and enjoys crafting maintainable software. Marten learned about orbital
          mechanics from Kerbal Space Program, and feels like he's therefore basically an astrophysicist.`
        },
        megSchwamb: {
          title: 'Researcher',
          bio: `Meg is a planetary scientist and astronomer involved in the Planet Four projects,
          and Comet Hunters for which she is project scientist. She studies small bodies in the
          Solar System, exoplanets, and Mars. Meg has a fondness for baking, soccer, and champagne.`
        },
        melanieBeck: {
          title: 'Researcher',
          bio: `A PhD student at the University of Minnesota, Melanie works on combining machine learning
          with volunteer votes for classification tasks on the Galaxy Zoo project with the goal of classifying
          *billions* of galaxies that future telescopes will see.`
        },
        michaelParrish: {
          title: 'Rails/Backend Developer',
          bio: `Software developer at the Zooniverse. He pwns databases daily. Dog, fishing, snakes, and bourbon.`
        },
        noahMalmed: {
          title: 'Mobile App Developer',
          bio: `Noah mainly has a background in mobile app development as well as some firmware and backend experience.
          Outside of work, Noah enjoys cooking, baking and climbing.`
        },
        perryRoper: {
          title: 'Developer',
          bio: 'Perry was a developer with the Zooniverse, based in Oxford.'
        },
        rebeccaSmethurst: {
          title: 'Researcher',
          bio: `Becky is an astrophysicist working towards her doctorate in Oxford. She is
          interested in how galaxies change over time and how we can track this evolution.
          Happy-go-lucky about outreach, the Zooniverse and everything.`
        },
        robinSchaaf: {
          title: 'Mobile App Developer',
          bio: `Robin has a background in web development for educational institutions.  In her free time she enjoys board games and playing bass guitar.`
        },
        robertSimpson: {
          title: 'Developer',
          bio: `Robert was one of the founding developers of the Zooniverse, based in Oxford.
          If you can keep your head when all around you are losing theirs, you are probably
          Rob Simpson.`
        },
        rogerHutchings: {
          title: 'Developer',
          bio: `Roger builds front end interfaces for the Zooniverse, and enjoys coding, music and rebuilding
          motorbikes in his spare time.`
        },
        ronaCostello: {
          title: 'Web Development placement student',
          bio: `Rona is a PhD student studying plant evolution at Oxford and has joined the Zooniverse to get some web development experience for a few months.
          Enjoys movies, board games and hanging out under the sea.`
        },
        samanthaBlickhan: {
          title: 'IMLS Postdoctoral Fellow',
          bio: `Samantha Blickhan is the IMLS Postdoctoral Fellow in the Department of Citizen Science at the Adler Planetarium, working on transcription projects for the Zooniverse. She received her Ph.D. in Musicology from Royal Holloway, University of London, with a thesis on the palaeography of British song notation in the 12th and 13th centuries. Her research interests include music and perception, and their relationships with writing systems, technology and pedagogy.`
        },
        samuelAroney: {
          title: 'Web Development placement student',
          bio: `Samuel is a DPhil student studying the swimming behaviour of soil bacteria at Oxford.
          He joined Zooniverse to learn professional coding skills and perhaps build something useful.`
        },
        sandorKruk: {
          title: 'Researcher',
          bio: `Sandor is a graduate student working on his PhD in Astrophysics at Oxford.
          He is looking at how galaxies evolve using data from Galaxy Zoo and enjoys stargazing,
          using telescopes, and dancing in his free time.`
        },
        sarahAllen: {
          title: 'Developer',
          bio: `Sarah Allen is a front-end web developer for the Zooniverse team at the Adler
          Planetarium starting in September 2014. She also has a degree in music and enjoys cooking
          and live concerts in her free time.`
        },
        saschaIshikawa: {
          title: 'Developer',
          bio: `Sascha joined the Zooniverse team in November 2013 as a front-end developer.
          A former researcher and software developer at NASA Ames, he received degrees in both
          computer science and mechanical engineering.`
        },
        shaunANoordin: {
          title: 'Developer',
          bio: `Shaun was raised by Nintendo consoles and somehow transformed his love
          for video games into a love for creating interactive experiences. When not at
          his PC playing games or reading comics, he's at his PC studying web design and
          coding experimental apps.`
        },
        simoneDuca: {
          title: 'Developer',
          bio: `Simone joined the Zooniverse in 2015 as a frontend developer. In a previous life, he received a Phd in logic and philosophy
          from Bristol. After moving "Up North", he joined another worthy cause in 2018.`
        },
        stuartLynn: {
          title: 'Developer',
          bio: `Stuart arrived at the Adler as a developer in July 2011, having been one of the founding
          developers at Oxford. He studied mathematical physics at Edinburgh University and received his doctorate
          in astrophysics from Royal Observatory Edinburgh. Data analysis maestro and web developer.`
        },
        steveRaden: {
          title: 'Developer',
          bio: 'Steve Raden was a developer at the Adler in Chicago.'
        },
        veronicaMaidel: {
          title: 'Data Scientist',
          bio: `Veronica is a Data Scientist who worked on discovering patterns in Zooniverse data, by manipulating
          it and using it to create machine learning models. She received a PhD in Information Science and Technology
          from Syracuse University.`
        },
        victoriaVanHyning: {
          title: 'Researcher',
          bio: `Victoria is a British Academy postdoctoral fellow in English at Oxford, and is the humanities PI
          at Zooniverse. She works on Science Gossip, Annotate, and Shakespeare's World and more. Coffee is her lifeblood.`
        },
        willGranger: {
          title: 'Developer',
          bio: `Will joined the Adler Planetarium in 2016 as a front-end developer for the Zooniverse.
          In the past, he has taught English overseas, toured in bands, and helped open a music venue in Alabama.`
        },
        zachWolfenbarger: {
          title: 'Developer',
          bio: `Zach is a software developer. He was a molecular biologist, but then the lab needed some code
          to be written and the die was cast. He’s also in a couple of bands and can be found playing shows at bars
          and comic conventions all over the midwest.`
        }
      }
    },
    acknowledgements: {
      title: '## Remercier Zooniverse',
      citation: '### Citation Académique',
      instructions: 'D\'après les [Règles d\'utilisation du Constructeur de projet Zooniverse](https://help.zooniverse.org/getting-started/lab-policies), toutes publications de recherche utilisant des données dérivées d\'un projet Zooniverse approuvé (ceux listés sur la page [Projets de Zooniverse](/projects)) sont requis de remercier Zooniverse et la plateforme de construction de projet. Pour ce faire, merci d\'utiliser le texte suivant:',
      supportText: '*This publication uses data generated via the [Zooniverse.org](https://www.zooniverse.org/) platform, development of which is funded by generous support, including a Global Impact Award from Google, and by a grant from the Alfred P. Sloan Foundation.*',
      publicationRequest: 'Nous demandons à tous les chercheurs utilisant la plateforme de construction de projet, de quelque manière que ce soit, d\’envisager également d\’inclure le texte de remerciement ci-dessus dans leurs publications.',
      publicationShareForm: 'Nous encourageons fortement les propriétaires de projet à nous faire part de leurs publications acceptées utilisant des données provenant de Zooniverse via [ce formulaire](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). Vous pouvez trouver une liste des publications scientifiques utilisant des données Zooniverse sur notre page [Publications](publications).',
      questions: 'Si vous avez d\'autres questions sur la façon dont remercier Zooniverse, par exemple comment remercier un individu particulier ou un code sur mesure, merci de [nous contacter](contact).',
      press: '### Ecire à propos de Zooniverse dans la Presse',
      projectURLs: 'Lorsque vous écrivez un article de presse à propos d\'un projet Zooniverse en particulier, merci d\'inclue l\'adresse du site internet du projet (dans les éditions imprimées et numériques).',
      ZooURL: 'Lorsque vous écrivez un article à propos de Zooniverse en général, merci d\'inclure l\'adresse du site internet [Zooniverse.org](https://www.zooniverse.org/) dans votre article.',
      enquiries: 'Si vous souhaitez vous entretenir avec un membre de l\'équipe, merci de [nous contacter](contact).'
    },
    contact: {
      title: '## Contact & Réseaux Sociaux',
      discussionBoards: 'La plupart du temps, le meilleur moyen de contacter un membre de l\’équipe Zooniverse, ou de l\’équipe de n\’importe quel projet, plus spécifiquement à propos de problèmes en lien avec le projet,  est de poster un message sur le forum Zooniverse ou sur le forum du projet concerné.',
      email: 'Si vous avez besoin de contacter un membre de l\’équipe Zooniverse à propos d\’un sujet général, vous pouvez aussi envoyé un mail à [contact@zooniverse.org](mailto:contact@zooniverse.org). Notez que l\’équipe Zooniverse est relativement petite et très occupées, il nous est donc malheureusement impossible de répondre à tous les mails que nous recevons et vous remercions de votre compréhension.',
      collaborating: 'Si vous souhaitez collaborer avec Zooniverse, par exemple pour un projet construit sur demande, merci d’envoyer un mail à [collab@zooniverse.org](mailto:collab@zooniverse.org). (Notez que notre [Constructeur de projet](/lab) offre une façon efficace pour mettre en place un nouveau projet sans avoir à contacter notre équipe !)',
      pressInquiries: 'Pour les demandes de la part de la presse, merci de contacter les directeurs de Zooniverse, Chris Lintott par mail à [chris@zooniverse.org](mailto:chris@zooniverse.org) ou par téléphone au +44 (0) 7808 167288 ou Laura Trouille par mail à [trouille@zooniverse.org](mailto:trouille@zooniverse.org) ou par téléphone au +1 312 322 0820.',
      dailyZoo: 'Si vous voulez être informé de ce qu\’il se passe sur Zooniverse et de nos derniers résultats, consultez notre journal, le [Daily Zooniverse](http://daily.zooniverse.org/) ou le [blog Zooniverse](http://blog.zooniverse.org/). Vous pouvez aussi suivre Zooniverse sur [Twitter](http://twitter.com/the_zooniverse), [Facebook](http://facebook.com/therealzooniverse), et [Google+](https://plus.google.com/+ZooniverseOrgReal).'
    },
    faq: {
      title: '## Foire Aux Questions',
      whyNeedHelp: '- **Pourquoi les chercheurs ont besoin de vous ? Pourquoi les ordinateurs ne peuvent pas effectuer ces tâches ?**\nLes humains sont meilleurs que les ordinateurs dans de nombreuses tâches. Pour la plupart des projets Zooniverse, les ordinateurs ne sont simplement pas assez bons pour effectuer les tâches requises, ou pourraient louper des détails intéressants qu\’un humain pourrait voir – c\’est pourquoi nous avons besoin de votre aide. Certains projets Zooniverse ont aussi besoin de l\’aide d\’humain pour effectuer des classifications qui aident ensuite à entrainer les ordinateurs à être meilleurs dans ces tâches pour les recherches futures. Lorsque vous participez à un projet Zooniverse, vous contribuez à de la véritable recherche.',
      amIDoingThisRight: '- **Comment savoir si je fais ça correctement ?**\nPour la plupart des activités des projets Zooniverse, les chercheurs ne savent pas quelle est la bonne réponse et c\’est pour cette raison que nous avons besoin de votre aide. Les humains sont très bons pour reconnaître des motifs, donc généralement votre première idée est bonne. N\’ayez pas peur de faire des erreurs occasionnelles – plus d\’une personne vont voir et classifier chaque image, vidéo ou graphique d\’un projet. La plupart des projet Zooniverse ont aussi un bouton Aide, une page de Foire Aux Questions (FAQ) et un Guide de Terrain contenant plus d\’informations pour vous aider lorsque vous classifiez.',
      whatHappensToClassifications: '- **Que ce passe-t-il lorsque je soumets une classification ?**\nVotre classification est stockée dans la base de donnée en ligne sécurisée de Zooniverse. Plus tard, les membres de l’équipe de recherche du projet accèdent et combinent les classifications de tous les volontaires, y compris la vôtre, pour chaque image, vidéo ou graphique. Une fois que vous avez soumis une classification pour une image, une vidéo ou un graphique, vous ne pourrez pas revenir en arrière et changer votre classification. Plus d\’information peuvent être trouvé sur la page Zooniverse [Accord d\'utilisateur et politique de confidentialité](/privacy).',
      accountInformation: '- **Qu\’est ce que Zooniverse fait avec mes informations personnelles ?**\nZooniverse prend très au sérieux la protection des informations personnelles des volontaires ainsi que des données de classification. Les détails à propos de ces efforts peuvent être trouvés sur la page Zooniverse [Accord d\'utilisateur et politique de confidentialité](/privacy) et la page Zooniverse [Sécurité](/security).',
      featureRequest: '- **J\’ai une demande à propos d\’une fonctionnalité du site ou j\’ai trouvé un bug ; qui dois-je contacter/comment le reporter ?**\nVous pouvez poster vos suggestions pour de nouvelles fonctionnalités ou reporter un bug ou un problème sur le [forum Zooniverse](/talk) ou via le [dépôt de logiciel Zooniverse](https://github.com/zooniverse/Panoptes-Front-End/issues).',
      hiring: '- **Est-ce que Zooniverse embauche ?**\nZooniverse est une collaboration entre des institutions du Royaume-Uni et des Etats-Unis ; toutes nos équipes sont employées par une de nos institutions partenaires.  Allez voir la page [Carrières de Zoonvierse](https://jobs.zooniverse.org/) pour en savoir plus sur les opportunités d\'emploi à Zooniverse.',
      howToAcknowledge: '- **Je suis un propriétaire de projet/un membre d’une équipe de recherche, comment remercier Zooniverse et la plateforme de construction de projet dans mon article scientifique, mon résumé de conférence, etc. ?**\nVous pouvez trouvez les informations concernant la citation de Zooniverse dans vos articles scientifiques qui utilisent des données dérivées d\’un projet construit avec Zooniverse sur la page [Remerciements](/about/acknowledgements).',
      browserSupport: '- **Quels versions de navigateur est pris en charge par Zooniverse ?**\nNous prenons en charge les navigateurs majeurs jusqu\'à l\’avant dernière ou la dernière version disponible.',
      furtherHelp: 'Vous n\’avez pas trouvé de réponse à votre question ? Rendez vous sur la page [Solutions de Zooniverse](https://zooniverse.freshdesk.com/support/solutions), posez votre question sur le [forum Zooniverse](/talk) ou [contactez-nous](/about/contact).'
    },
    resources: {
      title: '## Ressources',
      filler: 'Téléchargements utiles et lignes directrices pour parler de Zooniverse.',
      introduction: '### Matériaux de marque',
      officialMaterials: '[Téléchargez le logo officiel de Zooniverse](https://github.com/zooniverse/Brand/tree/master/style%%20guide/logos). Notre couleur officielle est bleu canard: hex `#00979D` or `RGBA(65, 149, 155, 1.00)`.',
      printables: '[Téléchargez des cartes, posters et d\'autres documents éphémères à imprimer](https://github.com/zooniverse/Brand/tree/master/style%%20guide/downloads). Si vous avez des besoins spécifiques, merci de [nous contacter](/about/contact).',
      press: '### Informations pour la presse',
      tips: 'Conseils pour écrire à propos de Zooniverse dans la presse',
      listOne: '- Merci d\’inclure l\’adresse internet spécifique au projet lorsque vous parlez d\’un projet particulier. Si vous parlez de Zooniverse en général, merci d\’inclure www.zooniverse.org dans votre texte.  Allez voir la page [Remerciements](/about/acknowledgements) pour plus de détails sur la façon de citer correctement Zooniverse.',
      listTwo: '- Merci de noter que nous sommes une plateforme de recherche participative, et non une entreprise ou un organisme à but non-lucratif.',
      listThree: '- Si vous avez des questions à propos de Zooniverse et souhaitez parler à un membre de notre équipe, merci de [nous contacter](/about/contact).'
    },
    highlights: {
      title: '## Zooniverse Highlights Book 2019',
      thanks: '### Thank You!',
      paragraphOne: 'As a thank you and celebration of 2019 projects and impacts, we put together our first ‘Into the Zooniverse’ highlights book.',
      paragraphTwo: 'Over the past decade, Zooniverse projects have led to many unexpected and scientifically significant discoveries and over 160 [peer-reviewed publications](https://zooniverse.org/publications). All of this would have been impossible if it weren’t for our global community of nearly 2 million people working alongside hundreds of professional researchers.',
      paragraphThree: 'The book is an homage to the Zooniverse Year of 2019, highlighting 40 Zooniverse projects out of more than 200 launched to date. There are many fascinating projects we weren’t able to include this year. We hope to continue creating these books annually, highlighting a whole new set of projects and discoveries next year!',
      toDownload: '**To download a free electronic copy:**',
      download: 'Please click [here](http://bit.ly/zoonibook19-pdf) to download a free electronic copy of ‘Into the Zooniverse’.',
      toOrder: '**To order a hard copy:**',
      order: 'Please click [here](http://bit.ly/zoonibook19-buy) if you would like to order a hard copy of ‘Into the Zooniverse’. Note, the cost simply covers Lulu.com’s printing and postage fees - we will not be making any profit through sales of the hard copy of the book.',
      credits: 'A special thank you to our volunteers (Mark Benson, Caitlyn Buongiorno, Leslie Grove, and Andrew Salata) who wrote text, vetted it with research teams, and designed the book in collaboration with Zooniverse designer Becky Rother. We’re so thankful to them for their time and efforts.'
    },
    donate: {
      title: '## Donate',
      paragraphOne: 'Zooniverse is a collaboration between the University of Oxford, Chicago’s Adler Planetarium, the University of Minnesota – Twin Cities (UMN), hundreds of researchers, and over 2 million participants from around the world. The [Zooniverse teams](https://www.zooniverse.org/about/team) at Oxford, Adler, and UMN include the project leads, web developers, designer, communications lead, and researchers. This unique mix of expertise in research, public engagement, and modern web development supports an amazing community of volunteers and dedicated research teams using the Zooniverse platform.',
      paragraphTwo: 'Much of the Zooniverse’s funding comes through grants, as well as institutional support from Oxford, Adler, and UMN.',
      paragraphThree: 'Please consider making a tax-deductible donation to the Adler Planetarium. Your unrestricted gift to the Adler helps researchers unlock their data through online citizen science, astronomers bring telescopes into neighborhoods all over Chicagoland, teenagers launch original experiments into space, and people of all ages connect under the stars.',
      paragraphFour: 'Follow the link below to make a donation on the Adler Planetarium’s website.'
    }
  },
  getInvolved: {
    index: {
      title: 'S\'impliquer',
      nav: {
        volunteering: 'Etre volontaire',
        education: 'Education',
        callForProjects: 'Appel à projets',
        collections: 'Collections d\'images',
        favorites: 'Favoris'
      }
    },
    callForProjects: {
      audio: {
        header: '## Call for Zooniverse Audio Transcription Project Proposals',
        intro: 'Would your research benefit from the involvement of hundreds or even thousands of volunteers? Zooniverse.org is the world’s largest and most successful online platform for crowdsourced research. We currently have over 1.6 million registered volunteers working in collaboration with professional researchers on more than 70 research projects across a range of disciplines, from astronomy to biology, climatology to humanities subjects.',
        seekingProposals: 'Thanks to a generous grant from the Institute of Museum and Library Services, we are currently seeking proposals for two new custom audio transcription projects in the humanities or from GLAM institutions (Galleries, Libraries, Archives and Museums), to be developed as part of the Zooniverse platform.',
        projectSelection: '### Project Selection',
        requirements: 'This call will be limited to research teams with audio recordings of spoken language (not limited to English) which would benefit from transcription into digital text formats and/or classification tasks like metadata tagging. We are particularly keen to work on projects where the resulting data can be incorporated into an existing content management system (CMS) and used for research purposes.',
        audioCompatibility: 'Audio compatibility is currently not available on our free [Project Builder](https://www.zooniverse.org/lab) tool. One aim of this effort will be to use these projects to help test and expand the functionality of our audio tools.',
        selectionCriteriaTitle: '### Selection Criteria',
        selectionCriteriaOne: '1. We are looking for projects that harness crowdsourced audio transcription for the purposes of unlocking data currently trapped in sources that cannot be transcribed through automation, and for which human effort is truly necessary. Therefore, proposals should address any previously-attempted methods of automated speech to text transcription.',
        selectionCriteriaTwo: '2. The data extracted must have an audience or usefulness, be this to academic researchers, members of the public or both.',
        selectionCriteriaThree: '3. Audio clips for transcription should feature one speaker at a time (per audio clip), as our current research effort does not include speaker diarization.',
        selectionCriteriaFour: '4. Project teams need clear plans for how to make the crowdsourced data openly and publicly available, ideally through a CMS or site hosted and maintained by your institution.',
        selectionCriteriaFive: '5. Audio material must be digitized; we do not have funds to support digitization of audio material.',
        selectionCriteriaSix: '6. We will not accept projects if the material for transcription has previously been edited or published as text.',
        furtherNotes: '### Further Notes',
        imlsGrantInfo: 'The two selected audio transcription projects will be part of an ongoing Zooniverse effort, [Transforming Libraries and Archives through Crowdsourcing](https://www.imls.gov/grants/awarded/lg-71-16-0028-16). We particularly welcome applications from marginalized or underrepresented groups, or which utilize content about or generated by underrepresented groups.',
        deadline: '### Deadline for Audio Project Proposals:',
        contact: 'Project proposals are due by 28 February 2018. If you have questions or require any further guidance, please contact Samantha Blickhan, IMLS Postdoctoral Fellow: samantha@zooniverse.org.',
        submissionLink: '[SUBMIT AN AUDIO TRANSCRIPTION PROPOSAL](https://goo.gl/forms/ALbUaRN17Rlq7AkD3)',
        break: '***'
      },
      bio: {
        header: '## Call for Biomedical Project Proposals',
        wouldResearchBenefit: 'Would your research benefit from the involvement of thousands of volunteers? We are currently seeking proposals for biomedical projects to be developed as part of the Zooniverse platform. The Zooniverse is the world’s largest and most successful online platform for crowd-sourced research; we currently have over 1.5 million registered volunteers working in collaboration with professional researchers on more than 50 research projects across a range of disciplines, from physics to biology.',
        projectBuilder: 'Using our unique [Project Builder](/lab) you can create your own Zooniverse project for free with a set of tried and tested tools, including multiple-choice questions and region marking or drawing tools. If we don’t yet offer the tools you need, please propose your project below; we are particularly interested in developing novel projects that extend the functionality of our platform.',
        projectSelection: '### Project Selection',
        expandFunctionality: 'We are looking for biomedical projects that will help us expand the functionality of the Zooniverse and build on the selection of tools available to researchers via our platform. Projects may involve a processing task applied to images, graphs, videos or another data format, data collection, or a combination of the two. Successful projects will be developed and hosted by the Zooniverse team, in close collaboration with the applicants.',
        examples: 'Examples of our current biomedical projects include [Microscopy Masters](https://www.zooniverse.org/projects/jbrugg/microscopy-masters), where volunteers classify cryo-electron microscopy images to advance understanding of protein and virus structure, and [Worm Watch Lab](https://www.wormwatchlab.org/), which aims to improve understanding of the relationship between genes and behaviour.',
        selectionCriteriaTitle: '### Selection Criteria:',
        selectionCriteriaOne: '1. Projects extending the capability of the Zooniverse platform or serving as case studies for crowdsourcing in new areas are encouraged.',
        selectionCriteriaTwo: '2. Alignment with biomedical research (long-term aim of research is to improve human health outcomes).',
        selectionCriteriaThree: '3. Merit and usefulness of the data expected to result from the project.',
        deadline: '### Deadline\nProject proposals are accepted on a rolling basis. Applications will be reviewed at the beginning of each month.',
        submissionLink: '[SUBMIT A BIOMEDICAL PROPOSAL](https://goo.gl/forms/uUGdO5CpWDNFE5Uz2)'
      }
    },
    education: {
      title: '## L\'éducation avec Zooniverse',
      becomeCitizenScientist: 'En tant que volontaire sur les projets Zooniverse, vous et vos élèves pouvez devenir des citoyens  scientifiques et des citoyens chercheurs, participant à de vraies recherches scientifiques et dans d\’autres domaines. Si vous ou vos élèves pensez que vous avez fais une erreur, ne vous inquietez pas, même les chercheurs font des erreurs. Ces projets sont fait de façon à ce que plusieurs volontaires classifient chaque image, vidéo ou graphique du projet, ce qui permet d\’éliminer la grande majorité des erreurs humaines. Les erreurs font parti du jeu et peuvent même nous aider à évaluer la difficulté de la tâche demandée. Tant que toutes les personnes font de leur mieux,  ils aident !',
      resources: '### Ressources pour les professeurs utilisant Zooniverse',
      zooTeach: '- [ZooTeach](http://www.zooteach.org/) est un site collectant des leçons et ressources pour professeurs. Sur ZooTeach, vous trouverez une variété de ressources pour l\’éducation, incluant : des guides de projets pour étudiants et professeurs, des présentations crées par des professeur pour introduire un projet particulier à des élèves, et des leçons développées pour connecter vos élèves aux projets et recherches dans des contextes qu\’ils connaissent déjà.',
      educationPages: '- De nombreux projets Zooniverse ont leur propre page éducative avec des ressources supplémentaires pour professeurs. Ces ressources peuvent inclure des tutoriel vidéo expliquant comment s\’impliquer dans le projet, ainsi que d\’autres documents utiles et des vidéos à propos de la classification, et des ressources expliquant  la recherche effectué grâce au projet Zooniverse.',
      joinConversationTitle: '### Prenez part aux discussions',
      joinConversationBody: 'Restez informé des derniers efforts de Zooniverse en matière d\'éducation en consultant le [Blog Zooniverse](http://blog.zooniverse.org/) ou en suivant [&#64;zooteach](https://twitter.com/ZooTeach) sur Twitter. Vous pouvez également discuter avec d\'autres professeurs qui souhaitent utiliser la recherche participative faite sur Zooniverse, d\'une façon ou d\'une autre, dans leur environnement éducatif sur le forum, sur la page de discussion [Education](http://zooniverse.org/talk/16) du forum Zooniverse.',
      howEducatorsUseZooniverse: '### Comment les professeurs utilisent Zooniverse?',
      inspiration: 'Vous cherchez un peu d/’inspiration ? Voici quelques façons dont les projets Zooniverse et les ressources éducatives ont été utilisés :',
      floatingForests: '- [Floating Forests: Teaching Young Children About Kelp](http://blog.zooniverse.org/2015/04/29/floating-forests-teaching-young-children-about-kelp/)',
      cosmicCurves: '- [Cosmic Curves: Investigating Gravitational Lensing at the Adler Planetarium](http://blog.zooniverse.org/2014/03/18/cosmic-curves-investigating-gravitational-lensing-at-the-adler-planetarium/)',
      snapshotSerengeti: '- [Snapshot Serengeti Brings Authentic Research Into Undergraduate Courses](http://blog.zooniverse.org/2014/02/19/snapshot-serengeti-brings-authentic-research-into-undergraduate-courses/)',
      contactUs: 'Nous aimerions savoir comment vous utilisez Zooniverse avec vos étudiants adultes ou enfants ! Merci de contacter [education@zooniverse.org](mailto:education@zooniverse.org) si vous souhaitez partager votre histoire.'
    },
    volunteering: {
      title: '## Comment devenir volontaire',
      introduction: 'Tout d\’abord il faut savoir que chaque personne contribuant à un projet Zooniverse est un volontaire ! Nous avons une merveilleuse communauté qui nous aide dans ce que nous faisons. Les principales façons d\’être un volontaire parmi nous est de nous aider dans les classifications de données, d\’être un beta testeur de projets qui ne sont pas encore lancés, ou d\’être un modérateur pour un projet. Pour avoir plus d\’information sur chacun de ces rôles, lisez la suite.',
      projectVolunteeringTitle: '### Volontaire sur un projet',
      projectVolunteeringDescription: 'Le volontariat sur un projet est la façon la plus facile et la plus commune d\’être volontaire chez Zooniverse. Nous avons toujours besoin de volontaire pour classifier les données contenues dans un projet. Vous pouvez lire plus d’informations sur ce qu\’il se passe lorsque vous classifiez, comment obtenir de l\’aide de la communauté scientifique et connaitre les progrès de la science sur la page [A propos](/about) page.',
      projectLink: 'Il n\’y a pas de minimum de temps requis ; faites autant que vous le pouvez ou souhaitez. Pour commencer à classifier en temps que volontaire, allez simplement sur la page [Projets](/projects), regardez les projets disponible, trouvez celui qui vous plait le plus et commencez (n\’hésitez pas à en tester plusieurs)!',
      betaTesterTitle: '### Volontaire comme Beta testeur',
      betaTesterDescription: 'Les volontaires nous aident aussi à tester des projets avant qu\’ils soient lancés pour vérifier qu\’ils fonctionnent correctement. Ceci implique de faire quelques classifications sur la version beta du projet pour vérifier si ça fonctionne, chercher les potentiels bugs, et remplir un questionnaire. Ceci nous aide à trouver les problèmes dans les projets qui nécessitent d’être résolus et également d\’évaluer si le projet est adapté pour Zooniverse. Vous pouvez lire les règles qui font qu\’un projet est adapté sur la page [Policies](https://help.zooniverse.org/getting-started/lab-policies), sous \'Rules and Regulations\'.',
      betaTesterSignUp: 'Pour vous enregistrer comme Beta testeur, allez sur [www.zooniverse.org/settings/email](/settings/email) et cochez la case lié aux beta testeurs. Nous vous enverrons un email lorsqu\’un projet sera prêt à être testé. Vous pouvez changer vos préférences et vous désabonner des emails pour beta testeurs en utilisant la [même page] (/settings/email) et en décochant la case.',
      projectModeratorTitle: '### Volontaire comme modérateur',
      projectModeratorBody: 'Les modérateurs volontaires ont des droits supplémentaires dans les outils du forum de discussion d\’un projet particulier. Ils peuvent modérer les discussions et agir comme contact pour le projet. Les modérateurs sont sélectionnés par le propriétaire du projet. Si vous souhaitez devenir modérateur d’un projet, allez sur la page « A propos » du projet et contactez les chercheurs.',
      furtherInformationTitle: '### Plus d\’informations',
      contactUs: 'Si vous souhaitez plus d\’informations sur les différents rôles des volontaires, merci de [nous contacter](/about/contact).'
    }
  },
  lab: {
    help: {
      howToBuildProject: {
        title: '## How to create a project with our Project Builder',
        overview: {
          quickGuide: '* [A quick guide to building a project](#a-quick-guide-to-building-a-project)',
          navigating: '* [Navigating the project builder](#navigating-the-project-builder)\n  * [Project](#project)\n  * [Workflows](#workflows)\n  * [Subjects](#subjects)',
          inDetail: {
            title: '* [Project building in detail](#project-building-in-detail)',
            projectDetails: '* [Project Details](#project-details)',
            about: '  * [About](#about)',
            collaborators: '* [Collaborators](#collaborators)',
            fieldGuide: '* [Field Guide](#field-guide)',
            tutorial: '* [Tutorial](#tutorial)',
            media: '* [Media](#media)',
            visibility: '* [Visibility](#visibility)',
            workflows: '* [Workflows](#workflow-details)',
            createTasks: '* [Create Tasks](#create-tasks)',
            taskContent: '* [Task Content](#task-content)',
            questions: '* [Questions](#questions)',
            drawing: '* [Drawing](#drawing)',
            transcription: '* [Transcription](#transcription)',
            linking: '* [Linking the Workflow Together](#linking-the-workflow-together)',
            subjectSets: '* [Subject Sets](#subject-sets)',
            furtherHelp: '* [Further Help](#further-help)'
          }
        },
        sectionOverview: {
          title: 'There are three sections in this guide:',
          quickGuide: '1.  [A quick guide to building a project](#a-quick-guide-to-building-a-project) provides an overview of all the steps you need to complete to set up your project.',
          navigating: '2.  [Navigating the Project Builder](#navigating-the-project-builder) introduces the navigation bar (nav-bar) used in the project builder.',
          inDetail: '3.  [Project building in detail](#project-building-in-detail) provides a more detailed description of how to set up a project.'
        },
        quickGuide: {
          title: '## A quick guide to building a project',
          intro: 'A brief overview of all the steps you need to complete to set up your project.',
          step1: '1. Log in to your Zooniverse account.',
          step2: '2. Click on "Build a Project" (www.zooniverse.org/lab) and click "Create a New Project".',
          step3: '3. Enter your project details in the pop-up that appears. You’ll then be taken to a “Project Details” page where you can add further basic information.',
          step4: '4. Add more information about your project via the blue tabs on the left-hand side of the project builder page. Guidance for each of these sections is provided on the page itself.',
          step5: '5.  If you have data to upload, add your subjects via the “Subject Sets” tab of the Project Builder (detailed instructions are provided [here](#subjects)).',
          step6: '6. Next, create your workflow. Click on the “Workflow” tab in the navigation bar on the left-hand side of the page. Use the “New workflow” button to create a workflow. Multiple workflows can be created.',
          step7: '7. Once you’ve created a workflow, the "Associated Subject Sets" section allows you to link your workflow to your subject sets. If you have no subjects, go to the “Subject Sets” tab and upload your data (see step 5 above).',
          step8: '8. Hit the "Test this workflow" button to see how your project looks.',
          step9: '9. Explore your project to figure out what works and what doesn\'t. Make changes, then refresh your project page to test these out.',
          step10: '10. Guidelines on how to design your project to maximize engagement and data quality are provided on the [Policies page](https://help.zooniverse.org/getting-started/lab-policies).',
          step11: '11. When you are happy with your project, set it to “Public” on the “Visibility” tab. Use the “Apply for review” button to submit it to the Zooniverse team for review.',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        navigatingTheProjectBuilder: {
          title: '## Navigating the Project Builder',
          intro: 'On the left-hand side of the project builder you will see a number of tabs which can be divided into three key sections; “Project”, “Workflows” and “Subject Sets”. These are terms you\'ll see a lot, and they have specific meanings in the Zooniverse.',
          project: '**Project** is pretty self-explanatory; Galaxy Zoo and Penguin Watch are examples of Zooniverse projects that could be built using the project builder.',
          workflows: '**Workflows** are sequences of tasks that volunteers are asked to do.',
          subjectSets: '**Subject sets** are collections of data (typically images) that volunteers are asked to perform tasks on.',
          glossaryPage: 'For more Zooniverse definitions, check out the [Glossary page](https://help.zooniverse.org/getting-started/glossary).'
        },
        project: {
          title: '### Project',
          intro: 'The tabs listed below are where you enter descriptive information for your project.',
          details: '- **Project Details:** Here you can add information that generates a home page for your project. Start by naming and describing your project, add a logo and background image.',
          about: '- **About:** Here you can add all sorts of additional pages, including *Research, Team, Results, Education,* and *FAQ*',
          collaborators: '- **Collaborators:** Add people to your team. You can specify their roles so that they have access to the tools they need (such as access to the project before it\'s public).',
          fieldGuide: '- **Field Guide:** A field guide is a place to store general project-specific information that volunteers will need to understand in order to complete classifications and talk about what they\'re seeing.',
          tutorial: '- **Tutorial:** This is where you create tutorials to show your users how to contribute to your project.',
          media: '- **Media:** Add images you need for your project pages (not the images you want people to classify!)',
          visibility: '- **Visibility:** Set your project\'s "state" - private or public, live or in development, and apply for review by the Zooniverse. You can also activate or deactivate specific workflows on this page.',
          talk: '- **Talk:** Create and manage discussion boards for your project.',
          dataExports: '- **Data Exports:** Access your raw and aggregated classification data, subject data, and comments from Talk.'
        },
        workflow: {
          title: '### Workflows',
          body: 'A workflow is the sequence of tasks volunteers are asked to perform. For example, you might want to ask volunteers to answer questions about your images, or to mark features in your data, or both. The workflow tab is where you define those tasks and set the order in which volunteers are asked to do them. Your project might have multiple workflows (if you want to set different tasks for different image sets). See the detailed [Workflow](#workflow-details) section for more information.'
        },
        subjects: {
          title: '### Subjects',
          body: 'A subject is a unit of data to be analyzed. A single subject can include more than one image. A “subject set” consists of both the "manifest" (a list of the subjects and their properties), and the images themselves. Subjects can be grouped into different sets if useful for your research. See the [Subject Details](#subject-sets) section for more on subjects.',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        projectDetails: {
          title: '## Project building in detail',
          intro: 'Detailed instructions on how to use the pages described above.',
          subtitle: '### Project details',
          name: '* **Name**: The project name is the first thing people will see and it will show up in the project URL. Try to keep it short and sweet.',
          avatar: '* **Avatar**: Pick an avatar image for your project. This will represent your project on the Zooniverse home page. It can also be used as your project\'s brand. It\'s best if it\'s recognizable even as a small icon. To add an image, either drag and drop or click to open your file viewer. For best results, use a square image of not more than 50KB, but at minimum 100x100 pixels.',
          background: '* **Background**: This image will be the background for all of your project pages, including your project\'s front page. It should be relatively high resolution and you should be able to read text written across it. To add an image, either drag and drop or click to open your file viewer. For best results, use images of at least 1 megapixel, no larger than 256 KB. Most people\'s screens are not much bigger than 1300 pixels across and 750 pixels high, so if your image is a lot bigger than this you may find it doesn\'t look the way you expect. Feel free to experiment with different sizes on a "typical" desktop, laptop or mobile screen.',
          description: '* **Description**: This should be a one-line call to action for your project. This will display on your landing page and, if approved, on the Zooniverse home page. Some volunteers will decide whether to try your project based on reading this, so try to write short text that will make people actively want to join your project.',
          introduction: '* **Introduction**: Add a brief introduction to get people interested in your project. This will display on your project\'s front page. Note this field [renders markdown](http://markdownlivepreview.com/), so you can format the text. You can make this longer than the Description, but it\'s still probably best to save much longer text for areas like the About, Research Case or FAQ tabs.',
          workflowDescription: '* **Workflow Description:** A workflow is a set of tasks a volunteer completes to create a classification. Your project might have multiple workflows (if you want to set different tasks for different subject image sets). Add text here when you have multiple workflows and want to help your volunteers decide which one they should do.',
          checkboxVolunteers: '* **Checkbox: Volunteers choose workflow:**  If you have multiple workflows, check this to let volunteers select which workflow they want to work on; otherwise, they\'ll be served randomly.',
          researcherQuote: '* **Researcher Quote:** This text will appear on the project landing page alongside an avatar of the selected researcher. It’s a way of communicating information to your volunteers, highlighting specific team members, and getting volunteers enthusiastic about participating.',
          announcementBanner: '* **Announcement Banner:** This text will appear as a banner at the top of all your project’s pages. Only use this when you’ve got a big important announcement to make! Many projects use this to signal the end of a beta review, or other major events in a project’s life cycle.',
          disciplineTag: '* **Discipline Tag:** Enter or select one or more discipline tags to identify which field(s) of research your project belongs to. These tags will determine the categories your project will appear under on the main Zooniverse projects page, if your project becomes a full Zooniverse project.',
          otherTags: '* **Other Tags:** Enter a list of additional tags to describe your project separated by commas to help users find your project.',
          externalLinks: '* **External links:** Adding an external link will make it appear as a new tab alongside the About, Classify, Talk, and Collect tabs. You can rearrange the displayed order by clicking and dragging on the left gray tab next to each link.',
          socialLinks: '* **Social links:** Adding a social link will append a media icon at the end of your project menu bar. You can rearrange the displayed order by clicking and dragging on the left gray tab next to each link.',
          checkboxPrivate: '* **Checkbox: Private project:** On "private" projects, only users with specified project roles can see or classify on the project. We strongly recommend you keep your project private while you\'re still editing it. Share it with your team to get feedback by adding them in the Collaborators area (linked at the left-hand side of the Project Builder). Team members you add can see your project even if it\'s private. Once your project is public, anyone with the link can view and classify on it.',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        about: {
          title: '### About',
          intro: 'This section contains pages where you can enter further information for Research, Team, Results, Education and FAQ. All of these pages use [Markdown](http://markdownlivepreview.com/) to format text and display images.',
          research: '* **Research:** Use this section to explain your research to your audience in as much detail as you\'d like. Explaining your motivation to volunteers is critical for the success of your project – please fill in this page (it will display even if you don’t)!',
          team: '* **Team:** Introduce the members of your team, and the roles they play in your project.',
          results: '* **Results:** Share results from your project with volunteers and the public here. This page will only display if you add content to it.',
          education: '* **Education:** On this page, you can provide resources for educators and students to use alongside your project, such as course syllabi, pedagogical tools, further reading, and instructions on how the project might be used in an educational context. This page will only display if you add content to it.',
          faq: '* **FAQ:** Add details here about your research, how to classify, and what you plan to do with the classifications. This page can evolve as your project does so that your active community members have a resource to point new users to. This page will only display if you add content to it.'
        },
        collaborators: {
          title: '### Collaborators',
          intro: 'Here you can add people to your team. You can specify their roles so that they have access to the tools they need (such as access to the project before it\'s public).',
          owner: '* **Owner:** The owner is the original project creator. There can be only one.',
          collaborator: '* **Collaborator:** Collaborators have full access to edit workflows and project content, including deleting some or all of the project.',
          expert: '* **Expert:** Experts can enter “gold mode” to make authoritative gold standard classifications that will be used to validate data quality.',
          researcher: '* **Researcher:** Members of the research team will be marked as researchers on “Talk".',
          moderator: '* **Moderator:** Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on “Talk".',
          tester: '* **Tester:** Testers can view and classify on your project to give feedback while it’s still private. They cannot access the project builder.',
          translator: '* **Translator:** Translators will have access to the project builder as well as the translation site, so they can translate all of your project text into a different language.',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        fieldGuide: {
          title: '### Field Guide',
          intro: 'A field guide is a place to store general project-specific information that volunteers will need to understand in order to complete classifications and talk about what they\'re seeing. It\'s available anywhere in your project, accessible via a tab on the right-hand side of the screen.',
          details: 'Information can be grouped into different sections, and each section should have a title and an icon. Content for each section is rendered with [Markdown](http://markdownlivepreview.com/), so you can include any media you\'ve uploaded for your project there.'
        },
        tutorial: {
          title: '### Tutorial',
          intro: 'In this section, you can create a step-by-step tutorial to show your users how to use your project. You can upload images and enter text to create each step of the tutorial. You can add as many steps as you want, but keep your tutorial as short as possible so volunteers can start classifying as soon as possible.',
          details: 'In some cases, you might have several different workflows, and will therefore need several different tutorials. In the Workflows tab, you can specify which tutorial shows for the workflow a volunteer is on.'
        },
        media: {
          title: '### Media',
          intro: 'You can upload your own media to your project (such as example images for your Help pages or Tutorial) so you can link to it without an external host. To start uploading, drop an image into the grey box (or click “Select files” to bring up your file browser and select a file). Once the image has uploaded, it will appear above the "Add an image" box. You can then copy the Markdown text beneath the image into your project, or add another image.'
        },
        visibility: {
          title: '### Visibility',
          intro: 'This page is where you decide whether your project is public and whether it\'s ready to go live.',
          projectState: '* **Project State and Visibility:** Set your project to “Private” or “Public”. Only the assigned collaborators can view a private project. Anyone with the URL can access a public project. Here, you can also choose whether your project is in “Development”, or “Live”. Note: in a live project, active workflows are locked and can no longer be edited.',
          betaStatus: '* **Beta Status:** Here, you will find a checklist of tasks that must be complete for your project to undergo beta review. Projects must complete review in order to launch as full Zooniverse projects and be promoted as such. Once these tasks are complete, click “Apply for review”.',
          workflowSettings: '* **Workflow Settings:** You will see a list of all workflows created for the project. You can set the workflows to “Active”, choose what metric to measure for completeness statistics, and whether those statistics should be shown on your project’s Stats Page.For more information on the different project stages, see our [Project Builder policies](https://help.zooniverse.org/getting-started/lab-policies).',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        talk: {
          title: '### Talk',
          intro: '“Talk” is the name for the discussion boards attached to your project. On your Talk, volunteers will be able to discuss your project and subjects with each other, as well as with you and your project’s researchers. **Maintaining a vibrant and active Talk is important for keeping your volunteers engaged with your project.** Conversations on Talk also can lead to additional research discoveries.',
          details: 'You can use this page to set up the initial Talk boards for your project. We highly recommend first activating the default subject-discussion board, which hosts a single dedicated conversation for each subject. After that, you can add additional boards, where each board will host conversation about a general topic. Example boards might include: “Announcements,” “Project Discussion,” “Questions for the Research Team,” or “Technical Support.”'
        },
        dataExports: {
          title: '### Data Exports',
          intro: 'In this section you can request data exports for your Project Data (CSV format) and Talk Data (JSON format). Note that the Zooniverse will process at most 1 of each export within a 24-hour period and some exports may take a long time to process. We will email you when they are ready. For examples of how to work with the data exports see our [Data Digging code repository](https://github.com/zooniverse/Data-digging).'
        },
        workflowDetails: {
          title: '### Workflow Details',
          introduction: 'Note that a workflow with fewer tasks is easier for volunteers to complete. We know from surveys of our volunteers that many people classify in their limited spare time, and sometimes they only have a few minutes. Longer, more complex workflows mean each classification takes longer, so if your workflow is very long you may lose volunteers.',
          workflowTitle: '* **Workflow title:** Give your workflow a short, but descriptive name. If you have multiple workflows and give volunteers the option of choosing which they want to work on, this Workflow title will appear on a button instead of "Get started!"',
          version: '* **Version:** Version indicates which version of the workflow you are on. Every time you save changes to a workflow, you create a new version. Big changes, like adding or deleting questions, will change the version by a whole number: 1.0 to 2.0, etc. Smaller changes, like modifying the help text, will change the version by a decimal, e.g. 2.0 to 2.1. The version is tracked with each classification in case you need it when analyzing your data.',
          tasks: '* **Tasks:** There are two main types of tasks: questions and drawing. For question tasks, the volunteer chooses from a list of answers but does not mark or draw on the image. In drawing tasks, the volunteer marks or draws directly on the image using tools that you specify. They can also give sub-classifications for each mark. Note that you can set the first task from the drop-down menu.',
          mainText: '* **Main Text:** Describe the task, or ask the question, in a way that is clear to a non-expert. The wording here is very important, because you will in general get what you ask for. Solicit opinions from team members and testers before you make the project public: it often takes a few tries to reach the combination of simplicity and clarity that will guide your volunteers to give you the inputs you need. You can use markdown in the main text.',
          helpText: '* **Help Text:** Add text and images for a pop-up help window. This is shown next to the main text of the task in the main classification interface, when the volunteer clicks a button asking for help. You can use markdown in this text, and link to other images to help illustrate your description. The help text can be as long as you need, but you should try to keep it simple and avoid jargon. One thing that is useful in the help text is a concise description of why you are asking for this information.',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        createTasks: {
          title: '### Create Tasks',
          body: 'Create tasks with the "Add a task" button. Delete tasks with the "Delete this task" button under the “Choices” box.'
        },
        taskContent: {
          title: '### Task Content',
          body: 'Tasks can be Questions, Drawings or Transcription. All types have "Main Text" boxes where you can ask your questions or tell users what to draw, as well as provide additional support for completing the task in the "Help Text" box.'
        },
        questions: {
          title: '#### Questions',
          intro: 'Choices: This section contains all your answers. The key features of this section are:',
          required: '- **Required:** if you select this, the user has to answer the question before moving on.',
          multiple: '- **Multiple:** if you select this, the user can select more than one answer - use this for "select all that apply" type questions.',
          nextTask: '- **Next Task:** The “Next task” selection (which appears below the text box for each answer) describes what task you want the volunteer to perform next after they give a particular answer. You can choose from among the tasks you’ve already defined. If you want to link a task to another you haven’t built yet, you can come back and do it later (don’t forget to save your changes).'
        },
        drawing: {
          title: '#### Drawing',
          intro: 'This section contains all the different things people can mark. We call each separate option a "Tool" and you can specify a label, colour, and tool type for each option. Check out the [Aggregation documents](https://aggregation-caesar.zooniverse.org/docs) to understand how multiple volunteer answers are turned into final shapes for your data analysis. The tool types are:',
          bezier: '- **bezier:** an arbitrary shape made of point-to-point curves. The midpoint of each segment drawn can be dragged to adjust the curvature.',
          circle: '- **circle:** a point and a radius.',
          column: '- **column:** a box with full height but variable width; this tool *cannot* be rotated.',
          ellipse: '- **ellipse:** an oval of any size and axis ratio; this tool *can* be rotated.',
          line: '- **line:** a straight line at any angle.',
          point: '- **point:** X marks the spot.',
          polygon: '- **polygon:** an arbitrary shape made of point-to-point lines.',
          rectangle: '- **rectangle:** a box of any size and length-width ratio; this tool *cannot* be rotated.',
          triangle: '- **triangle:** an equilateral triangle of any size and vertex distance from the center; this tool *can* be rotated.',
          gridTable: '- **grid table:** cells which can be made into a table for consecutive annotations.',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        },
        transcription: {
          title: '#### Transcription',
          intro: 'This section deals with projects which require user-generated text. Tasks can range from adding keywords or extracting metadata to full text transcriptions.',
          keywordTagging: '- **Keyword tagging** is helpful when teams want to create a list of all of the things volunteers see in a given image, to make that object more discoverable in a database or online collection. In these cases diversity of opinion is helpful. Setting a retirement rate of 5 to 10 people will help capture diverse opinions.',
          fullTextTranscription: '- **Full text transcription** is more cumbersome and diversity of opinion is less helpful. Teams are usually trying to capture exactly what is on a page, so it will help to set a relatively low retirement rate for each image (i.e. 3 or 5) and be very clear in the tutorial how you would like volunteers to transcribe. Should they preserve spelling and punctuation or modernize it?',
          aggregatedClassifications: '- Zooniverse does not currently offer aggregated classifications for text subjects. We can only report what each user transcribed for each subject. Before embarking on a transcription project be sure you have in-house expertise or access to expertise for combining multiple independent transcriptions into a single reading that you could use for research or to upload into a library or museum catalogue or content management system. For more information on Project Builder Data, please visit our [Data Digging code repository](https://github.com/zooniverse/Data-digging) as well as our [Data processing Talk board](https://www.zooniverse.org/talk/1322).'
        },
        linking: {
          title: '#### Linking the workflow together',
          intro: 'Now that all the tasks have been created, we\'ve got to string them together by specifying what happens *next*. Set your first task using the "First Task" drop-down menu below the "Add Task" button. Then, using the “Next task” drop-down under the “Choices” box, specify *what comes next*. In question tasks, you can specify different "Next Tasks" for each available answer (provided users can only select one answer).',
          multiImageOptions: '**Multi-Image options:** If your tasks require users to see multiple subjects per task (like on [Snapshot Serengeti](https://www.snapshotserengeti.org)), decide how users will see them. The Flipbook option means users have to press a button to switch between subjects, while separate frames mean that each subject will be visible for the duration of the classification task.',
          subjectRetirement: '**Subject retirement:** Decide how many people you want to complete each task. You can change this number at any point (particularly after beta review). We suggest starting out high, between 10 and 20.'
        },
        subjectSets: {
          title: '### Subject Sets',
          intro: 'On this page, you can add groups of data to be classified.',
          summary: 'To do so, drag and drop items onto the drop zone in the browser and then upload. You can give each set a name so that you can easily distinguish between them.',
          details: 'Subject sets can be pretty powerful, and sometimes complex. You can have a single subject set that you add to over time, or have multiple subject sets, say, from different years or places. You can have different subject sets for different workflows, but you don\'t have to. You can even have multiple images in a given subject. For more details and advice on creating and structuring subject sets and associated manifests, check out https://www.zooniverse.orghttps://help.zooniverse.org/getting-started/example and scroll down to DETAILS - Subject sets and manifest details, a.k.a. “What is a manifest?”'
        },
        furtherHelp: {
          title: '## Further Help',
          body: 'If you\'d like some further information, check out the [documentation behind building Kitteh Zoo](https://help.zooniverse.org/getting-started/example), that talks you through building this project in the Project Builder.\n\nIf this doesn\'t help, get in contact with the Zooniverse team via the [contact page](/about/contact).',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        }
      }
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
};
