import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import theme from 'styled-theming';
import ExternalLink from './components/ExternalLink';
import { zooTheme } from '../../../../theme';

export const StyledExternalLinksBlock = styled.div`
  background-color: white;
  color: ${theme('mode', {
    light: zooTheme.colors.navy.default
  })};
  flex: 2 0 auto;
  padding: 3em 4vw;

  ul {
    padding-left: 1em;
  }

  > ul li {
    display: block;
    margin-top: 1.5em;
  }
`;

export const StyledExternalLink = styled(ExternalLink)`
  align-items: center;
  display: inline-flex;
  flex-direction: row-reverse;
  font-size: 1.2em;
  justify-content: flex-start;
  text-decoration: none;

  &:focus, &:hover {
    text-decoration: underline;
  }
`;

export default function ExternalLinksBlock({ links }) {
  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <StyledExternalLinksBlock>
        <Translate className="project-home-page__small-header" component="h4" content="project.home.links" />
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
