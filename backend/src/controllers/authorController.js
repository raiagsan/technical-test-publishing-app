const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");

const getAuthors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: { _count: { select: { books: true } } },
      }),
      prisma.author.count({ where }),
    ]);

    return res.json({
      success: true,
      data: authors,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAuthor = async (req, res, next) => {
  try {
    const author = await prisma.author.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { books: { include: { publisher: true } } },
    });

    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    return res.json({ success: true, data: author });
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, bio } = req.body;
    const author = await prisma.author.create({ data: { name, bio } });

    return res
      .status(201)
      .json({ success: true, message: "Author created", data: author });
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, bio } = req.body;
    const author = await prisma.author.update({
      where: { id: parseInt(req.params.id) },
      data: { name, bio },
    });

    return res.json({ success: true, message: "Author updated", data: author });
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    await prisma.author.delete({ where: { id: parseInt(req.params.id) } });
    return res.json({ success: true, message: "Author deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
