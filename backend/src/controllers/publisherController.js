const { validationResult } = require("express-validator");
const prisma = require("../config/prisma");

const getPublishers = async (req, res, next) => {
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

    const [publishers, total] = await Promise.all([
      prisma.publisher.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: { _count: { select: { books: true } } },
      }),
      prisma.publisher.count({ where }),
    ]);

    return res.json({
      success: true,
      data: publishers,
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

const getPublisher = async (req, res, next) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { books: { include: { author: true } } },
    });
    if (!publisher)
      return res
        .status(404)
        .json({ success: false, message: "Publisher not found" });
    return res.json({ success: true, data: publisher });
  } catch (error) {
    next(error);
  }
};

const createPublisher = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { name, address } = req.body;
    const publisher = await prisma.publisher.create({
      data: { name, address },
    });
    return res
      .status(201)
      .json({ success: true, message: "Publisher created", data: publisher });
  } catch (error) {
    next(error);
  }
};

const updatePublisher = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { name, address } = req.body;
    const publisher = await prisma.publisher.update({
      where: { id: parseInt(req.params.id) },
      data: { name, address },
    });
    return res.json({
      success: true,
      message: "Publisher updated",
      data: publisher,
    });
  } catch (error) {
    next(error);
  }
};

const deletePublisher = async (req, res, next) => {
  try {
    await prisma.publisher.delete({ where: { id: parseInt(req.params.id) } });
    return res.json({ success: true, message: "Publisher deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublishers,
  getPublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
};
