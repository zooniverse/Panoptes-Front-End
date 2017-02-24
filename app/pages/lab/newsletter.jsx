import React from 'react';

const PreviousLetter = (props) => {
  // this makes use of the talk comment styling
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
    // will have to parse the markdown into plan text
    // or we could use a normal <input> box to avoid that
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
          cols="150"
          value={this.state.newsletter}
          onChange={this.handleChange}
        />
        <br />
        <small className="form-help">Send a newsletter to your volunteers.  When you use the submit button below your newsletter will be reviewed by the Zooniverse before being sent out to your uses.</small>
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
