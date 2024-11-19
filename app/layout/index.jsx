import React from 'react';
import AdminOnly from '../components/admin-only';
import SiteNav from './site-nav';
import SiteFooter from './site-footer';

export default function AppLayout(props) {
  return (
    <div className="app-layout">
      <AdminOnly whenActive={true}>
        <div className="app-layout__admin-indicator" title="Admin mode on!" />
      </AdminOnly>

      <header className='app-layout__header'>
        <SiteNav params={props.params} />
      </header>

      <div className="app-layout__not-header">
        <div className="app-layout__main">
          {props.children}
        </div>

        <footer className="app-layout__footer">
          <SiteFooter />
        </footer>
      </div>
    </div>
  );
}
