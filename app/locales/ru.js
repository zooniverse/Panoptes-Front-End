export default {
  loading: 'Идет загрузка',
  classifier: {
    back: 'назад',
    backButtonWarning: 'Если Вы нажмете "назад", Ваша работа по текущему заданию не сохранится',
    close: 'Закрыть',
    continue: 'Продолжить',
    detailsSubTaskFormSubmitButton: 'ОК',
    done: 'Готово',
    doneAndTalk: 'Готово. Обсудить',
    dontShowMinicourse: 'Не показывать больше мини-курс ',
    letsGo: 'Начать',
    next: 'Следующий',
    optOut: 'Отклонить',
    taskTabs: {
      taskTab: 'Задание',
      tutorialTab: 'Посмотреть инструкции и примеры'
    },
    recents: 'Ваши последние разметки/классификации',
    talk: 'Обсуждение',
    taskHelpButton: 'Помочь?',
    miniCourseButton: 'Перезагрузить мини-курс',
    workflowAssignmentDialog: {
      promotionMessage: 'Поздравляем! Вы открыли следующий уровень. Если Вы предпочитаете оставаться на этом уровне, можно выбрать "остаться"',
      acceptButton: 'На следующий уровень',
      declineButton: 'Нет, спасибо'
    },
    interventions: {
      optOut: 'Не показывать больше',
    }
  },
  project: {
    language: 'Язык',
    loading: 'Проект загружается',
    disclaimer: 'Этот проект был создан с использованием Zooniverse Project Builder, но еще не является официальным проектом Zooniverse. Поэтому команда Zooniverse не сможет Вам ответить на вопросы, связанные с этим проектом',
    about: {
      header: 'Узнать о',
      nav: {
        research: 'Исследование',
        results: 'Результаты',
        faq: 'Часто задаваемые вопросы',
        education: 'Образование',
        team: 'Команда'
      }
    },
    nav: {
      about: 'Узнать о',
      adminPage: 'Страница администратора',
      classify: 'Классифицировать',
      collections: 'Собрать',
      exploreProject: 'Узнать больше о проекте',
      lab: 'Лаборатория ',
      recents: 'Последнее',
      talk: 'Дискуссия',
      underReview: 'На рассмотрении',
      zooniverseApproved: 'Подтверждено Zooniverse'
    },
    classifyPage: {
      dark: 'Темный',
      light: 'Светный',
      title: 'Классифицировать',
      themeToggle: 'Переключиться на %(theme)s тему'
    },
    home: {
      organization: 'Организация',
      researcher: 'Слова от исследователя',
      about: 'Узнать о %(title)s',
      metadata: {
        statistics: '%(title)s Статистика',
        classifications: 'Классификации',
        volunteers: 'Волонтеры',
        completedSubjects: 'Законченные предметные указатели',
        subjects: 'Предметные указатели '
      },
      talk: {
        zero: 'Никто в данный момент не обсуждает **%(title)s**',
        one: '**1** участник в данный момент обсуждает (ют) **%(title)s**',
        other: ' В данный момент **%(count)s** участник (а, ков) обсуждает (ют) **%(title)s** '
      },
      joinIn: 'Присоединиться',
      learnMore: 'Подробнее',
      getStarted: 'Начать',
      workflowAssignment: 'Вам открыт доступ к %(workflowDisplayName)s',
      visitLink: 'Пройдите в проект',
      links: 'Внешние ссылки'
    }
  },
  organization: {
    error: 'Ошибка получения информации об организации',
    home: {
      introduction: 'Введение',
      links: 'Ссылки',
      metadata: {
        projects: 'Проекты',
      },
      projects: {

        error: 'Ошибка загрузки проектов организаций',
        loading: 'Загрузка проектов организаций',
        none: 'Нет проектов, связанных с этой организацией',
      },
      researcher: 'Слова от исследователя',
      viewToggle: 'Для волонтеров',
      readLess: 'Свернуть',
      readMore: 'Развенуть/подробнее'
    },
    loading: 'Организация, загрузившая контент',
    notFound: 'Организация не найдена',
    notPermission: ' Вы уверены, что ссылка введена правильно? Возможно, у Вас нет разрешения на доступ к этой организации',
    pleaseWait: 'Подождите, пожалуйста',
  },
  tasks: {
    hidePreviousMarks: 'Hide previous marks %(count)s',
    less: 'Свернуть',
    more: 'Развенуть/подробнее',
    shortcut: {
      noAnswer: 'Без ответа'
    },
    survey: {
      clear: 'Очистить',
      clearFilters: 'Очистить фильтры',
      makeSelection: 'Сделать выбор',
      showing: 'Показать  %(count)s of %(max)s',
      confused: 'Не путать с',
      dismiss: 'Отклонить',
      itsThis: 'Думаю, что это',
      cancel: 'Отменить',
      identify: 'Определить',
      surveyOf: 'Исследование %(count)s',
      identifications: {
        zero: 'Не идентифицировано',
        one: '1 идентификатор',
        other: '%(count)s  идентифицированно'
      }
    }
  },
  userAdminPage: {
    header: 'Администрация',
    nav: {
      createAdmin: 'Управление пользователями',
      projectStatus: 'Установить статус проекта',
      grantbot: 'Грантбот',
      organizationStatus: 'Установить статус организации'
    },
    notAdminMessage: 'Вы не администратор',
    notSignedInMessage: 'Вы не активировались '
  },
  signIn: {
    title: 'Войти/зарегистрироваться',
    withZooniverse: 'Войти с Zooniverse аккаунтом',
    whyHaveAccount: 'Авторизованные волонтеры могут получить доступ к своей работе. Их поблагодарят в итоговой публикации',
    signIn: 'Войти',
    register: 'Зарегистрироваться',
    orThirdParty: 'Или войти с другим сервисом',
    withFacebook: 'Войти с аккаунта Facebook',
    withGoogle: 'Войти с аккаунта Google'
  },
  notFoundPage: {
    message: 'Не найдено'
  },
  resetPassword: {
    heading: 'Изменить пароль',
    newPasswordFormDialog: 'Чтобы продолжить исследование, введите пароль и подтвердите его. В пароле должно быть не менее 8 символов',
    newPasswordFormLabel: 'Новый пароль',
    newPasswordConfirmationLabel: 'Для подтверждения повторите пароль',
    enterEmailLabel: 'Пожалуйста, введите здесь свой имейл адрес, и мы пошлем ссылку, по которой можно будет изменить пароль',
    emailSuccess: 'Мы послали Вам ссылку, по которой можно будет изменить пароль',
    emailError: 'Ошибка изменения пароля',
    passwordsDoNotMatch: 'Пароль не совпадает, пожалуйста, повторите',
    loggedInDialog: 'Вы активизированы в своем аккаунте. Пожалуйста, выйдите, чтобы изменить пароль',
    missingEmailsSpamNote: 'Если Вы не получили имейл со ссылкой для изменения пароля, пожалуйста, проверьте папку спам',
    missingEmailsAlternateNote: 'Если Вы все еще не получили имейл, пожалуйста, введите другой имейл, с которым Вы могли войти в свой аккаунт'
  },
  workflowToggle: {
    label: 'Активно'
  },
  collections: {
    createForm: {
      private: 'Персональное пространство',
      submit: 'Добавить коллекцию'
    }
  },
  emailSettings: {
    email: 'Имейл адрес',
    general: {
      section: 'Настройки Zooniverse имейла',
      updates: 'Получать новости о Zooniverse по имейлу',
      classify: 'Получать новости, когда Вы впервые анализируете проект',
      note: 'Имейте в виду: Ваша подписка на проекты не прекратится, если Вы снимете галочку',
      manual: 'Управлять проектами по отдельности',
      beta: 'Получать новости о beta проектах и стать beta текстировщиком',
    },
    talk: {
      section: 'Настройки имейла обсуждения',
      header: 'Послать имейл',
      frequency: {
        immediate: 'Прямо сейчас',
        day: 'Ежедневно',
        week: 'Еженедельно',
        never: 'Никогда'
      },
      options: {
        participating_discussions: 'Когда появятся новости в обсуждении, в котором я участвую',
        followed_discussions: 'Когда появятся новости в обсуждении, за которым я наблюдаю',
        mentions: 'Когда меня упоминают ',
        group_mentions: 'Когда меня упоминает группа (@admins, @team и т.д.)',
        messages: 'Когда я получаю личный имейл',
        started_discussions: 'Когда обсуждение началось на доске, за которой я наблюдаю'
      }
    },
    project: {
      section: 'Настройки имейла проекта',
      header: 'Проект'
    }
  },
  userSettings: {
    account: {
      displayName: 'Покажите имя (обязательное поле)',
      displayNameHelp: 'Как Ваше имя будет показано другим участникам Обсуждения [Talk] и на Вашем профиле',
      realName: 'Настоящее имя (указать по желанию)',
      realNameHelp: 'Публичное пространство; мы используем это пространство, чтобы сделать ссылки на проект в статьях, постерах и других материалах',
      interventions: 'Показывать уведомления об изменениях в проекте.',
      interventionsHelp: 'Разрешить показывать сообщения, когда Вы работаете над разметкой/классификацией',
      interventionsPreferences: 'Настройки сообщений',
      changePassword: {
        heading: 'Изменить пароль',
        currentPassword: 'Действующий пароль (обязательное поле)',
        newPassword: 'Новый пароль (обязательное поле)',
        tooShort: 'Слишком коротко',
        confirmNewPassword: 'Подтвердить пароль (обязательное поле)',
        doesntMatch: 'Нет совпадения',
        change: 'Изменить'
      }
    },
    profile: {
      dropImage: 'Скинуть картинку здесь (или нажать и выбрать)',
      changeAvatar: 'Изменить аватарку',
      avatarImageHelp: 'Скинуть картинку здесь (квардат, менее %(size)s KB)',
      clearAvatar: 'Очистить аватарку',
      changeProfileHeader: 'Изменить название профиля',
      profileHeaderImageHelp: 'Скинуть картинку здесь (любой размер, менее %(size)s KB)',
      clearHeader: 'Очистить название '
    }
  }
}
