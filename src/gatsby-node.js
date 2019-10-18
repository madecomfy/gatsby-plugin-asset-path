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
export const onPostBuild = async (
  { pathPrefix },
  {
    additionalPaths = [], // depricated argument to prevent breaking change
    paths = ["static", "icons", "page-data"],
    fileTypes = ["js", "css"],
  },
) => {
  const publicFolder = "./public";
  const assetFolder = path.join(publicFolder, `.${pathPrefix}`);

  const move = (fileOrFolder) => {
    const currentPath = path.join(publicFolder, fileOrFolder);
    const newPath = path.join(assetFolder, fileOrFolder);
    return fs.move(currentPath, newPath);
  };

  const filesExtensions = fileTypes.join("|");
  const filesRegex = RegExp(`.*.(${filesExtensions})$`);
  const filterFilesIn = (folder) =>
    fs.readdirSync(folder).filter((file) => filesRegex.test(file));

  const filesInPublicFolder = filterFilesIn(publicFolder);
  const thingsToMove = paths
    .concat(additionalPaths)
    .concat(filesInPublicFolder);

  // Move files and directories
  await Promise.all(thingsToMove.map(move));
};
