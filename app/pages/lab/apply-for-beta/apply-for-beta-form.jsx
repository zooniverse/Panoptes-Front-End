import PropTypes from 'prop-types';
import React from 'react';
import uniq from 'lodash/uniq';
import apiClient from 'panoptes-client/lib/api-client';

// Constants
const MINIMUM_SUBJECT_COUNT = 100;
const REQUIRED_PAGES = ['Research', 'FAQ'];

// Static functions
const projectHasActiveWorkflows = (project) => {
  return project.links.active_workflows && project.links.active_workflows.length > 0;
};

const projectHasMinimumActiveSubjects = (project) => {
  const subjectCount = project.subjects_count;
  return (subjectCount >= MINIMUM_SUBJECT_COUNT) ?
    true : `The project only has ${subjectCount} of ${MINIMUM_SUBJECT_COUNT} required subjects`;
};

const projectHasRequiredContent = (project) => {
  // Second parameter is an empty object to prevent request caching.
  return apiClient.type('projects')
    .get(project.id)
    .get('pages', {})
    .then((projectPages) => {
      const missingPages = REQUIRED_PAGES.reduce((accumulator, requiredPage) => {
        const pagePresent = projectPages.find((page) => {
          return requiredPage === page.title;
        });
        if (!pagePresent || (pagePresent.content === null || pagePresent.content === '')) {
          accumulator.push(requiredPage);
        }
        return accumulator;
      }, []);
      const errorMessage = `The following pages are missing content: ${missingPages.join(', ')}`;
      return (missingPages.length === 0) ? true : errorMessage;
    });
};

const projectIsLive = (project) => {
  return project.live === true;
};

const projectIsPublic = (project) => {
  return project.private === false;
};

