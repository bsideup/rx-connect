var pkg = require('./package.json');

module.exports = {
    root: '.',
    title: 'RxConnect Documentation',

    // Enforce use of GitBook v3
    gitbook: '3.1.1',

    // Use the "official" theme
    plugins: ['theme-official@2.1.1', '-sharing', '-fontsettings'],

    variables: {
        version: pkg.version
    }
};
