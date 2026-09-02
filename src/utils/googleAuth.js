import { supabase } from "../supabaseClient";
import { ensureWallet, resolveUserRole, upsertProfile } from "../lib/supabaseMarketplace";

export const GOOGLE_ROLE_STORAGE_KEY = "devsoko-google-role";

const getStoredGoogleRole = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(GOOGLE_ROLE_STORAGE_KEY);
};

const getOAuthHashParams = () => {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  return new URLSearchParams(hash);
};

export const getDashboardPath = (role) => {
  if (role === "admin") return "/admin-dashboard";
  if (role === "seller") return "/seller-dashboard";
  if (role === "buyer") return "/buyer-dashboard";
  return "/dashboard";
};

export const getGoogleRedirectUrl = (pathname) => {
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const currentPath = pathname || (typeof window !== "undefined" ? window.location.pathname : "/");
  const normalizedPath = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;

  return `${currentOrigin}${normalizedPath}`;
};

export const hasPendingGoogleAuthCallback = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = getOAuthHashParams();

  return ["code", "error", "error_code", "access_token", "refresh_token"].some(
    (key) => searchParams.has(key) || hashParams.has(key)
  );
};

export const startGoogleOAuth = async ({ redirectPath, role } = {}) => {
  if (role) {
    sessionStorage.setItem(GOOGLE_ROLE_STORAGE_KEY, role);
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getGoogleRedirectUrl(redirectPath),
    },
  });

  if (error) {
    throw error;
  }
};

export const ensureGoogleUserProfile = async ({
  defaultRole = "buyer",
  allowRoleUpdate = false,
} = {}) => {
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    const authCode = searchParams.get("code");

    if (authCode) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);

      if (exchangeError) {
        throw exchangeError;
      }
    }
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) {
    return null;
  }

  const storedRole = getStoredGoogleRole();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const resolvedRole = storedRole || profile?.role || defaultRole;
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "DevSoko User";

  if (!profile) {
    await upsertProfile({
      userId: user.id,
      email: user.email,
      role: resolvedRole,
      fullName,
    });
  } else if (allowRoleUpdate && storedRole && storedRole !== profile.role) {
    await upsertProfile({
      userId: user.id,
      email: user.email,
      role: resolvedRole,
      fullName,
      extra: {
        created_at: profile.created_at || new Date().toISOString(),
      },
    });
  }

  await ensureWallet(user.id);
  const finalRole = await resolveUserRole(user);

  sessionStorage.removeItem(GOOGLE_ROLE_STORAGE_KEY);
  return { user, role: finalRole || resolvedRole };
};