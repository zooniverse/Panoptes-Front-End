import PropTypes from 'prop-types';
import React from 'react';
import DragReorderable from 'drag-reorderable';
import AutoSave from '../../components/auto-save.coffee';

export default class ExternalLinksEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddLink = this.handleAddLink.bind(this);
    this.handleLinkReorder = this.handleLinkReorder.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  handleAddLink() {
    const changes = {
      [`urls.${this.props.project.urls.length}`]: {
        label: 'Example',
        url: 'https://example.com/'
      }
    };
    this.props.project.update(changes);
  }

  handleLinkReorder(newLinkOrder) {
    const socialUrls = this.props.project.urls.filter(url => url.path);
    const urls = newLinkOrder.concat(socialUrls);
    const changes = { urls };
    this.props.project.update(changes);
    this.props.project.save();
  }

  handleRemoveLink(linkToRemove) {
    const urlList = this.props.project.urls.slice();
    const indexToRemove = urlList.findIndex(i => (i._key === linkToRemove._key));
    if (indexToRemove > -1) {
      urlList.splice(indexToRemove, 1);
      const changes = {
        urls: urlList
      };
      this.props.project.update(changes);
      // Remove link is handeld outside of the AutoSave so save directly
      // This is to prevent setState on the AutoSave from firing after the dom is removed
      this.props.project.save();
    }
  }

  handleLinkChange(event) {
    const { project } = this.props;
    const { name, type, value } = event.target;
    let sanitisedValue = value;
    if (type === 'url' && value.length > 4) {
      const isURL = value.substring(0, 4) === 'http';
      sanitisedValue = isURL ? value : '';
    }
    project.update({ [name]: sanitisedValue });
  }

  handleDisableDrag(event) {
    event.target.parentElement.parentElement.setAttribute('draggable', false);
  }

  handleEnableDrag(event) {
    event.target.parentElement.parentElement.setAttribute('draggable', true);
  }

  renderRow(link) {
    // Find the links current position in the list
    const idx = this.props.project.urls.findIndex(i => (i._key === link._key));
    return (
      <tr key={link._key}>
        <AutoSave tag="td" resource={this.props.project}>
          <input
            type="text"
            name={`urls.${idx}.label`}
            required
            value={link.label}
            onChange={this.handleLinkChange}
            onMouseDown={this.handleDisableDrag}
            onMouseUp={this.handleEnableDrag}
          />
        </AutoSave>
        <AutoSave tag="td" resource={this.props.project}>
          <input
            type="url"
            name={`urls.${idx}.url`}
            pattern="https?://.+"
            required
            value={link.url}
            onChange={this.handleLinkChange}
            onMouseDown={this.handleDisableDrag}
            onMouseUp={this.handleEnableDrag}
          />
        </AutoSave>
        <td>
          <button type="button" onClick={this.handleRemoveLink.bind(this, link)}>
            <i className="fa fa-remove" />
          </button>
        </td>
      </tr>
    );
  }

  renderTable(urls) {
    const tableUrls = urls.filter(url => !url.path);
    for (const link of tableUrls) {
      if (!link._key) {
        link._key = Math.random();
      }
    }

    return (
      <table className="external-links-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
          </tr>
        </thead>
        <DragReorderable
          tag="tbody"
          items={tableUrls}
          render={this.renderRow}
          onChange={this.handleLinkReorder}
        />
      </table>
    );
  }

  render() {
    return (
      <div>
        {(this.props.project.urls.length > 0)
          ? this.renderTable(this.props.project.urls)
          : null}

        <AutoSave resource={this.props.project}>
          <button type="button" onClick={this.handleAddLink}>Add a link</button>
        </AutoSave>
      </div>
    );
  }
}

ExternalLinksEditor.defaultProps = {
  project: {}
};

ExternalLinksEditor.propTypes = {
  project: PropTypes.shape({
    save: PropTypes.func,
    update: PropTypes.func,
    urls: PropTypes.array
  })
};