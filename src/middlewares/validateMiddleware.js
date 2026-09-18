import { body, query, validationResult } from 'express-validator';

export const TASK_STATUSES = ["toDo", "inProgress", "completed"];
export const TASK_PRIORITIES = ["low", "medium", "high"];
export const PROJECT_STATUSES = ["inProgress", "completed"];
export const INVITATION_STATUSES = ["accepted", "rejected"];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({
        message: "Validation failed",
        success: false,
        errors: errors.array().map(error => error.msg)
    });

    next();
};

const nonEmptyString = (field, message) => body(field)
    .isString().withMessage(message)
    .notEmpty().withMessage(message);

const optionalString = (field, message) => body(field)
    .optional()
    .isString().withMessage(message);

const optionalNonEmptyString = (field, message) => body(field)
    .optional()
    .isString().withMessage(message)
    .notEmpty().withMessage(message);

const optionalEnum = (field, values) => body(field)
    .optional()
    .isIn(values).withMessage(`${field} must be one of: ${values.join(", ")}`);

const optionalArray = (field) => body(field)
    .optional()
    .isArray().withMessage(`${field} must be an array`);

const optionalDate = (field) => body(field)
    .optional()
    .isISO8601({ strict: true }).withMessage(`${field} must be a valid date in YYYY-MM-DD format`);

const passwordValidation = (requireComplexity = false) => {
    const validation = body('password')
        .isString().withMessage('password must be a string')
        .isLength({ min: 6, max: 20 }).withMessage('password must be between 6 and 20 characters')
        .not().matches(/\s/).withMessage('password must not contain whitespace');

    if (requireComplexity) {
        validation
            .matches(/[a-z]/).withMessage('password must contain at least one lowercase letter')
            .matches(/[A-Z]/).withMessage('password must contain at least one uppercase letter')
            .matches(/[0-9]/).withMessage('password must contain at least one number')
            .matches(/[^A-Za-z0-9]/).withMessage('password must contain at least one special character');
    }

    return validation;
};

const rejectEmptyBody = body().custom((value) => {
    if (!value || Object.keys(value).length === 0) {
        throw new Error("request body cannot be empty");
    }

    return true;
});

// ----- Auth -----

export const validateRegister = [
    nonEmptyString('fullName', 'fullName is required and must be a non-empty string'),
    nonEmptyString('email', 'email is required and must be a non-empty string'),
    body('email').isEmail().withMessage('email must be a valid email address'),
    body("role").trim().notEmpty().withMessage("Role is required"),
    passwordValidation(true),
    handleValidationErrors
];

export const validateLogin = [
    nonEmptyString('email', 'email is required and must be a non-empty string'),
    body('email').isEmail().withMessage('email must be a valid email address'),
    passwordValidation(),
    handleValidationErrors
];

// ----- Projects -----

export const validateCreateProject = [
    nonEmptyString('title', 'title is required and must be a non-empty string'),
    optionalString('description', 'description must be a string'),
    optionalEnum('status', PROJECT_STATUSES),
    optionalArray('members'),
    optionalNonEmptyString('dueDate', 'dueDate must be a non-empty string'),
    handleValidationErrors
];

export const validateUpdateProject = [
    rejectEmptyBody,
    optionalNonEmptyString('title', 'title must be a non-empty string'),
    optionalString('description', 'description must be a string'),
    optionalEnum('status', PROJECT_STATUSES),
    optionalArray('members'),
    optionalDate('dueDate'),
    handleValidationErrors
];

export const validateProjectStatus = [
    nonEmptyString('status','status is required and must be a non-empty string'),
    body('status').isIn(PROJECT_STATUSES).withMessage(`status must be one of: ${PROJECT_STATUSES.join(", ")}`),
    handleValidationErrors
];

// ----- Tasks -----

export const validateCreateTask = [
    nonEmptyString('title', 'title is required and must be a non-empty string'),
    optionalString('description', 'description must be a string'),
    optionalEnum('status', TASK_STATUSES),
    optionalEnum('priority', TASK_PRIORITIES),
    optionalNonEmptyString('projectId', 'projectId must be a non-empty string'),
    handleValidationErrors
];

export const validateUpdateTask = [
    rejectEmptyBody,
    optionalNonEmptyString('title', 'title must be a non-empty string'),
    optionalString('description', 'description must be a string'),
    optionalEnum('status', TASK_STATUSES),
    optionalEnum('priority', TASK_PRIORITIES),
    optionalNonEmptyString('projectId', 'projectId must be a non-empty string'),
    handleValidationErrors
];

export const validateTaskStatus = [
    nonEmptyString('status', 'status is required and must be a non-empty string'),
    optionalEnum('status', TASK_STATUSES),
    handleValidationErrors
];


export const validateCreateInvitations = [
    nonEmptyString("projectId", "projectId is required and must be a non-empty string"),
    body("receiversId").isArray({ min: 1 }).withMessage("userIds is required and must be a non-empty array"),
    body("receiversId.*").isString().withMessage("userIds must only contain strings").notEmpty().withMessage("userIds must only contain non-empty strings"),
    handleValidationErrors
];


export const validateInvitationStatus = [
    nonEmptyString("status", "status is required and must be a non-empty string"),
    body("status").isIn(INVITATION_STATUSES).withMessage(`status must be one of: ${INVITATION_STATUSES.join(", ")}`),
    handleValidationErrors
];

export const validateSearchUsers = [
    query("search").optional().isString().withMessage("search must be a string"),
    handleValidationErrors
];