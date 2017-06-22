import React, { Component, PropTypes } from 'react';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Title from 'grommet/components/Title';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';

counterpart.registerTranslations('en', {
  adminPage: {
    header: 'Admin',
    nav: {
      createAdmin: 'Manage Users',
      projectStatus: 'Set Project Status',
    },
  },
});

class Admin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box>
        <Title pad={{ vertical: 'small', horizontal: 'none' }}>Admin</Title>
        <Split flex="right">
          <Sidebar size="small" full="false">
            <List>
              <ListItem>
                <IndexLink to="/admin" activeClassName="active">
                  <Translate content="adminPage.nav.createAdmin" />
                </IndexLink>
              </ListItem>
              <ListItem>
                <Link to="/admin/project_status" activeClassName="active">
                  <Translate content="adminPage.nav.projectStatus" />
                </Link>
              </ListItem>
            </List>
          </Sidebar>
          <Box>
            Foobar
            {this.props.children}
          </Box>
        </Split>
      </Box>
    );
  }

}

Admin.propTypes = {
  user: PropTypes.func,
};

export default Admin; 
