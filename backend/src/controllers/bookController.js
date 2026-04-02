const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");

const getBooks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      authorId,
      publisherId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      AND: [
        search ? { title: { contains: search, mode: "insensitive" } } : {},
        authorId ? { authorId: parseInt(authorId) } : {},
        publisherId ? { publisherId: parseInt(publisherId) } : {},
      ],
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: { author: true, publisher: true },
      }),
      prisma.book.count({ where }),
    ]);

    return res.json({
      success: true,
      data: books,
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

const getBook = async (req, res, next) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { author: true, publisher: true },
    });
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    return res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { title, isbn, year, authorId, publisherId } = req.body;

    // Verify author & publisher exist
    const [author, publisher] = await Promise.all([
      prisma.author.findUnique({ where: { id: parseInt(authorId) } }),
      prisma.publisher.findUnique({ where: { id: parseInt(publisherId) } }),
    ]);
    if (!author)
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    if (!publisher)
      return res
        .status(404)
        .json({ success: false, message: "Publisher not found" });

    const book = await prisma.book.create({
      data: {
        title,
        isbn,
        year: year ? parseInt(year) : null,
        authorId: parseInt(authorId),
        publisherId: parseInt(publisherId),
      },
      include: { author: true, publisher: true },
    });
    return res
      .status(201)
      .json({ success: true, message: "Book created", data: book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { title, isbn, year, authorId, publisherId } = req.body;
    const book = await prisma.book.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        isbn,
        year: year ? parseInt(year) : null,
        authorId: authorId ? parseInt(authorId) : undefined,
        publisherId: publisherId ? parseInt(publisherId) : undefined,
      },
      include: { author: true, publisher: true },
    });
    return res.json({ success: true, message: "Book updated", data: book });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await prisma.book.delete({ where: { id: parseInt(req.params.id) } });
    return res.json({ success: true, message: "Book deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
