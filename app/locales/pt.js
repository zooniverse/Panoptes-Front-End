export default {
  loading: '(A carregar)',
  classifier: {
    back: 'Voltar',
    backButtonWarning: 'Voltar irá limpar o seu trabalho para a tarefa actual.',
    close: 'Fechar',
    continue: 'Continuar',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Concluir',
    doneAndTalk: 'Concluir e Discutir',
    dontShowMinicourse: 'Não mostrar o minicurso no futuro',
    letsGo: 'Vamos!',
    next: 'Próximo',
    optOut: 'Excluir',
    taskTabs: {
      taskTab: 'Tarefa',
      tutorialTab: 'Tutorial'
    },
    recents: 'As suas classificações recentes',
    talk: 'Falar',
    taskHelpButton: 'Precisa de ajuda com esta tarefa?',
    miniCourseButton: 'Reiniciar o minicurso do projecto',
    workflowAssignmentDialog: {
      promotionMessage: 'Parabéns! Desbloqueou o próximo fluxo de trabalho. Se  preferir permanecer neste fluxo de trabalho, pode optar por permanecer.',
      acceptButton: 'Leve-me para o próximo nível!',
      declineButton: 'Não, obrigado'
    },
    interventions: {
      optOut: 'Não mostrar estas mensagens novamente.'
    }
  },
  project: {
    language: 'Língua',
    loading: 'A carregar o projecto',
    disclaimer: 'Este projecto foi construído usando o "Zooniverse Project Builder", mas ainda não é um projecto oficial do Zooniverse. Consultas e questões relacionadas com este projecto direccionadas à Equipa do Zooniverse podem não receber nenhuma resposta.',
    fieldGuide: 'Guia de Campo',
    about: {
      header: 'Sobre',
      nav: {
        research: 'Investigação',
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
      collections: 'Colectar',
      exploreProject: 'Explorar o Projecto',
      lab: 'Lab',
      recents: 'Recentes',
      talk: 'Falar',
      underReview: 'Sob Revisão',
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
      researcher: 'Palavras do investigador',
      about: 'Sobre %(title)s',
      metadata: {
        statistics: 'Estatísticas %(title)s',
        classifications: 'Classificações',
        volunteers: 'Voluntários',
        completedSubjects: 'Assuntos Completados',
        subjects: 'Assuntos'
      },
      talk: {
        zero: 'Ninguém está a falar sobre **%(title)s** neste momento.',
        one: '**1** pessoa está a falar sobre **%(title)s** neste momento.',
        other: '**%(count)s** pessoas estão a falar sobre **%(title)s** neste momento.'
      },
      joinIn: 'Aderir',
      learnMore: 'Saber mais',
      getStarted: 'Iniciar',
      workflowAssignment: 'Desbloqueou %(workflowDisplayName)s',
      visitLink: 'Visitar o projecto',
      links: 'Links Externos para o Projecto'
    }
  },
  organization: {
    error: 'Houve um erro na recuperação da organização',
    home: {
      about: 'About %(title)s',
      introduction: 'Introdução',
      learn: 'Learn more about %(title)s',
      links: 'Links',
      metadata: {
        complete: 'Percent complete',
        heading: 'Organization Statistics',
        numbers: 'By the numbers',
        projects: 'Projectos',
        subtitle: 'Keep track of the progress you and your fellow volunteers have made on this project.',
        text: "Every click counts! Join %(title)s's community to complete this project and help researchers produce important results."
      },
      projects: {
        active: 'Active Projects',
        all: 'All',
        error: 'Houve um erro no carregamento dos projectos da organização',
        finished: 'Finished Projects',
        hideSection: 'Hide Section',
        loading: 'A carregar os projectos da organização...',
        none: 'Não há projectos associados com esta organização',
        paused: 'Paused Projects',
        projectCategory: 'Project Category',
        showSection: 'Show Section'
      },
      researcher: 'Palavras de um investigador',
      viewToggle: 'Ver Como Voluntário',
      readLess: 'Ler menos',
      readMore: 'Ler mais'
    },
    loading: 'A carregar a organização',
    notFound: 'Organização não encontrada',
    notPermission: 'Se tiver a certeza de que a URL está correcta, talvez não tenha permissão para visualizar esta organização.',
    pleaseWait: 'Por favor aguarde...'
  },
  tasks: {
    hidePreviousMarks: 'Hide previous marks %(count)s',
    less: 'Menos',
    more: 'Mais',
    shortcut: {
      noAnswer: 'Sem resposta'
    },
    survey: {
      clear: 'Limpar',
      clearFilters: 'Limpar filtros',
      makeSelection: 'Seleccionar',
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
      projectStatus: 'Definir Status do Projecto  ',
      grantbot: 'Grantbot',
      organizationStatus: 'Definir Status da Organização'
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
    orThirdParty: 'Entrar com outro serviço',
    withFacebook: 'Entrar com Facebook',
    withGoogle: 'Entrar com Google'
  },
  notFoundPage: {
    message: 'Não encontrado'
  },
  resetPassword: {
    heading: 'Redefinir a senha',
    newPasswordFormDialog: 'Digite a mesma senha duas vezes para voltar a fazer alguma pesquisa. As senhas precisam ter pelo menos 8 caracteres.',
    newPasswordFormLabel: 'Nova senha:',
    newPasswordConfirmationLabel: 'Repita a sua senha para confirmação:',
    enterEmailLabel: 'Digite o seu endereço de e-mail aqui e enviar-lhe-emos um link que  poderá usar para a redefinir.',
    emailSuccess: 'Acabámos de lhe enviar um e-mail com um link para redefinir a sua senha.',
    emailError: 'Ocorreu um erro ao redefinir a sua senha.',
    passwordsDoNotMatch: 'As senhas não coincidem. Tente novamente.',
    loggedInDialog: 'Neste momento, a sua sessão está activa. Saia da sessão se desejar redefinir a sua senha.',
    missingEmailsSpamNote: 'Verifique na sua pasta de spam se recebeu o nosso e-mail de redefinição.',
    missingEmailsAlternateNote: 'Se ainda não recebeu um e-mail, por favor tente qualquer outro endereço de e-mail com o qual se tenha registado.'
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
      section: 'Preferências de email do Zooniverse',
      updates: 'Receba actualizações gerais por email do Zooniverse',
      classify: 'Receba actualizações por email quando classificar pela primeira vez num projecto',
      note: 'Nota: Desmarcar a caixa não cancelará a sua inscrição em nenhum dos projectos',
      manual: 'Gerir projectos individualmente',
      beta: 'Receba actualizações por e-mail do projecto beta e torne-se um testador beta',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'Preferências de e-mail para Falar',
      header: 'Enviem-me um email',
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
        started_discussions: 'Quando uma discussão for iniciada num quadro que eu estou a seguir'
      }
    },
    project: {
      section: 'Preferências de email do projecto',
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
        acknowledgements: 'Reconhecimemtos',
        contact: 'Contacte-nos',
        faq: 'FAQ',
        resources: 'Recursos',
        highlights: 'Highlights Book',
        donate: 'Donate'
      }
    },
    home: {
      title: '## O que é o Zooniverse?',
      whatIsZooniverse: 'O Zooniverse é a maior e mais popular plataforma do mundo para pesquisas potenciadas por pessoas. Estas pesquisas são possibilitadas por voluntários - mais de um milhão de pessoas em todo o mundo que se reúnem para auxiliar pesquisadores profissionais. O nosso objectivo é permitir pesquisas que não seriam possíveis, ou práticas, caso contrário. As pesquisas do Zooniverse resultam em novas descobertas, conjuntos de dados úteis para a comunidade de pesquisa em geral e [many publications](/about/publications)..',
      anyoneCanResearch: '### No Zooniverse, qualquer pessoa pode ser um pesquisador\n\nNão precisa de antecedentes, formação, ou conhecimento especializado para participar de qualquer projecto do Zooniverse. Facilitamos a contribuição de qualquer pessoa para a pesquisa académica real, no seu próprio computador e pela sua própria conveniência.\n\nPoderá estudar objectos de interesse autênticos reunidos por pesquisadores, como imagens de galáxias distantes, registos históricos e diários ou vídeos de animais nos seus habitats naturais. Ao responder a perguntas simples sobre eles, ajudará a contribuir para a compreensão do mundo, da história, do universo e muito mais.\n\nCom o nosso amplo e sempre abrangente conjunto de projectos, cobrindo muitas disciplinas e tópicos em ciências e humanidades, há um lugar para toda e qualquer pessoa explorar, aprender e divertir-se no Zooniverse. Para se voluntariar connosco, basta ir à página [Projets](/projects), escolher um que goste e começar.',
      accelerateResearch: '### Aceleramos importantes pesquisas ao trabalhar em conjunto\n\nO grande desafio das pesquisas do século XXI é lidar com o fluxo de informações que agora podemos colectar sobre o mundo ao nosso redor. Os computadores podem ajudar, mas em muitos campos a capacidade humana de reconhecimento de padrões - e a nossa capacidade de nos surpreender - torna-nos superiores. Com a ajuda de voluntários da Zooniverse, os pesquisadores podem analisar as suas informações com mais rapidez e precisão do que seria possível, economizando tempo e recursos, aumentando a capacidade dos computadores de executar as mesmas tarefas e levando a um progresso e entendimento mais rápidos do mundo, levando à obtenção de resultados emocionantes mais rapidamente.\n\nOs nossos projectos combinam contribuições de muitos voluntários individuais, contando com uma versão da ‘sabedoria das multidões’ para produzir dados confiáveis ​​e precisos. Ao fazer com que muitas pessoas analisem os dados, também podemos estimar a probabilidade de cometer um erro. O produto de um projecto do Zooniverse geralmente é exactamente o necessário para fazer progressos em muitos campos de pesquisa.',
      discoveries: '### Voluntários e profissionais fazem descobertas reais juntos\n\nOs projectos do Zooniverse são construídos com o objectivo de converter os esforços dos voluntários em resultados mensuráveis. Estes projectos produziram um grande número de [published research papers](/about/publications), bem como vários conjuntos de dados analisados ​​de código aberto. Em alguns casos, os voluntários do Zooniverse fizeram descobertas completamente inesperadas e cientificamente significativas.\n\nUma quantidade significativa desta pesquisa ocorre nos fóruns de discussão do Zooniverse, onde os voluntários podem trabalhar juntos e com as equipas de pesquisa. Estes painéis são integrados com cada projecto para permitir tudo, desde "hashtagging" rápido até análise colaborativa aprofundada. Há também um quadro central do Zooniverse para discussão geral e discussão sobre assuntos do Zooniverse.\n\nMuitas das descobertas mais interessantes dos projectos do Zooniverse vieram de discussões entre voluntários e pesquisadores. Incentivamos todos os utilizadores a participarem da conversa nos fóruns de discussão para uma participação mais aprofundada.'
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
          showAll: 'Todas as publicações'
        },
        submitNewPublication: 'Para enviar uma nova publicação ou actualizar uma já existente, use  [this form](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform).  O nosso objectivo é publicar links para artigos publicados que possam ser acedidos pelo público. Os artigos aceites para publicação, mas ainda não publicados, também são válidos.'
      },
      publication: {
        viewPublication: 'Ver publicação.',
        viewOpenAccess: 'Ver versão de acesso aberto.'
      }
    },
    acknowledgements: {
      title: '## Reconhecumento ao Zooniverse',
      citation: '### Citação Académica',
      instructions: 'De acordo com [Zooniverse Project Builder Policies](https://help.zooniverse.org/getting-started/lab-policies), todas as publicações de pesquisa que usam dados derivados de projectos aprovados pelo Zooniverse (aqueles listados em [Zooniverse Projects page](/projects)) são obrigados a reconhecer o Zooniverse e a plataforma Project Builder. Para fazer isso, use o seguinte texto:',
      supportText: '*Esta publicação utiliza dados gerados pela plataforma [Zooniverse.org](https://www.zooniverse.org/), cujo desenvolvimento é financiado por apoios generosos, incluindo um Global Impact Award do Google e uma concessão da Fundação Alfred P. Sloan.*',
      publicationRequest: 'Pedimos que todos os pesquisadores que utilizam a plataforma Zooniverse Project Builder de qualquer forma também considerem incluir o reconhecimento acima nas suas publicações.',
      publicationShareForm: 'Incentivamos vivamente os proprietários do projecto a reportar-nos as publicações de pesquisa aceites para publicação usando os dados produzidos pelo Zooniverse via [this form](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). Pode encontrar uma lista de publicações escritas usando o Zooniverse na nossa [Publications page](publications).',
      questions: 'Se tiver alguma dúvida sobre como reconhecer o Zooniverse, como fazer referência a um determinado indivíduo ou código personalizado, por favor [get in touch](contact).',
      press: ' ### Escrever sobre o Zooniverse na imprensa',
      projectURLs: 'Ao escrever sobre projectos específicos do Zooniverse na imprensa, inclua a URL do projecto (nas edições impressa e digital).',
      ZooURL: 'Ao escrever sobre o Zooniverse em geral, inclua a URL [Zooniverse.org] (https://www.zooniverse.org/) em algum lugar do seu artigo.',
      enquiries: 'Se estiver interessado em entrevistar um membro da equipa, por favor [get in touch](contact).'
    },
    contact: {
      title: '## Contacto e Media Social',
      discussionBoards: 'Na maioria das vezes, a melhor maneira de entrar em contacto com a equipa do Zooniverse ou com qualquer equipa de projecto, principalmente sobre questões específicas do projecto, é através dos fóruns de discussão.',
      email: 'Se precisar entrar em contacto com a equipa do Zooniverse sobre um assunto geral, também poderá enviar um email para a equipa em [contact@zooniverse.org] (mailto: contact@zooniverse.org). Por favor, entenda que a equipa do Zooniverse é relativamente pequena e muito ocupada, portanto, infelizmente, não podemos responder a todos os e-mails que recebemos.',
      collaborating: 'Se estiver interessado em colaborar com o Zooniverse, por exemplo, num projecto personalizado, envie um email para [collab@zooniverse.org] (mailto: collab@zooniverse.org). (Tome nota que nosso [Project Builder](/lab) oferece uma maneira eficaz de configurar um novo projecto sem precisar de entrar em contacto com a equipa!)',
      pressInquiries: 'Para perguntas da imprensa, entre em contacto com os directores do Zooniverse, Chris Lintott através de [chris@zooniverse.org] (mailto: chris@zooniverse.org) ou +44 (0) 7808 167288 ou Laura Trouille através de  [trouille@zooniverse.org] (mailto: trouille@zooniverse.org) ou +1 312 322 0820.',
      dailyZoo: 'Se deseja manter-se actualizado com o que está a acontecer no Zooniverse e os nossos últimos resultados, consulte o [Daily Zooniverse] (http://daily.zooniverse.org/) ou o principal [Zooniverse blog] (http://blog.zooniverse.org/). Também pode seguir o Zooniverse no [Twitter] (http://twitter.com/the_zooniverse), no [Facebook] (http://facebook.com/therealzooniverse) e no [Google+] (https://plus.google. com/+ ZooniverseOrgReal).'
    },
    faq: {
      title: '## Perguntas frequentes',
      whyNeedHelp: '**Porque é que os pesquisadores precisam da sua ajuda? Porque é que os computadores não podem executar estas tarefas?**\nOs seres humanos são melhores que os computadores em muitas tarefas. Para a maioria dos projectos do Zooniverse, os computadores não suficientemente bons para realizar a tarefa exigida ou podem perder recursos interessantes que um humano detectaria - é por isso que precisamos da sua ajuda. Alguns projectos do Zooniverse também estão a usar classificações humanas para ajudar a treinar computadores para se sairem melhor nestas tarefas de pesquisa no futuro. Quando participa de um projeto do Zooniverse, está a  contribuir para pesquisas reais.',
      amIDoingThisRight: '**Como é que sei se estou a fazer isto bem?**\nPara a maioria dos assuntos mostrados nos projectos do Zooniverse, os pesquisadores não sabem a resposta correcta e é por isso que precisam da sua ajuda. Os seres humanos são realmente bons em tarefas de reconhecimento de padrões; geralmente, o seu primeiro palpite é provavelmente o certo. Não se preocupe demasiado de cometer erros ocasionais - mais de uma pessoa analisará cada imagem, vídeo ou gráfico de um projecto. A maioria dos projectos do Zooniverse possui um botão Ajuda, uma página de Perguntas Frequentes (FAQ) e um Guia de Campo com mais informações para o guiar na classificação.',
      whatHappensToClassifications: '**O que acontece com a minha classificação depois que a envio?**\nAs suas classificações são armazenadas na base de dados online segura do Zooniverse. Posteriormente, a equipa de pesquisa de um projecto acede e combina as várias avaliações voluntárias armazenadas para cada assunto, incluindo as suas classificações. Depois de enviar a sua resposta para uma determinada imagem, gráfico ou vídeo, não será possível voltar e editá-la. Mais informações podem ser encontradas em [Zooniverse User Agreement and Privacy Policy page](/privacy).',
      accountInformation: '**O que o Zooniverse faz com as informações da minha conta?**\nO Zooniverse leva muito a sério a tarefa de proteger as informações pessoais e dados de classificação dos nossos voluntários. Detalhes sobre estes esforços podem ser encontrados em [Zooniverse User Agreement and Privacy Policy page](/privacy) e [Zooniverse Security page](/security).',
      featureRequest: '**Tenho uma solicitação de recurso ou encontrei um erro; com quem devo conversar/como reportá-lo?**\nPode publicar as suas sugestões de novos recursos e reportar erros através do [Zooniverse Talk](/talk) ou através do [Zooniverse Software repository](https://github.com/zooniverse/Panoptes-Front-End/issues).',
      hiring: '**O Zooniverse está a recrutar?**\nO Zooniverse é uma colaboração entre instituições do Reino Unido e dos Estados Unidos; toda a nossa equipa é contratada por uma ou outra destas instituições parceiras. Confira em [Zooniverse jobs page](https://jobs.zooniverse.org/) para descobrir mais sobre oportunidades de emprego no Zooniverse.',
      howToAcknowledge: '** Sou proprietário do projecto/membro da equipa de pesquisa, como devo reconhecr o Zooniverse e a Plataforma do Construtor de Projectos no meu trabalho, sumário, etc.?**\nPode encontrar mais detalhes sobre como citar o Zooniverse em publicações de pesquisa usando dados derivados do uso do Zooniverse Project Builder em [Acknowledgements page](/about/acknowledgements).',
      browserSupport: '** Qual é a versão do navegador que o Zooniverse suporta?**\nNós suportamos os principais navegadores até à penúltima versão.',
      furtherHelp: 'Não encontrou a resposta para a sua pergunta? Visite [Zooniverse Solutions webpage](https://zooniverse.freshdesk.com/support/solutions), pergunte em [Zooniverse Talk](/talk) ou [get in touch](/about/contact).'
    },
    resources: {
      title: '## Recursos',
      filler: '"Downloads" e directrizes úteis para falar sobre o Zooniverse.',
      introduction: '### Materiais da Marca',
      officialMaterials: '[Download official Zooniverse logos](https://github.com/zooniverse/Brand/tree/master/style%%20guide/logos). Our official color is teal hex `#00979D` or `RGBA(65, 149, 155, 1.00)`.',
      printables: '[Download printable handouts, posters, and other ephemera](https://github.com/zooniverse/Brand/tree/master/style%%20guide/downloads). Se tiver necessidades específicas não abordadas aqui, por favor [let us know](/about/contact).',
      press: '### Informações para a imprensa',
      tips: 'Ajudas para escrever sobre o Zooniverse na imprensa',
      listOne: ' - Inclua sempre as URLs ao escrever sobre projectos específicos. Se escrever em geral sobre o Zooniverse, inclua www.zooniverse.org em algum lugar do seu artigo. Confira [Acknowledgements page](/about/acknowledgements) para obter mais detalhes sobre como reconhecer correctamente o Zooniverse.',
      listTwo: ' - Tome nota: somos uma plataforma para pesquisa feita por pessoas, não uma empresa ou organização sem fins lucrativos.',
      listThree: ' - Se tiver dúvidas sobre o Zooniverse e gostaria de falar com um membro da nossa equipe, please [contact us](/about/contact).'
    },
    highlights: {
      title: '## Zooniverse Highlights Book 2019',
      thanks: '### Obrigado!',
      paragraphOne: 'Como agradecimento e celebração dos projectos e impactos de 2019, compilámos o nosso primeiro livro de destaques ‘Into the Zooniverse’.',
      paragraphTwo: 'Na última década, os projectos do Zooniverse levaram a muitas descobertas inesperadas e cientificamente significativas e mais de 160 [peer-reviewed publications](https://zooniverse.org/publications). Tudo isso seria impossível se não fosse a nossa comunidade global de quase 2 milhões de pessoas trabalhando ao lado de centenas de pesquisadores profissionais.',
      paragraphThree: 'O livro é uma homenagem ao Ano de 2019 da Zooniverse, destacando 40 projectos Zooniverse em mais de 200 lançados até ao momento. Existem muitos projectos fascinantes que não pudemos incluir este ano. Esperamos continuar a criar estes livros anualmente, destacando todo um novo conjunto de projectos e descobertas no próximo ano!',
      toDownload: '**Para descarregar uma cópia eletrónica gratuita:**',
      download: 'Por favor clique em [here](http://bit.ly/zoonibook19-pdf-new) para descarregar uma cópia eletrónica gratuita de ‘Into the Zooniverse’.',
      toOrder: '**Para solicitar uma cópia impressa:**',
      order: 'Por favor clique em [here](http://bit.ly/zoonibook19-buy-new) se quer solicitar uma cópia impressa de ‘Into the Zooniverse’. Tome nota, que o custo simplesmente cobre as despesas de impressão de Lulu.com e as taxas postais - não obteremos lucro com as vendas da cópia impressa do livro.',
      credits: 'Um agradecimento especial aos nossos voluntários (Mark Benson, Caitlyn Buongiorno, Leslie Grove e Andrew Salata) que escreveram o texto, examinaram-no com as equipas de pesquisa e criaram o livro em colaboração com a "designer" do Zooniverse, Becky Rother. Estamos-lhes muito gratos pelo seu tempo e esforço.'
    },
    donate: {
      title: '## Donativo',
      paragraphOne: 'O Zooniverse é uma colaboração entre a Universidade de Oxford, o Planetário Adler de Chicago, a Universidade de Minnesota - Cidades Gêmeas (UMN), centenas de pesquisadores e mais de 2 milhões de participantes de todo o mundo. As equipas [Zooniverse teams](https://www.zooniverse.org/about/team) em Oxford, Adler e UMN incluem os líderes do projecto, desenvolvedores da web, designer, líder de comunicações e pesquisadores. Esta combinação única de experiência em pesquisa, comprometimento público e desenvolvimento moderno da web suporta uma incrível comunidade de voluntários e equipas de pesquisa dedicadas usando a plataforma Zooniverse.',
      paragraphTwo: 'Grande parte do financiamento do Zooniverse vem de donativos, além do apoio institucional de Oxford, Adler e UMN.',
      paragraphThree: 'Por favor, considere fazer um donativo dedutível nos impostos ao Planetário Adler. A sua oferta ao Adler ajuda os pesquisadores a desbloquear os seus dados através da ciência cidadã on-line, os astrónomos trazem telescópios para os bairros de Chicagoland, adolescentes lançam as suas experiências originais no espaço e pessoas de todas as idades conectam-se sob as estrelas.',
      paragraphFour: 'Siga o link abaixo para fazer um donativo no site do Planetário Adler.'
    }
  },
  getInvolved: {
    index: {
      title: 'Faça parte',
      nav: {
        volunteering: 'Voluntariado',
        education: 'Educação',
        callForProjects: 'Apelo a Projectos',
        collections: 'Colecções',
        favorites: 'Favoritos'
      }
    },
    education: {
      title: '## Educação no Zooniverso',
      becomeCitizenScientist: 'Como voluntários nestes sites, o professor e os seus alunos podem tornar-se cientistas e pesquisadores cidadãos, participando de ciência real e de outras pesquisas. Se o professor ou os seus alunos pensam que cometeram um erro, não se preocupem; até os pesquisadores cometem erros. Estes projectos são configurados para que mais de um voluntário analise cada dado, eliminando a grande maioria dos erros humanos. Erros fazem parte do processo e podem até ajudar-nos a avaliar a dificuldade dos dados. Desde que todos façam o seu melhor, todos estão a ajudar!',
      resources: '### Recursos para educadores que usam o Zooniverse',
      zooniverseClassrooms: ' - Instrutores e voluntários podem aceder a uma variedade de recursos educacionais na plataforma [Zooniverse Classrooms] (https://classroom.zooniverse.org/). Actualmente, os materiais ASTRO 101 são direccionados para estudantes de nível superior, enquanto os WildCam Labs são direccionados para um público mais amplo de estudantes. Actualmente, estamos a trabalhar para expandir os nossos materiais curriculares para projectos adicionais na plataforma Zooniverse.',
      educationPages: ' - Muitos projectos do Zooniverse têm as suas próprias páginas de educação com recursos adicionais para os professores. Os recursos podem incluir um tutorial em vídeo de como usar o projecto, outros documentos e vídeos úteis sobre o processo de classificação e recursos educacionais relacionados com a pesquisa por detrás do projecto.',
      joinConversationTitle: '### Participe da conversa',
      joinConversationBody: 'Acompanhe os mais recentes esforços educacionais do Zooniverse no [Zooniverse Blog] (http://blog.zooniverse.org/). Também pode conversar com outros educadores e colegas do Zooniverse interessados em usar pesquisas realizadas por pessoas em todos os tipos de ambientes de aprendizagem em  [Zooniverse Education Talk board](http://zooniverse.org/talk/16).',
      howEducatorsUseZooniverse: '### Como é que os educadores estão a usar o Zooniverse?',
      inspiration: 'Procurando um pouco de inspiração? Aqui estão algumas das formas pelas quais os educadores usaram os projectos e os recursos educacionais do Zooniverse:',
      floatingForests: '- [Floating Forests: Teaching Young Children About Kelp](http://blog.zooniverse.org/2015/04/29/floating-forests-teaching-young-children-about-kelp/)',
      cosmicCurves: '- [Cosmic Curves: Investigating Gravitational Lensing at the Adler Planetarium](http://blog.zooniverse.org/2014/03/18/cosmic-curves-investigating-gravitational-lensing-at-the-adler-planetarium/)',
      snapshotSerengeti: '- [Snapshot Serengeti Brings Authentic Research Into Undergraduate Courses](http://blog.zooniverse.org/2014/02/19/snapshot-serengeti-brings-authentic-research-into-undergraduate-courses/)',
      contactUs: 'Gostaríamos muito de saber como usou o Zooniverse com jovens ou adultos! Entre em contacto com  [education@zooniverse.org](mailto:education@zooniverse.org) se tiver alguma história interessante para compartilhar.'
    },
    volunteering: {
      title: '## Como ser voluntário',
      introduction: 'Em primeiro lugar, todos os que contribuem para um projecto do Zooniverse são voluntários! Temos uma comunidade global maravilhosa que nos ajuda a fazer o que fazemos. As principais formas de se oferecer como voluntário connosco serão ajudar-nos com classificações de dados, sendo um testador beta em projectos que ainda não lançamos e um moderador de um projecto. Para mais informações sobre qualquer uma dessas funções, basta ler abaixo.',
      projectVolunteeringTitle: '### Voluntário num Projecto',
      projectVolunteeringDescription: 'O voluntariado num projeto é a maneira mais fácil e comum de ser voluntário. Precisamos sempre de voluntários para participar dos nossos projectos e classificar os dados neles contidos. Pode ler mais sobre o que acontece com as classificações e como isso ajuda a comunidade científica e o progresso da ciência na página [About](/about).',
      projectLink: 'Não há requisito de tempo mínimo necessário; faça o quanto quiser. Para começar como voluntário de classificações, basta aceder uma página [Projects](/projects), observar, encontrar uma que goste e começar!',
      betaTesterTitle: '###  Voluntário como Testador Beta',
      betaTesterDescription: 'Os voluntários também nos ajudam a testar projectos antes de serem lançados para verificar se estão a funcionar correctamente. Isso envolve trabalhar com algumas classificações no projecto beta para verificar se ele funciona, procurar erros e preencher um questionário no final. Isso ajuda-nos a encontrar quaisquer problemas no projecto que precisem ser resolvidos e também avaliar a adequação do projecto para o Zooniverse. Pode ler algumas directrizes sobre o que torna um projecto adequado na página [Policies](https://help.zooniverse.org/getting-started/lab-policies), sob ‘Regras e Regulamemtos’.',
      betaTesterSignUp: 'Para se inscrever como testador beta, vá para  [www.zooniverse.org/settings/email](/settings/email) e marque a caixa relacionada com teste beta. Em seguida, enviar-lhe-emos e-mails quando um projecto estiver pronto para ser testado. Pode alterar as suas configurações de email a qualquer momento usando [same email page](/settings/email) e desmarcando a caixa.',
      projectModeratorTitle: '### Voluntário como Moderador de Projectos',
      projectModeratorBody: 'Os moderadores voluntários têm permissões extras na ferramenta de discussão do "Talk" para um projecto específico. Eles ajudam a moderar as discussões e actuam como um ponto de contacto para o projecto. Os moderadores são seleccionados pelo proprietário do projecto. Se estiver interessado em tornar-se um moderador de um projecto do qual participa, vá para a página Sobre do projecto e entre em contacto com o pesquisador.',
      furtherInformationTitle: '### Outras informações',
      contactUs: 'Se desejar obter mais informações sobre qualquer uma destas funções diferentes, entre em contacto conosco através da página [Contact Us](/about/contact).'
    }
  },
  userSettings: {
    account: {
      displayName: 'Nome a exibir(obrigatório)',
      displayNameHelp: 'Como é que o seu nome aparecerá para os outros utilizadores no "Talk" e na Página do seu seu Perfil',
      realName: 'Nome verdadeiro (opcional)',
      realNameHelp: 'Público; usaremos isto para dar reconhecimento em documentos, painéis, etc.',
      interventions: 'Mostrar notificações de intervenção do projecto.',
      interventionsHelp: 'Permite que os projectos exibam mensagens enquanto estiver a classificar.',
      interventionsPreferences: 'Preferências de notificação',
      changePassword: {
        heading: 'Mudar a sua senha',
        currentPassword: 'Senha actual (obrigatório)',
        newPassword: 'Nova senha (obrigatório)',
        tooShort: 'Demasiado curta',
        confirmNewPassword: 'Confirmar a nova senha (obrigatório)',
        doesntMatch: 'Estas não correspondem',
        change: 'Mudar'
      }
    },
    profile: {
      dropImage: 'Colocar uma imagem aqui (ou clique para selecionar).',
      changeAvatar: 'Mude o avatar',
      avatarImageHelp: 'Colocar uma imagem aqui (quadrada, menor que % (size)s KB)',
      clearAvatar: 'Limpar o avatar',
      changeProfileHeader: 'Mudar o cabeçalho do perfil',
      profileHeaderImageHelp: 'Colocar uma imagem aqui (qualquer dimensão, menor que %(size)s KB)',
      clearHeader: 'Limpar o cabeçalho'
    }
  }
};
