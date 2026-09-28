import { body, param, query } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2 to 60 characters'),
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isLength({ max: 72 }).withMessage('Password can be at most 72 characters')
    .matches(/[a-z]/).withMessage('Add at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Add at least one uppercase letter')
    .matches(/\d/).withMessage('Add at least one number'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  body('password').notEmpty().withMessage('Enter your password'),
];

export const idRule = [param('id').isMongoId().withMessage('Product id is not valid')];

// price and stock must arrive as real JSON numbers, not strings
export const productRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description can be at most 500 characters'),
  body('price').custom((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0).withMessage('Price must be a number, 0 or more'),
  body('stock').custom((v) => Number.isInteger(v) && v >= 0).withMessage('Stock must be a whole number, 0 or more'),
  body('category').optional().trim().isLength({ min: 2, max: 40 }).withMessage('Category must be 2 to 40 characters'),
  // either a full http(s) link, or one of the pictures that ship with the app (/products/name.svg)
  body('image')
    .optional({ values: 'falsy' })
    .trim()
    .custom((v) => /^\/products\/[a-z0-9-]+\.(svg|png|jpe?g|webp)$/i.test(v) || /^https?:\/\/\S+$/i.test(v))
    .withMessage('Image must be an http(s) link'),
  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 images allowed'),
  body('images.*')
    .optional()
    .trim()
    .custom((v) => /^\/products\/[a-z0-9-]+\.(svg|png|jpe?g|webp)$/i.test(v) || /^https?:\/\/\S+$/i.test(v))
    .withMessage('Each image must be an http(s) link'),
];

export const listRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be 1 or more').toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50').toInt(),
  query('search').optional().trim().isLength({ max: 60 }).withMessage('search is too long'),
  query('category').optional().trim().isLength({ max: 40 }).withMessage('category is too long'),
];
