export const hasPermission = (role : string, permissions : string, ROLE_PERMISSIONS : string[]) => {
  return ROLE_PERMISSIONS[role]?.includes(permissions);
}