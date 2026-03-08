export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  userId: number;
}

export type AuthUserInfo = {
  name: string;
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const cookieOptions = {
  maxAge: COOKIE_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const USER_INFO_KEY = "auth_user_info";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const authApiUrl = config.public.authApiBaseUrl;
  const authTokenCookieName = config.public.authTokenCookieName || "auth_token";

  const authTokenCookie = useCookie<string | null>(authTokenCookieName, cookieOptions);
  const userInfo = useState<AuthUserInfo | null>(USER_INFO_KEY, () => null);

  const loadUserInfo = async (): Promise<AuthUserInfo | null> => {
    const token = authTokenCookie.value;
    if (!token) {
      userInfo.value = null;
      return null;
    }

    try {
      const info = await $fetch<AuthUserInfo>(`${authApiUrl}/auth/info`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      userInfo.value = info;
      return info;
    } catch {
      userInfo.value = null;
      return null;
    }
  };

  const login = async (name: string, password: string): Promise<AuthUserInfo | undefined> => {
    const token = await $fetch<string>(`${authApiUrl}/auth/login`, {
      method: "POST",
      body: {
        username: name,
        password,
      },
    });

    if (token == null) return undefined;

    authTokenCookie.value = token;
    const info = await loadUserInfo();
    return info ?? undefined;
  };

  const register = async (name: string, email: string, password: string): Promise<AuthUserInfo> => {
    const token = await $fetch<string>(`${authApiUrl}/auth/register`, {
      method: "POST",
      body: {
        name,
        email,
        password,
      },
    });

    authTokenCookie.value = token;
    const info = await loadUserInfo();
    return info ?? { name };
  };

  const logout = () => {
    authTokenCookie.value = null;
    userInfo.value = null;
    navigateTo("/");
  };

  const isAuthenticated = computed(() => !!authTokenCookie.value);
  const userName = computed(() => userInfo.value?.name ?? undefined);
  const token = computed(() => authTokenCookie.value ?? "");

  return {
    userName,
    userInfo,
    isAuthenticated,
    token,
    login,
    register,
    logout,
    loadUserInfo,
  };
};
