// 因為是作業，不是正式對外的網站，所以就不做過多的資料驗證

// https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
const sequelize = require('sequelize');
const { Op } = require('sequelize');

// JSON schema 用於後端驗證 json 轉成的 object 格式是否符合規格
const jsonschema = require('jsonschema');

const jsonValidator = new jsonschema.Validator();
const restaurantSchena = {
  title: '餐廳基本資料',
  description: '用於驗證要傳入資料庫 javascript object 資料結構是否符合規範',
  type: 'objct',
  properties: {
    name: {
      description: 'restaurant name',
      type: 'string',
      minLength: 1, // 用於驗證是否為空字串
    },
    category: {
      type: 'string',
      minLength: 1,
    },
    image: {
      type: 'string',
      minLength: 1,
    },
    location: {
      type: 'string',
      minLength: 1,
    },
    google_map: {
      type: 'string',
      minLength: 1,
    },
    description: {
      type: 'string',
      minLength: 1,
    },
  },
  require: ['name', 'category', 'image', 'location', 'google_map', 'description'],
};

// database
const db = require('../models');

const { Restaurant } = db;

const restaurantHandler = {};

// 分頁條件
const limit = 6;

restaurantHandler.getAll = async (req, res, next) => {
  try {
    // ESlint 要求要使用完整的三元運算子
    // trim() 無法處理空值，所以要另外拉出來處理
    const preKeyword = req.query.keyword ? req.query.keyword.trim() : ''; // 處理只輸入空白字元
    const keyword = preKeyword.toLowerCase() || ''; // ESlint: no-unneeded-ternary

    // 取得排序條件
    const sortOption = req.query.sort;
    let sortCondition = [];
    switch (sortOption) {
      case 'name_asc':
        sortCondition = [['name', 'ASC']];
        break;
      case 'name_desc':
        sortCondition = [['name', 'DESC']];
        break;
      case 'category':
        sortCondition = 'category';
        break;
      case 'location':
        sortCondition = 'location';
        break;
      default:
        break;
    }

    // 取得目前頁數
    const currentPage = parseInt(req.query.page, 10) || 1; // ESlint: Missing radix parameter

    // 設定搜尋條件
    const userId = req.user.id;
    const searchCondition = keyword ? { // 三元運算子
      [Op.and]: [
        {
          [Op.or]: [
            // PostgreSQL 才能使用 iLike case insensitive 查詢， MySQL 要另外使用 lower case 處理
            // https://stackoverflow.com/questions/56976245/query-case-insensitive-with-sequelize-in-node-using-mariadb-database
            sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), { [Op.like]: `%${keyword}%` }), // case insensitive
            sequelize.where(sequelize.fn('LOWER', sequelize.col('category')), { [Op.like]: `%${keyword}%` }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('location')), { [Op.like]: `%${keyword}%` }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('phone')), { [Op.like]: `%${keyword}%` }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), { [Op.like]: `%${keyword}%` }),
            // { name: { [Op.like]: `%${keyword}%` } }, // 原本的寫法
          ],
        }, { userId },
      ],
    } : { userId }; // 三元運算子 若無 keyword，條件只限制使用者id

    // 從資料庫取得餐廳資料
    const filterRestaurants = await Restaurant.findAll({
      attribuets: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
      where: searchCondition,
      order: sortCondition,
      offset: (currentPage - 1) * limit,
      limit,
      raw: true,
    });
    // 計算餐廳資料最大頁數
    let restaurantsCount = 0;

    if (keyword) {
      restaurantsCount = await Restaurant.count({ where: searchCondition });
    } else {
      restaurantsCount = await Restaurant.count({ where: userId });
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

restaurantHandler.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const restaurant = await Restaurant.findByPk(id, {
      attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description', 'userId'],
      raw: true,
    });
    // 找不到資餐廳資料時候的處理
    if (restaurant === null) {
      const error = { errorMessage: '查詢不到該筆餐廳資料' };
      next(error);
      return;
    }
    // 權限不符合時候的處理
    if (req.user.id !== userId) {
      const error = { errorMessage: '該操作的使用者權限不符合' };
      next(error);
      return;
    }
    req.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
};

restaurantHandler.getEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const restaurant = await Restaurant.findByPk(id, {
      attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description', 'userId'],
      raw: true,
    });
    // 找不到資餐廳資料時候的處理
    if (restaurant === null) {
      const error = { errorMessage: '查詢不到該筆餐廳資料' };
      next(error);
      return;
    }
    // 權限不符合時候的處理
    if (req.user.id !== userId) {
      const error = { errorMessage: '該操作的使用者權限不符合' };
      next(error);
      return;
    }
    req.restaurant = restaurant;
    next();
  } catch (error) {
    next(error);
  }
};

restaurantHandler.create = async (req, res, next) => {
  try {
    const restaurant = req.body;
    restaurant.userId = req.user.id;
    console.log('userId:', restaurant.userId);

    const result = jsonValidator.validate(restaurant, restaurantSchena);
    if (!result.valid) {
      const error = { errorMessage: 'The JSON data schema or value is does not match rule.' };
      next(error);
      return; // 防止進入資料庫 insert 程序
    }
    console.log(restaurant);
    await Restaurant.create(restaurant);
    req.flash('success', '新增成功');
    return res.redirect('/restaurants');
  } catch (error) {
    const err = error;
    err.errorMessage = '新增失敗！';
    next(err);
  }
};
restaurantHandler.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const edit = req.body;

    // 取得資料並驗證使用者
    const restaurant = await Restaurant.findByPk(id, {
      where: id,
      attribuets: ['id', 'userId'],
      raw: true,
    });
    if (!restaurant) {
      req.flash('error', '找不到資料');
      return res.redirect('/restaurants');
    }

    if (userId !== restaurant.userId) {
      req.flash('error', '無權限編輯此資料');
      return res.redirect('/restaurants');
    }

    await Restaurant.update(edit, {
      where: { id },
    });
    req.flash('success', '更新成功');
    return res.redirect('/restaurants');
  } catch (error) {
    const err = error;
    err.errorMessage = '更新失敗！';
    next(err);
  }
};

restaurantHandler.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    // 先取得資料並驗證資料使用者
    const restaurant = await Restaurant.findByPk(id, {
      attributes: ['id', 'userId'],
      raw: true,
    });
    if (!restaurant) {
      req.flash('error', '找不到資料');
      return res.redirect('/restaurants');
    }
    if (userId !== restaurant.userId) {
      req.flash('error', '無權限刪除此資料');
      return res.redirect('/restaurants');
    }
    await Restaurant.destroy({ where: { id } });
    req.flash('success', '刪除成功');
    return res.redirect('/restaurants');
  } catch (error) {
    const err = error;
    err.errorMessage = '刪除失敗！';
    next(err);
  }
};

module.exports = restaurantHandler;
