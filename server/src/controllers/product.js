import Product from '../models/Product.js';

const pick = (b) =>
  Object.fromEntries(
    ['name', 'description', 'price', 'stock', 'category', 'image', 'images']
      .filter((k) => b[k] !== undefined)
      .map((k) => [k, b[k]])
  );
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function list(req, res, next) {
  try {
    const { page = 1, limit = 12, search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
    if (category) filter.category = category;
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('createdBy', 'name'),
      Product.countDocuments(filter),
    ]);
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const product = await Product.create({ ...pick(req.body), createdBy: req.user.id });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

// Update and delete: first confirm the product exists (404), then confirm it belongs to the caller (403).
async function findOwned(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return void res.status(404).json({ message: 'Product not found' });
  if (product.createdBy.toString() !== req.user.id) {
    return void res.status(403).json({ message: 'You can only change your own products' });
  }
  return product;
}

export async function update(req, res, next) {
  try {
    const product = await findOwned(req, res);
    if (!product) return;
    Object.assign(product, pick(req.body));
    await product.save();
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const product = await findOwned(req, res);
    if (!product) return;
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}
