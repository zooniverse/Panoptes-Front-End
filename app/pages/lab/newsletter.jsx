import React from 'react';

const PreviousLetter = (props) => {
  // this makes use of the talk comment styling
  // depanding on what data is saved on the API this should also display information
  // about the "status" of the newsletter (e.g. accepted, pending, rejected)
  // and metadata such as data sent out.
  return (
    <div>
      <div className="talk-comment-body">
        {props.text}
      </div>
    </div>
  );
};

PreviousLetter.propTypes = {
  text: React.PropTypes.string
};

export default class NewsletterPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      newsletter: '',
      busy: false,
      previousNewsletters: []
    };
  }

  componentDidMount() {
    // Make API call to grab previously submitted newsletters
  }

  handleChange(e) {
    this.setState({ newsletter: e.target.value });
  }

  handleSubmit() {
    // Make the submit API call when that exists
    // the textarea style should be extracted to css
    this.setState({ busy: true }, () => {
      const previousNewsletters = this.state.previousNewsletters.slice();
      previousNewsletters.push(this.state.newsletter);
      this.setState({
        newsletter: '',
        previousNewsletters,
        busy: false
      });
    });
  }

  render() {
    let previousList = [<span key="no-letters">You have not sent any newsletters yet</span>];
    if (this.state.previousNewsletters.length > 0) {
      previousList = this.state.previousNewsletters.map((p, idx) => { return <PreviousLetter text={p} key={`previous-letter-${idx}`} />; });
    }
    return (
      <div>
        <span className="form-label">Newsletter</span>
        <br />
        <textarea
          className="full"
          rows="15"
          style={{ width: '100%' }}
          value={this.state.newsletter}
          onChange={this.handleChange}
        />
        <br />
        <small className="form-help">Send a newsletter to your volunteers.  When you use the submit button below your newsletter will be reviewed by the Zooniverse before being sent out to your uses.</small>
        <br />
        <button
          type="button"
          className="major-button"
          disabled={this.state.busy}
          onClick={this.handleSubmit}
        >
          Submit
        </button>
        <hr />
        <span className="form-label">Previous newsletters</span>
        <div className="talk">
          {previousList}
        </div>
      </div>
    );
  }
}

NewsletterPage.propTypes = {
  project: React.PropTypes.object.isRequired
};
