import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from 'markdownz';
import { socialIcons } from '../../../../lib/nav-helpers';

export default function ExternalLink({ className, isExternalLink, isSocialLink, label, path, site, url, socialLabel }) {
  let iconClasses;
  let linkLabel = label;
  const linkProps = {
    className,
    href: url,
    rel: 'noopener noreferrer',
    target: '_blank'
  };

  if (isExternalLink) {
    iconClasses = 'fa fa-external-link fa-fw';
    return (
      <div className={linkProps.className}>
        <Markdown tag="span" className="link-title" inline={true}>
          {`[${linkLabel}](+tab+${linkProps.href})`}
        </Markdown>
        {iconClasses && <i className={iconClasses} />}
      </div>
    );
  }

  if (isSocialLink && !!socialIcons[site]) {
    const icon = socialIcons[site].icon;
    const isMastodonLink = socialIcons[site].label === "Mastodon"
    const isBlueSkyLink = socialIcons[site].label === "BlueSky"

    iconClasses = `fa ${icon} fa-fw`;
    linkLabel = path;
    linkProps['aria-label'] = socialIcons[site].ariaLabel;
    const siteSubpath = socialIcons[site]?.siteSubpath || ''
    if (socialIcons[site]?.pathBeforeSite) {
      linkProps.href = `https://${path}.${site}`;
    } else {
      linkProps.href = `https://${site}${siteSubpath}${path}`;
    }
    const isValidLink = !!icon && linkProps.href.substring(0, 8) === 'https://';
    if (isValidLink) {
      return (
        <a {...linkProps}>
          <div>
            <span className="link-title">
              {socialLabel ? '@' : ''}
              {linkLabel}
            </span>
            {socialLabel && <span className="social-label">{socialIcons[site].label}</span>}
          </div>
          {/** Mastodon and BlueSky icons are not available in this repo's current versino of font-awesome libraries, so we manually add svgs here */}
          {isMastodonLink ? <i className='fa fa-fw'><svg viewBox="0 0 448 512" height="14px" width="14px"><path fill="#43bbfd" d="M433 179.1c0-97.2-63.7-125.7-63.7-125.7-62.5-28.7-228.6-28.4-290.5 0 0 0-63.7 28.5-63.7 125.7 0 115.7-6.6 259.4 105.6 289.1 40.5 10.7 75.3 13 103.3 11.4 50.8-2.8 79.3-18.1 79.3-18.1l-1.7-36.9s-36.3 11.4-77.1 10.1c-40.4-1.4-83-4.4-89.6-54a102.5 102.5 0 0 1 -.9-13.9c85.6 20.9 158.7 9.1 178.8 6.7 56.1-6.7 105-41.3 111.2-72.9 9.8-49.8 9-121.5 9-121.5zm-75.1 125.2h-46.6v-114.2c0-49.7-64-51.6-64 6.9v62.5h-46.3V197c0-58.5-64-56.6-64-6.9v114.2H90.2c0-122.1-5.2-147.9 18.4-175 25.9-28.9 79.8-30.8 103.8 6.1l11.6 19.5 11.6-19.5c24.1-37.1 78.1-34.8 103.8-6.1 23.7 27.3 18.4 53 18.4 175z"/></svg></i>
          : isBlueSkyLink ? <i className='fa fa-fw'><svg viewBox="0 0 576 512" height="14px" width="14px"><path fill="#43bbfd" d="M407.8 294.7c-3.3-.4-6.7-.8-10-1.3c3.4 .4 6.7 .9 10 1.3zM288 227.1C261.9 176.4 190.9 81.9 124.9 35.3C61.6-9.4 37.5-1.7 21.6 5.5C3.3 13.8 0 41.9 0 58.4S9.1 194 15 213.9c19.5 65.7 89.1 87.9 153.2 80.7c3.3-.5 6.6-.9 10-1.4c-3.3 .5-6.6 1-10 1.4C74.3 308.6-9.1 342.8 100.3 464.5C220.6 589.1 265.1 437.8 288 361.1c22.9 76.7 49.2 222.5 185.6 103.4c102.4-103.4 28.1-156-65.8-169.9c-3.3-.4-6.7-.8-10-1.3c3.4 .4 6.7 .9 10 1.3c64.1 7.1 133.6-15.1 153.2-80.7C566.9 194 576 75 576 58.4s-3.3-44.7-21.6-52.9c-15.8-7.1-40-14.9-103.2 29.8C385.1 81.9 314.1 176.4 288 227.1z"/></svg></i>
          : iconClasses ? <i className={iconClasses} /> : null
        }
        </a>
      );
    }
  }

  return null;
}

ExternalLink.defaultProps = {
  className: '',
  isExternalLink: false,
  isSocialLink: false,
  label: '',
  path: '',
  site: '',
  url: '',
  socialLabel: false
};

ExternalLink.propTypes = {
  className: PropTypes.string,
  isExternalLink: PropTypes.bool.isRequired,
  isSocialLink: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string,
  site: PropTypes.string,
  url: PropTypes.string.isRequired,
  socialLabel: PropTypes.bool
};
