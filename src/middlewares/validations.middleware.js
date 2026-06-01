const validateSchema = (schema) => {
    return async (req, res, next) => {
        try {
            const data = await schema.validate(req.body, { abortEarly: false });
            next();
        } catch (err) {
    return res.status(400).json({ errors: err.errors });
}

    }
}

module.exports = {
    validateSchema
}
