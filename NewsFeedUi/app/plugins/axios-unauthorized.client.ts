import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authTokenCookieName = config.public.authTokenCookieName || "auth_token";
  const authTokenCookie = useCookie(authTokenCookieName, { path: "/" });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const route = useRoute();
        if (route.path !== "/login" && route.path !== "/register") {
          authTokenCookie.value = null;
          const userInfoState = useState<unknown>("auth_user_info", () => null);
          userInfoState.value = null;
          navigateTo("/login");
        }
      }
      return Promise.reject(error);
    },
  );
});
