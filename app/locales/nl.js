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
    backButtonWarning: 'Als je terug gaat verlies je je werk voor de huidige taak.',
    close: 'Close',
    continue: 'Continue',
    detailsSubTaskFormSubmitButton: 'OK',    
    done: 'Klaar',
    doneAndTalk: 'Klaar & Praat',
    dontShowMinicourse: 'Do not show mini-course in the future',
    letsGo: 'Let’s go!',
    next: 'Verder',
    optOut: 'Opt out',
    taskTabs: {
      taskTab: 'Task',
      tutorialTab: 'Tutorial'
    },
    recents: 'Je recente classificaties',
    talk: 'Praat',
    taskHelpButton: 'Need some help with this task?',
    miniCourseButton: 'Herstart de minitour'
  },
  project: {
    language: 'Taal',
    loading: 'Project wordt geladen',
    disclaimer: 'Dit project is gemaakt met de Zooniverse projectbouwer maar is not niet een officieel Zooniverseproject. Vragen en problemen met betrekking tot dit project die gestuurd worden aan het Zooniverseteam krijgen mogelijk geen reactie.',
    about: {
      header: 'About',
      nav: {
        research: 'Research',
        results: 'Results',
        faq: 'FAQ',
        education: 'Education',
        team: 'The Team',
      }
    },
    nav: {
      about: 'Over',
      classify: 'Classificeer',
      talk: 'Praat',
      collections: 'Verzamel',
      recents: 'Recent',
      lab: 'Lab',
      adminPage: 'Beheerpagina',
      underReview: 'Under Review',
      zooniverseApproved: 'Zooniverse Approved'
    },
    classifyPage: {
      dark: 'dark',
      light: 'light',
      title: 'Classify',
      themeToggle: 'Switch to %(theme)s theme'
    },
    home: {
      researcher: 'Woorden van de onderzoeker',
      about: 'Over %(title)s',
      metadata: {
        statistics: '%(title)s statistieken',
        classifications: 'Classificeringen',
        volunteers: 'Vrijwilligers',
        completedSubjects: 'Voltooide Onderwerpen',
        subjects: 'Onderwerpen'
      },
      talk: {
        zero: 'Niemand praat over **%(title)s** op dit moment.',
        one: '**1** persoon praat over **%(title)s** op dit moment.',
        other: '**%(count)s** mensen praten over **%(title)s** op dit moment.'
      },
      joinIn: 'Doe mee',
      learnMore: 'Learn more',
      getStarted: 'Get started',
      workflowAssignment: 'You\'ve unlocked level %(workflowDisplayName)s',
      visitLink: 'Visit the project',
      links: 'Links'
    }
  },
  organization: {
    loading: 'Organisatie wordt geladen',
    error: 'Er ging iets mis bij het laden van de organisatie',
    notFound: 'organisatie werd niet gevonden.',
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
      clear: 'Wis',
      clearFilters: 'Wis filters',
      makeSelection: 'Maak een keuze',
      showing: 'Toont %(count)s van %(max)s',
      confused: 'Vaak verward met',
      dismiss: 'Sluiten',
      itsThis: 'Ik denk dat het dit is',
      cancel: 'Annuleer',
      identify: 'Identificeer',
      surveyOf: 'Inspectie van %(count)s',
      identifications: {
        zero: 'Geen identificaties',
        one: '1 identificatie',
        other: '%(count)s identificaties'
      }
    }
  },
  privacy: {
    title: 'Zooniverse Gebruikersovereenkomst en privacybeleid',
    userAgreement: {
      summary: '## User Agreement\n**Summary**\n\nThe Zooniverse is a suite of citizen science projects operated by the Citizen Science Alliance (CSA), which support scientific research by involving members of the public - you - in the processes of analyzing and discussing data. Data from these projects is used to study online community design and theory, interface design, and other topics. This document describes what will happen to your contributions if you choose to contribute and what data we collect, how we use it and how we protect it.',
      contribution: '**What you agree to if you contribute to the Zooniverse**\n\nProjects involving the public are needed to enable researchers to cope with the otherwise unmanageable flood of data. The web provides a means of reaching a large audience willing to devote their free time to projects that can add to our knowledge of the world and the Universe.\n\nThe major goal for this project is for the analyzed data to be available to the researchers for use, modification and redistribution in order to further scientific research. Therefore, if you contribute to the Zooniverse, you grant the CSA and its collaborators, permission to use your contributions however we like to further this goal, trusting us to do the right thing with your data. However, you give us this permission non-exclusively, meaning that you yourself still own your contribution.\n\nWe ask you to grant us these broad permissions, because they allow us to change the legal details by which we keep the data available; this is important because the legal environment can change and we need to be able to respond without obtaining permission from every single contributor.\n\nFinally, you must not contribute data to the Zooniverse that you do not own. For example, do not copy information from published journal articles. If people do this, it can cause major legal headaches for us.',
      data: '**What you may do with Zooniverse data**\n\nYou retain ownership of any contribution you make to the Zooniverse, and any recorded interaction with the dataset associated with the Zooniverse. You may use, distribute or modify your individual contribution in any way you like. However, you do not possess ownership of the dataset itself. This license does not apply to data about you, covered in the Privacy Policy.',
      legal: '**Legal details**\n\nBy submitting your contribution to the Zooniverse, you agree to grant the CSA a perpetual, royalty-free, non-exclusive, sub-licensable license to: use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and exercise all copyright and publicity rights with respect to your contribution worldwide and/or to incorporate your contribution in other works in any media now known or later developed for the full term of any rights that may exist in your contribution.\n\nIf you do not want to grant to the CSA the rights set out above, you cannot interact with the Zooniverse.\n\nBy interacting with the Zooniverse, you:\n\n* Warrant that your contribution contains only data that you have the right to make available to the CSA for all the purposes specified above, is not defamatory, and does not infringe any law; and\n\n* Indemnify the CSA against all legal fees, damages and other expenses that may be incurred by the CSA as a result of your breach of the above warranty; and\n\n* Waive any moral rights in your contribution for the purposes specified above.\n\nThis license does not apply to data about you, covered in the Privacy Policy.'
    },
    privacyPolicy: {
      intro: '## Privacy Policy\n\nIn addition to the contributions you make towards the scientific goals of the Zooniverse, we collect additional data about you to support and improve the operation of the project. We also conduct experiments on the design of the website that we evaluate based on your reactions and behavior. This Privacy Policy describes what data we collect, how we use it and how we protect it.\n\nWe respect the privacy of every individual who participates in the Zooniverse. We operate in accordance with the United Kingdom Data Protection Act 1998 and the Freedom of Information Act 2000, as well as with United States regulations regarding protection of human subjects in research.',
      data: '**Data we collect**\n\n_Identifying information_: If you register with the Zooniverse, we ask you to create a username and supply your e-mail address. Your e-mail address is not visible to other users, but others will see your username in various contexts. Notably, your username is associated with any classifications or other contributions you make, e.g., on Talk pages. You may optionally provide your real name to be included when we publically thank participants, e.g., in presentations, publications or discoveries.\n\n_Usage information_: We also monitor how people use our website, and aggregate general statistics about users and traffic patterns as well as data about how users respond to various site features. This includes, among other things, recording:\n\n* When you log in.\n\n* Pages you request.\n\n* Classifications you make.\n\n* Other contributions, such as posts on Talk pages.\n\nIf you register and log in, the logs associate these activities with your username. Otherwise, they are associated with your IP address. In order to collect this data, we may use software that collects statistics from IP data. This software can determine what times of day people access our site, which country they access the websites from, how long they visit for, what browser they are using, etc.',
      info: '**What we do with the information we gather**\n\nUsage information is collected to help us improve our website in particular for the following reasons:\n\n* Internal record keeping.\n\n* We may periodically send email promoting new research-related projects or other information relating to our research. Information about these contacts is given below. We will not use your contact information for commercial purposes.\n\n* We may use the information to customize the website.\n\n* We may use the information to conduct experiments regarding the use of various site features.',
      thirdParties: '**What is shared with third parties**\n\nWe will never release e-mail addresses to third parties without your express permission. We will also never share data we collect about you unless (a) it cannot be associated with you or your username, and (b) it is necessary to accomplish our research goals. Specifically, we may share your anonymized data with research study participants, other researchers, or in scholarly work describing our research. For example, we might use one of your classifications as an illustration in a paper, show some of your classifications to another user to see if they agree or disagree, or publish statistics about user interaction.\n\nContributions you make to the Talk pages are widely available to others. Aside from the above, information is held as confidentially as is practical within our secured database.',
      cookies: '**How we use cookies**\n\nIn some areas of our site, a cookie may be placed on your computer. A cookie is a small file that resides on your computer\'s hard drive that allows us to improve the quality of your visit to our websites by responding to you as an individual.\n\nWe use traffic log cookies to identify which pages are being used and improve our website. We only use this information for statistical analysis purposes, they are not shared with other sites and are not used for advertisements.\n\nYou can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, if you choose to decline cookies from the Zooniverse then functionality, including your ability to log-in and participate, will be impaired.\n\nAcceptance of cookies is implied if you continue to access our website without adjusting your browser settings.',
      dataStorage: '**Where we store your data**\n\nWe use Amazon Web Services so we can quickly and reliably serve our website to an unpredictable number of people. This means that your data will be stored in multiple locations, including the United States of America (USA). Amazon is a participant in the Safe Harbor program developed by the USA Department of Commerce and the European Union (EU). Amazon has certified that it adheres to the Safe Harbor Privacy Principles agreed upon by the USA and the EU.\n\nOur mailing list server, which contains a copy of subscribed email addresses and no other personal data, is hosted on a virtual private server with Linode in the UK.',
      security: '**Security measures**\n\nMembers of the research teams are made aware of our privacy policy and practices by reviewing this statement upon joining the team. We follow industry best practices to secure user data, and access to the database and logs are limited to members of the research group and system administrative staff.',
      dataRemoval: '**Removing your data**\n\nDue to the way in which we archive data, it is generally not possible to completely remove your personal data from our systems. However, if you have specific concerns, please contact us and we will see what we can do.',
      contactUser: '**When we will contact you**\n\nIf you do not register, we will never contact you. If you do register, we will contact you by e-mail in the following circumstances:\n\n* Occasionally, we will send e-mail messages to you highlighting a particular aspect of our research, announcing new features, explaining changes to the system, or inviting you to special events.\n\n* We may also use your information to contact you for the purpose of research into our site\'s operation. We may contact you by email. We may ask for additional information at that time. Providing additional information is entirely optional and will in no way affect your service in the site.\n\n* We may contact you with a newsletter about the progress of the project.\n\nYou are unlikely to receive more than two messages per month.\n\nYou can \'opt out\' of the newsletter at any time by visiting the Zooniverse [unsubscribe](https://www.zooniverse.org/unsubscribe) page.',
      furtherInfo: '**Further information and requests**\n\nThe Data Controller is the Department of Physics, University of Oxford. For a copy of the information we hold on you please contact the project team at the address below:\n\nProfessor Chris Lintott\nOxford Astrophysics\nDenys Wilkinson Building\nKeble Road\nOxford, OX1 3RH\nUnited Kingdom'
    }
  },
  security: {
    title: 'Zooniverse Beveiligingsbeleid',
    intro: 'The Zooniverse takes very seriously the security of our websites and systems, and protecting our users and their personal information is our highest priority. We take every precaution to ensure that the information you give us stays secure, but it is also important that you take steps to secure your own account, including:\n\n* Do not use the same password on different websites. The password you use for your Zooniverse account should be unique to us.\n* Never give your password to anyone. We will never ask you to send us your password, and you should never enter your Zooniverse password into any website other than ours. Always check your browser\'s address bar to make sure you have a secure connection to _www.zooniverse.org_.\n\nFor general advice and information about staying safe online, please visit:\n\n* [Get Safe Online](https://www.getsafeonline.org)\n* [Stay Safe Online](https://www.staysafeonline.org)\n* [US-CERT - Tips](https://www.us-cert.gov/ncas/tips)',
    details: '## Reporting Security Issues\n\nThe Zooniverse supports [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) of vulnerabilities. If you believe you have discovered a security vulnerability in any Zooniverse software, we ask that this first be reported to [security@zooniverse.org](mailto:security@zooniverse.org) to allow time for vulnerabilities to be fixed before details are published.\n\n## Known Vulnerabilities and Incidents\n\nWe believe it is important to be completely transparent about security issues. A complete list of fixed vulnerabilities and past security incidents is given below:\n\n* _(No entries at this time)_\n\nNew vulnerabilities and incidents will be announced via the [Zooniverse blog in the "technical" category](http://blog.zooniverse.org/category/technical/).'
  },
  userAdminPage: {
    header: 'Beheer',
    nav: {
      createAdmin: 'Beheer gebruikers',
      projectStatus: 'Zet projectstatus',
      grantbot: 'Grantbot',
      organizationStatus: 'Zet organisatiestatus'
    },
    notAdminMessage: 'Je bent geen beheerder',
    notSignedInMessage: 'Je bent niet ingelogd'
  },
  signIn: {
    title: 'Inloggen/registreren',
    withZooniverse: 'Log in met je Zooniverseaccount',
    whyHaveAccount: 'Ingelogde vrijwilligers kunnen hun eigen werk bijhouden en worden vermeld in publicaties.',
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
    newPasswordFormDialog: 'Voer hetzelfde wachtwoord tweemaal in, zodat je verder kunt met onderzoek doen. Een wachtwoord moet tenminste 8 tekens lang zijn.',
    newPasswordFormLabel: 'Nieuw wachtwoord:',
    newPasswordConfirmationLabel: 'Herhaal, ter controle:',
    enterEmailLabel: 'Voer je e-mailadres in en we sturen je een link waarmee je kunt herstellen.',
    emailSuccess: 'We hebben je zojuist een e-mail met een herstellink gezonden.',
    emailError: 'Er ging iets mis bij het herstellen van je wachtwoord.',
    passwordsDoNotMatch: 'De wachtwoorden komen niet overeen, probeer het opnieuw.',
    loggedInDialog: 'Je bent op dit moment ingelogd. Log uit om je wachtwoord te herstellen.',
    missingEmailsSpamNote: 'Als je geen e-mail ontvangen hebt, controleer dan of het wellicht in je spamfolder terecht is gekomen.',
    missingEmailsAlternateNote: 'Als je nog steeds geen e-mail ontvangen hebt, controleer of je misschien een ander e-mailadres voor je account hebt gebruikt.'
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
