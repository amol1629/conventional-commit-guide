/**
 * Authentication Configuration
 *
 * This file controls whether login and signup pages are enabled or disabled.
 *
 * To disable login/signup:
 *   - Set ENABLE_LOGIN to false
 *   - Set ENABLE_SIGNUP to false
 *
 * To enable login/signup:
 *   - Set ENABLE_LOGIN to true
 *   - Set ENABLE_SIGNUP to true
 *
 * When disabled:
 *   - Login and signup pages will redirect to home
 *   - Protected routes will allow access without authentication
 *   - Users can access all features without logging in
 */

export const AUTH_CONFIG = {
	/**
	 * Enable or disable the login page and authentication requirement
	 * When false: Login page redirects to home, protected routes allow access
	 * When true: Login page works normally, protected routes require authentication
	 */
	ENABLE_LOGIN: false as boolean,

	/**
	 * Enable or disable the signup page
	 * When false: Signup page redirects to home
	 * When true: Signup page works normally
	 */
	ENABLE_SIGNUP: false as boolean,
}

/**
 * Helper function to check if authentication is required
 */
export const isAuthRequired = (): boolean => {
	return AUTH_CONFIG.ENABLE_LOGIN === true
}

/**
 * Helper function to check if login is enabled
 */
export const isLoginEnabled = (): boolean => {
	return AUTH_CONFIG.ENABLE_LOGIN === true
}

/**
 * Helper function to check if signup is enabled
 */
export const isSignupEnabled = (): boolean => {
	return AUTH_CONFIG.ENABLE_SIGNUP === true
}
