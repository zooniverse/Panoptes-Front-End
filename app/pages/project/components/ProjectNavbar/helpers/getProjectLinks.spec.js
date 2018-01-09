import { expect } from 'chai';
import apiClient from'panoptes-client/lib/api-client';
import getProjectLinks from './getProjectLinks';

const projectOwner = {
  id: '52',
  links: {
    owner: { id: '4' }
  },
  roles: ['owner']
};

const projectCollab = {
  id: '93',
  links: {
    owner: { id: '5' }
  },
  roles: ['collaborator']
};

const projectRoles = [projectOwner, projectCollab];

const projectOwnerUser = { id: '4' };

const projectCollabUser = { id: '5' };

const randomUser = { id: '10' };

const adminUser = { id: '36', admin: true };

const projectWithoutRedirect = {
  id: '2',
  slug: 'zooniverse/find-the-thing'
};

const projectWithRedirect = {
  id: '3',
  redirect: 'https://www.redirected-project.org'
};

const workflow = { id: '35' };

describe('getProjectLinks', function() {
  it('uses the project slug in building the navbar links', function() {
    const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: projectOwnerUser });
    Object.keys(navLinks).forEach((link) => {
      expect(navLinks[link].url.includes(projectWithoutRedirect.slug));
    });
  });

  it('returns about, classify, talk, and collections set of navbar links', function() {
    const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: null });
    expect(Object.keys(navLinks).indexOf('about') > -1).to.be.true;
    expect(Object.keys(navLinks).indexOf('classify') > -1).to.be.true;
    expect(Object.keys(navLinks).indexOf('talk') > -1).to.be.true;
    expect(Object.keys(navLinks).indexOf('collections') > -1).to.be.true;
  });

  describe('without a user', function() {
    it('does not return a recents link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: null });
      expect(Object.keys(navLinks).indexOf('recents') > -1).to.be.false;
    });

    it('does not return a lab link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: null });
      expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.false;
    });

    it('does not return an admin link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: null });
      expect(Object.keys(navLinks).indexOf('admin') > -1).to.be.false;
    });
  });

  describe('with a user', function() {
    it('returns a recents link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: randomUser });
      expect(Object.keys(navLinks).indexOf('recents') > -1).to.be.true;
    });

    it('does not return a lab link if the user is not the project owner or a collaborator', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: randomUser });
      expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.false;
    });

    it('does not return an admin page link if the user is not an admin', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: randomUser });
      expect(Object.keys(navLinks).indexOf('admin') > -1).to.be.false;
    });

    describe('who have a project role', function() {
      it('returns the lab link if the user is the project owner', function() {
        const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: projectOwnerUser });
        expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.true;
      });

      it('returns the lab link if the user is a project collaborator', function() {
        const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: projectCollabUser });
        expect(Object.keys(navLinks).indexOf('lab') > -1).to.be.true;
      });
    });

    describe('who has admin privileges', function() {
      it('returns the admin link if the user is an admin', function() {
        apiClient.params.admin = true; // to get the isAdmin() helper function to return true for this test.
        const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: adminUser });
        expect(Object.keys(navLinks).indexOf('admin') > -1).to.be.true;
      });
    });
  });

  describe('a project with a redirect', function() {
    it('resets the classify link to the redirected project\'s classify page', function() {
      const navLinks = getProjectLinks({ project: projectWithRedirect, projectRoles, workflow, user: randomUser });
      expect(navLinks.classify.url.includes(projectWithRedirect.redirect)).to.be.true;
      expect(navLinks.classify.isExternalLink).to.be.true;
    });

    it('does not return the about link', function() {
      const navLinks = getProjectLinks({ project: projectWithRedirect, projectRoles, workflow, user: randomUser });
      expect(Object.keys(navLinks).indexOf('about') > -1).to.be.false;
    });
  });

  describe('a project without a workflow and without a redirect', function() {
    it('does not return the classify link', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow: null, user: null });
      expect(Object.keys(navLinks).indexOf('classify') > -1).to.be.false;
    });
  });
});
