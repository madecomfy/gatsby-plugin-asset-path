const mock = require("mock-fs");
const assert = require("assert");
const fs = require("fs");

const {
  onCreateWebpackConfig, // no need to test this.
  onPostBuild,
} = require("./gatsby-node");

describe("onPostBuild", function () {
  beforeEach(function () {
    mock({
      public: {
        "script.js": "javascript",
        "style.css": "css",
        "image.png": "png",
        static: {
          "one.jpg": "jpeg",
          "two.png": "png",
        },
        resources: {
          "textfile.txt": "text",
        },
      },
    });
  });
  afterEach(mock.restore);

  after(mock.restore); // for nyc to run...

  it("should copy files with path", function (done) {
    onPostBuild({ pathPrefix: "/target/" }, {}).then(function () {
      const files = fs.readdirSync("public/target");
      const static = fs.readdirSync("public/target/static");
      assert.deepEqual(files, ["script.js", "static", "style.css"]);
      assert.deepEqual(static, ["one.jpg", "two.png"]);
      done();
    });
  });

  it("should copy files with domain", function (done) {
    onPostBuild({ pathPrefix: "http://www.domain.com/target/" }, {}).then(
      function () {
        const files = fs.readdirSync("public/target");
        const static = fs.readdirSync("public/target/static");
        assert.deepEqual(files, ["script.js", "static", "style.css"]);
        assert.deepEqual(static, ["one.jpg", "two.png"]);
        done();
      },
    );
  });

  it("should copy specific fileTypes other than static files", function (done) {
    onPostBuild({ pathPrefix: "/assets/" }, { fileTypes: ["css", "png"] }).then(
      function () {
        const files = fs.readdirSync("public/assets");
        const static = fs.readdirSync("public/assets/static");
        assert.deepEqual(files, ["image.png", "static", "style.css"]);
        assert.deepEqual(static, ["one.jpg", "two.png"]);
        done();
      },
    );
  });

  it("should copy specific paths", function (done) {
    onPostBuild({ pathPrefix: "/assets/" }, { paths: ["resources"] }).then(
      function () {
        const files = fs.readdirSync("public/assets");
        const resources = fs.readdirSync("public/assets/resources");
        assert.deepEqual(files, ["resources", "script.js", "style.css"]);
        assert.deepEqual(resources, ["textfile.txt"]);
        done();
      },
    );
  });
});
