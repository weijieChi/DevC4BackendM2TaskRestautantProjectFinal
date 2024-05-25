// https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
const { Op } = require('sequelize');

// database
const db = require('../models');

const { Restaurant } = db;

const restaurantHandler = {};

// 分頁條件
const limit = 6;

restaurantHandler.getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // 取得目前頁數
    const currentPage = parseInt(req.query.page, 10) || 1; // ESlint: Missing radix parameter
    const keyword = req.query.search.trim() ? req.query.search.trim().toLowerCase() : '';// ESlint 要求要使用完整的三元運算子

    // 取得排序條件
    const sortOption = req.query.short;
    let sortConditnon = [];
    switch (sortOption) {
      case 'name_asc':
        sortConditnon = ['name', 'ASC'];
        break;
      case 'name_desc':
        sortConditnon = ['name', 'DESC'];
        break;
      case 'category':
        sortConditnon = ['category', 'ASC'];
        break;
      case 'location':
        sortConditnon = ['location', 'ASC'];
        break;
      default:
        break;
    }

    // 設定搜尋條件
    const searchCondition = keyword ? { // 三元運算子
      [Op.and]: [
        {
          [Op.or]: [
            {
              name: { [Op.iLike]: `%${keyword}%` }, // case insensitive
              category: { [Op.iLike]: `%${keyword}%` },
              location: { [Op.iLike]: `%${keyword}%` },
              phone: { [Op.iLike]: `%${keyword}%` },
              description: { [Op.iLike]: `%${keyword}%` },
            },
          ],
        }, { userId },
      ],
    } : { userId };

    // 從資料庫取得餐廳資料
    const filterRestaurants = await Restaurant.findAll({
      attribuets: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
      where: searchCondition,
      oder: sortConditnon,
      offset: (currentPage - 1) * limit,
      limit,
      raw: true,
    });
    // 計算餐廳資料最大頁數
    let restaurantsCount = 0;

    if (keyword) {
      restaurantsCount = await Restaurant.Count({ where: searchCondition });
    } else {
      restaurantsCount = await Restaurant.Count({ where: userId });
    }
    const maxPage = Math.ceil(restaurantsCount / limit);
    // 若指定頁數超過最大頁數則重新導向
    if (currentPage > maxPage) {
      return res.redirect(`/restaurants?search=${keyword}&sort=${sortOption}&page=${maxPage}`);
      // 回傳結果
    }
    req.filterRestaurants = filterRestaurants;
    req.maxPage = maxPage;
    req.sortOption = sortOption;
    req.currentPage = currentPage;
    req.keyword = keyword;

    next();
  } catch (error) {
    next(error);
  }
};
