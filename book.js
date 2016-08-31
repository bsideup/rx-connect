var pkg = require('./package.json');

module.exports = {
    root: "./docs",

    title: 'RxConnect Documentation',

    gitbook: '3.1.1',

    plugins: ['theme-official', 'codepen', 'regexplace'],

    pluginsConfig: {
        regexplace: {
            substitutes: [
                { pattern: "<!--remove-->", flags: "g", substitute: '<div style="display: none;">' },
                { pattern: "<!--endremove-->", flags: "g", substitute: "</div>" },
            ]
        }
    },

    variables: {
        version: pkg.version
    }
};
