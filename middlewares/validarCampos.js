import { validationResult } from 'express-validator';

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: 'Errores de validación', errores: errors.array() });
    }
    next();
};

export default validarCampos;
