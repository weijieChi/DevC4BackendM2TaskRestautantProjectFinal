// 先產生陣列資料，我忽略部分我認為題目不需要的部分
const bcrypt = require('bcryptjs');
const restaurantsData = require('../public/jsons/restaurant.json').results;

const restaurants = [];

for (let i = 0; i < 6; i += 1) { // ESlint: no-plusplus
  if (i < 3) {
    restaurants.push(
      {
        id: restaurantsData[i].id,
        name: restaurantsData[i].name,
        category: restaurantsData[i].category,
        image: restaurantsData[i].image,
        location: restaurantsData[i].location,
        phone: restaurantsData[i].phone,
        google_map: restaurantsData[i].google_map,
        description: restaurantsData[i].description,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
  } else {
    restaurants.push(
      {
        id: restaurantsData[i].id,
        name: restaurantsData[i].name,
        category: restaurantsData[i].category,
        image: restaurantsData[i].image,
        location: restaurantsData[i].location,
        phone: restaurantsData[i].phone,
        google_map: restaurantsData[i].google_map,
        description: restaurantsData[i].description,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }
}
console.log(restaurants);

const users = [
  {
    id: 1,
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
  }, // 擁有 #1, #2, #3 號餐廳
  {
    id: 2,
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
  }, // 擁有 #4, #5, #6 號餐廳
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{d
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let transaction;
    try {
      transaction = await queryInterface.sequelize.transaction();

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('12345678', salt);

      await queryInterface.bulkInsert(
        'Users',
        users.map((user) => (({
          id: user.id,
          name: user.name,
          email: user.email,
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))),
        { transaction }, // { transaction: transaction }
      );
      await queryInterface.bulkInsert('Restaurants', restaurants, { transaction });
      transaction.commit();
    } catch (error) {
      console.log('sedder transacrion error: ');
      console.log(error);
      if (transaction) await transaction.rollback();
    }
    // await queryInterface.bulkInsert('Restaurants', restaurants, {});
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    let transaction;
    try {
      transaction = queryInterface.transaction();
      await queryInterface.bulkDelete('Restaurants', null, { transaction });
      await queryInterface.bulkDelete('Users', null, { transaction });
      transaction.commit();
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
    }
  },
};
