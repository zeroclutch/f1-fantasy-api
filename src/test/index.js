// TODO: Use actual testing library
const authenticatedTest = require('./authenticated')
const unauthenticatedTest = require('./test')

try {
    authenticatedTest()
    unauthenticatedTest()
} catch(error) {
    console.error('Tests failed.')
    console.error(error)
}