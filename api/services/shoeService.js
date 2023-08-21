const shoes = require('../models/shoe');

// Lấy danh sách giày
const getAllShoes = () => {
  return shoes;
};

// Lấy thông tin giày theo ID
const getShoeById = (id) => {
  return shoes.find((shoe) => shoe.id === id);
};

// Tạo mới giày
const createShoe = (shoeData) => {
  const newShoe = { id: Date.now().toString(), ...shoeData };
  shoes.push(newShoe);
  return newShoe;
};

// Cập nhật thông tin giày
const updateShoe = (id, shoeData) => {
  const shoeIndex = shoes.findIndex((shoe) => shoe.id === id);
  if (shoeIndex !== -1) {
    shoes[shoeIndex] = { id, ...shoeData };
    return shoes[shoeIndex];
  } else {
    return null;
  }
};

// Xóa giày
const deleteShoe = (id) => {
  const shoeIndex = shoes.findIndex((shoe) => shoe.id === id);
  if (shoeIndex !== -1) {
    return shoes.splice(shoeIndex, 1)[0];
  } else {
    return null;
  }
};

module.exports = {
  getAllShoes,
  getShoeById,
  createShoe,
  updateShoe,
  deleteShoe,
};