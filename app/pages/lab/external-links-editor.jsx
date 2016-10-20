import React from 'react';
import AutoSave from '../../components/auto-save.coffee';
import handleInputChange from '../../lib/handle-input-change.coffee';

class ExternalLinksEditorRow extends React.Component {
  render() {
    return (
      <AutoSave tag="tr" resource={this.props.project}>
        <td>
          <input type="text" name={`urls.${this.props.idx}.label`} value={this.props.link.label} onChange={handleInputChange.bind(this.props.project)} />
        </td>
        <td>
          <input type="text" name={`urls.${this.props.idx}.url`} value={this.props.link.url} onChange={handleInputChange.bind(this.props.project)} />
        </td>
        <td>
          <button type="button" onClick={this.props.handleRemoveLink}>
            <i className="fa fa-remove"></i>
          </button>
        </td>
      </AutoSave>
    );
  }
}

ExternalLinksEditorRow.propTypes = {
  project: React.PropTypes.object,
  link: React.PropTypes.object,
  idx: React.PropTypes.number,
  handleRemoveLink: React.PropTypes.func,
};


export default class ExternalLinksEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddLink = this.handleAddLink.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
  }

  handleAddLink() {
    const changes = {
      [`urls.${this.props.project.urls.length}`]: {
        label: 'Example',
        url: 'https://example.com/',
      },
    };
    this.props.project.update(changes);
  }

  handleRemoveLink(linkToRemove) {
    const urlList = this.props.project.urls.slice();
    const indexToRemove = urlList.findIndex(i => (i._key === linkToRemove._key));
    if (indexToRemove > -1) {
      urlList.splice(indexToRemove, 1);
      const changes = {
        urls: urlList,
      };
      this.props.project.update(changes);
    }
  }

  render() {
    const body = [];
    let idx = 0;
    for (const link of this.props.project.urls) {
      if (!link._key) {
        link._key = Math.random();
      }
      body.push(<ExternalLinksEditorRow idx={idx} key={link._key} link={link} project={this.props.project} handleRemoveLink={this.handleRemoveLink.bind(this, link)} />);
      idx += 1;
    }
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {body}
          </tbody>
        </table>

        <AutoSave resource={this.props.project}>
          <button type="button" onClick={this.handleAddLink}>Add a link</button>
        </AutoSave>
      </div>
    );
  }
}

ExternalLinksEditor.DefaultProps = {
  project: {},
};

ExternalLinksEditor.propTypes = {
  project: React.PropTypes.object,
};
