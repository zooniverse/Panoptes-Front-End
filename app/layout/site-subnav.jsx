import React from 'react';
import ReactDOM from 'react-dom';
import TriggeredModalForm from 'modal-form/triggered';

const FOCUSABLES = 'a[href], button';

const UP = 38;
const DOWN = 40;

class SiteSubnav extends React.Component {
  constructor(props) {
    super(props);
    this.navigateMenu = this.navigateMenu.bind(this);
  }

  trigger() {
    return (
      <span
        className="site-nav__link"
        activeClassName="site-nav__link--active"
        title="News"
        aria-label="News"
      >
        News
      </span>
    );
  }

  navigateMenu(event) {
    const focusables = [ReactDOM.findDOMNode(this.menuButton)];
    if (this.menu) {
      const menuItems = this.menu.querySelectorAll(FOCUSABLES);
      Array.prototype.forEach.call(menuItems, (item) => {
        focusables.push(item);
      });
    }
    const focusIndex = focusables.indexOf(document.activeElement);

    const newIndex = {
      [UP]: Math.max(0, focusIndex - 1),
      [DOWN]: Math.min(focusables.length - 1, focusIndex + 1)
    }[event.which];

    if (focusables[newIndex] !== undefined) {
      focusables[newIndex].focus();
      event.preventDefault();
    }
  }

  render() {
    if (this.props.isMobile) {
      return this.props.children;
    } else {
      return (
        <TriggeredModalForm
          ref={(button) => { this.menuButton = button; }}
          className="site-nav__modal"
          trigger={this.trigger()}
          triggerProps={{
            onKeyDown: this.navigateMenu
          }}
        >
          <div
            ref={(menu) => { this.menu = menu; }}
            onKeyDown={this.navigateMenu}
          >
            {this.props.children}
          </div>
        </TriggeredModalForm>
      );
    }
  }
}

SiteSubnav.propTypes = {
  isMobile: React.PropTypes.bool,
  children: React.PropTypes.node
};

export default SiteSubnav;
