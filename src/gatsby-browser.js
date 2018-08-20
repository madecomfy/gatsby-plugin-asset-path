import createHistory from "history/createBrowserHistory"

/**
 * Removes prefix from paths once links are clicked on by removing the basename
 * @see {@link https://github.com/gatsbyjs/gatsby/blob/v2.0.0-alpha.20/packages/gatsby/cache-dir/history.js#L10}
 */
export const replaceHistory = () => createHistory()
