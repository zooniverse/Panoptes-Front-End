export default {
  loading: '(Loading)',
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
    back: 'Back',
    backButtonWarning: 'Going back will clear your work for the current task.',
    close: 'Close',
    continue: 'Continue',
    detailsSubTaskFormSubmitButton: 'OK',
    done: 'Done',
    doneAndTalk: 'Done & Talk',
    dontShowMinicourse: 'Do not show mini-course in the future',
    letsGo: 'Let’s go!',
    next: 'Next',
    optOut: 'Opt out',
    taskTabs: {
      taskTab: 'Task',
      tutorialTab: 'Tutorial'
    },
    recents: 'Your recent classifications',
    talk: 'Talk',
    taskHelpButton: 'Need some help with this task?',
    miniCourseButton: 'Restart the project mini-course',
    workflowAssignmentDialog: {
      promotionMessage: "Congratulations! You've unlocked the next workflow. If you prefer to stay on this workflow, you can choose to stay.",
      acceptButton: 'Take me to the next level!',
      declineButton: 'No, thanks'
    },
    interventions: {
      optOut: 'Do not show me further messages.',
      studyInfo: 'I do not want to take part in this messaging [study](+tab+https://docs.google.com/document/d/1gLyN6Dgff8dOCOC88f47OD6TtFrfSJltsLgJMKkYMso/preview).'
    }
  },
  projects: {
    welcome: {
      heading: "Welcome! We're so glad you're here",
      thanks: "Thank you for your interest in helping real research. Here we've gathered a few projects we could really use your help on right now. For more options just scroll down to browse all of our active projects.",
      talk: "Make sure to also check out [Talk](/talk) where you can chat to other like-minded volunteers.",
      scrollDown: "Scroll down for even more"
    }
  },
  project: {
    language: 'Language',
    loading: 'Loading project',
    disclaimer: 'This project has been built using the Zooniverse Project Builder but is not yet an official Zooniverse project. Queries and issues relating to this project directed at the Zooniverse Team may not receive any response.',
    fieldGuide: 'Field Guide',
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
      about: 'About',
      adminPage: 'Admin page',
      classify: 'Classify',
      collections: 'Collect',
      exploreProject: 'Explore Project',
      lab: 'Lab',
      recents: 'Recents',
      talk: 'Talk',
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
      organization: 'Organization',
      researcher: 'Words from the researcher',
      about: 'About %(title)s',
      metadata: {
        statistics: '%(title)s Statistics',
        classifications: 'Classifications',
        volunteers: 'Volunteers',
        completedSubjects: 'Completed Subjects',
        subjects: 'Subjects'
      },
      talk: {
        zero: 'No one is talking about **%(title)s** right now.',
        one: '**1** person is talking about **%(title)s** right now.',
        other: '**%(count)s** people are talking about **%(title)s** right now.'
      },
      joinIn: 'Join in',
      learnMore: 'Learn more',
      getStarted: 'Get started',
      workflowAssignment: 'You\'ve unlocked %(workflowDisplayName)s',
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
        text: 'Every click counts! Join %(title)s\'s community to complete this project and help researchers produce important results.'
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
    notPermission: 'If you\'re sure the URL is correct, you might not have permission to view this organization.',
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
      classifications: 'Classifications',
      comments: 'Talk Comments',
      dateRange: 'Date range',
      expandWorkflowStats: 'Expand Workflow Stats',
      for: 'for',
      hidden: 'Stats hidden',
      hourly: 'Hourly data only available for the most recent 2 weeks.',
      organizationStatistics: '%(title)s Statistics',
      perclassifications: 'Classifications per',
      percomments: 'Comments per',
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
  privacy: {
    title: 'Zooniverse User Agreement and Privacy Policy',
    userAgreement: {
      summary: '## User Agreement\n**Summary**\n\nThe Zooniverse is a suite of citizen science projects operated by research groups in several institutions which support scientific research by involving members of the public - you - in the processes of analyzing and discussing data. Data from these projects is used to study online community design and theory, interface design, and other topics. This document describes what will happen to your contributions if you choose to contribute and what data we collect, how we use it and how we protect it.',
      contribution: '**What you agree to if you contribute to the Zooniverse**\n\nProjects involving the public are needed to enable researchers to cope with the otherwise unmanageable flood of data. The web provides a means of reaching a large audience willing to devote their free time to projects that can add to our knowledge of the world and the Universe.\n\nThe major goal for this project is for the analyzed data to be available to the researchers for use, modification and redistribution in order to further scientific research. Therefore, if you contribute to the Zooniverse, you grant us and our collaborators permission to use your contributions however we like to further this goal, trusting us to do the right thing with your data. However, you give us this permission non-exclusively, meaning that you yourself still own your contribution.\n\nWe ask you to grant us these broad permissions, because they allow us to change the legal details by which we keep the data available; this is important because the legal environment can change and we need to be able to respond without obtaining permission from every single contributor.\n\nFinally, you must not contribute data to the Zooniverse that you do not own. For example, do not copy information from published journal articles. If people do this, it can cause major legal headaches for us.',
      data: '**What you may do with Zooniverse data**\n\nYou retain ownership of any contribution you make to the Zooniverse, and any recorded interaction with the dataset associated with the Zooniverse. You may use, distribute or modify your individual contribution in any way you like. However, you do not possess ownership of the dataset itself. This license does not apply to data about you, covered in the Privacy Policy.',
      legal: '**Legal details**\n\nBy submitting your contribution to the Zooniverse, you agree to grant us a perpetual, royalty-free, non-exclusive, sub-licensable license to: use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and exercise all copyright and publicity rights with respect to your contribution worldwide and/or to incorporate your contribution in other works in any media now known or later developed for the full term of any rights that may exist in your contribution.\n\nIf you do not want to grant to us the rights set out above, you cannot interact with the Zooniverse.\n\nBy interacting with the Zooniverse, you:\n\n* Warrant that your contribution contains only data that you have the right to make available to us for all the purposes specified above, is not defamatory, and does not infringe any law; and\n\n* Indemnify us against all legal fees, damages and other expenses that may be incurred by us as a result of your breach of the above warranty; and\n\n* Waive any moral rights in your contribution for the purposes specified above.\n\nThis license does not apply to data about you, covered in the Privacy Policy.'
    },
    privacyPolicy: {
      intro: '## Privacy Policy\n\nIn addition to the contributions you make towards the scientific goals of the Zooniverse, we collect additional data about you to support and improve the operation of the project. We also conduct experiments on the design of the website that we evaluate based on your reactions and behavior. This Privacy Policy describes what data we collect, how we use it and how we protect it.\n\nWe respect the privacy of every individual who participates in the Zooniverse. We operate in accordance with the UK GDPR, Data Protection Act 2018 and any other relevant data protection legislation, as well as with United Kingdom and United States regulations regarding protection of human subjects in research.',
      data: '**Data we collect**\n\n_Identifying information_: If you register with the Zooniverse, we ask you to create a username and supply your e-mail address. Your e-mail address is not visible to other users, but others will see your username in various contexts. Notably, your username is associated with any classifications or other contributions you make, including on comments submitted to Talk, the discussion forums hosted by the Zooniverse. You may optionally provide your real name to be included when we publically thank participants, e.g., in presentations, publications or discoveries.\n\n_Usage information_: We also monitor how people use our website, and aggregate general statistics about users and traffic patterns as well as data about how users respond to various site features. This includes, among other things, recording:\n\n* When you log in.\n\n* Pages you request.\n\n* Classifications you make.\n\n* Other contributions, such as posts on Talk pages.\n\nIf you register and log in, the logs associate these activities with your username. Otherwise, they are solely associated with your IP address. In order to collect this data, we may use software such as Google Analytics that collects statistics from IP data. This software can determine what times of day people access our site, which country they access the websites from, how long they visit for, along with technical details of their computer (browser, screen type, processor).',
      info: '**What we do with the information we gather**\n\nUsage information is collected to help us improve our website, and for the following reasons:\n\n* Internal record keeping.\n\n* If you agree, we will periodically send email promoting new research-related projects or other information relating to our research. Information about these contacts is given below. We will not use your contact information for commercial purposes.\n\n* We will use the information to customize the website.\n\n* To conduct experiments regarding the use of site features.',
      thirdParties: '**What is shared with third parties**\n\nWe will never release e-mail addresses to third parties without your express permission. We will also never share data we collect about your use of the site unless (a) it cannot be associated with you or your username, and (b) it is necessary to accomplish our research goals. Specifically, we can share your anonymized data with research study participants, other researchers, or in scholarly work describing our research. For example, we might use one of your classifications as an illustration in a paper, show some of your classifications to another user to see if they agree or disagree, or publish statistics about user interaction.\n\n If you choose to give us a `Publishable Name\' on registration, this is available to research teams in projects you have participated in for purposes of giving credit for your work in published papers and elsewhere.\n\nContributions you make to the Talk pages are widely available to others. Aside from the above, information is held within our secured database. Passwords are hashed rather than being stored in plain text.',
      cookies: '**How we use cookies**\n\nIn some areas of our site, a cookie might be placed on your computer. A cookie is a small file that resides on your computer\'s hard drive that allows us to improve the quality of your visit to our websites by responding to you as an individual.\n\nWe use cookies to identify which pages are being used and improve our website. We only use this information for statistical analysis purposes, they are not shared with other sites and are not used for advertisements.\n\nYou can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, if you choose to decline cookies from the Zooniverse then functionality, including your ability to log-in and participate, will be impaired.\n\nAcceptance of cookies is implied if you continue to access our website without adjusting your browser settings.',
      dataStorage: '**Where we store your data**\n\nWe use Microsoft Azure Cloud Computing Service so we can quickly and reliably serve our website to an unpredictable number of people. This means that your data will be stored in multiple locations, including the United States of America (USA). Transfers of personal data to and from EU and UK are GDPR compliant through Microsoft\'s EU Standard Contractual Clauses (SCC; also known as EU Model Clauses). \n\nOur mailing list server, which contains a copy of subscribed email addresses and no other personal data, is hosted on a virtual private server with Linode in the UK.',
      security: '**Security measures**\n\nMembers of the research teams are made aware of our privacy policy and practices by reviewing this statement upon joining the team. We follow industry best practices to secure user data, and access to the database and logs are limited to members of the research group and system administrative staff.',
      dataRemoval: '**Removing your data**\n\nDue to the way in which we archive data, it is generally not possible to completely remove your personal data from our systems. However, if you have specific concerns, please contact us and we will see what we can do.',
      contactUser: '**When we will contact you**\n\nIf you do not register, we will never contact you. If you do register, we will contact you by e-mail in the following circumstances:\n\n* Occasionally, we will send e-mail messages to you highlighting a particular aspect of our research, announcing new features, explaining changes to the system, or inviting you to special events.\n\n* We might also use your email to contact you for the purpose of research into our site\'s operation, and we might ask for additional information at that time. Any additional information will be held consitently with this policy, and participation in such studies is entirely optional and participating or otherwise will in no way affect your use of the site.\n\n* We might contact you with a newsletter about the progress of the project.\n\nYou can \'opt out\' of communications from any project or from the Zooniverse as a whole at any time by visiting the Zooniverse [unsubscribe](https://www.zooniverse.org/unsubscribe) page.',
      furtherInfo: '**Further information and requests**\n\nFor information and questions regarding this policy and Zooniverse data, please contact the Zooniverse team at [contact@zooniverse.org](mailto:contact@zooniverse.org).\n\nThe Data Controller is the University of Oxford (Chancellor, Masters and Scholars of the University of Oxford). Information on your rights, including the right of access, in relation to your personal data are explained here: [https://compliance.admin.ox.ac.uk/individual-rights](https://compliance.admin.ox.ac.uk/individual-rights). If you want to exercise any of the rights or are dissatisfied with the way we have used your information, you should contact the University’s Information Compliance Team at [data.protection@admin.ox.ac.uk](mailto:data.protection@admin.ox.ac.uk).'
    },
    youthPolicy: {
      title: 'Advice for Volunteers Under 16 Years Old and Their Parent/Guardian',
      content: 'Please note that it is the parents’/guardians’ responsibility to explain the user agreement and privacy policy in simple terms to their child if signing up under 16s. There is no minimum age for signing up children as Zooniverse would like to encourage public engagement with research for all ages, though the platform may be more suitable for older children. Parents and guardians must supervise children if they are contributing to any message boards.'
    }
  },
  security: {
    title: 'Zooniverse Security',
    intro: 'The Zooniverse takes very seriously the security of our websites and systems, and protecting our users and their personal information is our highest priority. We take every precaution to ensure that the information you give us stays secure, but it is also important that you take steps to secure your own account, including:\n\n* Do not use the same password on different websites. The password you use for your Zooniverse account should be unique to us.\n* Never give your password to anyone. We will never ask you to send us your password, and you should never enter your Zooniverse password into any website other than ours. Always check your browser\'s address bar to make sure you have a secure connection to _www.zooniverse.org_.\n\nFor general advice and information about staying safe online, please visit:\n\n* [Get Safe Online](https://www.getsafeonline.org)\n* [Stay Safe Online](https://www.staysafeonline.org)\n* [US-CERT - Tips](https://www.us-cert.gov/ncas/tips)',
    details: '## Reporting Security Issues\n\nThe Zooniverse supports [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) of vulnerabilities. If you believe you have discovered a security vulnerability in any Zooniverse software, we ask that this first be reported to [security@zooniverse.org](mailto:security@zooniverse.org) to allow time for vulnerabilities to be fixed before details are published.\n\n## Known Vulnerabilities and Incidents\n\nWe believe it is important to be completely transparent about security issues. A complete list of fixed vulnerabilities and past security incidents is given below:\n\n* November 13, 2022: [Cross-Site Scripting Vulnerability on hosted media domains](https://blog.zooniverse.org/2022/12/20/fixed-cross-site-scripting-vulnerability-on-hosted-media-domains/)\n\n* November 9, 2020: [Cross-Site Scripting Vulnerability in Zoomapper App](https://blog.zooniverse.org/2020/11/10/fixed-cross-site-scripting-vulnerability-on-zoomapper-app/)\n\n* April 3, 2020: [Caesar Subject Rule Effect Vulnerability](https://blog.zooniverse.org/2020/06/19/caesar-subject-rule-effect-vulnerability-report/)\n\n* December 11, 2018: [Cross-Site Scripting Vulnerability on Project Page\'s External Links](https://blog.zooniverse.org/2018/12/20/fixed-cross-site-scripting-vulnerability-on-project-pages-external-links/)\n\n* June 21, 2018: [Cross-Site Scripting on Project Home Pages](https://blog.zooniverse.org/2018/07/03/fixed-cross-site-scripting-vulnerability-on-project-home-pages/)\n\nNew vulnerabilities and incidents will be announced via the [Zooniverse blog in the "technical" category](http://blog.zooniverse.org/category/technical/).'
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
  newAccountsPage: {
    signIn: 'Sign in',
    register: 'Register',
    successfullySignedIn: `You've successfully signed in!`,
    successfullyRegistered: `You've successfully registered!`,
    alreadySignedIn: 'Signed in as %(name)s',
    alreadySignedInLinks: {
      gotoHomepage: 'Go to the homepage',
      gotoProjects: 'Find a new project to explore'
    }
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
    label: 'Active'
  },
  collections: {
    createForm: {
      private: 'Private',
      submit: 'Add Collection'
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
      nasa: 'Get periodic email updates from NASA regarding broader NASA citizen science projects and efforts',
      emailValid: 'Valid email',
      emailInvalid: 'Invalid email',
      emailInvalidPrompt: 'Please re-enter your email above',
      emailVerified: 'Verified email',
      emailUnverified: 'Unverified email',
      emailUnverifiedPrompt: 'Resend confirmation email',
      emailUnverifiedRequesting: 'Requesting...',
      emailUnverifiedSuccess: 'Confirmation email requested, please check your inbox',
      emailUnverifiedError: 'ERROR: could not request confirmation email'
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
        participating_discussions: 'When discussions I\'m participating in are updated',
        followed_discussions: 'When discussions I\'m following are updated',
        mentions: 'When I\'m mentioned',
        group_mentions: 'When I\'m mentioned by group (@admins, @team, etc.)',
        messages: 'When I receive a private message',
        started_discussions: 'When a discussion is started in a board I\'m following'
      }
    },
    project: {
      section: 'Project email preferences',
      header: 'Project',
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
          mainText: '* **Main Text:** Describe the task, or ask the question, in a way that is clear to a non-expert. Markdown can be used only to add images (with alt text), bold and italic text.',
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
          body: 'If you\'d like some further information, check out the [documentation behind building Kitteh Zoo](https://help.zooniverse.org/getting-started/example), that talks you through building this project in the Project Builder.\n\nIf this doesn\'t help, get in contact with the Zooniverse team via the [contact page](https://www.zooniverse.org/about#contact).',
          backToTop: '[Back to top](#how-to-create-a-project-with-our-project-builder)'
        }
      }
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
};
