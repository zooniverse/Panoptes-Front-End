export default {
  loading: '(Cargando)',
  aboutPages: {
    missingContent: {
      education: 'Este proyecto no tiene recursos educativos todavía.',
      faq: 'Este proyecto no tiene preguntas frecuentes todavía.',
      research: 'Este proyecto no tiene un caso científico todavía.',
      results: 'Este proyecto no tiene resultados que notificar todavía.',
      team: 'Este proyecto no tiene información del equipo.'
    }
  },
  classifier: {
    back: 'Atrás',
    backButtonWarning: 'Al regresar se borrará su trabajo para la tarea actual.',
    close: 'Cerrar',
    continue: 'Continuar',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Listo',
    doneAndTalk: 'Listo & Hablemos',
    dontShowMinicourse: 'No mostrar mini-curso en el futuro',
    interventions: {
      optOut: 'No quiero recibir más mensajes.',
      studyInfo: 'No quiero participar en este estudio.'
    },
    letsGo: '¡Vamos!',
    miniCourseButton: 'Reiniciar el mini-curso del proyecto',
    next: 'Siguiente',
    optOut: 'Opción de salida',
    recents: 'Tus clasificaciones recientes',
    talk: 'Hablemos',
    taskHelpButton: '¿Necesitas ayuda con esta tarea?',
    taskTabs: {
      taskTab: 'Tarea',
      tutorialTab: 'Tutorial'
    },
    workflowAssignmentDialog: {
      acceptButton: '¡Ir al siguiente nivel!',
      declineButton: 'No, gracias',
      promotionMessage: '¡Felicitaciones! Has desbloqueado la próxima secuencia de trabajo. Si prefieres seguir en la secuencia actual, puedes escoger permanecer.'
    }
  },
  collections: {
    createForm: {
      private: 'Privado',
      submit: 'Añadir colección'
    }
  },
  feedback: {
    categories: {
      correct: 'Aciertos',
      falsepos: 'Falsos positivos',
      incorrect: 'Fallos'
    }
  },
  project: {
    about: {
      header: 'Acerca de',
      nav: {
        education: 'Educación',
        faq: 'Preguntas Frecuentes',
        research: 'Investigación',
        results: 'Resultados',
        team: 'El Equipo'
      }
    },
    classifyPage: {
      dark: 'oscuro',
      light: 'claro',
      themeToggle: 'Cambiar a diseño %(theme)s',
      title: 'Clasificar'
    },
    disclaimer: 'Este proyecto ha sido construido usando Zooniverse Project Builder, pero todavía no es un proyecto oficial de Zooniverse. Las preguntas y asuntos relacionados con este proyecto dirigidos al equipo de Zooniverse podrían no recibir respuesta.',
    fieldGuide: 'Guía Práctica',
    home: {
      about: 'Acerca de %(title)s',
      getStarted: 'Comenzar',
      joinIn: 'Unirse',
      learnMore: 'Aprende más',
      links: 'Enlaces',
      metadata: {
        classifications: 'Clasificaciones',
        completedSubjects: 'Sujetos completados',
        statistics: 'Estadística de %(title)s',
        subjects: 'Sujetos',
        volunteers: 'Voluntarios'
      },
      organization: 'Organización',
      researcher: 'Palabras del investigador',
      talk: {
        one: '1 persona está hablando de  %(title)s ahora.',
        other: '%(count)s personas están hablando de %(title)s ahora.',
        zero: 'Nadie está hablando de %(title)s ahora.'
      },
      visitLink: 'Visita el proyecto',
      workflowAssignment: 'Has desbloqueado %(workflowDisplayName)s'
    },
    language: 'Idioma',
    loading: 'Cargando el proyecto',
    nav: {
      about: 'Acerca de',
      adminPage: 'Página del Administrador',
      classify: 'Clasificar',
      collections: 'Colecciones',
      exploreProject: 'Explorar el proyecto',
      lab: 'Laboratorio',
      recents: 'Recientes',
      talk: 'Hablemos',
      underReview: 'Bajo Revisión',
      zooniverseApproved: 'Aprobado por Zooniverse'
    }
  },
  projectRoles: {
    collaborator: 'Colaborador',
    expert: 'Experto',
    moderator: 'Moderador',
    museum: 'Museo',
    owner: 'Propietario',
    scientist: 'Investigador',
    tester: 'Evaluador',
    title: 'El Equipo',
    translator: 'Traductor'
  },
  projects: {
    welcome: {
      heading: '¡Te damos la bienvenida! Estamos muy contentos de que estés aquí',
      scrollDown: 'Desplázate hacia abajo para ver aún más',
      talk: 'Asegúrate también de visitar Talk, donde puedes chatear con otros voluntarios afines.',
      thanks: 'Gracias por tu interés en ayudar a la investigación real. Aquí hemos reunido algunos proyectos en los que nos vendría muy bien tu ayuda en este momento. Para ver más opciones, solo tienes que desplazarte hacia abajo para ver todos nuestros proyectos activos.'
    }
  },
  organization: {
    loading: 'Cargando organización',
    error: 'Hubo un error al recuperar la organización',
    notFound: 'organización no encontrada.',
    notPermission: 'Si la dirección es correcta, podrías no tener los permisos para ver esta organización.',
    pleaseWait: 'Espere por favor...',
    home: {
      projects: {
        loading: 'Cargando proyectos de la organización...',
        error: 'Hubo un error al cargar los proyectos de la organización.',
        none: 'No hay proyectos asociados a esta organización.'
      },
      viewToggle: 'Ver como Voluntario',
      introduction: 'Introducción',
      readMore: 'Leer más',
      readLess: 'Leer menos',
      links: 'Enlaces'
    }
  },
  tasks: {
    hidePreviousMarks: 'Ocultar marcas anteriores %(count)s',
    less: 'Menos',
    more: 'Más',
    shortcut: {
      noAnswer: 'Sin respuesta'
    },
    survey: {
      clear: 'Borrar',
      clearFilters: 'Borrar filtros',
      makeSelection: 'Haz una selección',
      showing: 'Mostrando %(count)s de %(max)s',
      confused: 'Frecuentemente confundido con',
      dismiss: 'Descartar',
      itsThis: 'Pienso que es esto',
      cancel: 'Cancelar',
      identify: 'Identificar',
      surveyOf: 'Estudio de %(count)s',
      identifications: {
        zero: 'Ninguna identificación',
        one: '1 identificación',
        other: '%(count)s identificaciones'
      }
    }
  },
  security: {
    title: 'Seguridad en Zooniverse',
    intro: 'Zooniverse toma con mucha seriedad la seguridad de nuestros sitios web y sistemas, y la protección de nuestros usuarios y de su información personal es nuestra prioridad. Tomamos todas las precauciones para asegurar que la información que usted nos proporcione permanezca segura, pero también es importante para asegurar su propia cuenta que usted siga pasos como los siguientes:\n\n* No utilizar la misma contraseña en sitios web diferentes. La contraseña que utilice para su cuenta de Zooniverse debería ser única.\n* Nunca dé su contraseña a nadie. Nosotros nunca le pediremos que nos envíe su contraseña y usted nunca debe ingresar su contraseña de Zooniverse en otro sitio web que no sea el nuestro. Siempre verifique la barra de direcciones de su navegador para asegurarse de tener una conexión segura con _www.zooniverse.org_.\n\nPara obtener información y consejos generales acerca de la seguridad en línea, por favor visite:\n\n* [Get Safe Online](https://www.getsafeonline.org)\n* [Stay Safe Online](https://www.staysafeonline.org)\n* [US-CERT - Tips](https://www.us-cert.gov/ncas/tips)',
    details: '## Para reportar problemas de seguridad\n\nZooniverse apoya la revelación responsable [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) de vulnerabilidades. Si usted cree haber descubierto una vulnerabilidad en la seguridad en cualquier software de Zooniverse, le pedimos que primero la reporte en [security@zooniverse.org](mailto:security@zooniverse.org) para permitir que se reparen las vulnerabilidades antes de revelarlas públicamente.\n\n ## Vulnerabilidades e incidentes conocidos.\n\nNosotros creemos que es importante ser completamente transparentes acerca de los temas de seguridad. Se presenta a continuación una lista completa de vulnerabilidades reparadas e incidentes de seguridad pasados:\n\n* June 21, 2018: [Cross-site scripting on project home pages](https://blog.zooniverse.org/2018/07/03/fixed-cross-site-scripting-vulnerability-on-project-home-pages/)\n\nLas vulnerabilidades e incidentes nuevos serán anunciados vía el [blog de Zooniverse en la categoría "técnica"] (http://blog.zooniverse.org/category/technical/).'
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Administrar usuarios',
      projectStatus: 'Establecer el estado del proyecto',
      grantbot: 'Grantbot',
      organizationStatus: 'Establecer el estado de la organización'
    },
    notAdminMessage: 'Usted no es un administrador',
    notSignedInMessage: 'Usted no ha iniciado una sesión'
  },
  signIn: {
    title: 'Iniciar sesión / registrarse',
    withZooniverse: 'Iniciar sesión con su cuenta de Zooniverse',
    whyHaveAccount: 'Los voluntarios con sesión iniciada pueden llevar un registro de su trabajo y recibirán crédito por cualquier publicación resultante.',
    signIn: 'Iniciar sesión',
    register: 'Registrarse'
  },
  notFoundPage: {
    message: 'No encontrado'
  },
  resetPassword: {
    heading: 'Restablecer la contraseña',
    newPasswordFormDialog: 'Introduza la misma contraseña dos veces, así podrá regresar a hacer investigación. Las contraseñas necesitan tener al menos 8 caracteres.',
    newPasswordFormLabel: 'Contraseña nueva:',
    newPasswordConfirmationLabel: 'Repita la contraseña para confirmar:',
    enterEmailLabel: 'Por favor, introduzca su dirección de correo electrónico aquí y le enviaremos un enlace que puede utilizar para restablecerla.',
    emailSuccess: 'Le hemos enviado un correo electrónico con un enlace para restablecer su contraseña.',
    emailError: 'Hubo un error al restablecer su contraseña.',
    resetError: 'Algo falló, por favor intente restablecer su contraseña vía correo electrónico nuevamente.',
    passwordsDoNotMatch: 'Las contraseñas son diferentes, por favor intente de nuevo.',
    loggedInDialog: 'Usted tiene una sesión activa actualmente. Por favor salga de su sesión si quiere restablecer su contraseña.',
    missingEmailsSpamNote: 'Por favor, revise su carpeta de spam si no ha recibido el correo electrónico para restablecer la contraseña.',
    missingEmailsAlternateNote: 'Si aún no ha recibido el correo electrónico, por favor intente con alguna otra dirección que pudo haber usado para registrarse.'
  },
  workflowToggle: {
    label: 'Activo'
  }
}
