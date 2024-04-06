const asyncHandler = (fn) => {
    // The asyncHandler function takes a function 'fn' as a parameter.
    return (req, res, next) => {
        // It returns another function that takes 'req', 'res', and 'next' as parameters.
        
        // The 'Promise.resolve' function is used to wrap the result of calling 'fn(req, res, next)'
        Promise.resolve(fn(req, res, next))
            // If the promise resolves successfully, it proceeds to the next middleware or route handler.
            .catch(next);
            // If an error occurs during the execution of 'fn', the error is caught and passed to the 'next' function.
    };
};

export default asyncHandler;