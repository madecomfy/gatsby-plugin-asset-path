import React from "react"
import { StaticRouter } from "react-router-dom"

/**
 * That is so that the pathPrefix, which is the timestamp of the build,
 * does not appear on links in the html, by removing the basename of the router
 * @see {@link https://next.gatsbyjs.org/docs/ssr-apis/#replaceStaticRouterComponent}
 * @see {@link https://github.com/gatsbyjs/gatsby/blob/v2.0.0-alpha.20/packages/gatsby/cache-dir/static-entry.js#L114}
 */
export const replaceRenderer = () => {
  return ({ basename, ...props }) => <StaticRouter {...props} />
}
