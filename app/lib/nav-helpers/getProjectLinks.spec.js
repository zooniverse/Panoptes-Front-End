import { expect } from 'chai';
import apiClient from 'panoptes-client/lib/api-client';
import getProjectLinks from './getProjectLinks';
import {
  adminUser,
  projectOwnerUser,
  projectCollabUser,
  projectRoles,
  projectWithRedirect,
  projectWithoutRedirect,
  randomUser
} from '../../../test';


describe('getProjectLinks', function() {
  it('should use the project slug in building the navbar links', function() {
    const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: projectOwnerUser });
    Object.keys(navLinks).forEach((link) => {
      expect(navLinks[link].url.includes(projectWithoutRedirect.slug));
    });
  });

  it('should return about, classify, talk, and collections set of navbar links', function() {
    const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: null });
    expect(Object.keys(navLinks).indexOf('about') > -1).to.be.true;
    expect(Object.keys(navLinks).indexOf('classify') > -1).to.be.true;
    expect(Object.keys(navLinks).indexOf('talk') > -1).to.be.true;
    expect(Object.keys(navLinks).indexOf('collections') > -1).to.be.true;
  });

  describe('without a user', function() {
    it('should not return a recents link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: null });
      expect(Object.keys(navLinks).indexOf('recents') > -1).to.be.false;
    });

    it('should not return a lab link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: null });
      expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.false;
    });

    it('should not return an admin link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: null });
      expect(Object.keys(navLinks).indexOf('admin') > -1).to.be.false;
    });
  });

  describe('with a user', function() {
    it('should return a recents link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: randomUser });
      expect(Object.keys(navLinks).indexOf('recents') > -1).to.be.true;
    });

    it('should not return a lab link if the user is not the project owner or a collaborator', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: randomUser });
      expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.false;
    });

    it('should not return an admin page link if the user is not an admin', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: randomUser });
      expect(Object.keys(navLinks).indexOf('admin') > -1).to.be.false;
    });

    describe('who have a project role', function() {
      it('should return the lab link if the user is the project owner', function() {
        const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: projectOwnerUser });
        expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.true;
      });

      it('should return the lab link if the user is a project collaborator', function() {
        const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: projectCollabUser });
        expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.true;
      });
    });

    describe('who has admin privileges', function() {
      before(function() {
        apiClient.params.admin = true; // to get the isAdmin() helper function to return true for this test.
      });

      after(function() {
        apiClient.params.admin = false;
      });

      it('should return the admin link if the user is an admin', function() {
        const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: adminUser });
        expect(Object.keys(navLinks).indexOf('admin') > -1).to.be.true;
      });
    });
  });

  describe('a project with a redirect', function() {
    it('should reset the classify link to the redirected project\'s classify page', function() {
      const navLinks = getProjectLinks({ project: projectWithRedirect, projectRoles, user: randomUser });
      expect(navLinks.classify.url.includes(projectWithRedirect.redirect)).to.be.true;
      expect(navLinks.classify.isExternalLink).to.be.true;
    });

    it('should not return the about link', function() {
      const navLinks = getProjectLinks({ project: projectWithRedirect, projectRoles, user: randomUser });
      expect(Object.keys(navLinks).indexOf('about') > -1).to.be.false;
    });
  });

  describe('a project with active workflows', function() {
    it('should not disable the classify link', function() {
      const project = Object.assign({}, projectWithoutRedirect);
      project.links.active_workflows = ['1', '2'];
      const navLinks = getProjectLinks({ project, projectRoles, user: null });
      expect(navLinks.classify).not.to.have.property('disabled');
    });
  });

  describe('a project without a workflow', function() {
    it('should return the classify link with disabled: true', function() {
      const project = Object.assign({}, projectWithoutRedirect);
      project.links.active_workflows = [];
      const navLinks = getProjectLinks({ project, projectRoles, user: null });
      expect(navLinks.classify.disabled).to.be.true;
    });
  });
});
