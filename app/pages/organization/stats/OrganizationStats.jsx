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

const StyledStatsPage = styled.div`
  background-color: #edf0f4;
  border-bottom: 5px solid #005d69;
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const StyledStatsPageContainer = styled.div`
  padding: 2.9em 6.6em 6.3em;
`;

export const StyledPageHeading = styled.h2`
  font-size: 1.8em;
  letter-spacing: -.5px;
  margin-bottom: .8em;
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
    <StyledStatsPage>
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
    </StyledStatsPage>
  );
}

OrganizationStats.defaultProps = {
  fetchingProjects: false,
  organization: {
    id: '',
    display_name: '',
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
    display_name: '',
    id: ''
  },
  user: null
};

OrganizationStats.propTypes = {
  fetchingProjects: PropTypes.bool,
  organization: PropTypes.shape({
    announcement: PropTypes.string,
    display_name: PropTypes.string,
    id: PropTypes.string,
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
    display_name: PropTypes.string,
    id: PropTypes.string
  })
};

export default OrganizationStats;
