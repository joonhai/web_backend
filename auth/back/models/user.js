// models/user.js (MongoDB Version)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  nick: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //followings: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
  versionKey: false,
});

const User = mongoose.model('User', userSchema);
module.exports = User;




/*const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      userId: { 
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.Post.hasMany(db.Comment, { foreignKey: 'userId', sourceKey: 'id' });
    
    db.User.belongsToMany(db.User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow',
    });
    db.User.belongsToMany(db.User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow',
    });
  }
};

module.exports = User;*/