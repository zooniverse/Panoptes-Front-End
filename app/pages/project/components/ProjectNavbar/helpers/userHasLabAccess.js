function userHasLabAccess({ projectRoles, user }) {
  return projectRoles.some((role) => {
    if (role.links.owner.id === user.id) {
      return role.roles.includes('owner') ||
        role.roles.includes('collaborator');
    }
    return false;
  });
}

export default userHasLabAccess;
