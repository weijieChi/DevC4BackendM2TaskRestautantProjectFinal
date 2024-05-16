// 引用 Express 與 Express 路由器
const express = require('express');

const router = express.Router();

// JSON schema 用於驗證 json 轉成的 object 格式是否符合規格
const Validator = require('jsonschema');

const jsonValidator = new Validator.Validator();
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

router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', (req, res, next) => {
  let data = {};

  // 驗證是否為有效 json 資料
  try {
    data = (req.body); // 包含使用 app.use(express.json())
  } catch (error) {
    // res.status(400); // 不知道要怎麼把 http code 設為 400
    error.errorMessage = 'Invalid request data.';
    next(error);
    return; // 防止進入資料庫 insert 程序
  }

  // JSON schema 驗證 javascript object 格式
  const result = jsonValidator.validate(data, restaurantSchena);
  if (!result.valid) {
    const error = { errorMessage: 'The JSON data schema or value is does not match rule.' };
    next(error);
    return; // 防止進入資料庫 insert 程序
  }

  Restaurant.create(data)
    .then(() => {
      req.flash('success', '新增成功');
      return res.redirect('restaurants');
    })
    .catch((error) => {
      const err = error;
      err.errorMessage = '新增失敗！';
      next(err);
    });
});

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  Restaurant.findAll({
    attributes: ['id', 'name', 'category', 'image'],
    where: { userId },
    raw: true,
  })
    .then((restaurants) => {
      res.render('restaurants', { restaurants });
    })
    .catch((error) => {
      const err = error;
      err.error_msg = '資料取得失敗';
      // res.status(500); // 不知道要怎麼把 http code 設為 500
      next(error);
    });
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
  const result = jsonValidator.validate(data, restaurantSchena);
  if (!result.valid) {
    const error = { errorMessage: 'The JSON data schema or value is does not match.' };
    next(error);
    return; // 防止進入資料庫 update 程序
  }

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
