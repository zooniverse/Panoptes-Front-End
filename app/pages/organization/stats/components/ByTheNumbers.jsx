import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import styled from 'styled-components';

import SectionHeading from './SectionHeading';

const StyledByTheNumbers = styled.section`
  background-color: white;
  border: 1px solid #E2E5E9;
  flex: 1 1 200px;
  height: fit-content;
  margin: 1.6em .8em 0 .8em;
  padding: 2em;
`;

const StyledStatBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledStatBlock = styled.div`
  max-width: 250px;
  min-width: 125px;
  margin: 0 1em 1em 0;
`;

const StyledStat = styled.span`
  color: #5C5C5C;
  display: block;
  font-size: 1.8em;
`;

const StyledStatDescription = styled.span`
  color: #5C5C5C;
  display: block;
  font-weight: bold;
`;

function ByTheNumbers({ projects }) {
  function extractStat(statName) {
    return projects.reduce((accum, project) => {
      if (project[statName]) {
        return accum + project[statName];
      } else {
        return accum;
      }
    }, 0);
  }

  const liveProjectsCount = projects
    .filter(project => project.launch_approved && project.state === 'live')
    .length;

  const pausedProjectsCount = projects
    .filter(project => project.launch_approved && project.state === 'paused')
    .length; 

  const retiredProjectsCount = projects
    .filter(project => project.launch_approved && project.state === 'finished')
    .length;

  const launchedProjects = projects
    .filter(project => !!project.launch_date);

  let oldestProject = null;
  launchedProjects.forEach((project) => {
    if (!oldestProject || Date.parse(project.launch_date) < Date.parse(oldestProject.launch_date)) {
      oldestProject = project;
    }
  });

  let oldestProjectLaunchDate;
  if (oldestProject) {
    oldestProjectLaunchDate = new Date(oldestProject.launch_date);
  }

  return (
    <StyledByTheNumbers>
      <SectionHeading content="organization.stats.byTheNumbers" />
      <StyledStatBlockContainer>
        <StyledStatBlock>
          <StyledStat>
            {liveProjectsCount.toLocaleString()}
          </StyledStat>
          <Translate
            component={StyledStatDescription}
            content="organization.stats.byTheNumbersContent.liveProjects"
          />
        </StyledStatBlock>
        <StyledStatBlock>
          <StyledStat>
            {pausedProjectsCount.toLocaleString()}
          </StyledStat>
          <Translate
            component={StyledStatDescription}
            content="organization.stats.byTheNumbersContent.pausedProjects"
          />
        </StyledStatBlock>
        <StyledStatBlock>
          <StyledStat>
            {retiredProjectsCount.toLocaleString()}
          </StyledStat>
          <Translate
            component={StyledStatDescription}
            content="organization.stats.byTheNumbersContent.retiredProjects"
          />
        </StyledStatBlock>
        <StyledStatBlock>
          <StyledStat>
            {extractStat('classifications_count').toLocaleString()}
          </StyledStat>
          <Translate
            component={StyledStatDescription}
            content="organization.stats.byTheNumbersContent.classifications"
          />
        </StyledStatBlock>
        <StyledStatBlock>
          <StyledStat>
            {extractStat('subjects_count').toLocaleString()}
          </StyledStat>
          <Translate
            component={StyledStatDescription}
            content="organization.stats.byTheNumbersContent.subjects"
          />
        </StyledStatBlock>
        <StyledStatBlock>
          <StyledStat>
            {extractStat('retired_subjects_count').toLocaleString()}
          </StyledStat>
          <Translate
            component={StyledStatDescription}
            content="organization.stats.byTheNumbersContent.retiredSubjects"
          />
        </StyledStatBlock>
        {oldestProject && (
          <>
            <StyledStatBlock>
              <StyledStat>
                {oldestProject.display_name}
              </StyledStat>
              <Translate
                component={StyledStatDescription}
                content="organization.stats.byTheNumbersContent.firstProject"
              />
            </StyledStatBlock>
            <StyledStatBlock>
              <StyledStat>
                {oldestProjectLaunchDate.getFullYear()}
              </StyledStat>
              <Translate
                component={StyledStatDescription}
                content="organization.stats.byTheNumbersContent.firstProjectLaunch"
              />
            </StyledStatBlock>
          </>
        )}
      </StyledStatBlockContainer>
    </StyledByTheNumbers>
  );
}

ByTheNumbers.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ).isRequired
};

export default ByTheNumbers;
