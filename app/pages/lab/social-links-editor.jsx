import React from 'react';
import AutoSave from '../../components/auto-save.coffee';
import DragReorderable from 'drag-reorderable';
import SOCIAL_ICONS from '../../lib/social-icons';

export default class SocialLinksEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleNewLink = this.handleNewLink.bind(this);
    this.handleLinkReorder = this.handleLinkReorder.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
  }

  handleNewLink(site, e) {
    let index = this.props.project.urls.findIndex(i => (i.site === site));
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
    const changes = {
      urls: newLinkOrder
    };
    this.props.project.update(changes);
    this.props.project.save();
  }

  handleRemoveLink(linkToRemove) {
    const urls = this.props.project.urls.slice();
    const indexToRemove = urls.findIndex(i => (i.site === linkToRemove));
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

  render() {
    return (
      <div>
        <h5>Social Links Section</h5>
        <small className="form-help">
          Adding a social link will apend a media icon at
          the end of your project menu bar.
        </small>
        {Object.keys(SOCIAL_ICONS).map((site, index) => {
          let value = '';
          this.props.project.urls.forEach((item) => {
            if (item.site === site) {
              value = item.path;
            }
          });
          return (
            <tr key={index}>
              <td>
                {site}
              </td>
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
        })}
      </div>
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
