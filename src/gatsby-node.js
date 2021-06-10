/* eslint no-console: 0 */

import * as fs from "fs-extra";
import * as path from "path";

/**
 * Removes the .map files
 * @see {@link https://next.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig}
 * @see {@link https://github.com/gatsbyjs/gatsby/blob/v2.0.0-alpha.20/packages/gatsby/src/utils/webpack.config.js#L411}
 * @see {@link https://github.com/gatsbyjs/gatsby/blob/v2.0.0-alpha.20/packages/gatsby/src/utils/webpack.config.js#L240}
 * @param {*} param0
 */
export const onCreateWebpackConfig = (
  { stage, actions },
  { removeMapFiles },
) => {
  if (removeMapFiles === true && stage === "build-javascript") {
    actions.setWebpackConfig({
      devtool: false,
    });
  }
};

/**
 * Moves or copies assets to assets folder
 * @see {@link https://next.gatsbyjs.org/docs/node-apis/#onPostBuild}
 */
export const onPostBuild = async (
  { pathPrefix }, // this is specified by the 'assetPrefix' parameter in gatsby-config (note 'asset' instead of 'path'!)
  {
    additionalPaths = [], // deprecated argument to prevent breaking change
    paths = ["static", "page-data"],
    fileTypes = ["js", "css"],
    copyAssets = true,
  },
) => {
  // this is for deploying to external domains...
  // it writes the files correctly with the domain coded into the generated files,
  // but prevents them from being written into an incorrect folder like `/public/.https:/foobar.netlify.com/assets/`
  if (pathPrefix.indexOf("//") !== -1) {
    // eslint-disable-next-line no-useless-escape
    pathPrefix = pathPrefix.replace(/^.*\/\/[^\/]+/, "");
  }

  const publicFolder = "./public";
  const assetFolder = path.join(publicFolder, `.${pathPrefix}`);

  if (additionalPaths.length) {
    console.warn(
      `gatsby-plugin-asset-path argument 'additionalPaths' is deprecated, use 'paths'`,
    );
  }

  if (pathPrefix === "") {
    console.error(`gatsby-plugin-asset-path requires both:
- 'assetPrefix' set in gatsby-config
- 'gatsby build' to be run with the '--prefix-paths' flag`);
  }

  if (paths.includes("icons")) {
    console.error(
      `gatsby-plugin-asset-path needs to copy 'icons' to work with 'gatsby-plugin-manifest'
do not add 'icons' to paths parameter!`,
    );
  }

  const copy = (fileOrFolder) => {
    const currentPath = path.join(publicFolder, fileOrFolder);
    const newPath = path.join(assetFolder, fileOrFolder);
    try {
      if (fs.existsSync(currentPath)) {
        return fs.copy(currentPath, newPath);
      }
    } catch (err) {
      console.error(err);
      return Promise.resolve();
    }
  };

  const move = (fileOrFolder) => {
    const currentPath = path.join(publicFolder, fileOrFolder);
    const newPath = path.join(assetFolder, fileOrFolder);
    try {
      if (fs.existsSync(currentPath)) {
        return fs.move(currentPath, newPath);
      }
    } catch (err) {
      console.error(err);
      return Promise.resolve();
    }
  };

  const filesExtensions = fileTypes.join("|");
  const filesRegex = RegExp(`.*.(${filesExtensions})$`);
  const filterFilesIn = (folder) =>
    fs.readdirSync(folder).filter((file) => filesRegex.test(file));

  const filesInPublicFolder = filterFilesIn(publicFolder);

  // Some things should always be copied
  await Promise.all(["icons"].map(copy));

  const assets = paths.concat(additionalPaths).concat(filesInPublicFolder);

  const transferMethod = copyAssets ? copy : move;

  await Promise.all(assets.map(transferMethod));
};
