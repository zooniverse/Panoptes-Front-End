import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import ExternalLink from './components/ExternalLink';
import { zooTheme } from '../../theme';

export const StyledExternalLinksBlock = styled.div`
  background-color: ${({ isItAProject }) => {
    return (isItAProject) ? zooTheme.colors.background : 'white';
  }};
  box-sizing: border-box;
  color: ${theme('mode', {
    light: zooTheme.colors.navy.default
  })};
  flex: ${props => `1 0 ${props.basis}%`};
  min-width: 400px;
  padding: 3em 4vw;

  ul {
    padding-left: 0;
  }

    li {
      display: block;
      margin-top: 1.5em;
    }

      a {
        text-decoration: none;
      }

      a:hover, a:focus {
        text-decoration: underline;
      }

      i {
        margin: 0 1ch;
        text-decoration: none;
      }
`;

export const StyledExternalLink = styled(ExternalLink)`
  align-items: center;
  display: inline-flex;
  flex-direction: row-reverse;
  font-size: 1.2em;
  justify-content: flex-start;
  text-decoration: none;
`;

function isResourceAProject(resource) {
  return Object.keys(resource).includes('workflow_description');
}

export default function ExternalLinksBlock({ basis, header, links, resource }) {
  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <StyledExternalLinksBlock basis={basis} isItAProject={isResourceAProject(resource)}>
        {header}
        <ul>
          {links.map((link) => {
            const { isExternalLink, isSocialLink, label, path, site, url } = link;
            return (
              <li key={url}>
                <StyledExternalLink
                  isExternalLink={isExternalLink}
                  isSocialLink={isSocialLink}
                  label={label}
                  path={path}
                  site={site}
                  url={url}
                />
              </li>
            );
          })}
        </ul>
      </StyledExternalLinksBlock>
    </ThemeProvider>
  );
}

ExternalLinksBlock.defaultProps = {
  basis: '33.333',
  header: null,
  links: [],
  resource: null
};

ExternalLinksBlock.propTypes = {
  basis: PropTypes.string,
  header: PropTypes.node,
  links: PropTypes.arrayOf(PropTypes.object),
  resource: PropTypes.object
};

