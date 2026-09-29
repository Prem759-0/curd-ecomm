import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import { idRule, productRules, listRules } from '../validators.js';
import { list, getOne, create, update, remove } from '../controllers/product.js';
import { upload } from '../cloudinary.js';

const router = Router();

// POST /api/products/upload — upload up to 5 images, returns { urls: [...] }
router.post(
  '/upload',
  authenticate,
  upload.array('images', 5),
  (req, res) => {
    const urls = (req.files || []).map((f) => f.path);
    res.json({ urls });
  }
);

router.get('/', listRules, validate, list);
router.get('/:id', idRule, validate, getOne);
router.post('/', authenticate, productRules, validate, create);
router.put('/:id', authenticate, idRule, productRules, validate, update);
router.delete('/:id', authenticate, idRule, validate, remove);

export default router;
