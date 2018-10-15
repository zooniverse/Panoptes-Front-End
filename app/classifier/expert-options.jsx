import PropTypes from 'prop-types';
import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isAdmin from '../lib/is-admin';
import { toggleGoldStandard } from '../redux/ducks/classify';

function ExpertOptions(props) {
  function handleGoldStandardChange(e) {
    props.actions.toggleGoldStandard(e.target.checked || undefined);
  }

  function handleDemoModeChange(e) {
    props.onChangeDemoMode(e.target.checked);
  }

  return (
    <TriggeredModalForm
      trigger={<i className="fa fa-cog fa-fw" />}
    >
      {(props.userRoles.includes('owner') || props.userRoles.includes('expert')) &&
        <p>
          <label>
            <input
              type="checkbox"
              checked={!!props.classification.gold_standard}
              onChange={handleGoldStandardChange}
            />
            {' '}
            Gold standard mode
          </label>{' '}
          <TriggeredModalForm
            trigger={<i className="fa fa-question-circle" />}
          >
            <p>A “gold standard” classification is one that is known to be completely accurate. We’ll compare other classifications against it during aggregation.</p>
          </TriggeredModalForm>
        </p>
      }

      {(isAdmin() || props.userRoles.includes('owner') || props.userRoles.includes('collaborator')) &&
        <p>
          <label>
            <input type="checkbox" checked={props.demoMode} onChange={handleDemoModeChange} />{' '}
            Demo mode
          </label>{' '}
          <TriggeredModalForm
            trigger={<i className="fa fa-question-circle" />}
          >
            <p>In demo mode, classifications <strong>will not be saved</strong>. Use this for quick, inaccurate demos of the classification interface.</p>
          </TriggeredModalForm>
        </p>
      }
    </TriggeredModalForm>
  );
}

ExpertOptions.propTypes = {
  classification: PropTypes.shape({
    update: PropTypes.func,
    gold_standard: PropTypes.bool
  }),
  demoMode: PropTypes.bool,
  onChangeDemoMode: PropTypes.func,
  userRoles: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = state => ({
  classification: state.classify.classification
});

const mapDispatchToProps = dispatch => ({
  actions: {
    toggleGoldStandard: bindActionCreators(toggleGoldStandard, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpertOptions);
export { ExpertOptions };