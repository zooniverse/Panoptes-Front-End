import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import ImageSelector from '../../components/image-selector';
import putFile from '../../lib/put-file';

const MAX_AVATAR_SIZE = 65536;
const MAX_HEADER_SIZE = 256000;

class CustomiseProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: {},
      avatarError: null,
      profile_header: {},
      profile_headerError: null
    };
    this.getUserResource('avatar');
    this.getUserResource('profile_header');
  }

  getUserResource(type) {
    return this.props.user.get(type, {})
    .then(([resource]) => {
      this.setState({ [type]: resource });
      return resource;
    });
  }

  handleMediaChange(type, file) {
    const { user } = this.props;
    const errorProp = `${type}Error`;
    this.setState({ [errorProp]: null });
    apiClient.post(user._getURL(type), { media: { content_type: file.type }})
    .then(([resource]) => {
      putFile(resource.src, file, { 'Content-Type': file.type })
      .then(() => this.getUserResource(type))
      .then((updatedResource) => {
        this.setState({ [type]: updatedResource });
      });
    })
    .catch((error) => {
      this.setState({ [errorProp]: error });
    });
  }

  handleMediaClear(type) {
    const errorProp = `${type}Error`;
    this.setState({ [errorProp]: null });
    this.getUserResource(type)
    .then((resource) => {
      !!resource && resource.delete();
      this.setState({ [type]: {} });
    })
    .catch((error) => {
      this.setState({ [errorProp]: error });
    });
  }

  render() {
    const { avatar, avatarError, profile_header, profile_headerError } = this.state;
    const placeholder = <p className="content-container">Drop an image here (or click to select).</p>;
    return (
      <div>
        <div className="content-container">
          <h3>Change avatar</h3>
          <div>
            <p className="form-help">Drop an image here (square, less than {Math.floor(MAX_AVATAR_SIZE / 1000)} KB)</p>
            <div style={{ width: '20vw' }}>
              <ImageSelector
                maxSize={MAX_AVATAR_SIZE}
                ratio={1}
                src={avatar.src}
                placeholder={placeholder}
                onChange={this.handleMediaChange.bind(this, 'avatar')}
              />
            </div>
            <div>
              <button
                type="button"
                disabled={avatar === {}}
                onClick={this.handleMediaClear.bind(this, 'avatar')}
              >
                Clear avatar
              </button>
            </div>
          </div>
          {!!avatarError &&
            <div className="form-help error">{avatarError.toString()}</div>
          }
        </div>
        <hr />
        <div className="content-container">
          <h3>Change profile header</h3>
          <div>
            <p className="form-help">Drop an image here (any dimensions, less than {Math.floor(MAX_HEADER_SIZE / 1000)} KB)</p>
            <div style={{ width: '40vw' }}>
              <ImageSelector
                maxSize={MAX_HEADER_SIZE}
                src={profile_header.src}
                placeholder={placeholder}
                onChange={this.handleMediaChange.bind(this, 'profile_header')}
              />
            </div>
            <div>
              <button
                type="button"
                disabled={profile_header === {}}
                onClick={this.handleMediaClear.bind(this, 'profile_header')}
              >
                Clear header
              </button>
            </div>
          </div>
          {!!profile_headerError &&
            <div className="form-help error">{profile_headerError.toString()}</div>}
        </div>
      </div>
    );
  }
}

CustomiseProfile.defaultProps = {
  user: null
};

CustomiseProfile.propTypes = {
  user: React.PropTypes.shape({
    get: React.PropTypes.func
  })
};

export default CustomiseProfile;
