export default {
  loading: '読み込み中',
  classifier: {
    back: '戻る',
    backButtonWarning: 'Going back will clear your work for the current task.',
    close: '閉じる',
    continue: '続ける',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Done',
    doneAndTalk: 'Done & Talk',
    dontShowMinicourse: 'Do not show mini-course in the future',
    letsGo: 'さあ、やってみましょう！',
    next: '次へ',
    optOut: 'Opt out',
    taskTabs: {
      taskTab: 'タスク',
      tutorialTab: 'チュートリアル'
    },
    recents: '最近行った分類',
    talk: 'トーク',
    taskHelpButton: 'このタスクに関するヘルプが必要ですか?',
    miniCourseButton: 'Restart the project mini-course',
    workflowAssignmentDialog: {
      promotionMessage: "Congratulations! You've unlocked the next workflow. If you prefer to stay on this workflow, you can choose to stay.",
      acceptButton: 'Take me to the next level!',
      declineButton: '結構です'
    },
    interventions: {
      optOut: 'Do not show me further messages.',
      studyInfo: 'I do not want to take part in this messaging [study](+tab+https://docs.google.com/document/d/1gLyN6Dgff8dOCOC88f47OD6TtFrfSJltsLgJMKkYMso/preview).'
    }
  },
  projects: {
    welcome: {
      heading: "Welcome! We're so glad you're here",
      thanks: '我々の研究を支援することに興味を持っていただき誠に感謝しています。ここでは、皆様の参加することができるいくつかのプロジェクトを集めました。その他のオプションについては、ロジェクトのすべてを参照するために下にスクロールしてください。',
      talk: 'Make sure to also check out [Talk](/talk) where you can chat to other like-minded volunteers.',
      scrollDown: 'Scroll down for even more'
    }
  },
  project: {
    language: '言語',
    loading: 'Loading project',
    disclaimer: 'This project has been built using the Zooniverse Project Builder but is not yet an official Zooniverse project. Queries and issues relating to this project directed at the Zooniverse Team may not receive any response.',
    fieldGuide: 'フィールドガイド',
    about: {
      header: 'プロジェクト概要',
      nav: {
        research: '研究',
        results: '結果',
        faq: 'よくある質問',
        education: 'Education',
        team: 'チームメンバー'
      }
    },
    nav: {
      about: 'このプロジェクトについて',
      adminPage: 'Admin page',
      classify: '分類',
      collections: 'コレクション',
      exploreProject: 'Explore Project',
      lab: 'Lab',
      recents: 'Recents',
      talk: 'トーク',
      underReview: 'Under Review',
      zooniverseApproved: 'Zooniverse Approved'
    },
    classifyPage: {
      dark: '暗',
      light: '明',
      title: '分類する',
      themeToggle: 'Switch to %(theme)s theme'
    },
    home: {
      organization: 'Organization',
      researcher: 'Words from the researcher',
      about: 'About %(title)s',
      metadata: {
        statistics: '%(title)s Statistics',
        classifications: '分類',
        volunteers: 'ボランティア達',
        completedSubjects: '終了した',
        subjects: '対象物'
      },
      talk: {
        zero: 'No one is talking about **%(title)s** right now.',
        one: '**1** person is talking about **%(title)s** right now.',
        other: '**%(count)s** people are talking about **%(title)s** right now.'
      },
      joinIn: '参加する',
      learnMore: 'はじめる',
      getStarted: 'Get started',
      workflowAssignment: "You've unlocked %(workflowDisplayName)s",
      visitLink: 'Visit the project',
      links: 'External Project Links'
    }
  },
  organization: {
    error: 'There was an error retrieving organization',
    home: {
      about: 'About %(title)s',
      introduction: '%(title)s Introduction',
      learn: 'Learn more about %(title)s',
      links: 'Connect with %(title)s',
      metadata: {
        complete: 'Percent complete',
        heading: 'Organization Statistics',
        numbers: 'By the numbers',
        projects: 'Projects',
        subtitle: 'Keep track of the progress you and your fellow volunteers have made on this project.',
        text: "Every click counts! Join %(title)s's community to complete this project and help researchers produce important results."
      },
      projects: {
        active: 'Active Projects',
        all: 'All',
        error: 'There was an error loading organization projects.',
        finished: 'Finished Projects',
        hideSection: 'Hide Section',
        loading: 'Loading organization projects...',
        none: 'There are no %(state)s %(category)s projects associated with this organization.',
        paused: 'Paused Projects',
        projectCategory: 'Project Category',
        showSection: 'Show Section'
      },
      researcher: 'Message from the Researcher',
      viewToggle: 'View as volunteer'
    },
    loading: 'Loading organization',
    notFound: 'organization not found.',
    notPermission: "If you're sure the URL is correct, you might not have permission to view this organization.",
    pleaseWait: 'Please wait...',
    stats: {
      adjustParameters: 'Adjust Parameters',
      byTheNumbers: 'By the Numbers',
      byTheNumbersContent: {
        classifications: 'Classifications',
        firstProject: 'First Project',
        firstProjectLaunch: 'First Project Launch Date',
        liveProjects: 'Live Projects',
        pausedProjects: 'Paused Projects',
        retiredProjects: 'Retired Projects',
        retiredSubjects: 'Completed Subjects',
        subjects: 'Subjects'
      },
      classification: 'Classifications',
      comment: 'Talk Comments',
      dateRange: 'Date range',
      expandWorkflowStats: 'Expand Workflow Stats',
      for: 'for',
      hidden: 'Stats hidden',
      hourly: 'Hourly data only available for the most recent 2 weeks.',
      organizationStatistics: '%(title)s Statistics',
      perclassification: 'Classifications per',
      percomment: 'Comments per',
      projectStats: 'Live Projects (%(count)s)',
      reset: 'Reset view'
    }
  },
  tasks: {
    hidePreviousMarks: 'Hide previous marks %(count)s',
    less: 'Less',
    more: 'More',
    shortcut: {
      noAnswer: 'No answer'
    },
    survey: {
      clear: 'Clear',
      clearFilters: 'Clear filters',
      makeSelection: 'Make a selection',
      showing: 'Showing %(count)s of %(max)s',
      confused: 'Often confused with',
      dismiss: 'Dismiss',
      itsThis: 'I think it’s this',
      cancel: 'Cancel',
      identify: 'Identify',
      surveyOf: 'Survey of %(count)s',
      identifications: {
        zero: 'No identifications',
        one: '1 identification',
        other: '%(count)s identifications'
      }
    }
  },
  userAdminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Manage Users',
      projectStatus: 'Set Project Status',
      grantbot: 'Grantbot',
      organizationStatus: 'Set Organization Status'
    },
    notAdminMessage: 'You are not an administrator',
    notSignedInMessage: 'You are not signed in'
  },
  signIn: {
    title: 'Sign in/register',
    withZooniverse: 'Sign in with your Zooniverse account',
    whyHaveAccount: 'Signed-in volunteers can keep track of their work and will be credited in any resulting publications.',
    signIn: 'Sign in',
    register: 'Register',
    orThirdParty: 'Or sign in with another service',
    withFacebook: 'Sign in with Facebook',
    withGoogle: 'Sign in with Google'
  },
  notFoundPage: {
    message: 'Not found'
  },
  resetPassword: {
    heading: 'Reset Password',
    newPasswordFormDialog: 'Enter the same password twice so you can get back to doing some research. Passwords need to be at least 8 characters long.',
    newPasswordFormLabel: 'New password:',
    newPasswordConfirmationLabel: 'Repeat your password to confirm:',
    enterEmailLabel: 'Please enter your email address here and we’ll send you a link you can follow to reset it.',
    emailSuccess: 'We’ve just sent you an email with a link to reset your password.',
    emailError: 'There was an error resetting your password.',
    passwordsDoNotMatch: 'The passwords do not match, please try again.',
    loggedInDialog: 'You are currently logged in. Please log out if you would like to reset your password.',
    missingEmailsSpamNote: 'Please check your spam folder if you have not received the reset email.',
    missingEmailsAlternateNote: 'If you have still not received an email, please try any other email address you may have signed up with.'
  },
  workflowToggle: {
    label: 'アクティブ'
  },
  collections: {
    createForm: {
      private: 'プライベート',
      submit: 'コレクションに追加する'
    }
  },
  emailSettings: {
    email: 'Email address',
    general: {
      section: 'Zooniverse email preferences',
      updates: 'Get general Zooniverse email updates',
      classify: 'Get email updates when you first classify on a project',
      note: 'Note: Unticking the box will not unsubscribe you from any of the projects',
      manual: 'Manage projects individually',
      beta: 'Get beta project email updates and become a beta tester',
      partnerPreferences: 'Zooniverse partner email preferences',
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts'
    },
    talk: {
      section: 'Talk email preferences',
      header: 'Send me an email',
      frequency: {
        immediate: 'Immediately',
        day: 'Daily',
        week: 'Weekly',
        never: 'Never'
      },
      options: {
        participating_discussions: "When discussions I'm participating in are updated",
        followed_discussions: "When discussions I'm following are updated",
        mentions: "When I'm mentioned",
        group_mentions: "When I'm mentioned by group (@admins, @team, etc.)",
        messages: 'When I receive a private message',
        started_discussions: "When a discussion is started in a board I'm following"
      }
    },
    project: {
      section: 'Project email preferences',
      header: 'Project'
    }
  },
  about: {
    index: {
      header: 'About',
      title: 'About',
      nav: {
        about: 'About',
        publications: 'Publications',
        ourTeam: 'Our Team',
        acknowledgements: 'Acknowledgements',
        contact: 'Contact Us',
        faq: 'FAQ',
        resources: 'Resources',
        highlights: 'Highlights Book',
        donate: 'Donate'
      }
    },
    home: {
      title: '## What is the Zooniverse?',
      whatIsZooniverse: 'The Zooniverse is the world’s largest and most popular platform for people-powered research. This research is made possible by volunteers — more than a million people around the world who come together to assist professional researchers. Our goal is to enable research that would not be possible, or practical, otherwise. Zooniverse research results in new discoveries, datasets useful to the wider research community, and [many publications](/about/publications).',
      anyoneCanResearch: "### At the Zooniverse, anyone can be a researcher\n\nYou don’t need any specialised background, training, or expertise to participate in any Zooniverse projects. We make it easy for anyone to contribute to real academic research, on their own computer, at their own convenience.\n\nYou’ll be able to study authentic objects of interest gathered by researchers, like images of faraway galaxies, historical records and diaries, or videos of animals in their natural habitats. By answering simple questions about them, you’ll help contribute to our understanding of our world, our history, our Universe, and more.\n\nWith our wide-ranging and ever-expanding suite of projects, covering many disciplines and topics across the sciences and humanities, there's a place for anyone and everyone to explore, learn and have fun in the Zooniverse. To volunteer with us, just go to the [Projects](/projects) page, choose one you like the look of, and get started.",
      accelerateResearch: '### We accelerate important research by working together\n\nThe major challenge of 21st century research is dealing with the flood of information we can now collect about the world around us. Computers can help, but in many fields the human ability for pattern recognition — and our ability to be surprised — makes us superior. With the help of Zooniverse volunteers, researchers can analyze their information more quickly and accurately than would otherwise be possible, saving time and resources, advancing the ability of computers to do the same tasks, and leading to faster progress and understanding of the world, getting to exciting results more quickly.\n\nOur projects combine contributions from many individual volunteers, relying on a version of the ‘wisdom of crowds’ to produce reliable and accurate data. By having many people look at the data we often can also estimate how likely we are to make an error. The product of a Zooniverse projects is often exactly what’s needed to make progress in many fields of research.',
      discoveries: "### Volunteers and professionals make real discoveries together\n\nZooniverse projects are constructed with the aim of converting volunteers' efforts into measurable results. These projects have produced a large number of [published research papers](/about/publications), as well as several open-source sets of analyzed data. In some cases, Zooniverse volunteers have even made completely unexpected and scientifically significant discoveries.\n\nA significant amount of this research takes place on the Zooniverse discussion boards, where volunteers can work together with each other and with the research teams. These boards are integrated with each project to allow for everything from quick hashtagging to in-depth collaborative analysis. There is also a central Zooniverse board for general chat and discussion about Zooniverse-wide matters.\n\nMany of the most interesting discoveries from Zooniverse projects have come from discussion between volunteers and researchers. We encourage all users to join the conversation on the discussion boards for more in-depth participation."
    },
    publications: {
      nav: {
        showAll: 'Show All',
        space: 'Space',
        physics: 'Physics',
        climate: 'Climate',
        humanities: 'Humanities',
        nature: 'Nature',
        medicine: 'Medicine',
        meta: 'Meta'
      },
      content: {
        header: {
          showAll: 'All Publications'
        },
        submitNewPublication: 'To submit a new publication or update an existing one, please use [this form](https://docs.google.com/forms/d/e/1FAIpQLSdbAKVT2tGs1WfBqWNrMekFE5lL4ZuMnWlwJuCuNM33QO2ZYg/viewform). We aim to post links to published papers that can be accessed by the public. Articles accepted for publication but not yet published are also fine.'
      },
      publication: {
        viewPublication: 'View publication.',
        viewOpenAccess: 'View open access version.'
      }
    },
    acknowledgements: {
      title: '## Acknowledging the Zooniverse',
      citation: '### Academic Citation',
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
      title: '## Contact & Social Media',
      discussionBoards: 'Most of the time, the best way to reach the Zooniverse team, or any project teams, especially about any project-specific issues, is through the discussion boards.',
      email: 'If you need to contact the Zooniverse team about a general matter, you can also send an email to the team at [contact@zooniverse.org](mailto:contact@zooniverse.org). Please understand that the Zooniverse team is relatively small and very busy, so unfortunately we cannot reply to all of the emails we receive.',
      collaborating: 'If you are interested in collaborating with the Zooniverse, for instance on a custom-built project, please email [collab@zooniverse.org](mailto:collab@zooniverse.org). (Note that our [Project Builder](/lab) offers an effective way to set up a new project without needing to contact the team!)',
      pressInquiries: 'For press inquires, please contact the Zooniverse directors Chris Lintott at [chris@zooniverse.org](mailto:chris@zooniverse.org) or +44 (0) 7808 167288 or Laura Trouille at [trouille@zooniverse.org](mailto:trouille@zooniverse.org) or +1 312 322 0820.',
      dailyZoo: "If you want to keep up to date with what's going on across the Zooniverse and our latest results, check out the [Daily Zooniverse](http://daily.zooniverse.org/) or the main [Zooniverse blog](http://blog.zooniverse.org/). You can also follow the Zooniverse on [Twitter](http://twitter.com/the_zooniverse), [Facebook](http://facebook.com/therealzooniverse), and [Google+](https://plus.google.com/+ZooniverseOrgReal)."
    },
    faq: {
      title: '## Frequently Asked Questions',
      whyNeedHelp: "- **Why do researchers need your help? Why can't computers do these tasks?**\nHumans are better than computers at many tasks. For most Zooniverse projects, computers just aren’t good enough to do the required task, or they may miss interesting features that a human would spot - this is why we need your help. Some Zooniverse projects are also using human classifications to help train computers to do better at these research tasks in the future. When you participate in a Zooniverse project, you are contributing to real research.",
      amIDoingThisRight: "- **How do I know if I'm doing this right?**\nFor most of the subjects shown in Zooniverse projects, the researchers don't know the correct answer and that's why they need your help. Human beings are really good at pattern recognition tasks, so generally your first guess is likely the right one. Don’t worry too much about making an occasional mistake - more than one person will review each image, video or graph in a project. Most Zooniverse projects have a Help button, a Frequently Asked Questions (FAQ) page, and a Field Guide with more information to guide you when classifying.",
      whatHappensToClassifications: "- **What happens to my classification after I submit it?**\nYour classifications are stored in the Zooniverse's secure online database. Later on a project's research team accesses and combines the multiple volunteer assessments stored for each subject, including your classifications, together. Once you have submitted your response for a given subject image, graph, or video, you can't go back and edit it. Further information can be found on the [Zooniverse User Agreement and Privacy Policy page](/privacy).",
      accountInformation: "- **What does the Zooniverse do with my account information?**\nThe Zooniverse takes very seriously the task of protecting our volunteer's personal information and classification data. Details about these efforts can be found on the [Zooniverse User Agreement and Privacy Policy page](/privacy) and the [Zooniverse Security page](/security).",
      featureRequest: '- **I have a feature request or found a bug; who should I talk to/how do I report it?**\nYou can post your suggestions for new features and report bugs via the [Zooniverse Talk](/talk) or through the [Zooniverse Software repository](https://github.com/zooniverse/Panoptes-Front-End/issues).',
      hiring: '- **Is the Zooniverse hiring?**\nThe Zooniverse is a collaboration between institutions from the United Kingdom and the United States; all of our team are employed by one or the other of these partner institutions. Check out the [Zooniverse jobs page](https://jobs.zooniverse.org/) to find out more about employment opportunities within the Zooniverse.',
      howToAcknowledge: "- **I'm a project owner/research team member, how do I acknowledge the Zooniverse and the Project Builder Platform in my paper, talk abstract, etc.?**\nYou can find more details on how to cite the Zooniverse in research publications using data derived from use of the Zooniverse Project Builder on our [Acknowledgements page](/about/acknowledgements).",
      browserSupport: '- **What browser version does Zooniverse support?**\nWe support major browsers up to the second to last version.',
      furtherHelp: "Didn't find the answer to your question? Visit the [Zooniverse Solutions webpage](https://zooniverse.freshdesk.com/support/solutions), ask on [Zooniverse Talk](/talk), or [get in touch](/about/contact)."
    },
    resources: {
      title: '## Resources',
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
      title: '## Zooniverse Highlights Book 2019',
      thanks: '### Thank You!',
      paragraphOne: 'As a thank you and celebration of 2019 projects and impacts, we put together our first ‘Into the Zooniverse’ highlights book.',
      paragraphTwo: 'Over the past decade, Zooniverse projects have led to many unexpected and scientifically significant discoveries and over 160 [peer-reviewed publications](https://zooniverse.org/publications). All of this would have been impossible if it weren’t for our global community of nearly 2 million people working alongside hundreds of professional researchers.',
      paragraphThree: 'The book is an homage to the Zooniverse Year of 2019, highlighting 40 Zooniverse projects out of more than 200 launched to date. There are many fascinating projects we weren’t able to include this year. We hope to continue creating these books annually, highlighting a whole new set of projects and discoveries next year!',
      toDownload: '**To download a free electronic copy:**',
      download: 'Please click [here](https://bit.ly/zoonibook19-pdf-new) to download a free electronic copy of ‘Into the Zooniverse’.',
      toOrder: '**To order a hard copy:**',
      order: 'Please click [here](https://bit.ly/zoonibook19-buy-new) if you would like to order a hard copy of ‘Into the Zooniverse’. Note, the cost simply covers Lulu.com’s printing and postage fees - we will not be making any profit through sales of the hard copy of the book.',
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
      title: 'Get Involved',
      nav: {
        volunteering: 'Volunteering',
        education: 'Education',
        callForProjects: 'Call for Projects',
        collections: 'Collections',
        favorites: 'Favorites'
      }
    },
    education: {
      title: '## Education in the Zooniverse',
      becomeCitizenScientist: 'As a volunteer on these websites, both you and your students can become citizen scientists and citizen researchers, participating in real science and other research. If you or your students think you have make a mistake, don’t worry; even the researchers make mistakes. These projects are set up to have more than one volunteer analyzing each piece of data, thereby eliminating the vast majority of human error. Mistakes are a part of the process, and can even help us evaluate the difficulty of the data. As long as everyone does their best, they are helping!',
      resources: '### Resources for educators using Zooniverse',
      zooniverseClassrooms: '- Instructors and volunteers alike can access a variety of educational resources on the [Zooniverse Classrooms](https://classroom.zooniverse.org/) platform. The ASTRO 101 materials are currently targeted towards introductory college-level students, while WildCam Labs are aimed at a broader audience of students. We are currently working to expand our curricular materials to additional projects on the Zooniverse platform.',
      educationPages: '- Many Zooniverse projects have their own education pages with additional resources for teachers. Resources may include a video tutorial of how to use the project, other helpful documents and videos about the classification process, and education resources related to the research behind the project.',
      joinConversationTitle: '### Take part in the conversation',
      joinConversationBody: 'Keep up with the latest Zooniverse educational efforts on the [Zooniverse Blog](http://blog.zooniverse.org/). You can also talk with other Zooniverse educators and peers interested in using people-powered research in all sorts of learning environments on the [Zooniverse Education Talk board](http://zooniverse.org/talk/16).',
      howEducatorsUseZooniverse: '### How are educators using Zooniverse?',
      inspiration: 'Looking for a little inspiration? Here are some ways educators have used Zooniverse projects and educational resources:',
      floatingForests: '- [Floating Forests: Teaching Young Children About Kelp](http://blog.zooniverse.org/2015/04/29/floating-forests-teaching-young-children-about-kelp/)',
      cosmicCurves: '- [Cosmic Curves: Investigating Gravitational Lensing at the Adler Planetarium](http://blog.zooniverse.org/2014/03/18/cosmic-curves-investigating-gravitational-lensing-at-the-adler-planetarium/)',
      snapshotSerengeti: '- [Snapshot Serengeti Brings Authentic Research Into Undergraduate Courses](http://blog.zooniverse.org/2014/02/19/snapshot-serengeti-brings-authentic-research-into-undergraduate-courses/)',
      contactUs: 'We’d love to hear about how you’ve used Zooniverse with youth or adult learners! Please contact [education@zooniverse.org](mailto:education@zooniverse.org) if you have any interesting stories to share.'
    },
    volunteering: {
      title: '## How to Volunteer',
      introduction: "First of all, everyone who contributes to a Zooniverse project is a volunteer! We have a wonderful, global community who help us do what we do. The main ways of volunteering with us are helping us with classifications on data, being a beta tester on projects we've yet to launch, and being a moderator for a project. For more information about any of these roles, just read below.",
      projectVolunteeringTitle: '### Volunteer on a Project',
      projectVolunteeringDescription: 'Volunteering on a project is the easiest and most common way of volunteering. We always need volunteers to go onto our projects and classify the data contained in them. You can read more about what happens with the classifications and how it helps the scientific community and the progress of science on the [About](/about) page.',
      projectLink: "There is no minimum time requirement needed; do as much or as little as you'd like. To get started as a classifications volunteer, just to go to the [Projects](/projects) page, have a look through, find one you like the look of, and get stuck in!",
      betaTesterTitle: '### Volunteer as a Beta Tester',
      betaTesterDescription: "Volunteers also help us test projects before they are launched to check that they work properly. This involves working through some classifications on the beta project to check that it works, looking for any bugs, and filling out a questionnaire at the end. This helps us find any issues in the project that need resolving and also assess how suitable the project is for the Zooniverse. You can read some guidelines on what makes a project suitable on the [Policies](https://help.zooniverse.org/getting-started/lab-policies) page, under 'Rules and Regulations'.",
      betaTesterSignUp: "To sign up as a beta tester, go to [www.zooniverse.org/settings/email](/settings/email) and tick the box relating to beta testing. We'll then send you emails when a project is ready to be tested. You can change your email settings any time you want using the [same email page](/settings/email) and unticking the box.",
      projectModeratorTitle: '### Volunteer as a Project Moderator',
      projectModeratorBody: "Volunteer moderators have extra permissions in the Talk discussion tool for a particular project. They help moderate discussions and act as a point of contact for the project. Moderators are selected by the project owner. If you're interested in becoming a moderator on a project you're taking part in, go to the project's About page and get in touch with the researcher.",
      furtherInformationTitle: '### Further Information',
      contactUs: "If you'd like any more information on any of these different roles, contact us via the [Contact Us](/about/contact) page."
    }
  },
  userSettings: {
    account: {
      displayName: 'Display name (required)',
      displayNameHelp: 'How your name will appear to other users in Talk and on your Profile Page',
      realName: 'Real name (optional)',
      realNameHelp: 'Public; we’ll use this to give acknowledgement in papers, on posters, etc.',
      interventions: 'Show project intervention notifications.',
      interventionsHelp: 'Allow projects to display messages while you are classifying.',
      interventionsPreferences: 'Notification preferences',
      changePassword: {
        heading: 'Change your password',
        currentPassword: 'Current password (required)',
        newPassword: 'New password (required)',
        tooShort: 'That’s too short',
        confirmNewPassword: 'Confirm new password (required)',
        doesntMatch: 'These don’t match',
        change: 'Change'
      }
    },
    profile: {
      dropImage: 'Drop an image here (or click to select).',
      changeAvatar: 'Change avatar',
      avatarImageHelp: 'Drop an image here (square, less than %(size)s KB)',
      clearAvatar: 'Clear avatar',
      changeProfileHeader: 'Change profile header',
      profileHeaderImageHelp: 'Drop an image here (any dimensions, less than %(size)s KB)',
      clearHeader: 'Clear header'
    }
  },
  feedback: {
    categories: {
      correct: 'Hits',
      incorrect: 'Misses',
      falsepos: 'False Positives'
    }
  }
}
