'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('boards', [{
      writer:'kang1',
      title:'11111111111111',
      content:'aaaaaaaaaaaaaa',
      createdAt:'2019-01-01',
      updatedAt:'2019-01-01'
    },{
      writer:'kang2',
      title:'2222222222222',
      content:'bbbbbbbbbbbbb',
      createdAt:'2019-01-01',
      updatedAt:'2019-01-01'
    },{
      writer:'kang3',
      title:'33333333333',
      content:'cccccccccccccccccc',
      createdAt:'2019-01-01',
      updatedAt:'2019-01-01'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('boards', null, {});
  }
};
