import * as fs from "fs-extra"
import * as path from "path"

/**
 * Removes the .map files
 * @see {@link https://next.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig}
 * @see {@link https://github.com/gatsbyjs/gatsby/blob/v2.0.0-alpha.20/packages/gatsby/src/utils/webpack.config.js#L411}
 * @see {@link https://github.com/gatsbyjs/gatsby/blob/v2.0.0-alpha.20/packages/gatsby/src/utils/webpack.config.js#L240}
 * @param {*} param0
 */
export const onCreateWebpackConfig = ({ stage, actions }, { options }) => {
  if (options.removeMapFiles === true && stage === "build-javascript") {
    actions.setWebpackConfig({
      devtool: false
    })
  }
}

/**
 * Moves all js and css files into timestamp-named folder
 * @see {@link https://next.gatsbyjs.org/docs/node-apis/#onPostBuild}
 */
export const onPostBuild = async ({ pathPrefix }) => {
  const publicFolder = path.resolve(__dirname, "public")
  const assetFolder = path.resolve(publicFolder, `.${pathPrefix}`)

  // Move js and css files
  const files = fs.readdirSync(publicFolder)
  await Promise.all(files.map((file) => {
    if (/.*\.(js|css)$/.test(file)) {
      const currentPath = path.resolve(publicFolder, file)
      const newPath = path.resolve(assetFolder, file)
      return fs.move(currentPath, newPath)
    }
  }))

  // Move data files
  const staticFolder = "static"
  const currentStaticPath = path.resolve(publicFolder, staticFolder)
  const newStaticPath = path.resolve(assetFolder, staticFolder)
  await fs.move(currentStaticPath, newStaticPath)

  // Copy sitemap.xml
  const sitemap = "sitemap.xml"
  const currentSitemapPath = path.resolve(publicFolder, sitemap)
  const newSitemapPath = path.resolve(assetFolder, sitemap)
  await fs.copy(currentSitemapPath, newSitemapPath)
}
