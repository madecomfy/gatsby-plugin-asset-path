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
 * Moves all js and css files into timestamp-named folder
 * @see {@link https://next.gatsbyjs.org/docs/node-apis/#onPostBuild}
 */
export const onPostBuild = async ({ pathPrefix }, { additionalPaths = [] }) => {
  const publicFolder = "./public";
  const assetFolder = path.join(publicFolder, `.${pathPrefix}`);

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

  const filterFilesIn = (folder) =>
    fs.readdirSync(folder).filter((file) => /.*\.(js|css)$/.test(file));

  const filesInPublicFolder = filterFilesIn(publicFolder);
  const directories = ["static", "icons", "page-data"];
  const thingsToMove = directories
    .concat(filesInPublicFolder)
    .concat(additionalPaths);

  // Move files and directories
  await Promise.all(thingsToMove.map(move));
};
