export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();
  const toast = useToast();

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    toast.add({
      title: "Fehler",
      description: "Sie müssen angemeldet sein, um diesen Inhalt zu sehen!",
      color: "error",
      icon: "i-heroicons-x-mark",
      duration: DURATION,
    });
    return navigateTo(`/kolping/login`);
  }

  const allowedRoles = (to.meta.allowedRoles as string[]) ?? [];

  if (allowedRoles.length && !allowedRoles.includes(user.value!.role)) {
    return navigateTo("/kolping/startpage");
  }
});
