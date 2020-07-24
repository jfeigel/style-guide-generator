import { createContext, useContext } from 'react';

export const AuthContext = createContext();

/**
 * AuthContext
 *
 * @exports
 * @returns {React.Context} Current context for Auth
 */
export function useAuth() {
  return useContext(AuthContext);
}
