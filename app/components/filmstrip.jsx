import React from 'react';
import { DISCIPLINES } from './disciplines';

export default class Filmstrip extends React.Component {
  constructor(props) {
    super(props);

    this.scrollLeft = this.scrollLeft.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
  }

  componentDidMount() {
    this.filmstrip.style.height = `${this.strip.clientHeight}px`;
    this.viewport.style.paddingBottom = `${this.viewport.offsetHeight - this.viewport.clientHeight}px`;
  }

  scrollLeft() {
    this.adjustPos(-this.props.increment);
  }

  scrollRight() {
    this.adjustPos(this.props.increment);
  }

  mangleFilterName(filterName) {
    return filterName.replace(/\s+/g, '-');
  }

  selectFilter(filterName) {
    this.props.onChange(filterName);
  }

  calculateClasses(filterName) {
    const mangledFilterName = this.mangleFilterName(filterName);

    const list = ['filmstrip--disciplines__discipline-card'];
    list.push(`filmstrip--disciplines__discipline-card--discipline-${mangledFilterName}`);

    if (this.props.value === filterName) {
      list.push('filmstrip--disciplines__discipline-card--active');
    }
    if (!this.props.value && filterName === 'all') {
      list.push('filmstrip--disciplines__discipline-card--active');
    }
    if (this.props.value === '' && filterName === 'all') {
      list.push('filmstrip--disciplines__discipline-card--active');
    }

    return list.join(' ');
  }

  adjustPos(increment) {
    const oldPos = this.viewport.scrollLeft;
    let newPos = oldPos + increment;

    if (increment < 0) {
      newPos = Math.max(newPos, 0);
    }

    if (increment > 0) {
      newPos = Math.min(newPos, this.strip.clientWidth);
    }

    increment = (newPos - oldPos) / 10;
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
  filterCards: React.PropTypes.arrayOf(React.PropTypes.object),
  increment: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string
};

Filmstrip.defaultProps = {
  filterCards: DISCIPLINES
};
