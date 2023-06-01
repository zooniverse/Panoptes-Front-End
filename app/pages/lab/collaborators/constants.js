export const ROLES_INFO = {
  collaborator: {
    label: 'Collaborator',
    description: 'Collaborators have full access to edit workflows and project content, including deleting some or all of the project.'
  },
  expert: {
    label: 'Expert',
    description: 'Experts can enter "gold mode" to make authoritative gold standard classifications that will be used to validate data quality.'
  },
  scientist: {
    label: 'Researcher',
    description: 'Members of the research team will be marked as researchers on "Talk"'
  },
  moderator: {
    label: 'Moderator',
    description: 'Moderators have extra privileges in the community discussion area to moderate discussions. They will also be marked as moderators on "Talk".'
  },
  tester: {
    label: 'Tester',
    description: 'Testers can view and classify on your project to give feedback while it’s still private. If given the direct url, they can also view and classify on inactive workflows; this is useful for already launched projects that are planning on building a new workflow and woud like volunteer feedback. Testers cannot access the project builder.'
  },
  translator: {
    label: 'Translator',
    description: 'Translators will have access to the translation site.'
  },
  museum: {
    label: 'Museum',
    description: 'Enables a custom interface for the project on the Zooniverse iPad app, specifically designed to be used in a museum or exhibit space.'
  }
};

export const ROLES_NOT_IN_TALK_API = [
  'museum'
];
