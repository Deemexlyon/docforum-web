import { useMutation } from '@tanstack/react-query';
import { logout } from '../../../services/auth-service';
import { useAuthStore } from '../../../store/auth-store';

export function useLogout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const csrfToken = useAuthStore((state) => state.csrfToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => (accessToken ? logout(accessToken, csrfToken) : Promise.resolve()),
    // Clear local session regardless of whether the server call succeeds —
    // an unreachable/erroring logout endpoint shouldn't strand the user in
    // a logged-in-looking UI. The refresh cookie is cleared server-side on
    // success; on failure, the CSRF token we drop makes a later boot refresh
    // fail too, so a reload still cannot silently sign the user back in.
    onSettled: () => clearSession(),
  });
}
