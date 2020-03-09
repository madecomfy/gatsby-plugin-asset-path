# gatsby-plugin-asset-path

Move all of your JS and CSS build files, as well as the static folder into a subdirectory of your choice.

## Breaking change in v1

Use `assetPrefix` instead of `pathPrefix`

## Breaking change in v2

- A sitemap is no longer required
- A webmanifest is no longer required

The above two files were hard coded into this plugin in earlier versions. If you still want to move these files to the assets folder, use the new `paths` option, see below for more information on the option. To get the same behavior as v1, use the following options:

```javascript
options: {
  paths: ["manifest.webmanifest", "sitemap.xml"],
},
```

Also note that `sitemap.xml` and the `page-data` folder were copied to assets folder before, now they are moved just as all other files this plugin handles.

## Our use case

Gatsby by default will generate all of the assets and put them directly at the root level:

```
public
│   index.html
│   component1.js
|   component1.js.map
|   component1.css
|   component2.js
|   compoennt2.js.map
|   component3.css
└───path1
│   │   index.html
│   │   other1.html
│───path2
│   │   index.html
│   │   other2.html
|___static
|   |   data.json
|   |   image.jpg
```

However here at MadeComfy, we host our site on AWS Cloudfront/S3. One issue that we faced was that somehow, two different builds would have some JS/CSS files with the same file names even though their content are different.

That means during deployment on S3 and object invalidation on Cloudfront, someone that is currently browsing the site, would see the experience broken whilst moving onto other pages as the loaded JS would still have asset references of the previous build.

Hence our need to make sure that each build is kept intact on Cloudfront, except the HTML that are loaded on the browser at each hard reload. That way we make sure that our site has no down time at any point of time. We've configured our caching configs this way.

Using this plugin, our file struture is now as followed:

```
public
│   index.html
|___assets
|   |___1534761288
│   |   |   component1.js
│   |   |   component1.js.map
│   |   |   component1.css
│   |   |   component2.js
│   |   |   compoennt2.js.map
│   |   |   component3.css
│   |   |___static
│   |   |   |   data.json
│   |   |   |   image.jpg
└───path1
│   │   index.html
│   │   other1.html
│───path2
│   │   index.html
│   │   other2.html
```

Our new `assets` folder would contain assets of every build once on S3.

## Install

```
npm install --save-dev gatsby-plugin-asset-path
```

```
yarn install -D gatsby-plugin-asset-path
```

## How to use

```javascript
// Your gatsby-config.js
{
    assetPrefix: "custom_asset_folder",
    plugins: [
        {
            resolve: "gatsby-plugin-asset-path"
        }
    ]
}
```

In our use case above, we have `assetPrefix` set as followed:

```javascript
{
  assetPrefix: `/assets/${Date.now().toString()}`,
}
```

## Options

### removeMapFiles

Default: false

Stops Webpack from generating the .js.map files

```javascript
// Your gatsby-config.js
{
  plugins: [
    {
      resolve: "gatsby-plugin-asset-path",
      options: {
        removeMapFiles: true,
      },
    },
  ];
}
```

### paths

Default: `["static", "icons", "page-data"]`

The paths of files/folders to be moved to the asset directory.

```javascript
// Your gatsby-config.js
{
  plugins: [
    {
      resolve: "gatsby-plugin-asset-path",
      options: {
        paths: ["static"],
      },
    },
  ];
}
```

### fileTypes

Default: `["js", "css"]`

The types of files in the root `publicFolder` to be moved to the asset directory.

```javascript
// Your gatsby-config.js
{
  plugins: [
    {
      resolve: "gatsby-plugin-asset-path",
      options: {
        fileTypes: ["js", "map", "css"],
      },
    },
  ];
}
```
