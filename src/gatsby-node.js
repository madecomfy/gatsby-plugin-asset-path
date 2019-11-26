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
export const onPostBuild = async ({ pathPrefix }, { additionalFiles = [] }) => {
  const publicFolder = "./public";
  const assetFolder = path.join(publicFolder, `.${pathPrefix}`);

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

  // Move css,js and webmanifest files
  const files = fs.readdirSync(publicFolder);
  await Promise.all(
    files.map((file) => {
      if (/.*\.(js|css|webmanifest)$/.test(file)) {
        return move(file);
      }
    }),
  );

  await Promise.all(additionalFiles.map((file) => move(file)));

  // Move statics data and icons
  await Promise.all(["static", "icons"].map(move));

  // Copy page data and sitemap
  await Promise.all(["page-data", "sitemap.xml"].map(copy));
};
