/* Async Hanlder using try catch
const asyncHandler = (fn) => async (req, res) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
*/

// Async Handler using Promises
const asyncHandler = (requestHanlder) => (req, res, next) => {
    Promise.resolve(requestHanlder(req, res, next))
        .catch((err) => next(err))
}

export { asyncHandler }