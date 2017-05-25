import React from 'react';
import ReactDOM from 'react-dom';
import TriggeredModalForm from 'modal-form/triggered';

const FOCUSABLES = 'a[href], button';

const UP = 38;
const DOWN = 40;

class ExpandableMenu extends React.Component {
  constructor(props) {
    super(props);
    this.navigateMenu = this.navigateMenu.bind(this);
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
    return (
      <TriggeredModalForm
        ref={(button) => { this.menuButton = button; }}
        className={this.props.className}
        trigger={this.props.trigger}
        triggerProps={Object.assign(this.props.triggerProps, { onKeyDown: this.navigateMenu })}
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

ExpandableMenu.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  trigger: React.PropTypes.node,
  triggerProps: React.PropTypes.object
};

ExpandableMenu.defaultProps = {
  triggerProps: {}
};

export default ExpandableMenu;
