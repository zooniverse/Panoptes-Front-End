import React from 'react';
import classnames from 'classnames';
import AdminOnly from '../components/admin-only';
import SiteNav from './site-nav';
import SiteFooter from './site-footer';

class AppLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  };

  static childContextTypes = {
    setAppHeaderVariant: React.PropTypes.func
  };

  state = {
    siteHeaderDetached: false
  };

  getChildContext() {
    return {
      setAppHeaderVariant: (variant) => {
        this.setState({
          siteHeaderDetached: variant === 'detached'
        });
      }
    };
  }

  render() {
    return (
      <div ref="container" className="app-layout">
        <AdminOnly whenActive={true}>
          <div className="app-layout__admin-indicator" title="Admin mode on!"></div>
        </AdminOnly>

        <header
          ref="header"
          className={classnames('app-layout__header', {
            'app-layout__header--detached': this.state.siteHeaderDetached
          })}
        >
          <SiteNav ref="mainNav" params={this.props.params} />
        </header>

        <div className="app-layout__not-header">
          <div className="app-layout__main">
            {this.props.children}
          </div>

          <footer className="app-layout__footer">
            <SiteFooter />
          </footer>
        </div>
      </div>
    );
  }
}

export default AppLayout;
