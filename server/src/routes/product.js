import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import { idRule, productRules, listRules } from '../validators.js';
import { list, getOne, create, update, remove } from '../controllers/product.js';

const router = Router();

router.get('/', listRules, validate, list);
router.get('/:id', idRule, validate, getOne);
router.post('/', authenticate, productRules, validate, create);
router.put('/:id', authenticate, idRule, productRules, validate, update);
router.delete('/:id', authenticate, idRule, validate, remove);

export default router;
