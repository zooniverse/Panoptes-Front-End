import React, { PropTypes } from 'react';
import markdownz from 'markdownz';
const Markdown = markdownz.Markdown;
import AboutPageLayout from './about-page-layout';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import Avatar from '../../../partials/avatar';

counterpart.registerTranslations('en', {
  projectRoles: {
      title: 'The Team',
      owner: 'Owner',
      collaborator: 'Collaborator',
      translator: 'Translator',
      scientist: 'Researcher',
      moderator: 'Moderator',
      tester: 'Tester',
      expert: 'Expert',
  }
});

const createTeamList = (team) => (
  <div>
    <Translate content="projectRoles.title" />
    <ul className="team-list">
      {team.map(teamMember => (
        <li key={teamMember.userResource.id} className="team-list-item">
          <span className="team-list-item__display-name">
            <Avatar user={teamMember.userResource} className="avatar" />
            {' '}
            {teamMember.userResource.display_name}
            {' '}
          </span>
          <span className="team-list-item__project-roles">
          {teamMember.roles.map(role => (
            <Translate key={role} 
              content={`projectRoles.${role}`} 
              className={`project-role ${role}`} 
            />
          ))}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const AboutProjectTeam = ({ pages, project, team }) => {
  const teamPage = pages.find(page => page.slug === 'team');
  const mainContent = (teamPage && teamPage.content && teamPage.content !== '') 
      ? teamPage.content 
      : 'This project has no team information.';
  const aside = createTeamList(team);

  return <AboutPageLayout
    project={project}
    mainContent={mainContent}
    aside={aside}
  />;
}

AboutProjectTeam.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    content: PropTypes.string,
  })),
  project: PropTypes.object,
  team: PropTypes.arrayOf(PropTypes.shape({
    userResource: PropTypes.shape({
      display_name: PropTypes.string.isRequired,
    }),
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  })), 
};

export default AboutProjectTeam;
