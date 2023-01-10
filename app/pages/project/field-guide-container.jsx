import React from 'react';
import PropTypes from 'prop-types';
import Pullout from 'react-pullout';
import { Provider, ReactReduxContext } from 'react-redux';
import Translate from 'react-translate-component';
import FieldGuide from './field-guide';
import Translations from '../../classifier/translations';

export default class FieldGuideContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      revealed: false
    };

    this.toggleFieldGuide = this.toggleFieldGuide.bind(this);
  }

  toggleFieldGuide() {
    this.setState(prevState => ({ revealed: !prevState.revealed }));
  }

  render() {
    const { store } = this.context;
    if (this.props.guide && this.props.guide.items.length > 0 && this.props.guideIcons) {
      return (
        <Pullout className="field-guide-pullout" side="right" open={this.state.revealed}>
          <button type="button" className="field-guide-pullout-toggle" onClick={this.toggleFieldGuide}>
            <strong>
              <Translate content="project.fieldGuide" />
            </strong>
          </button>
          <Provider store={store}>
            <Translations original={this.props.guide} type="field_guide">
              <FieldGuide
                items={this.props.guide.items}
                icons={this.props.guideIcons}
                onClickClose={this.toggleFieldGuide}
              />
            </Translations>
          </Provider>
        </Pullout>
      );
    }

    return null;
  }
}

FieldGuideContainer.defaultProps = {
  guide: {
    items: []
  },
  guideIcons: null
};

FieldGuideContainer.propTypes = {
  guide: PropTypes.shape({
    items: PropTypes.array
  }),
  guideIcons: PropTypes.object
};

FieldGuideContainer.contextType = ReactReduxContext;
