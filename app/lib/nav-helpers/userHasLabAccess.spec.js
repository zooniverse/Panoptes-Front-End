import { expect } from 'chai';
import userHasLabAccess from './userHasLabAccess';
import {
  projectOwnerUser,
  projectCollabUser,
  projectRoles,
  randomUser
} from '../../../test';

describe('userHasLabAccess', () => {
  it('returns false if projectRoles does not have any roles', () => {
    expect(userHasLabAccess({ projectRoles: [], user: projectOwnerUser })).to.be.false;
  });

  it('returns false if user argument does not have links', () => {
    expect(userHasLabAccess({ projectRoles, user: {}})).to.be.false;
  });

  it('returns false if user argument does not have links.owner', () => {
    expect(userHasLabAccess({ projectRoles, user: { links: {}}})).to.be.false;
  });

  it('returns false if user argument does not have links.owner.id', () => {
    expect(userHasLabAccess({ projectRoles, user: { links: { owner: {}}}})).to.be.false;
  });

  it('returns true if the user is the project owner', () => {
    expect(userHasLabAccess({ projectRoles, user: projectOwnerUser })).to.be.true;
  });

  it('returns true if the user is the project collaborator', () => {
    expect(userHasLabAccess({ projectRoles, user: projectCollabUser })).to.be.true;
  });

  it('returns false if the user is not the project owner or collaborator', () => {
    expect(userHasLabAccess({ projectRoles, user: randomUser })).to.be.false;
  });
});
