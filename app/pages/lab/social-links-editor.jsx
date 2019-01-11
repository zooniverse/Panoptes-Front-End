import PropTypes from 'prop-types';
import React from 'react';
import DragReorderable from 'drag-reorderable';
import AutoSave from '../../components/auto-save.coffee';
import { socialIcons } from '../../lib/nav-helpers';

export default class SocialLinksEditor extends React.Component {
  constructor(props) {
    super(props);
    const socialOrder = Object.keys(socialIcons).map(key => key);

    this.state = {
      socialOrder
    };
    this.reorderDefault = this.reorderDefault.bind(this);
    this.handleNewLink = this.handleNewLink.bind(this);
    this.handleLinkReorder = this.handleLinkReorder.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.reorderDefault();
  }

  reorderDefault() {
    const socialUrls = this.props.project.urls.filter(url => url.path);
    const newOrder = [];
    socialUrls.map(link => newOrder.push(link.site));
    this.state.socialOrder.map((item) => {
      if (newOrder.indexOf(item) < 0) {
        newOrder.push(item);
      }
    });
    this.setState({ socialOrder: newOrder });
  }

  handleNewLink(site, e) {
    let index = this.indexFinder(this.props.project.urls, site);
    if (index < 0) { index = this.props.project.urls.length; }
    let url = `https://${site}${e.target.value}`;
    if (socialIcons[site].pathBeforeSite) {
      url = `https://${e.target.value}.${site}`;
    }

    if (e.target.value) {
      const changes = {
        [`urls.${index}`]: {
          label: '',
          path: e.target.value,
          site,
          url
        }
      };
      this.props.project.update(changes);
    } else {
      this.handleRemoveLink(site);
    }
  }

  handleLinkReorder(newLinkOrder) {
    const externalUrls = this.props.project.urls.filter(url => !url.path);
    const socialUrls = this.props.project.urls.filter(url => url.path);
    const newSocialUrls = socialUrls.sort((a, b) => newLinkOrder.indexOf(a.site) - newLinkOrder.indexOf(b.site));
    const changes = { urls: externalUrls.concat(newSocialUrls) };
    this.props.project.update(changes).save();
    this.setState({ socialOrder: newLinkOrder });
  }

  handleRemoveLink(linkToRemove) {
    const urls = this.props.project.urls.slice();
    const indexToRemove = this.indexFinder(urls, linkToRemove);
    if (indexToRemove > -1) {
      urls.splice(indexToRemove, 1);
      this.props.project.update({ urls }).save();
    }
  }

  handleDisableDrag(event) {
    event.target.parentElement.parentElement.setAttribute('draggable', false);
  }

  handleEnableDrag(event) {
    event.target.parentElement.parentElement.setAttribute('draggable', true);
  }

  indexFinder(toSearch, toFind) {
    return toSearch.findIndex(i => (i.site === toFind));
  }

  renderRow(site, i) {
    const index = this.indexFinder(this.props.project.urls, site);
    const value = index >= 0 ? this.props.project.urls[index].path : '';
    const precedeSiteName = socialIcons[site].pathBeforeSite;

    return (
      <tr key={i}>
        {!precedeSiteName && (
          <td>{site}</td>
        )}
        <AutoSave tag="td" resource={this.props.project}>
          <input
            type="text"
            name={`urls.${site}.url`}
            value={value}
            onChange={this.handleNewLink.bind(this, site)}
            onMouseDown={this.handleDisableDrag}
            onMouseUp={this.handleEnableDrag}
          />
        </AutoSave>
        {precedeSiteName && (
          <td>.{site}</td>
        )}
        <td>
          <button type="button" onClick={this.handleRemoveLink.bind(this, site)}>
            <i className="fa fa-remove" />
          </button>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <table className="edit-social-links">
        <DragReorderable
          tag="tbody"
          items={this.state.socialOrder}
          render={this.renderRow}
          onChange={this.handleLinkReorder}
        />
      </table>
    );
  }
}

SocialLinksEditor.defaultProps = {
  project: {}
};

SocialLinksEditor.propTypes = {
  project: PropTypes.shape({
    save: PropTypes.func,
    update: PropTypes.func,
    urls: PropTypes.array
  })
};
