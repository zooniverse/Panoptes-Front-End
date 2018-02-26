import React from 'react';
import _ from 'lodash';
import ExternalLinksBlock from './ExternalLinksBlock';

export default class ExternalLinksBlockContainer extends React.Component {
  getExternalLinks() {
    const allExternalLinks = _.get(this.props.project, 'urls', [])
      .map(link => ({ ...link, isExternalLink: true }));

    const partitionedLinks = _.partition(allExternalLinks, link => (link.site));

    const external = partitionedLinks[1].map(link => ({
      isExternalLink: true,
      label: link.label,
      url: link.url
    }));

    const social = partitionedLinks[0].map(link => ({
      isExternalLink: true,
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
        <ExternalLinksBlock links={links} />
      );
    }

    return null;
  }
}
