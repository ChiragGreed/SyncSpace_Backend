// Catches requests that don't match any route.
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        success: false
    });
};

// Centralized error handler.
export const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

    res.status(statusCode).json({
        message: statusCode === 500 ? "Something went wrong on the server" : err.message,
        success: false
    });
};
