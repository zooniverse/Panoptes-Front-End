import PropTypes from 'prop-types';
import { Markdown } from 'markdownz';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

import ProjectNavbar from '../../project/components/ProjectNavbar';

import BarChart from './components/BarChart';
import ByTheNumbers from './components/ByTheNumbers';
import ProjectStats from './components/ProjectStats';
import StatsContainer from './components/StatsContainer';

const StyledStatsPageContainer = styled.div`
  padding: 2em 5vw;
`;

export const StyledPageHeading = styled.h2`
  letter-spacing: -.5px;
  margin-bottom: 1.5em;
`;

function OrganizationStats({
  fetchingProjects,
  organization,
  organizationAvatar,
  organizationBackground,
  organizationProjects,
  organizationRoles,
  projectAvatars,
  routes,
  user
}) {
  return (
    <div
      className="project-page"
    >
      <ProjectNavbar
        background={organizationBackground}
        loading={fetchingProjects}
        project={organization}
        projectAvatar={organizationAvatar}
        projectRoles={organizationRoles}
        routes={routes}
        translation={{ id: organization.id, display_name: organization.display_name }}
        user={user}
      />
      {(organization.announcement)
        && (
          <div className="informational project-announcement-banner">
            <Markdown>
              {organization.announcement}
            </Markdown>
          </div>
        )}
      <StyledStatsPageContainer>
        <Translate
          component={StyledPageHeading}
          content="organization.stats.organizationStatistics"
          with={{ title: organization.display_name }}
        />
        <StatsContainer>
          <BarChart
            projects={organizationProjects}
            type="classification"
          />
          <BarChart
            projects={organizationProjects}
            type="comment"
          />
        </StatsContainer>
        <StatsContainer>
          <ByTheNumbers projects={organizationProjects} />
          <ProjectStats
            projects={organizationProjects}
            projectAvatars={projectAvatars}
          />
        </StatsContainer>
      </StyledStatsPageContainer>
    </div>
  );
}

OrganizationStats.defaultProps = {
  fetchingProjects: false,
  organization: {
    id: '',
    display_name: '',
    redirect: '',
    slug: ''
  },
  organizationAvatar: null,
  organizationBackground: {
    src: ''
  },
  organizationProjects: [],
  organizationRoles: [],
  projectAvatars: [],
  routes: [],
  translation: {
    id: '',
    display_name: ''
  },
  user: null
};

OrganizationStats.propTypes = {
  fetchingProjects: PropTypes.bool,
  organization: PropTypes.shape({
    configuration: PropTypes.shape({
      announcement: PropTypes.string
    }),
    id: PropTypes.string,
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
  organizationBackground: PropTypes.shape({
    src: PropTypes.string
  }),
  organizationAvatar: PropTypes.shape({
    src: PropTypes.string
  }),
  organizationProjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ),
  organizationRoles: PropTypes.array,
  projectAvatars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      src: PropTypes.string
    })
  ),
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  routes: PropTypes.array,
  translation: PropTypes.shape({
    display_name: PropTypes.string
  })
};

export default OrganizationStats;
