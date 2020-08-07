exports.createPostValidator = (req, res, next) => {
    // Title Validation
    req.check("title", "Write a Title").notEmpty();
    req.check("title", "Title must be between 4 to 150 Characters").isLength({
        min: 4,
        max: 150,
    });

    //Body Validation
    req.check("body", "Write Some Post Content").notEmpty();
    req.check(
        "body",
        "Post Content must be between 4 to 2000 Characters"
    ).isLength({
        min: 4,
        max: 2000,
    });

    // Error Handling
    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json({
            error: errors.map((error) => error.msg)[0],
        });
    }

    next();
};

exports.userSignupValidator = (req, res, next) => {
    // Name Validation
    req.check("name", "Name is Required").notEmpty();
    req.check("name", "Name must be between 4 to 20 Characters").isLength({
        min: 4,
        max: 20,
    });

    //Email Validation
    req.check("email")
        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        .withMessage("Email Must contain @ and .");

    //Password Validation
    req.check("password", "Password should not be Empty").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain atleast 6 Characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    //Error Handling
    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json({
            error: errors.map((error) => error.msg)[0],
        });
    }

    next();
};

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};
