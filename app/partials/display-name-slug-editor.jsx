import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AutoSave from '../components/auto-save';
import handleInputChange from '../lib/handle-input-change';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);

class DisplayNameSlugEditor extends Component {
  constructor(props) {
    super(props);
    this.getResourceUrl = this.getResourceUrl.bind(this);
    this.undoNameChange = this.undoNameChange.bind(this);
    this.warnURLChange = this.warnURLChange.bind(this);
    this.state = {
      currentSlug: props.resource.slug,
      currentName: props.resource.display_name,
      url: null,
    };
  }

  componentDidMount() {
    this.getResourceUrl();
  }

  componentWillReceiveProps() {
    this.getResourceUrl();
  }

  getResourceUrl() {
    this.props.resource.get('owner')
      .then(owner => {
        const {resource, resourceType} = this.props; 
        this.setState({
          url: `/${resourceType}s/${resource.slug}`
        });
      });
  }

  undoNameChange(resource, currentName) {
    const cleanDisplayNameValue = DOMPurify.sanitize(currentName);
    resource.update({ display_name: cleanDisplayNameValue });
    resource.save();
  }

  warnURLChange(resource, currentSlug) {
    return resource.slug !== currentSlug && 
      currentSlug.match(/untitled-project/i) === null;
  }

  render() {
    const {state, undoNameChange} = this;
    const {resource, resourceType} = this.props;

    return (
      <div>
        <AutoSave resource={resource}>
          <span className="form-label">Name</span>
          <br />
          <input type="text" 
            className="standard-input full" 
            name="display_name" 
            value={resource.display_name} 
            onChange={handleInputChange.bind(resource)} 
            disabled={resource.live}
          />
        </AutoSave>

        {(this.warnURLChange(resource, state.currentSlug))
          ? <small className="form-help">
              You’re changing the url of your {resourceType}. Users with bookmarks and links in Talk will no longer work. 
              {' '}
              <button type="button" onClick={undoNameChange.bind(this, resource, state.currentName)}>
                Undo
              </button>
              {' '}
            </small>
          : null
        }

        {(state.url)
          ? <small className="form-help">
              {(resource.live)
                ? `You cannot change a live ${resourceType}'s name.`
                : `The ${resourceType} name is the first thing people will see about the ${resourceType}, and it will show up in the ${resourceType} URL. Try to keep it short and sweet.`
              }
              {' '}
              Your {resourceType}’s URL is
              {' '}
              <a href={window.location.origin + state.url}>
                {state.url}
              </a>
            </small>
          : null
        }
      </div>
    );
  }

}

DisplayNameSlugEditor.propTypes = {
  resource: PropTypes.object,
  resourceType: PropTypes.string,
};

DisplayNameSlugEditor.defaultProps = {
  resource: {},
  resourceType: '',
};

export default DisplayNameSlugEditor;