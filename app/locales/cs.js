export default {
  loading: '(načítá se)',
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
