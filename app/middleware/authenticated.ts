export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    return navigateTo("/login");
  }

  const allowedRoles = to.meta.allowedRoles || [];

  if (allowedRoles.length && !allowedRoles.includes(user.value.role)) {
    return navigateTo("/");
  }
});
