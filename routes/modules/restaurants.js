// 引用 Express 與 Express 路由器
const express = require('express');

// database
const db = require('../../models');

const { Restaurant } = db;

const router = express.Router();

const restaurantHandler = require('../../middlewares/restaurant-handler');

router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', restaurantHandler.create);

router.get('/', restaurantHandler.getAll, async (req, res, next) => {
  try {
    const restaurants = req.filterRestaurants;
    const { maxPage } = req; // eslint: prefer-destructuring
    const { sortOption } = req || 'none'; // 不知道如何在 express-handlebars 如何判斷空值
    const { currentPage } = req;
    const { keyword } = req;
    const previousPage = currentPage === 1 ? 1 : currentPage - 1;
    const nextPage = currentPage === maxPage ? maxPage : currentPage + 1;

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

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
    raw: true,
  })
    .then((restaurant) => {
      if (restaurant === null) {
        // res.status(404); // 不知道要怎麼把 http code 設為 404
        const error = { errorMessage: '查詢不到該筆餐廳資料' };
        next(error);
        return;
      }
      res.render('detail', { restaurant });
    })
    .catch((error) => {
      const err = error;
      // res.status(500); // 不知道要怎麼把 http code 設為 500
      err.errorMessage = '資料庫查詢錯誤';
      next(err);
    });
});

router.get('/:id/edit', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'category', 'image', 'location', 'phone', 'google_map', 'description'],
    raw: true,
  })
    .then((restaurant) => {
      if (restaurant === null) {
        // res.status(404); // 不知道要怎麼把 http code 設為 404
        const error = { errorMessage: '查詢不到該筆餐廳資料' };
        next(error);
        return;
      }
      res.render('edit', { restaurant });
    })
    .catch((error) => {
      const err = error;
      // res.status(404); // 不知道要怎麼把 http code 設為 404
      err.errorMessage = '查詢不到該筆餐廳資料';
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  // 驗證是否為有效 JSON 資料
  let data = {};
  try {
    data = req.body;
  } catch (error) {
    error.errorMessage = 'Invalid request data';
    next(error);
    return; // 防止進入資料庫 update 程序
  }
  // 驗勝資料結構
  // const result = jsonValidator.validate(data, restaurantSchena);
  // if (!result.valid) {
  //   const error = { errorMessage: 'The JSON data schema or value is does not match.' };
  //   next(error);
  //   return; // 防止進入資料庫 update 程序
  // }

  Restaurant.update(data, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功');
      res.redirect(`./${id}`);
    })
    .catch((error) => {
      const err = error;
      err.errorMessage = '修改失敗！';
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.destroy({ where: { id } })
    .then(() => {
      res.redirect('./');
    })
    .catch((error) => {
      const err = error;
      err.errorMessage = '刪除失敗！';
      next(err);
    });
});

module.exports = router;
