// Karma configuration
// Generated on Fri Apr 29 2022 11:27:55 GMT+0800 (China Standard Time)

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ["mocha", "chai"],

    // list of files / patterns to load in the browser
    files: ["test/*", "test/*.js"],

    plugins: ["karma-*"],
    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      "test/*.js": ["rollup"],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ["progress"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ["Chrome"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,

    rollupPreprocessor: {
      options: {
        /**
         * This is just a normal Rollup config object,
         * except that `input` is handled for you.
         */
        plugins: [require("rollup-plugin-buble")()],
        output: {
          format: "iife", // Helps prevent naming collisions.
          name: "snabbdom", // Required for 'iife' format.
          sourcemap: "inline", // Sensible for testing.
        },
        transformPath: (filePath) => filePath.replace(".spec.js", ".test.js"),
      },
    },
  });
};
