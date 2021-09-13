export default {
  loading: '(A carregar)',
  aboutPages: {
    missingContent: {
      education: 'Este projecto ainda não tem recursos educacionais.',
      faq: 'Este projecto ainda não tem perguntas frequentes.',
      research: 'Este projecto ainda não tem caso científico.',
      results: 'Este projecto ainda não tem resultados a reportar.',
      team: 'Este projecto não tem informa.',
    }
  },
  projectRoles: {
    title: 'A Equipa',
    owner: 'Proprietário',
    collaborator: 'Colaborador',
    translator: 'Tradutor',
    scientist: 'Investigador',
    moderator: 'Moderador',
    tester: 'Verificador',
    expert: 'Especialista',
    museum: 'Museu',
  },
  classifier: {
    back: 'Voltar',
    backButtonWarning: 'Voltar limpará o seu trabalho na tarefa actual.',
    close: 'Fechar',
    continue: 'Continuar',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Concluir',
    doneAndTalk: 'Concluir e Debater',
    dontShowMinicourse: 'Não voltar a mostrar mostrar o minicurso',
    letsGo: 'Vamos!',
    next: 'Próximo',
    optOut: 'Excluir',
    taskTabs: {
      taskTab: 'Tarefa',
      tutorialTab: 'Tutorial'
    },
    recents: 'As suas classificações recentes',
    talk: 'Debater',
    taskHelpButton: 'Precisa de ajuda com esta tarefa?',
    miniCourseButton: 'Reiniciar o minicurso do projecto',
    workflowAssignmentDialog: {
      promotionMessage: 'Parabéns! Desbloqueou o próximo fluxo de trabalho. Pode, se  preferir, optar por permanecer neste fluxo de trabalho.',
      acceptButton: 'Leve-me para o próximo nível!',
      declineButton: 'Não, obrigado'
    },
    interventions: {
      optOut: 'Não me mostre mais mensagens.'
    }
  },
  project: {
    language: 'Língua',
    loading: 'A carregar o projecto',
    disclaimer: 'Este projecto foi construído usando o "Zooniverse Project Builder" mas ainda não é um projecto oficial do Zooniverse. Consultas e questões relacionadas com este projecto que sejam direccionadas à Equipa do Zooniverse podem não receber qualquer resposta.',
    fieldGuide: 'Guia de Campo',
    about: {
      header: 'Sobre',
      nav: {
        research: 'Investigaçã',
        results: 'Resultados',
        faq: 'FAQ',
        education: 'Educação',
        team: 'A Equipa'
      }
    },
    nav: {
      about: 'Sobre',
      adminPage: 'Pág. Admin.',
      classify: 'Classificar',
      collections: 'Coleccionar',
      exploreProject: 'Explorar o Projecto',
      lab: 'Lab',
      recents: 'Recentes',
      talk: 'Debater',
      underReview: 'Em  Revisã',
      zooniverseApproved: 'Aprovado pelo Zooniverse'
    },
    classifyPage: {
      dark: 'escuro',
      light: 'claro',
      title: 'Classificar',
      themeToggle: 'Mudar para %(theme)s tema'
    },
    home: {
      organization: 'Organização',
      researcher: 'Mensagem do investigador',
      about: 'Sobre %(title)s',
      metadata: {
        statistics: 'Estatísticas %(title)s',
        classifications: 'Classificações',
        volunteers: 'Voluntários',
        completedSubjects: 'Itens Completados',
        subjects: 'Itens'
      },
      talk: {
        zero: 'Neste momento ninguém está a falar sobre o projecto **%(title)s**.',
        one: 'Neste momento está **1**  pessoa a falar sobre o projecto **%(title)s**.',
        other: 'Neste momento estão **%(count)s** pessoas a falar sobre o projecto **%(title)s**.'
      },
      joinIn: 'Aderir',
      learnMore: 'Saber mais',
      getStarted: 'Iniciar',
      workflowAssignment: 'Desbloqueou %(workflowDisplayName)s',
      visitLink: 'Visitar o projecto',
      links: 'Ligações Externas para o Projecto'
    }
  },
  organization: {
    error: 'Ocorreu um erro ao recuperar a organizaçã',
    home: {
      about: 'Sobre %(title)s',
      introduction: 'Introdução',
      learn: 'Saiba mais sobre o projecto %(title)s',
      links: 'Ligações',
      metadata: {
        complete: 'Percentagem completada',
        heading: 'Estatísticas Organizacionais',
        numbers: 'Em números',
        projects: 'Projectos',
        subtitle: 'Mantenha-se a par do progresso alcançado por si e pelos seus colegas voluntários do projecto.',
        text: "Todos os toques contam! Junte-se à comunidade do projecto %(title)s para o completar e ajudar os investigadores a produzir resultados importantes."
      },
      projects: {
        active: 'Projectos Activos',
        all: 'Todos',
        error: 'Ocorreu um erro no carregamento dos projectos da organização.',
        finished: 'Projectos Completados',
        hideSection: 'Esconder Secção',
        loading: 'A carregar os projectos da organização...',
        none: 'Não há projectos associados com esta organização',
        paused: 'Projectos em Pausa',
        projectCategory: 'Categoria do Projecto',
        showSection: 'Mostrar Secção'
      },
      researcher: 'Mensagem do Investigador',
      viewToggle: 'Ver como Voluntário',
      readLess: 'Ler menos',
      readMore: 'Ler mais'
    },
    loading: 'A carregar a organização',
    notFound: 'Organização não encontrada.',
    notPermission: 'Se tem a certeza de que o URL está correcto, talvez não tenha permissão para visualizar esta organização.',
    pleaseWait: 'Por favor aguarde...'
  },
  tasks: {
    hidePreviousMarks: 'Esconder as marcas já feitas %(count)s',
    less: 'Menos',
    more: 'Mais',
    shortcut: {
      noAnswer: 'Sem resposta'
    },
    survey: {
      clear: 'Limpar',
      clearFilters: 'Limpar filtros',
      makeSelection: 'Seleccione',
      showing: 'Mostrar %(count)s de %(max)s',
      confused: 'Muitas vezes confundido com',
      dismiss: 'Ignorar',
      itsThis: 'Creio que é isto',
      cancel: 'Cancelar',
      identify: 'Identificar',
      surveyOf: 'Pesquisa de %(count)s',
      identifications: {
        zero: 'Sem identificações',
        one: '1 identificação',
        other: '%(count)s identificações'
      }
    }
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Gerir Utilizadores',
      projectStatus: 'Definir Estado do Projecto',
      grantbot: 'Grantbot',
      organizationStatus: 'Definir Estado da Organização'
    },
    notAdminMessage: 'Não é um administrador',
    notSignedInMessage: 'Não tem uma sessão activa'
  },
  signIn: {
    title: 'Entrar / Registar-se',
    withZooniverse: 'Entrar com a sua conta Zooniverse',
    whyHaveAccount: 'Os voluntários registados podem acompanhar o seu trabalho e serão creditados em todas as publicações resultantes.',
    signIn: 'Entrar',
    register: 'Registar-se',
    orThirdParty: 'Ou entre com outro serviço',
    withFacebook: 'Entrar com Facebook',
    withGoogle: 'Entrar com Google'
  },
  notFoundPage: {
    message: 'Não encontrado'
  },
  resetPassword: {
    heading: 'Redefinir a Senha',
    newPasswordFormDialog: 'Digite a mesma senha duas vezes para poder voltar a fazer alguma investigação. As senhas precisam de ter pelo menos 8 caracteres.',
    newPasswordFormLabel: 'Nova senha:',
    newPasswordConfirmationLabel: 'Repita a sua senha para confirmação:',
    enterEmailLabel: 'Por favor digite aqui o seu endereço de e-mail e enviar-lhe-emos uma ligação (link) que poderá usar para a redefinir.',
    emailSuccess: 'Acabámos de lhe enviar um e-mail com uma ligação (link) para redefinir a sua senha.',
    emailError: 'Ocorreu um erro ao redefinir a sua senha.',
    passwordsDoNotMatch: 'As senhas não coincidem. Tente novamente.',
    loggedInDialog: 'Neste momento, a sua sessão está activa. Saia da sessão se desejar redefinir a sua senha.',
    missingEmailsSpamNote: 'Se não  recebeu o nosso e-mail de redefinição verifique por favor a sua pasta de spam.',
    missingEmailsAlternateNote: 'Se ainda não recebeu um e-mail, por favor tente qualquer outro endereço de e-mail com o qual possa ter-se registado.'
  },
  workflowToggle: {
    label: 'Activo'
  },
  collections: {
    createForm: {
      private: 'Privado',
      submit: 'Adicionar Colecção'
    }
  },
  emailSettings: {
    email: 'Endereço de e-mail',
    general: {
      section: 'Preferências de e-mail do Zooniverse',
      updates: 'Receber por e-mail actualizações gerais do Zooniverse',
      classify: 'Receber por e-mail actualizações quando classificar pela primeira vez num projecto',
      note: 'Nota: Desmarcar a caixa não cancelará a sua inscrição em nenhum dos projectos',
      manual: 'Gerir projectos individualmente',
      beta: 'Receba por e-mail actualizações do projecto beta e torne-se um verificador beta',
      partnerPreferences: 'Preferências e-mail para parceiros do Zooniverse',
      nasa: 'Receber periodicamente da NASA, por e-mail, actualizações sobre projectos e esforços genéricos da NASA relativos a ciência cidadã'
    },
    talk: {
      section: 'Preferências de e-mail para Debater',
      header: 'Enviem-me um e-mail',
      frequency: {
        immediate: 'Imediatamente',
        day: 'Diariamente',
        week: 'Semanalmente',
        never: 'Nunca'
      },
      options: {
        participating_discussions: 'Quando as discussões em que estou a participar são actualizadas',
        followed_discussions: 'Quando as discussões que estou a seguir são actualizadas',
        mentions: 'Quando eu sou mencionado',
        group_mentions: 'Quando sou mencionado pelo grupo (@admins, @team etc.)',
        messages: 'Quando recebo uma mensagem privada',
        started_discussions: 'Quando for iniciada uma discussão num forum que eu estou a seguir'
      }
    },
    project: {
      section: 'Preferências de e-mail para o projecto',
      header: 'Projecto '
    }
  },
  about: {
    index: {
      header: 'Sobre',
      title: 'Sobre',
      nav: {
        about: 'Sobre',
        publications: 'Publicações',
        ourTeam: 'A Nossa Equipa',
        acknowledgements: 'Reconhecimentos',
        contact: 'Contacte-nos',
        faq: 'FAQ',
        resources: 'Recursos',
        highlights: 'Livro de Destaques',
        donate: 'Faça uma Doação'
      }
    },
    home: {
      title: '## O que é o Zooniverse?',
      whatIsZooniverse: 'O Zooniverse é a maior e mais popular plataforma do mundo para investigação potenciada por pessoas. Esta investigação é possibilitada por voluntários - mais de um milhão de pessoas em todo o mundo que se juntam para auxiliar investigadores profissionais. O nosso objectivo é tornar possíveis projectos de investigação que, de outro modo, não seriam exequíveis ou práticos. Os projectos de investigação do Zooniverse resultam em novas descobertas, conjuntos de dados úteis para a comunidade de investigação em geral e [muitas publicações](/about/publications).',
      anyoneCanResearch: '### No Zooniverse, qualquer pessoa pode ser um investigador\n\nNão precisa de antecedentes, formação, ou conhecimento especializado para participar em qualquer projecto do Zooniverse. Facilitamos a contribuição de qualquer pessoa para a investigação académica real, no seu próprio computador e como lhe for mais conveniente.\n\nPoderá estudar objectos de interesse, autênticos, reunidos por investigadores, tais como imagens de galáxias distantes, registos históricos e diários ou vídeos de animais nos seus habitats naturais. Ao responder a perguntas simples sobre eles, ajudará a contribuir para a compreensão do mundo, da história, do universo e muito mais.\n\nCom o nosso amplo e sempre crescente conjunto de projectos, cobrindo muitas disciplinas e tópicos das ciências e humanidades há, no Zooniverse, um lugar para toda e qualquer pessoa explorar, aprender e divertir-se. Para ser nosso voluntário  basta ir à página [Projectos](/projects), escolher um de que goste e começar.',
      accelerateResearch: '### Aceleramos investigações importantes ao trabalharmos em conjunto\n\nO grande desafio da investigação do século XXI é lidar com o dilúvio de informações que hoje em dia podemos coligir sobre o mundo ao nosso redor. Os computadores podem ajudar mas, em muitos campos, a capacidade humana de reconhecimento de padrões - e a nossa capacidade de nos surpreendermos - torna-nos superiores. Com a ajuda dos voluntários do Zooniverse, os investigadores podem analisar a sua informação com mais rapidez e precisão do que, de outro modo, seria possível, economizando tempo e recursos, aumentando a capacidade dos computadores virem a executar as mesmas tarefas, e levando a um progresso e entendimento mais rápidos do mundo, resultando na obtenção de resultados emocionantes mais rapidamente.\n\nOs nossos projectos combinam as contribuições de muitos voluntários individuais, contando com uma versão da ‘sabedoria das multidões’ para produzir dados confiáveis e precisos. Ao fazer com que muitas pessoas analisem os dados também podemos estimar a probabilidade de se cometer um erro. O produto de um projecto do Zooniverse é, geralmente, o exactamente necessário para obter progressos em muitos campos de investigação.',
      discoveries: '###Voluntários e profissionais fazem juntos descobertas reais\n\nOs projectos do Zooniverse são construídos com o objectivo de converter os esforços dos voluntários em resultados mensuráveis. Estes projectos produziram um grande número de [publicações de investigação](/about/publications), bem como vários conjuntos de código aberto de dados analisados. Em alguns casos, os voluntários do Zooniverse fizeram descobertas completamente inesperadas e cientificamente importantes.\n\nUma quantidade significativa desta investigação ocorre nos fóruns de debate do Zooniverse, onde os voluntários podem trabalhar juntos e com as equipas de investigação. Estes fóruns estão integrados em cada projecto para permitir tudo, desde "hashtagging" rápido até análise colaborativa aprofundada. Há também um fórum central do Zooniverse para debate geral e debate sobre assuntos do Zooniverse.\n\nMuitas das descobertas mais interessantes dos projectos do Zooniverse vieram de debates entre voluntários e investigadores. Incentivamos todos os utilizadores a juntarem-se às conversas nos fóruns de debate para uma participação mais aprofundada.'
    },
    publications: {
      nav: {
        showAll: 'Mostrar tudo',
        space: 'Espaço',
        physics: 'Física',
        climate: 'Clima',
        humanities: 'Humanidades',
        nature: 'Natureza',
        medicine: 'Medicina',
        meta: 'Meta'
      },
      content: {
        header: {
          showAll: 'Todas as Publicações'
        },
        submitNewPublication: 'Para submeter uma nova publicação ou actualizar uma já existente, use  [este formulário](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform).  O nosso objectivo é publicar ligaç oes para artigos publicados que possam ser acedidos pelo público. Os artigos aceites para publicação, mas ainda não publicados, também são válidos.'
      },
      publication: {
        viewPublication: 'Ver publicação.',
        viewOpenAccess: 'Ver versão de acesso aberto.'
      }
    },
    acknowledgements: {
      title: '## Reconhecimento do Zooniverse',
      citation: '### Citação Académica',
      instructions: 'De acordo com as [Políticas do Zooniverse Project Builder](https://help.zooniverse.org/getting-started/lab-policies), todas as publicações de investigação que usem dados derivados de projectos aprovados pelo Zooniverse (aqueles listados na [página de Projectos do Zooniverse](/projects)) estão obrigadas a reconhecer o Zooniverse e a plataforma Project Builder. Para tal use, por favor, o seguinte texto:',
      supportText: '*Esta publicação utiliza dados gerados pela plataforma [Zooniverse.org](https://www.zooniverse.org/), cujo desenvolvimento é financiado por apoios generosos, incluindo um Global Impact Award da Google e uma doação da Fundação Alfred P. Sloan.*',
      publicationRequest: 'Pedimos a todos os investigadores que de alguma forma utilizem a plataforma Zooniverse Project Builder que considerem igualmente incluir o reconhecimento acima nas suas publicações.',
      publicationShareForm: 'Encorajamos vivamente todos os proprietários de projectos a reportar-nos via [este formulário](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform) as publicações de investigação aceites para publicação que usem os dados produzidos pelo Zooniverse. Pode encontrar uma lista de publicações escritas usando o Zooniverse na nossa página de [Publicações](publications).',
      questions: 'Se tiver alguma dúvida sobre como reconhecer o Zooniverse, tal como fazer referência a um determinado indivíduo ou código personalizado, por favor [contacte-nos](contact).',
      press: ' ### Escrever sobre o Zooniverse na Imprensa',
      projectURLs: 'Ao escrever na imprensa sobre projectos específicos do Zooniverse, inclua o URL do projecto (nas edições impressa e digital).',
      ZooURL: 'Ao escrever sobre o Zooniverse em geral, inclua o URL [Zooniverse.org](https://www.zooniverse.org/) em algum ponto do seu artigo.',
      enquiries: 'Se estiver interessado em entrevistar um membro da equipa, por favor [contacte-nos](contact).'
    },
    contact: {
      title: '## Contactos e os Media Sociais',
      discussionBoards: 'Na maioria das vezes, a melhor maneira de entrar em contacto com a equipa do Zooniverse ou com qualquer equipa de projecto, principalmente sobre questões específicas de um projecto, é através dos fóruns de discussão.',
      email: 'Se precisar de entrar em contacto com a equipa do Zooniverse sobre um assunto geral, também poderá enviar um e-mail à equipa para [contact@zooniverse.org] (mailto: contact@zooniverse.org). Por favor, tenha em conta que a equipa do Zooniverse é relativamente pequena e muito ocupada, portanto, infelizmente, não podemos responder a todos os e-mails que recebemos.',
      collaborating: 'Se estiver interessado em colaborar com o Zooniverse, por exemplo, num projecto personalizado, envie um e-mail para [collab@zooniverse.org](mailto: collab@zooniverse.org). (Repare que o nosso [Project Builder](/lab) oferece uma maneira eficaz de configurar um novo projecto sem precisar de entrar em contacto com a equipa!)',
      pressInquiries: 'Para perguntas da imprensa, entre em contacto com os directores do Zooniverse, Chris Lintott através de [chris@zooniverse.org](mailto:chris@zooniverse.org) ou +44 (0) 7808 167288 ou Laura Trouille através de [trouille@zooniverse.org](mailto:trouille@zooniverse.org) ou +1 312 322 0820.',
      dailyZoo: 'Se deseja manter-se actualizado sobre o que está a acontecer no Zooniverse e os nossos mais recentes resultados, consulte o [Daily Zooniverse](http://daily.zooniverse.org/) ou o [blog principal do Zooniverse](http://blog.zooniverse.org/). Também pode seguir o Zooniverse no [Twitter](http://twitter.com/the_zooniverse), no [Facebook](http://facebook.com/therealzooniverse) e no [Google+](https://plus.google.com/+ZooniverseOrgReal).'
    },
    faq: {
      title: '## Perguntas frequentes',
      whyNeedHelp: '**Porque é que os investigadores precisam da sua ajuda? Porque é que os computadores não podem executar estas tarefas?**\nOs seres humanos são melhores que os computadores em muitas tarefas. Para a maioria dos projectos do Zooniverse, os computadores não são suficientemente bons para realizar a tarefa exigida ou podem não reconhecer características interessantes que um humano detectaria - é por isso que precisamos da sua ajuda. Alguns projectos do Zooniverse também estão a usar as classificações humanas para ajudar a treinar computadores para que, no futuro, se saiam melhor nestas tarefas de investigação. Quando participa num projecto do Zooniverse, está a  contribuir para investigações existentes.',
      amIDoingThisRight: '**Como é que sei se estou a fazer isto bem?**\nPara a maioria dos assuntos mostrados nos projectos do Zooniverse, os investigadores não sabem a resposta correcta e é por isso que precisam da sua ajuda. Os seres humanos são realmente bons em tarefas de reconhecimento de padrões; e, geralmente, o seu primeiro palpite é provavelmente o certo. Não se preocupe demasiado com cometer erros ocasionais - mais de uma pessoa analisará cada imagem, vídeo ou gráfico de um projecto. A maioria dos projectos do Zooniverse possui um botão Ajuda, uma página de Perguntas Frequentes (FAQ) e um Guia de Campo com mais informações para o guiar na classificação.',
      whatHappensToClassifications: '*O que acontece com a minha classificação depois de a enviar?**\nAs suas classificações são armazenadas na base de dados online segura do Zooniverse. Posteriormente, a equipa de investigação de um projecto acede-a e combina as avaliações de vários voluntários armazenadas para cada item, incluindo as suas classificações. Depois de submeter a sua resposta para uma determinada imagem, gráfico ou vídeo, não pode voltar atrás e editá-la. Mais informações podem ser encontradas na página [Acordo de Utilização e Política de Privacidade do Zooniverse](/privacy).',
      accountInformation: '**O que faz o Zooniverse  com as informa ões da minha conta?**\nO Zooniverse leva muito a sério a tarefa de proteger as informações pessoais e dados de classificação dos nossos voluntários. Detalhes sobre estes esforços podem ser encontrados nas páginas [Acordo de Utilização e Polí tica de Privacidade do Zooniverse](/privacy) e [Segurança do Zooniverse](/security).',
      featureRequest: '**Tenho um pedido para uma funcionalidade ou encontrei um erro; com quem devo falar/como reportá-lo?**\nPode publicar as suas sugestões de novas funcionalidades e reportar erros através do [Zooniverse Talk](/talk) ou através do [Zooniverse Software repository](https://github.com/zooniverse/Panoptes-Front-End/issues).',
      hiring: '**O Zooniverse está a recrutar?**\nO Zooniverse é uma colaboração entre instituições do Reino Unido e dos Estados Unidos; toda a nossa equipa é contratada por uma ou outra destas instituições parceiras. Consulte a página de [emprego do Zooniverse](https://jobs.zooniverse.org/) para saber mais sobre oportunidades de emprego no Zooniverse.',
      howToAcknowledge: '** Sou o proprietário do projecto/membro da equipa de investigação, como devo reconhecer o Zooniverse e a Project Builder Platform no meu trabalho, sumário, etc.?**\nPode encontrar mais detalhes sobre como citar o Zooniverse em publicações de investigação usando dados derivados do uso do Zooniverse Project Builder na nossa página [Reconhecimentos](/about/acknowledgements).',
      browserSupport: '** Qual é a versão do navegador (browser) que o Zooniverse suporta?**\nSuportamos os principais navegadores até à penúltima versão.',
      furtherHelp: 'Não encontrou resposta para a sua pergunta? Visite a página [Zooniverse Solutions](https://zooniverse.freshdesk.com/support/solutions), pergunte em [Zooniverse Talk](/talk) ou [contacte-nos](/about/contact).'
    },
    resources: {
      title: '## Recursos',
      filler: '"Downloads" e directrizes úteis para falar sobre o Zooniverse.',
      introduction: '### Materiais da Marca',
      officialMaterials: '[Descarregue logótipos oficiais do Zooniverse](https://github.com/zooniverse/Brand/tree/master/style%%20guide/logos). A nossa cor oficial é o azul-petróleo hex `#00979D` ou `RGBA(65, 149, 155, 1.00)`.',
      printables: '[Download printable handouts, posters, and other ephemera](https://github.com/zooniverse/Brand/tree/master/style%%20guide/downloads). Se tiver necessidades específicas não abordadas aqui, por favor [let us know](/about/contact).',
      press: '### Informações para a Imprensa',
      tips: 'Conselhos úteis para escrever na imprensa sobre o Zooniverse',
      listOne: ' - Inclua sempre os URLs ao escrever sobre projectos específicos. Se escrever sobre o Zooniverse em geral, inclua www.zooniverse.org em algum ponto do seu artigo. Consulte a página [Reconhecimentos](/about/acknowledgements) para saber mais detalhes sobre como reconhecer correctamente o Zooniverse.',
      listTwo: ' - Por favor note: somos uma plataforma para investigação potenciada por pessoas, não uma empresa ou organização sem fins lucrativos.',
      listThree: ' - Se tem perguntas sobre o Zooniverse e gostaria de falar com um membro da nossa equipa, por favor, [contacte-nos](/about/contact).'
    },
    highlights: {
      title: '## Livro de Destaques Zooniverse 2019',
      thanks: '### Obrigado!',
      paragraphOne: 'Como agradecimento e celebração dos projectos e destaques de 2019, compilámos o nosso primeiro livro de destaques ‘Into the Zooniverse.',
      paragraphTwo: 'Na última década, os projectos do Zooniverse levaram a muitas descobertas inesperadas e cientificamente significativas e mais de 160 [peer-reviewed publications](https://zooniverse.org/publications). Tudo isso seria impossível se não fosse a nossa comunidade global de quase 2 milhões de pessoas trabalhando ao lado de centenas de pesquisadores profissionais.',
      paragraphThree: 'O livro é uma homenagem ao Ano de 2019 do Zooniverse, destacando 40 projectos Zooniverse de entre os mais de 200 lançados até ao momento. Existem muitos projectos fascinantes que não pudemos incluir este ano. Esperamos continuar a criar estes livros anualmente, destacando todo um novo conjunto de projectos e descobertas no próximo ano!',
      toDownload: '**Para descarregar uma cópia electrónica gratuita:**',
      download: 'Por favor clique em [here](http://bit.ly/zoonibook19-pdf-new) para descarregar uma cópia eletrónica gratuita de ‘Into the Zooniverse’.',
      toOrder: '**Para solicitar uma cópia impressa:**',
      order: 'Por favor clique [aqui](http://bit.ly/zoonibook19-buy-new) para solicitar uma cópia impressa de ‘Into the Zooniverse’. Note que o custo apenas cobre as despesas de impressão e as taxas postais - não obtemos lucro com as vendas da cópia impressa do livro.',
      credits: 'Um agradecimento especial aos nossos voluntários (Mark Benson, Caitlyn Buongiorno, Leslie Grove e Andrew Salata) que escreveram o texto, corrigiram-no com as equipas de investigação e criaram o livro em colaboração com a &quot;designer&quot; do Zooniverse, Becky Rother. Estamos-lhes muito gratos pelo seu tempo e esforço.'
    },
    donate: {
      title: '## Donativo',
      paragraphOne: 'O Zooniverse é uma colaboração entre a Universidade de Oxford, o Planetário Adler de Chicago, a Universidade de Minnesota - Cidades Gémeas (UMN), centenas de investigadores e mais de 2 milhões de participantes de todo o mundo. As [equipas Zooniverse](https://www.zooniverse.org/about/team) em Oxford, Adler e UMN incluem os líderes do projecto, programadores da web, designer, líder de comunicações e investigadores. Esta combinação única de experiência em investigação, comprometimento público e desenvolvimento moderno da web suporta uma assombrosa comunidade de voluntários e equipas dedicadas de investigação usando a plataforma Zooniverse.',
      paragraphTwo: 'Grande parte do financiamento do Zooniverse provém de donativos, além do apoio institucional de Oxford, Adler e UMN.',
      paragraphThree: 'Por favor, considere fazer um donativo dedutível nos impostos ao Planetário Adler. A sua oferta ao Adler ajuda os investigadores a desbloquear os seus dados através da ciência cidadã on-line, os astrónomos trazem telescópios para os bairros de toda a Chicago, adolescentes lançam as suas experiências originais para o espaço e pessoas de todas as idades relacionam-se sob as estrelas.',
      paragraphFour: 'Siga a ligação  abaixo para fazer um donativo no site do Planetário Adler.'
    }
  },
  getInvolved: {
    index: {
      title: 'Faça parte',
      nav: {
        volunteering: 'Voluntariado',
        education: 'Educação',
        callForProjects: 'Solicitação de Projectos',
        collections: 'Colecções',
        favorites: 'Favoritos'
      }
    },
    education: {
      title: '## Educação no Zooniverso',
      becomeCitizenScientist: 'Enquanto voluntários nestes ‘websites’, professores e os seus alunos podem tornar-se cientistas cidadãos e investigadores cidadãos, participando em ciência real e outra investigação. Se o professor ou os seus alunos suposerem que cometeram um erro, não devem preocupar-se; até os investigadores cometem erros. Estes projectos são configurados de forma a que mais de um voluntário analise cada dado, eliminando a grande maioria dos erros humanos. Os erros fazem parte do processo e podem, até, ajudar-nos a avaliar a dificuldade dos dados. Desde que cada um faça o seu melhor, todos estão a ajudar!',
      resources: '### Recursos para educadores que usam o Zooniverse',
      zooniverseClassrooms: ' - Instrutores e voluntários podem aceder a uma variedade de recursos educacionais na plataforma [Zooniverse Classrooms](https://classroom.zooniverse.org/). Actualmente, os materiais ASTRO 101 são direccionados para estudantes do nível introdutório do ensino superior, enquanto os ‘WildCam Labs’ são direccionados para um público estudantil mais amplo. Actualmente, estamos a trabalhar para expandir os nossos materiais curriculares a mais projectos da plataforma Zooniverse..',
      educationPages: ' - Muitos projectos do Zooniverse têm as suas próprias páginas de educação com recursos adicionais para os professores. Os recursos podem incluir um tutorial em vídeo sobre como usar o projecto, outros documentos e vídeos úteis sobre o processo de classificação e recursos educacionais relacionados com a investigação por detrás do projecto.',
      joinConversationTitle: '### Participe na conversa',
      joinConversationBody: 'Acompanhe os mais recentes esforços educacionais do Zooniverse no [Zooniverse Blog](http://blog.zooniverse.org/). Também pode conversar com outros educadores e colegas do Zooniverse interessados em usar investigações realizadas por pessoas em todos os tipos de ambientes de aprendizagem no fórum [Zooniverse Education Talk](http://zooniverse.org/talk/16).',
      howEducatorsUseZooniverse: '### Como é que os educadores estão a usar o Zooniverse?',
      inspiration: 'Á procura um pouco de inspiração? Aqui estão algumas das maneiras como os educadores usaram os projectos e os recursos educacionais do Zooniverse:',
      floatingForests: '- [Florestas Flutuantes: Ensinando Crianças Pequenas Sobre o Kelp](http://blog.zooniverse.org/2015/04/29/floating-forests-teaching-young-children-about-kelp/)',
      cosmicCurves: '- [Curvas Cósmicas: Investigando as Lentes Gravitacionais no Planetário Adler](http://blog.zooniverse.org/2014/03/18/cosmic-curves-investigating-gravitational-lensing-at-the-adler-planetarium/)',
      snapshotSerengeti: '- [Instantânios Do Serengeti Trazem Investigação Autêntica Aos Cursos Universitários](http://blog.zooniverse.org/2014/02/19/snapshot-serengeti-brings-authentic-research-into-undergraduate-courses/)',
      contactUs: 'Se desejar obter mais informações sobre qualquer um destes diferentes papéis, entre em contacto conosco através da página [Contacte-nos](/about/contact).'
    },
    volunteering: {
      title: '## Como ser voluntário',
      introduction: 'Em primeiro lugar, todos os que contribuem para um projecto do Zooniverse são voluntários! Temos uma comunidade global maravilhosa que nos ajuda a fazer o que fazemos. As principais formas de fazer voluntariado connosco são ajudar-nos com classificações de dados, sendo um verificador beta em projectos que ainda náo lançámos e ser moderador de um projecto. Para mais informações sobre qualquer uma dessas funções, basta ler abaixo.',
      projectVolunteeringTitle: '### Voluntário num Projecto',
      projectVolunteeringDescription: 'O voluntariado num projecto é a maneira mais fácil e comum de ser voluntário. Precisamos sempre de voluntários para participar nos nossos projectos e classificar os dados neles contidos. Pode ler mais sobre o que acontece com as classificações e como isso ajuda a comunidade científica e o progresso da ciência na página [Sobre](/about).',
      projectLink: 'Não há requisito de tempo mínimo necessário; faça tanto ou tão pouco quanto quiser. Para começar como voluntário de classificações, basta aceder à página [Projectos](/projects), percorrê-la até encontrar um de que goste e começar!',
      betaTesterTitle: '###  Voluntário Vericador Beta',
      betaTesterDescription: 'Os voluntários também nos ajudam a testar projectos antes de serem lançados, para verificar se estão a funcionar correctamente. Isso envolve trabalhar com algumas classificações no projecto beta para verificar se ele funciona, procurar erros e preencher um questionário no final. Isso ajuda-nos a encontrar quaisquer problemas que precisem de ser resolvidos no projecto e também avaliar a adequação do projecto ao Zooniverse. Pode ler algumas directrizes sobre o que faz com que um projecto seja adequado na página [Políticas](https://help.zooniverse.org/getting-started/lab-policies), sob ‘Regras e Regulamentos’.',
      betaTesterSignUp: 'Para se inscrever como verificador beta, vá para [www.zooniverse.org/settings/email](/settings/email) e marque a caixa relacionada com teste beta. Enviar-lhe-emos um e-mail sempre que um projecto estiver pronto para ser testado. Pode alterar as suas configurações de e-mail a qualquer momento usando [a mesma página de e-mail](/settings/email) e desmarcando a caixa.',
      projectModeratorTitle: '### Voluntário  Moderador de Projecto',
      projectModeratorBody: 'Os voluntários moderadores têm permissões adicionais na ferramenta Debater ("Talk") de um projecto específico. Eles ajudam a moderar os debates e actuam como um ponto de contacto para o projecto. Os moderadores são seleccionados pelo proprietário do projecto. Se estiver interessado em tornar-se um moderador de um projecto do qual participa, vá para a página ‘Sobre’ desse projecto e entre em contacto com o investigador.',
      furtherInformationTitle: '### Mais informações',
      contactUs: 'Se desejar obter mais informações sobre qualquer um destes diferentes papéis, entre em contacto conosco através da página [Contacte-nos](/about/contact).'
    }
  },
  userSettings: {
    account: {
      displayName: 'Nome a exibir(obrigatório)',
      displayNameHelp: 'Formato em que o seu nome aparecerá aos outros utilizadores na ferramenta ‘Debater’ e na sua Página de Perfil',
      realName: 'Nome verdadeiro (opcional)',
      realNameHelp: 'Público; será usado para o reconhecermos em documentos, cartazes, etc.',
      interventions: 'Mostrar notificações de intervenção do projecto.',
      interventionsHelp: 'Permitir que os projectos exibam mensagens enquanto estiver a classificar.',
      interventionsPreferences: 'Preferências de notificação',
      changePassword: {
        heading: 'Mudar a sua senha',
        currentPassword: 'Senha actual (obrigatório)',
        newPassword: 'Nova senha (obrigatório)',
        tooShort: 'Senha demasiado curta',
        confirmNewPassword: 'Confirme a nova senha (obrigatório)',
        doesntMatch: 'Estas senhas são diferentes',
        change: 'Mudar'
      }
    },
    profile: {
      dropImage: 'Arraste uma imagem para aqui (ou clique para seleccionar).',
      changeAvatar: 'Mude o avatar',
      avatarImageHelp: 'Colocar aqui uma imagem (quadrada, menor que %(size)s KB)',
      clearAvatar: 'Limpar o avatar',
      changeProfileHeader: 'Mudar o cabeçalho do perfil',
      profileHeaderImageHelp: 'Colocar aqui uma imagem (qualquer dimensão, menor que %(size)s KB)',
      clearHeader: 'Limpar o cabeçalho'
    }
  }
};
