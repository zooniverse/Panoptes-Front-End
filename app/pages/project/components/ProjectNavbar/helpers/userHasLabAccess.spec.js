import { expect } from 'chai';
import userHasLabAccess from './userHasLabAccess';

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

describe('userHasLabAccess', function() {
  it('returns false if projectRoles does not have any roles', function() {
    expect(userHasLabAccess({ projectRoles: [], user: projectOwnerUser })).to.be.false;
  });

  it('returns false if user argument does not have links', function() {
    expect(userHasLabAccess({ projectRoles, user: {}})).to.be.false;
  });

  it('returns false if user argument does not have links.owner', function() {
    expect(userHasLabAccess({ projectRoles, user: { links: {}}})).to.be.false;
  });

  it('returns false if user argument does not have links.owner.id', function() {
    expect(userHasLabAccess({ projectRoles, user: { links: { owner: {}}}})).to.be.false;
  });

  it('returns true if the user is the project owner', function() {
    expect(userHasLabAccess({ projectRoles, user: projectOwnerUser })).to.be.true;
  });

  it('returns true if the user is the project collaborator', function() {
    expect(userHasLabAccess({ projectRoles, user: projectCollabUser })).to.be.true;
  });

  it('returns false if the user is not the project owner or collaborator', function() {
    expect(userHasLabAccess({ projectRoles, user: randomUser })).to.be.false;
  });
});
