import React, { Component, PropTypes } from 'react';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';

counterpart.registerTranslations('en', {
  adminPage: {
    title: 'Admin',
    nav: {
      manageUsers: 'Manage Users',
      projectStatus: 'Set Project Status',
    },
  },
});

class Admin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this)
    return (
      <div>
        <Translate 
          content="adminPage.title"
          component={Heading}
          pad={{ vertical: 'small', horizontal: 'none' }}
        />
        <Split flex="right">
          <Sidebar size="small" full="false">
            <List>
              <ListItem>
                <Translate 
                  component={IndexLink} 
                  content="adminPage.nav.manageUsers" 
                  to="/admin" 
                  activeClassName="active"
                />
              </ListItem>
              <ListItem>
                <Translate 
                  component={Link}
                  content="adminPage.nav.projectStatus" 
                  to="/admin/project_status" 
                  activeClassName="active"
                />
              </ListItem>
            </List>
          </Sidebar>
          <Box>
            {this.props.children}
          </Box>
        </Split>
      </div>
    );
  }

}

Admin.propTypes = {
  user: PropTypes.func,
};

export default Admin; 
