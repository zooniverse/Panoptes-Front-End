export default {
  loading: '(načítá se)',
  aboutPages: {
    missingContent: {
      education: 'This project has no educational resources yet.',
      faq: 'This project has no frequently asked questions yet.',
      research: 'This project has no science case yet.',
      results: 'This project has no results to report yet.',
      team: 'This project has no team information.',
    }
  },
  projectRoles: {
    title: 'The Team',
    owner: 'Owner',
    collaborator: 'Collaborator',
    translator: 'Translator',
    scientist: 'Researcher',
    moderator: 'Moderator',
    tester: 'Tester',
    expert: 'Expert',
    museum: 'Museum',
  },
  classifier: {
    back: 'Zpět',
    backButtonWarning: 'Krokem zpět ztratíte započatou práci na tomto úkolu.',
    close: 'Zavřít',
    continue: 'Pokračovat',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Dokončit',
    doneAndTalk: 'Dokončit & Komentovat',
    dontShowMinicourse: 'Mini-kurz již v budoucnu nezobrazovat',
    letsGo: 'Pojďme na to!',
    next: 'Další',
    optOut: 'Zrušit účast',
    taskTabs: {
      taskTab: 'Úkol',
      tutorialTab: 'Tutorial/Návod'
    },
    recents: 'Tvé nedávné klasifikace',
    talk: 'Diskuze',
    taskHelpButton: 'Potřebuješ pomoct s tímto úkolem?',
    miniCourseButton: 'Znovu spustit Mini-kurz',
    workflowAssignmentDialog: {
      promotionMessage: "Gratulujeme! Otevřela se ti další úroveň s úkoly. Pokud si přeješ zůstat v té současné, můžeš.",
      acceptButton: 'Jít do další úrovně!',
      declineButton: 'Ne, děkuji'
    },
    interventions: {
      optOut: "Tyto zprávy již nezobrazovat."
    }
  },
  project: {
    language: 'Jazyk',
    loading: 'Projekt se načítá',
    disclaimer: 'Tento projekt byl vybudován za pomoci aplikace Zooniverse Project Builder, ale zatím není oficiálním projektem Zooniverse. Dotazy a připomínky týkající se tohoto projektu směřované na tým Zooniverse se nemusí dočkat odezvy.',
    fieldGuide: 'Field Guide',
    about: {
      header: 'O projektu',
      nav: {
        research: 'Výzkum',
        results: 'Výsledky',
        faq: 'FAQ - Často kladené dotazy',
        education: 'Výuka',
        team: 'Tým',
      }
    },
    nav: {
      about: 'O projektu',
      adminPage: 'Admin stránka',
      classify: 'Klasifikovat',
      collections: 'Alba',
      exploreProject: 'Prozkoumat Projekt',
      lab: 'Lab',
      recents: 'Nedávno zobrazené',
      talk: 'Diskuze',
      underReview: 'Probíhá revize',
      zooniverseApproved: 'Schváleno Zooniverse'
    },
    classifyPage: {
      dark: 'tmavého',
      light: 'světlého',
      title: 'klasifikovat',
      themeToggle: 'Přepnout do %(theme)s prostředí'
    },
    home: {
      organization: 'Organizace',
      researcher: 'Slovy vědců',
      about: 'O projektu %(title)s',
      metadata: {
        statistics: 'Statistiky projektu %(title)s',
        classifications: 'Klasifikací',
        volunteers: 'Dobrovolníků',
        completedSubjects: 'Dokončených objektů',
        subjects: 'Objektů'
      },
      talk: {
        zero: 'Momentálně o projektu **%(title)s** nikdo nemluví.',
        one: '**1** člověk mluví o projektu **%(title)s** právě teď.',
        other: '**%(count)s** lidí mluví o projektu **%(title)s** právě teď.'
      },
      joinIn: 'Zapojit se',
      learnMore: 'Dozvědět se více',
      getStarted: 'Začít',
      workflowAssignment: 'Otevřela se ti další úroveň s úkoly - %(workflowDisplayName)s',
      visitLink: 'Navštivte projekt',
      links: 'Externí odkazy k projektu'
    }
  },
  organization: {
    error: 'Došlo k chybě během načítání organizace',
    home: {
      introduction: 'Představení',
      links: 'Odkazy',
      metadata: {
        projects: 'Projekty'
      },
      projects: {
        error: 'Došlo k chybě během načítání projektů dané organizace.',
        loading: 'Načítání projektů organizace...',
        none: 'Nejsou zde žádné projekty související s touto organizací.'
      },
      readLess: 'Zobrazit méně',
      readMore: 'Zobrazit více',
      researcher: 'Slovy vědců',
      viewToggle: 'Zobrazit jako dobrovolník'
    },
    loading: 'Načítání organizace',
    notFound: 'Organizace nenalezena.',
    notPermission: 'Pokud jste si jisti, že URL je sprváná, pravděpodobně nemáte povolení zobrazit tuto organizaci.',
    pleaseWait: 'Čekejte prosím...'
  },
  tasks: {
    hidePreviousMarks: 'Skrýt předchozí značky %(count)s',
    less: 'Méně',
    more: 'Více',
    shortcut: {
      noAnswer: 'Bez odpovědi'
    },
    survey: {
      clear: 'Zrušit',
      clearFilters: 'Zrušit filtry',
      makeSelection: 'Vyberte',
      showing: 'Zobrazuje %(count)s kategorií z %(max)s',
      confused: 'Někdy zaměněno za',
      dismiss: 'Zamítnout možnost',
      itsThis: 'Myslím, že to je ono',
      cancel: 'Zrušit',
      identify: 'Identifikovat',
      surveyOf: 'Výzkum z celkového počtu %(count)s kategorií',
      identifications: {
        zero: 'Žádná identifikace',
        one: '1 identifikace',
        other: '%(count)s identifikací'
      }
    }
  },
  security: {
    title: 'Zooniverse Security',
    intro: 'The Zooniverse takes very seriously the security of our websites and systems, and protecting our users and their personal information is our highest priority. We take every precaution to ensure that the information you give us stays secure, but it is also important that you take steps to secure your own account, including:\n\n* Do not use the same password on different websites. The password you use for your Zooniverse account should be unique to us.\n* Never give your password to anyone. We will never ask you to send us your password, and you should never enter your Zooniverse password into any website other than ours. Always check your browser\'s address bar to make sure you have a secure connection to _www.zooniverse.org_.\n\nFor general advice and information about staying safe online, please visit:\n\n* [Get Safe Online](https://www.getsafeonline.org)\n* [Stay Safe Online](https://www.staysafeonline.org)\n* [US-CERT - Tips](https://www.us-cert.gov/ncas/tips)',
    details: '## Reporting Security Issues\n\nThe Zooniverse supports [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) of vulnerabilities. If you believe you have discovered a security vulnerability in any Zooniverse software, we ask that this first be reported to [security@zooniverse.org](mailto:security@zooniverse.org) to allow time for vulnerabilities to be fixed before details are published.\n\n## Known Vulnerabilities and Incidents\n\nWe believe it is important to be completely transparent about security issues. A complete list of fixed vulnerabilities and past security incidents is given below:\n\n* December 11, 2018: [Cross-Site Scripting Vulnerability on Project Page\'s External Links](https://blog.zooniverse.org/2018/12/20/fixed-cross-site-scripting-vulnerability-on-project-pages-external-links/)\n\n* June 21, 2018: [Cross-site scripting on project home pages](https://blog.zooniverse.org/2018/07/03/fixed-cross-site-scripting-vulnerability-on-project-home-pages/)\n\nNew vulnerabilities and incidents will be announced via the [Zooniverse blog in the "technical" category](http://blog.zooniverse.org/category/technical/).'
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Spravovat uživatele',
      projectStatus: 'Nastavit Projekt Status',
      grantbot: 'Grantbot',
      organizationStatus: 'Nastavit Organization Status'
    },
    notAdminMessage: 'Nejste administrátor',
    notSignedInMessage: 'Nejste přihlášeni'
  },
  signIn: {
    title: 'Přihlásit se/Zaregistrovat se',
    withZooniverse: 'Přihlásit se pomocí svého Zooniverse účtu',
    whyHaveAccount: 'Přihlášení dobrovolníci mohou sledovat vlastní pokrok a ve výsledné publikaci budou uvedeni v kreditech.',
    signIn: 'Přihlásit se',
    register: 'Zaregistrovat se',
    orThirdParty: 'Nebo se přihlásit pod jinou službou',
    withFacebook: 'Přihlásit se pomocí Facebooku',
    withGoogle: 'Přihlásit se pomocí Googlu'
  },
  notFoundPage: {
    message: 'Nenalezeno'
  },
  resetPassword: {
    heading: 'Resetovat heslo',
    newPasswordFormDialog: 'Vložte stejné heslo dvakrát po sobě, a můžete se vrátit k práci na projektu. Heslo musí obsahovat nejméně 8 znaků.',
    newPasswordFormLabel: 'Nové heslo:',
    newPasswordConfirmationLabel: 'Potvrďte své nové heslo:',
    enterEmailLabel: 'Prosím zadejte svou emailovou adresu a my Vám zašleme odkaz pro resetování hesla.',
    emailSuccess: 'Právě jsme na Vaši emailovou adresu zaslali odkaz na zresetování hesla.',
    emailError: 'Došlo k chybě při resetování Vašeho hesla.',
    passwordsDoNotMatch: 'Heslo neodpovídá, zkuste jej prosím zadat znovu.',
    loggedInDialog: 'Momentálně jste přihlášeni. Pokud chcete zresetovat své heslo, prosím, odhlaste se.',
    missingEmailsSpamNote: 'Pokud jste neobdrželi email o resetování Vašeho hesla, zkontrolujte prosím složku s nevyžádanou poštou/spam.',
    missingEmailsAlternateNote: 'Pokud jste zprávu stále neobdrželi, prosím, zkuste zadat jinou emailovou adresu, pod níž jste se mohli zaregistrovat.'
  },
  workflowToggle: {
    label: 'Aktivní'
  },
  collections: {
    createForm: {
      private: 'Soukromé',
      submit: 'Přidat album'
    }
  },
  emailSettings: {
    email: 'Emailová adresa',
    general: {
      section: 'Emailové předvolby pro Zooniverse',
      updates: 'Dostávat emailové aktualizace Zooniverse',
      classify: 'Dostávat emailové aktualizace projektů po Vaší první klasifikaci v projektu.',
      note: 'Poznámka: Odstraněním značky z rámečku se neodhlásíte z žádného projektu.',
      manual: 'Spravovat projekty individuálně',
      beta: 'Dostávat emailové aktualizace o beta projektech a stát se beta testerem.',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'Emailové předvolby pro Diskuze',
      header: 'Pošlete mi email',
      frequency: {
        immediate: 'Ihned',
        day: 'Denně',
        week: '1x týdně',
        never: 'Nikdy'
      },
      options: {
        participating_discussions: 'Jsou-li aktualizované diskuze, do nichž přispívám',
        followed_discussions: 'Jsou-li aktualizované diskuze, které sleduji',
        mentions: 'Zmíní-li mě někdo v diskuzi',
        group_mentions: 'Jsem-li zmíněn v rámci skupiny (@admins, @team, atp.)',
        messages: 'Obdržím-li soukromou zprávu',
        started_discussions: 'Je-li započata diskuze na nástěnce, kterou sleduji.'
      }
    },
    project: {
      section: 'Emailové předvolby k projektům',
      header: 'Projekt',
    }
  },
  about: {
    index: {
      header: 'O Zooniverse',
      title: 'O Zooniverse',
      nav: {
        about: 'O Zooniverse',
        publications: 'Publikace',
        ourTeam: 'Náš tým',
        acknowledgements: 'Acknowledgements',
        contact: 'Kontaktujte nás',
        faq: 'FAQ - Často kladené dotazy',
        resources: 'Materiály ke stažení'
      }
    },
    home: {
      title: '## Co je Zooniverse?',
      whatIsZooniverse: 'Zooniverse je celosvětově nejrozsáhlejší a nejpopulárnější internetový portál pro občanskou vědu (citizen-science). Tento výzkum umožňuje více než milion dobrovolníků z celého světa, kteří se spolu s vědci zapojili do výzkumu. Naším cílem je umožnit takový výzkum, který by byl jinak nerealizovatelný, nebo nepraktický. Zooniverse pomáhá dosáhnout výsledků jako jsou nové objevy, soubory dat využitelné širší odbornou komunitou a vznik [mnoha publikací](/about/publications).',
      anyoneCanResearch: '### Se Zooniverse se vědcem může stát úplně každý\n\nK tomu, abyste se zapojili v jakémkoli Zooniverse projektu, nepotřebujete žádné odborné vzdělání, školení ani odbornou kvalifikaci. Snažíme se, aby se každý zvládl jednoduše zapojit do skutečného akademického výzkumu, z pohodlí domova od svého vlastního počítače.\n\nBudete mít možnost studovat autentické předměty zájmu nashromážděné vědci, jako jsou snímky vzdálených galaxií, historické záznamy a zápisky z diářů nebo videozáběry zvířat v jejich přirozeném prostředí. Tím, že o nich zodpovíte jednoduché otázky, pomůžete přispět našemu porozumění světu okolo nás, naší historii, našemu vesmíru a mnoha dalším.\n\nNáš široce zaměřený a neustále se rozšiřující soubor projektů napříč mnoha vědními obory dává komukoli šanci objevovat, učit se a bavit se spolu se Zooniverse. Stát se naším dobrovolníkem je jednoduché, klikněte na stránku [Projekty](/projects), vyberte si, který se Vám líbí a začněte.',
      accelerateResearch: '### Posunujeme důležitý výzkum dopředu tím, že pracujeme společně\n\nNejvětším úskalím vědeckého výzkumu 21. století je zvládnutí záplavy snadno získatelných nových dat o světě okolo nás. Počítače sice mohou v lecčem pomoct, ale v mnoha oblastech je lidská schopnost rozeznávání obrazových vzorů — a schopnost údivu — stále nad nimi. S pomocí Zooniverse dobrovolníků mohou vědci analyzovat svá data daleko rychleji a přesněji, než by byli schopni svépomocí. Šetří tím čas a zdroje, posunují schopnost počítačů zvládat ty samé úkoly, dosahují rychlejšího pokroku a porozumění světu a daleko rychleji se dostávají ke vzrušujícím výsledkům.\n\nNaše projekty kombinují příspění mnoha jednotlivých dobrovolníků, spoléhaje se na variantu ‘crowdsourcingu’ (moudrosti davů) produkovat věrohodná a přesná data. Tím, že necháme více lidí zpracovat ta samá data, často také dokážeme odhadnout, jak moc pravděpodobné je, že uděláme chybu. Výsledkem Zooniverse projektů je často přesně to, co je potřeba k dosažení pokroku v oblasti daného výzkumu.',
      discoveries: '### Dobrovolníci a odborníci dělají skutečné objevy společně\n\nZooniverse projekty jsou konstruovány se záměrem přeměny úsilí dobrovolníků v měřitelné výsledky. Výsledkem je obrovské množství [publikovaných vědeckých studií](/about/publications), stejně tak mnoho open-source setů analyzovaných dat. V několika případech Zooniverse dobrovovolníci dokonce učinili absolutně nečekané a vědecky významné objevy.\n\nVýznamné množství takového výzkumu se odehrává na diskuzních fórech, kde mohou dobrovolníci spolupracovat mezi sebou i přímo s jednotlivými členy vědeckého týmu. Tato diskuzní fóra jsou součástí každého projektu a svým uživatelům umožňují cokoli od rychlého použití hashtagů až po hloubkové analýzy. K dispozici je také centrální diskuzní fórum pro obecné diskuze ohledně Zooniverse.\n\nMnoho těch nejzajímavějších objevů z projektů Zooniverse vzešlo právě z diskuzí mezi dobrovolníky a vědci. Vyzýváme všechny uživatele, aby se zapojili do diskuzí na diskuzních fórech, pokud se chtějí více zapojit.'
    },
    publications: {
      nav: {
        showAll: 'Zobrazit vše',
        space: 'Vesmír',
        physics: 'Fyzika',
        climate: 'Klima',
        humanities: 'Humanitní vědy',
        nature: 'Příroda',
        medicine: 'Medicína',
        meta: 'Meta',
      },
      content: {
        header: {
          showAll: 'Všechny publikace'
        },
        submitNewPublication: 'K odeslání nové publikace nebo k aktualizaci již existující prosím použijte [tento formulář](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). Naším cílem je uveřejnit odkazy na publikované studie, které mohou být přístupné veřejnosti. Může jít také o články, které byly schválené, ale zatím nebyly nepublikované.'
      },
      publication: {
        viewPublication: 'Zobrazit publikaci.',
        viewOpenAccess: 'Zobrazit verzi s otevřeným přístupem.'
      }
    },
    team: {
      nav: {
        showAll: 'Zobrazit vše',
        oxford: 'Oxford',
        chicago: 'Adler Planetarium',
        minnesota: 'Minnesota',
        portsmouth: 'Portsmouth',
        california: 'Kalifornie',
        hilo: 'Hilo',
        alumni: 'Alumni'
      },
      content: {
        header: {
          showAll: 'Zooniverse tým'
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
      title: '## Acknowledging the Zooniverse',
      citation: '### Akademické citace',
      instructions: 'Per the [Zooniverse Project Builder Policies](https://help.zooniverse.org/getting-started/lab-policies), all research publications using any data derived from Zooniverse approved projects (those listed on the [Zooniverse Projects page](/projects)) are required to acknowledge the Zooniverse and the Project Builder platform. To do so, please use the following text:',
      supportText: '*This publication uses data generated via the [Zooniverse.org](https://www.zooniverse.org/) platform, development of which is funded by generous support, including a Global Impact Award from Google, and by a grant from the Alfred P. Sloan Foundation.*',
      publicationRequest: 'We ask that all researchers making use of the Zooniverse Project Builder platform in any way also consider including the above acknowledgement in their publications.',
      publicationShareForm: 'We strongly encourage project owners to report published accepted research publications using Zooniverse-produced data to us via [this form](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). You can find a list of publications written using the Zooniverse on our [Publications page](publications).',
      questions: 'If you have any questions about how to acknowledge the Zooniverse, such as referencing a particular individual or custom code, please [get in touch](contact).',
      press: '### Writing About Zooniverse in the Press',
      projectURLs: 'When writing about specific Zooniverse projects in the press, please include the project URL (in print as well as digital editions).',
      ZooURL: 'When writing about the Zooniverse in general, please include the [Zooniverse.org](https://www.zooniverse.org/) URL somewhere in your article.',
      enquiries: 'If you are interested in interviewing a member of the team, please [get in touch](contact).'
    },
    contact: {
      title: '## Kontakt & Sociální média',
      discussionBoards: 'Most of the time, the best way to reach the Zooniverse team, or any project teams, especially about any project-specific issues, is through the discussion boards.',
      email: 'If you need to contact the Zooniverse team about a general matter, you can also send an email to the team at [contact@zooniverse.org](mailto:contact@zooniverse.org). Please understand that the Zooniverse team is relatively small and very busy, so unfortunately we cannot reply to all of the emails we receive.',
      collaborating: 'If you are interested in collaborating with the Zooniverse, for instance on a custom-built project, please email [collab@zooniverse.org](mailto:collab@zooniverse.org). (Note that our [Project Builder](/lab) offers an effective way to set up a new project without needing to contact the team!)',
      pressInquiries: 'For press inquires, please contact the Zooniverse directors Chris Lintott at [chris@zooniverse.org](mailto:chris@zooniverse.org) or +44 (0) 7808 167288 or Laura Trouille at [trouille@zooniverse.org](mailto:trouille@zooniverse.org) or +1 312 322 0820.',
      dailyZoo: 'If you want to keep up to date with what\'s going on across the Zooniverse and our latest results, check out the [Daily Zooniverse](http://daily.zooniverse.org/) or the main [Zooniverse blog](http://blog.zooniverse.org/). You can also follow the Zooniverse on [Twitter](http://twitter.com/the_zooniverse), [Facebook](http://facebook.com/therealzooniverse), and [Google+](https://plus.google.com/+ZooniverseOrgReal).'
    },
    faq: {
      title: '## FAQ - Často kladené dotazy',
      whyNeedHelp: '- **Proč vědci potřebují Vaši pomoc? Proč tuto úlohu nemohou vykonat počítače?**\nV mnoha oblastech jsou lidé prozatím lepší než počítače. Většina Zooniverse projektů vyžaduje takové úkony, které zatím počítače nezvládnou na potřebné úrovni nebo v nichž by mohly přehlédnout zajímavé vlastnosti, narozdíl od člověka, který by si jich všiml - proto potřebujeme Vaši pomoc. Některé Zooniverse projekty zároveň využívají klasifikace vykonané člověkem právě k trénování počítačů - aby se v nich zlepšily a mohly je vykonávat v budoucnosti. Svou účastí v projektu přispíváte ke skutečnému vědeckému výzkumu.',
      amIDoingThisRight: '- **Jak poznám, jestli to dělám správně?**\nU mnoha objektů v našich projektech, vědci správnou odpověď neznají, proto potřebují Vaši pomoc. Lidé jsou velmi dobří v úkolech zaměřených na rozpoznávání vzorů (pattern recognition), jinak řečeno, Vaše první odpověď je často ta správná. Netrapte se, pokud občas uděláte chybu - každý snímek, video-nahrávka či graf jsou vyhodnocovány více lidmi v projektu. Většina projektů má Nápovědu, stránku s FAQ - Nejčastěji kladenými dotazy a Průvodce s dalšími informacemi, které Vám při klasifikaci pomohou.',
      whatHappensToClassifications: '- **Co se stane s mou klasifikací poté, co ji potvrdím?**\nVaše klasifikace jsou bezpečně uloženy v naší online databázi. Později tým vědců zkombinuje Vaši odpověď s odpověďmi dalších dobrovolníků, které jsou v databázi uloženy pro daný objekt. Jakmile potvrdíte Vaši klasifikaci (kliknutím na tlačítko "Dokončit") pro daný objekt (snímek, graf, videonahrávku...), už se nelze vrátit, abyste svou odpověď změnili. Pro více informací navštivě stránku [Zooniverse User Agreement and Privacy Policy page](/privacy).',
      accountInformation: '- **Jak Zooniverse nakládá s osobními údaji mého Zooniverse účtu?**\nZooniverse bere úlohu ochrany osobních údajů a klasifikací svých dobrovolníků velmi vážně. Více informací ohledně ochrany osobních údajů najdete na stránkách [Zooniverse User Agreement and Privacy Policy page](/privacy) a [Zooniverse Security page](/security).',
      featureRequest: '- **Mám nápad na vylepšení / Našel jsem chybu (bug); Na koho se obrátit? / Jak chybu nahlásit?**\nSvé nápady nebo objevené chyby s námi můžete sdílet prostřednictvím [Zooniverse Diskuze](/talk) nebo pomocí [Zooniverse Software repository](https://github.com/zooniverse/Panoptes-Front-End/issues) na GitHubu.',
      hiring: '- **Nabírá Zooniverse nové zaměstnance?**\nZooniverse je výsledkem spolupráce institucí Spojeného království Velké Británie a Severního Irska a Spojených států amerických; všichni členové našeho týmu jsou zaměstnáni jednou z těchto partnerských institucí. Více informací naleznete na stránce [Nabídka pracovních míst v Zooniverse](https://jobs.zooniverse.org/).',
      howToAcknowledge: '- **Jsem zakladatelem projektu/členem vědeckého týmu, jakým způsobem mohu uvádět Zooniverse a Project Builder ve své studii, v abstraktu, epod.?**\nDetaily o tom, jak citovat Zooniverse ve vědeckých publikacích, které využívají data získaná prostřednictvím Zooniverse najdete pod stránkou Project Builder nebo [Acknowledgements](/about/acknowledgements).',
      browserSupport: '- **Jaké verze prohlíže Zooniverse podporuje?**\nPodporujeme všechny hlavní prohlížeče od druhé až po nejnovější verzi.',
      furtherHelp: 'Nenašli jste odpověď na svou otázku? Navštivte webovou stránku se [Zooniverse Solutions](https://zooniverse.freshdesk.com/support/solutions), zeptejte se nás prostřednictvím [Zooniverse Diskuze](/talk) nebo nás kontaktujte [Získat kontakt](/about/contact).'
    },
    resources: {
      title: '## Materiály ke stažení',
      filler: 'Useful downloads and guidelines for talking about the Zooniverse.',
      introduction: '### Brand Materials',
      officialMaterials: '[Download official Zooniverse logos](https://github.com/zooniverse/Brand/tree/master/style%%20guide/logos). Our official color is teal hex `#00979D` or `RGBA(65, 149, 155, 1.00)`.',
      printables: '[Download printable handouts, posters, and other ephemera](https://github.com/zooniverse/Brand/tree/master/style%%20guide/downloads). If you have specific needs not addressed here, please [let us know](/about/contact).',
      press: '### Press Information',
      tips: 'Tips for writing about the Zooniverse in the press',
      listOne: '- Please always include URLs when writing about specific projects. If writing generally about the Zooniverse, please include www.zooniverse.org somewhere in your article. Check out the [Acknowledgements page](/about/acknowledgements) for more details about how to correctly acknowledge the Zooniverse.',
      listTwo: '- Please note: we are a platform for people-powered research, not a company or non-profit.',
      listThree: '- If you have questions about the Zooniverse and would like to speak to a member of our team, please [contact us](/about/contact).'
    },
    highlights: {
      imageAlt: 'Zooniverse Highlights Book Cover %(year)s',
      paragraphOne: 'Since 2007, Zooniverse projects have led to many unexpected and scientifically significant discoveries and many [peer-reviewed publications](https://zooniverse.org/publications). All of this would have been impossible if it weren’t for our global community of Zooniverse participants engaged in these projects alongside the research teams.',
      paragraphTwo: 'These ‘Into the Zooniverse’ books commemorate and honor the efforts of everyone involved, providing just a glimpse into the ways Zooniverse community members have a real impact on the world around them. Each book highlights a subset of projects that were active that year. There are so many fascinating projects we haven’t been able to include yet; we hope to continue creating these books into the future.',
      paragraphThree: 'Click on the links below to access the books. Note: the cost to purchase a hard copy simply covers printing and postage fees. We do not make any profit through sales of the hard copies of the books.',
      sectionHeader: '### Volume %(volumeNumber)s: %(year)s',
      title: '## Zooniverse Highlights',
      toDownload: '[Download a pdf](%(url)s)',
      toPurchase: '[Purchase on %(purchaseSource)s](%(url)s)'
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
      title: 'Zapojte se',
      nav: {
        volunteering: 'Dobrovolnictví',
        education: 'Výuka',
        callForProjects: 'Žádosti o návrhy projektů',
        collections: 'Alba',
        favorites: 'Oblíbené'
      }
    },
    education: {
      title: '## Výuka v Zooniverse',
      becomeCitizenScientist: 'Jakožto dobrovolník na těchto webových stránkách, se můžete Vy i Vaši studenti stát zároveň občanskými vědci i výzkumníky, podílejícími se na skutečném vědeckém výzkumu. Pokud si Vaši studenti myslí, že jste chybovali, nebojte se, dokonce i skuteční vědci dělají chyby. Naše projekty jsou nastaveny tak, že každý zkoumaný objekt je analyzován větším počtem dobrovolníků, čímž je možné eliminovat většinu lidských chyb. Chyby jsou součástí procesu, a mohou být dokonce přínosné - pomohou nám poznat, kdy jde o příliš složitá data. Pokud se všichni snažíme o nejlepší výkon, potom pomáháme!',
      resources: '### Zdroje pro učitele využívající Zooniverse',
      zooniverseClassrooms: '- Instructors and volunteers alike can access a variety of educational resources on the [Zooniverse Classrooms](https://classroom.zooniverse.org/) platform. The ASTRO 101 materials are currently targeted towards introductory college-level students, while WildCam Labs are aimed at a broader audience of students. We are currently working to expand our curricular materials to additional projects on the Zooniverse platform.',
      educationPages: '- Mnoho Zooniverse projektů má své vlastní stránky věnované výuce s dalšími zdroji nápadů pro učitele. Takové zdroje mohou obsahovat video-návod, jak pracovat s daným projektem, další užitečné dokumenty a videa o samotném procesu klasifikace nebo výukové materiály spojené s výzkumem nad rámec projektu.',
      joinConversationTitle: '### Zapojte se do konverzace',
      joinConversationBody: 'Držte krok s nejnovějšími výukovými pokusy Zooniverse na [Zooniverse Blogu](http://blog.zooniverse.org/). Můžete také diskutovat s dalšími učiteli a jinými dobrovolníky, kteří se snaží využít "lidmi-poháněný výzkum" (people-powered research) v různých oblastech vzdělávání na diskuzi [Zooniverse Education Talk board](http://zooniverse.org/talk/16).',
      howEducatorsUseZooniverse: '### Jak učitelé využívají Zooniverse?',
      inspiration: 'Hledáte nějakou inspiraci? Zde je několik způsobů, kdy učitelé využili Zooniverse projekty a výukové materiály:',
      floatingForests: '- [Plovoucí lesy - Floating Forests: Jak učit malé děti o chaluhách](http://blog.zooniverse.org/2015/04/29/floating-forests-teaching-young-children-about-kelp/)',
      cosmicCurves: '- [Kosmické Křivky - Cosmic Curves: Investigating Gravitational Lensing at the Adler Planetarium](http://blog.zooniverse.org/2014/03/18/cosmic-curves-investigating-gravitational-lensing-at-the-adler-planetarium/)',
      snapshotSerengeti: '- [Momentky ze Serengeti - Snapshot Serengeti přináší autentický výzkum do "Undergraduate" kurzů](http://blog.zooniverse.org/2014/02/19/snapshot-serengeti-brings-authentic-research-into-undergraduate-courses/)',
      contactUs: 'Rádi bychom slyšeli, jak jste využili Zooniverse s mladými či dospělými studenty! Prosím, kontaktujte [education@zooniverse.org](mailto:education@zooniverse.org), pokud máte nějaký zajímavý příběh nebo zkušenost, které byste rádi sdíleli.'
    },
    volunteering: {
      title: '## Jak se stát dobrovolníkem',
      introduction: 'Zaprvé, každý, kdo se zapojí do projektu Zooniverse je dobrovolníkem! Máme zde úžasnou komunitu lidí z celého světa, kteří nám pomáhají s tím, co děláme. Hlavní náplní dobrovolnictví u nás je pomoc s klasifikací dat, testováním beta projektů, které se chystáme spustit, a moderováním projektových diskuzí. Pro více informací ke kterékoli z těchto rolí čtěte níže.',
      projectVolunteeringTitle: '### Dobrovolníkem v projektu',
      projectVolunteeringDescription: 'Stát se dobrovolníkem v projektu je ten nejjednodušší a nejčastější způsob dobrovolnictví. Stále potřebujeme dobrovolníky, kteří by se přihlásili do našich projektů a klasifikovali jejich data. Přečtěte si více o tom, co se děje s klasifikacemi a jakým způsobem pomáhají vědecké komunitě a vědeckému pokroku na stránce [O Zooniverse](/about).',
      projectLink: 'Není zde žádný minimální čas, který byste nám museli věnovat; dělejte jen tolik, kolik chcete. Abyste se zapojili jako klasifikující dobrovolník, jděte na stránku [Projekty](/projects), projděte si naši nabídku, zvolte si jeden, který Vás zaujme a zapojte se!',
      betaTesterTitle: '### Dobrovolníkem jako Beta testerem',
      betaTesterDescription: 'Dobrovolníci nám také často pomáhají testovat projekty předtím, než je spustíme, abychom zjistili, zda budou dobře fungovat. To obnáší projít několik klasifikací v beta verzi projektu, aby zjistili, že funguje, hledají možné chyby a na závěr vyplňují dotazníky. To nám pomůže najít a vychytat jakékoli problémy, které je nutné vyřešit, ale také posoudit do jaké míry je projekt vhodný pro Zooniverse. Můžete si přečíst nějaké směrnice ohledně toho, jak by měl vypadat projekt vhodný pro Zooniverse na stránce [Zásady - Policies](https://help.zooniverse.org/getting-started/lab-policies), pod položkou \'Pravidla a předpisy - Rules and Regulations\'.',
      betaTesterSignUp: 'Abyste se přihlásili jako beta tester, jděte na stránku [www.zooniverse.org/settings/email](/settings/email) a zaškrtněte políčko pro beta testování. Poté Vám budeme zasílat emaily, když se objeví projekt připravený k testování. Své emailové nastavení můžete kdykoli změnit [stejná emailová stránka](/settings/email) tím, že rámeček odškrtnete.',
      projectModeratorTitle: '### Dobrovolník jako moderátor projektu',
      projectModeratorBody: 'Dobrovolníci moderátoři mají více práv v projektových diskuzích. Pomáhají usměrňovat diskuze a jednat jako konktaktní spojka projektu. Moderátoři jsou vybíráni zakladatelem projektu. Pokud máte zájem stát se moderátorem projektu, do něhož jste se zapojili, jděte na stránku "O projektu" a spojte se s příslušným vědeckým pracovníkem.',
      furtherInformationTitle: '### Další informace',
      contactUs: 'Pokud by Vás zajímaly další věci ohledně těchto rolí, kontaktujte nás prostřednictvím stránky [Kontaktujte nás](/about/contact).'
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
          externalLinks: '* **External links:** Adding an external link will populate an entry in a list of links in the bottom right section of the project landing page.  These links open in a new tab when clicked. You can rearrange the displayed order by clicking and dragging on the left gray tab next to each link.',
          socialLinks: '* **Social links:** A specialized form of an external link, adding a social link will populate an entry in the list of links in the bottom right section of the project landing page that includes service-specific icons. You can rearrange the displayed order by clicking and dragging on the left gray tab next to each link, but all social links follow after external links in the displayed list.'
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
      displayName: 'Zobrazované jméno (povinné)',
      displayNameHelp: 'Jak se Vaše jméno bude zobrazovat ostatním uživatelům v diskuzích a na Vašem profilu',
      realName: 'Skutečné jméno (nepovinné)',
      realNameHelp: 'Veřejné; bude použito v odborných publikacích, apod.',
      interventions: 'Zobrazovat upozornění ohledně projektové intervence (dotazníky apod.).',
      interventionsHelp: 'Povolit projektům zobrazovat zprávy v době, kdy klasifikujete.',
      interventionsPreferences: 'Předvolby upozornění',
      changePassword: {
        heading: 'Změnit heslo',
        currentPassword: 'Současné heslo (povinné)',
        newPassword: 'Nové heslo (povinné)',
        tooShort: 'Heslo je příliš krátké',
        confirmNewPassword: 'Potvrďte nové heslo (povinné)',
        doesntMatch: 'Zadaná hesla se neshodují',
        change: 'Změnit'
      }
    },
    profile: {
      dropImage: 'Sem přesuňte obrázek (nebo klikněte na Vybrat).',
      changeAvatar: 'Změnit avatar',
      avatarImageHelp: 'Sem přesuňte obrázek (čtvercový formát, menší než %(size)s KB)',
      clearAvatar: 'Odstranit avatar',
      changeProfileHeader: 'Změnit záhlaví Vašeho profilu',
      profileHeaderImageHelp: 'Sem přesuňte obrázek (libovolný poměr stran, menší než %(size)s KB)',
      clearHeader: 'Odstranit záhlaví'
    }
  }
};
