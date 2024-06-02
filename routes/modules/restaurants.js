// 引用 Express 與 Express 路由器
const express = require('express');

const router = express.Router();

const restaurantHandler = require('../../middlewares/restaurant-handler');

router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', restaurantHandler.create);

router.get('/', restaurantHandler.getAll, (req, res, next) => {
  try {
    const restaurants = req.filterRestaurants;
    const { maxPage } = req; // eslint: prefer-destructuring
    const { sortOption } = req || 'none'; // 不知道如何在 express-handlebars 如何判斷空值
    const { currentPage } = req;
    const { keyword } = req;
    const previousPage = currentPage === 1 ? 1 : currentPage - 1;
    const nextPage = currentPage === maxPage ? maxPage : currentPage + 1;

    // 以下為測試用

    const myObject = {
      restaurants,
      maxPage,
      sortOption,
      currentPage,
      previousPage,
      nextPage,
      keyword,
    };
    console.log('myObject:', myObject);

    res.render('restaurants', {
      restaurants,
      maxPage,
      sortOption,
      currentPage,
      previousPage,
      nextPage,
      keyword,
    });
  } catch (error) {
    const err = error;
    err.errorMessage = '資料庫查詢錯誤';
    next(err);
  }
});

router.get('/:id', restaurantHandler.getById, (req, res, next) => {
  try {
    const { restaurant } = req;
    res.render('detail', restaurant);
  } catch (error) {
    const err = error;
    next(err);
  }
});

router.get('/:id/edit', restaurantHandler.getEdit, (req, res, next) => {
  try {
    const { restaurant } = req;
    res.render('edit', restaurant);
  } catch (error) {
    const err = error;
    next(err);
  }
});

router.put('/:id', restaurantHandler.update);

router.delete('/:id', restaurantHandler.delete);

module.exports = router;
