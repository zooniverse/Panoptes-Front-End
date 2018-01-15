import PropTypes from 'prop-types';
import React from 'react';
import DISCIPLINES from '../constants/disciplines';

export default class Filmstrip extends React.Component {
  constructor() {
    super();
    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
  }

  componentDidMount() {
    this.filmstrip.style.height = `${this.strip.clientHeight}px`;
    this.viewport.style.paddingBottom = `${this.viewport.offsetHeight - this.viewport.clientHeight}px`;
  }

  scrollLeft() {
    this.adjustPosition(-this.props.increment);
  }

  scrollRight() {
    this.adjustPosition(this.props.increment);
  }

  mangleFilterName(filterName) {
    return filterName.replace(/\s+/g, '-');
  }

  selectFilter(filterName) {
    this.props.onChange(filterName);
  }

  calculateClasses(filterName) {
    const mangledFilterName = this.mangleFilterName(filterName);
    const { value } = this.props;

    const list = ['filmstrip--disciplines__discipline-card'];
    list.push(`filmstrip--disciplines__discipline-card--discipline-${mangledFilterName}`);

    if (value === filterName) {
      list.push('filmstrip--disciplines__discipline-card--active');
    }
    if (!value && filterName === 'all') {
      list.push('filmstrip--disciplines__discipline-card--active');
    }

    return list.join(' ');
  }

  adjustPosition(increment) {
    const oldPosition = this.viewport.scrollLeft;
    let newPosition = oldPosition + increment;

    if (increment < 0) {
      newPosition = Math.max(newPosition, 0);
    }

    if (increment > 0) {
      newPosition = Math.min(newPosition, this.strip.clientWidth);
    }

    increment = (newPosition - oldPosition) / 10;
    let i = 0;

    const scroll = () => {
      this.viewport.scrollLeft += increment;
      i += 1;
      if (i < 10) {
        setTimeout(scroll, 20);
      }
    };

    scroll();
  }

  render() {
    return (
      <div className="filmstrip filmstrip--disciplines" ref={(element) => { this.filmstrip = element; }}>
        <button className="filmstrip__nav-btn" onClick={this.scrollLeft} role="presentation" aria-hidden="true" aria-label="Scroll Left"><i className="fa fa-chevron-left" /></button>
        <div className="filmstrip__viewport" ref={(element) => { this.viewport = element; }}>
          <div className="filmstrip__strip" ref={(element) => { this.strip = element; }}>
            <ul>
              <li>
                <button className={this.calculateClasses('all')} onClick={this.selectFilter.bind(this, '')} >
                  <p>All<br />Disciplines</p>
                </button>
              </li>
              {this.props.filterCards.map((filter, i) => {
                const filterName = filter.value.replace(' ', '-');
                return (
                  <li key={i}>
                    <button key={i} className={this.calculateClasses(filter.value)} onClick={this.selectFilter.bind(this, filter.value)} >
                      <span key={i} className={`filmstrip--disciplines__discipline-card__icon filmstrip--disciplines__discipline-card__icon-${filterName}`} />
                      <p>{filter.label}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <button className="filmstrip__nav-btn" onClick={this.scrollRight} role="presentation" aria-hidden="true" aria-label="Scroll Right"><i className="fa fa-chevron-right" /></button>
      </div>
    );
  }

}

Filmstrip.propTypes = {
  filterCards: PropTypes.arrayOf(PropTypes.object),
  increment: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

Filmstrip.defaultProps = {
  filterCards: DISCIPLINES
};