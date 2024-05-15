const {
  Model,
  INTEGER,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      Restaurant.belongsTo(models.User);
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    location: DataTypes.STRING,
    phone: DataTypes.STRING,
    google_map: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: {
      DataTypes: INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};
