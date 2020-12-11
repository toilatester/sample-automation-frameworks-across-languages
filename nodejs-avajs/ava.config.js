export default ({ projectDir }) => {
    // Patterns of test file paths
    return {
        files: [
            'testsuites/login/*.js',
            // !'cypress/integration',
            // 'testsuites/feedbacks/*.js',
            // 'cypress/integration/hackathon/*.js',
        ],
        // Patterns of file monitored in watch mode
        sources: [
            '*.js',
        ],
        match: [
            '*',
        ],
        cache: false,
        concurrency: 2, // Maximum concurrent test files to be run
        failFast: false,
        failWithoutAssertions: false,
        tap: false,
        verbose: true,
        compileEnhancements: false,
        require: [
            // "@babel/register"
        ],
        babel: {
            // "extensions": ["jsx"],
            // "testOptions": {
            //     "babelrc": false
            // }
        },
        watch: false,
    }
}
