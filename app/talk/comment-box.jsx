import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ToggleChildren from './mixins/toggle-children';
import Feedback from './mixins/feedback';
import CommentImageSelector from './comment-image-selector';
import getSubjectLocation from '../lib/getSubjectLocation';
import Loading from '../components/loading-indicator';
import SingleSubmitButton from '../components/single-submit-button';
import alert from '../lib/alert';
import {Markdown, MarkdownEditor, MarkdownHelp} from 'markdownz';
import Suggester from './suggester';

const ERROR_MESSAGES = {
  BANNED: 'You are banned. Email contact@zooniverse.org for further information.',
  EMAIL_NOT_CONFIRMED: 'Your account email address is not yet confirmed. Please check your email for confirmation instructions, or visit https://www.zooniverse.org/settings/email to request new confirmation email.'
};

function getErrorMessage(error, user) {
  if (!error) return '';

  if (
    error.message?.match?.(/not allowed to create this Comment/i)
    || error.message?.match?.(/not allowed to create this Discussion/i)
    || error.message?.match?.(/You must confirm your account/i)
  ) {
    if (!user?.confirmed_at) {
      return ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
    }
  } else if (
    error.message?.match?.(/You are banned/i)
  ) {
    return ERROR_MESSAGES.BANNED;
  }

  return error.message || 'Unknown error';
}

const CommentBox = createReactClass({
  displayName: 'Commentbox',
  mixins: [ToggleChildren, Feedback],

  propTypes: {
    submit: PropTypes.string,
    user: PropTypes.object,
    header: PropTypes.string,
    placeholder: PropTypes.string,
    submitFeedback: PropTypes.string,
    onSubmitComment: PropTypes.func, // called on submit and passed (e, textarea-content, subject), expected to return something thenable
    onCancelClick: PropTypes.func
  }, // adds cancel button and calls callback on click if supplied

  getDefaultProps() {
    return {
      submit: "Submit",
      header: "Add to the discussion +",
      placeholder: "Type your comment here",
      submitFeedback: "Comment Successfully Submitted",
      content: '',
      subject: null,
      user: null,
      logSubmit: false
    };
  }, // if true, geordi logging will be made through onSubmitComment

  getInitialState() {
    return {
      subject: this.props.subject,
      content: this.props.content,
      reply: null,
      loading: false,
      error: ''
    };
  },

  contextTypes: {
    geordi: PropTypes.object
  },

  logPageClick(clicked, button) {
    return this.context?.geordi?.logEvent({
      type: clicked,
      data: button
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.reply !== this.props.reply) {
      return this.setState({reply: nextProps.reply});
    }
  },

  onSubmitComment(e) {
    if (this.props.logSubmit === true) {
      this.logPageClick('add-comment', this.props.submit);
    }
    e.preventDefault();
    const textareaValue = this.state.content;
    if (this.props.validationCheck?.(textareaValue)) { return; }
    this.setState({loading: true});

    return this.props.onSubmitComment?.(e, textareaValue, this.state.subject, this.state.reply)
      .then(() => {
        this.hideChildren();
        this.setState({subject: null, content: '', error: '', loading: false});
        return this.setFeedback(this.props.submitFeedback);
    }).catch(e => {
        const errorMessage = getErrorMessage(e, this.props.user);
        return this.setState({error: errorMessage, loading: false});
    });
  },

  onInputChange(e) {
    return this.setState({content: e.target.value});
  },

  onImageSelectClick(e) {
    return this.toggleComponent('image-selector');
  },

  onSelectImage(imageData) {
    this.setState({subject: imageData});
    return this.hideChildren();
  },

  onClearImageClick(e) {
    return this.setState({subject: null});
  },

  render() {
    const validationErrors = this.props.validationErrors.map((message, i) => {
      return <p key={i} className="talk-validation-error">{message}</p>;
    });

    const feedback = this.renderFeedback();
    const loader = this.state.loading ? <Loading /> : undefined;

    return (
      <div className="talk-comment-container">
        <div className="talk-comment-box">
          {this.props.reply ?
            <div className="talk-comment-reply">
              <div style={{color: '#afaeae'}}>
                In reply to {this.props.reply.comment.user_display_name}'s comment:
              </div>
              <Markdown project={this.props.project}>{this.props.reply.comment.body}</Markdown>
              <button type="button" onClick={this.props.onClickClearReply}><i className="fa fa-close" /> Clear Reply</button>
            </div> : undefined
            }

          <h1>{this.props.header}</h1>

          {this.state.subject ?
            <img className="talk-comment-focus-image" src={getSubjectLocation(this.state.subject).src} /> : undefined}

          <form className="talk-comment-form" onSubmit={this.onSubmitComment}>
            <Suggester {...this.props} input={this.state.content} onSelect={this.onInputChange}>
              <MarkdownEditor previewing={this.state.loading} placeholder={this.props.placeholder} project={this.props.project} className="full" value={this.state.content} onChange={this.onInputChange} onHelp={() => alert(<MarkdownHelp talk={true} title={<h1>Guide to commenting in Talk</h1>}/>) }/>
            </Suggester>
            <section>
              <button
                type="button"
                className={`talk-comment-image-select-button ${this.state.showing === 'image-selector' ? 'active' : ''}`}
                onClick={this.onImageSelectClick}>
                Linked Image
                {this.state.showing === 'image-selector' ? <span>&nbsp;<i className="fa fa-close" /></span> : undefined}
              </button>

            <SingleSubmitButton type="submit" onClick={this.onSubmitComment} className='talk-comment-submit-button'>{this.props.submit}</SingleSubmitButton>
              {this.props.onCancelClick ?
                <button
                  type="button"
                  className="button talk-comment-submit-button"
                  onClick={this.props.onCancelClick}>
                 Cancel
                </button> : undefined}
            </section>

            {feedback}

            <div className="submit-error">
              {validationErrors}
              {this.state.error != null ? this.state.error : null}
            </div>
          </form>

          <div className="talk-comment-children">
            {(() => { switch (this.state.showing) {
              case 'image-selector':
                return <CommentImageSelector
                  onSelectImage={this.onSelectImage}
                  onClearImageClick={this.onClearImageClick}
                  user={this.props.user} />;
            } })()}
          </div>

          {loader}
        </div>
      </div>
    );
  }
});

export default CommentBox;