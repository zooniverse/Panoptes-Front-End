import React from 'react';
import DragReorderable from 'drag-reorderable';
import AutoSave from '../../components/auto-save.coffee';
import SOCIAL_ICONS from '../../lib/social-icons';

export default class SocialLinksEditor extends React.Component {
  constructor(props) {
    super(props);
    const socialOrder = Object.keys(SOCIAL_ICONS).map(key => key);
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

    if (e.target.value) {
      const changes = {
        [`urls.${index}`]: {
          label: '',
          path: e.target.value,
          site,
          url: `https://${site}${e.target.value}`
        }
      };
      this.props.project.update(changes);
    } else {
      this.handleRemoveLink(site);
    }
  }

  handleLinkReorder(newLinkOrder) {
    const socialUrls = [];
    const urls = this.props.project.urls.slice();
    let index = urls.length - 1;
    while (index >= 0) {
      if (urls[index].path) {
        socialUrls.push(urls.splice(index, 1)[0]);
      }
      index -= 1;
    }
    newLinkOrder.map((item) => {
      const urlIndex = this.indexFinder(socialUrls, item);
      if (urlIndex >= 0) {
        urls.push(socialUrls[urlIndex]);
      }
    });
    const changes = { urls };
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

  indexFinder(toSearch, toFind) { //eslint-disable-line
    return toSearch.findIndex(i => (i.site === toFind));
  }

  renderRow(site, i) {
    const index = this.indexFinder(this.props.project.urls, site);
    const value = index >= 0 ? this.props.project.urls[index].path : '';

    return (
      <tr key={i}>
        <td>{site}</td>
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
  project: React.PropTypes.shape({
    save: React.PropTypes.func,
    update: React.PropTypes.func,
    urls: React.PropTypes.array
  })
};
