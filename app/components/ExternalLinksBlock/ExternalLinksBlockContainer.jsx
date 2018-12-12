import React from 'react';
import _ from 'lodash';
import ExternalLinksBlock from './ExternalLinksBlock';

export default class ExternalLinksBlockContainer extends React.Component {
  getExternalLinks() {
    const allExternalLinks = _.get(this.props.resource, 'urls', [])
      .map(link => ({ ...link, isExternalLink: true }));

    const partitionedLinks = _.partition(allExternalLinks, link => (link.site));

    const external = partitionedLinks[1]
      .map(link => {
        if (isURL(link.url)) {
          return {
            isExternalLink: true,
            label: link.label,
            url: link.url
          }
        }
      })
      .filter(link => link);

    const social = partitionedLinks[0].map(link => ({
      isExternalLink: false,
      isSocialLink: true,
      label: link.label,
      path: link.path,
      site: link.site,
      url: link.url
    }));

    return {
      external,
      social
    };
  }

  render() {
    const { external, social } = this.getExternalLinks();
    const links = [].concat(external, social);

    if (links.length > 0) {
      return (
        <ExternalLinksBlock header={this.props.header} links={links} basis={this.props.basis} resource={this.props.resource} />
      );
    }

    return null;
  }
}

function isURL(str) {
  return str.substring(0, 4) === 'http';
}
