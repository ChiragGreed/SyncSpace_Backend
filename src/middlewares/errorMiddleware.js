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

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];

        return res.status(400).json({
            message: `${field || "Field"} already exists`,
            success: false
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed",
            success: false,
            errors: Object.values(err.errors).map(error => error.message)
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            message: `Invalid ${err.path || "ID"}`,
            success: false
        });
    }

    // Unknown/unexpected error
    return res.status(500).json({
        message: "Something went wrong on server",
        success: false
    });
};