const renderValidationErrors = (errors) => {
  if (errors.length) {
    return (
      <div>
        <p className="form-help">The following errors need to be fixed:</p>
        <ul className="form-help error error-messages">
          {errors.map((error) => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
      </div>
    );
  }
  return null;
};

const shallowCompare = (a, b) => {
  let result = true;
  Object.keys(a).forEach((key) => {
    if (!(key in b) || a[key] !== b[key]) {
      result = false;
    }
  });
  Object.keys(b).forEach((key) => {
    if (!(key in a) || a[key] !== b[key]) {
      result = false;
    }
  });
  return result;
};

// Component
class ApplyForBetaForm extends React.Component {
  constructor(props) {
    super(props);

    this.attemptApplyForBeta = this.attemptApplyForBeta.bind(this);
    this.canApplyForReview = this.canApplyForReview.bind(this);
    this.createCheckbox = this.createCheckbox.bind(this);
    this.testAsyncValidations = this.testAsyncValidations.bind(this);
    this.toggleValidation = this.toggleValidation.bind(this);
    this.updateValidationsFromProps = this.updateValidationsFromProps.bind(this);

    this.state = {
      validations: {
        projectIsPublic: projectIsPublic(props.project),
        projectIsLive: projectIsLive(props.project),
        projectHasActiveWorkflows: projectHasActiveWorkflows(props.project),
        labPolicyReviewed: false,
        bestPracticesReviewed: false,
        feedbackReviewed: false
      },
      validationErrors: [],
      doingAsyncValidation: false
    };
  }


  componentWillUpdate(nextProps) {
    this.updateValidationsFromProps(nextProps);
  }

  testAsyncValidations() {
    // Resolves to true if everything passes, else rejects with an array of
    // error messages.
    this.setState({ doingAsyncValidation: true });
    return Promise.all([
      projectHasMinimumActiveSubjects(this.props.project),
      projectHasRequiredContent(this.props.project)
    ])
    .catch((error) => {
      console.error('Error requesting project data', error);
    })
    .then((results) => {
      this.setState({ doingAsyncValidation: false });
      if (results.every((result) => {
        return typeof result === 'boolean' && result === true;
      })) {
        return true;
      }
      const errors = results.filter((result) => {
        return typeof result !== 'boolean';
      });
      return Promise.reject(errors);
    });
  }

  toggleValidation(validationName, event) {
    const validations = Object.assign({}, this.state.validations);
    validations[validationName] = event.target.checked;
    this.setState({ validations });
  }

  canApplyForReview() {
    const { validations } = this.state;
    const values = Object.keys(validations)
      .map((key) => {
        return validations[key];
      });
    return values.every((value) => {
      return value === true;
    });
  }

  createCheckbox(validationName, content, disabled = false) {
    // If it's a non-user controlled checkbox, we don't want to trigger anything
    // on change, so we use Function.prototype as a noop.
    const changeFn = (disabled) ? Function.prototype : this.toggleValidation.bind(this, validationName);
    return (
      <label htmlFor={`checkbox-${validationName}`} style={{ display: 'block' }}>
        <input
          id={`checkbox-${validationName}`}
          type="checkbox"
          onChange={changeFn}
          checked={this.state.validations[validationName] === true}
          disabled={disabled}
        />
        {content}
      </label>
    );
  }

  attemptApplyForBeta() {
    this.testAsyncValidations()
      .then(() => {
        this.props.applyFn();
      })
      .catch((errors) => {
        this.setState({
          validationErrors: errors
        });
      });
  }

  updateValidationsFromProps(props) {

    // We need to do a props comparison, otherwise we get a loop where props
    // update state -> updates state repeatedly.
    //
    // Unfortunately, we have to do it by comparing the new props against the
    // current state, instead of using shouldComponentUpdate. This is because
    // the project prop passed down is mutable, which breaks the props/nextProps
    // comparison used by shouldComponentUpdate.
    const validations = Object.assign({}, this.state.validations);

    const newValues = {
      projectIsPublic: projectIsPublic(props.project),
      projectIsLive: projectIsLive(props.project),
      projectHasActiveWorkflows: projectHasActiveWorkflows(props.project)
    };

    Object.keys(newValues).forEach((key) => {
      if (validations[key] !== newValues[key]) {
        validations[key] = newValues[key];
      }
    });

    if (!shallowCompare(validations, this.state.validations)) {
      this.setState({ validations });
    }
  }

  render() {
    const applyButtonDisabled = !this.canApplyForReview() ||
      this.state.doingAsyncValidation;
    return (
      <div>

        {this.createCheckbox('projectIsPublic', <span>Project is public</span>, true)}

        {this.createCheckbox('projectIsLive', <span>Project is live</span>, true)}

        {this.createCheckbox('projectHasActiveWorkflows', <span>Project has at least one active workflow</span>, true)}

        {this.createCheckbox('labPolicyReviewed', <span>I have reviewed the <a href="/lab-policies" target="_blank" rel="noopener noreferrer">policies</a></span>)}

        {this.createCheckbox('bestPracticesReviewed', <span>I have reviewed the <a href="https://help.zooniverse.org/best-practices" target="_blank" rel="noopener noreferrer">best practices</a></span>)}

        {this.createCheckbox('feedbackReviewed', <span>I have reviewed the sample <a href="https://docs.google.com/a/zooniverse.org/forms/d/1o7yTqpytWWhSOqQhJYiKaeHIaax7xYVUyTOaG3V0xA4/viewform" target="_blank" rel="noopener noreferrer">project review feedback form</a></span>)}

        <p className="form-help">To be eligible for beta review, projects also require:</p>
        <ul className="form-help">
          <li>at least {MINIMUM_SUBJECT_COUNT} subjects in active workflows</li>
          <li>content on the Research and FAQ pages in the About page</li>
        </ul>
        <p className="form-help">These will be checked when you click &quot;Apply for review&quot;.</p>

        {renderValidationErrors(this.state.validationErrors)}

        <button
          type="button"
          className="standard-button"
          disabled={applyButtonDisabled}
          onClick={this.attemptApplyForBeta}
        >
          Apply for review
        </button>

      </div>
    );
  }
}

ApplyForBetaForm.defaultProps = {
  project: {},
  applyFn: Function.prototype
};

ApplyForBetaForm.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    live: PropTypes.bool.isRequired,
    private: PropTypes.bool.isRequired
  }).isRequired,
  applyFn: PropTypes.func.isRequired
};

export default ApplyForBetaForm;
