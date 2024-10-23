const Coupon = require("../models/couponModel");
const { BadRequestError, NotFoundError } = require("../utils/errorUtil");

// Create a new coupon
const createCoupon = async (couponData) => {
  const coupon = new Coupon(couponData);
  await coupon.save();
  return coupon;
};

// Get all coupons
const getAllCoupons = async () => {
  const coupons = await Coupon.find();
  return coupons;
};

// Get a coupon by ID
const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }
  return coupon;
};

// Update a coupon by ID
const updateCoupon = async (id, updatedData) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  Object.assign(coupon, updatedData); // Apply updates to the existing coupon object
  await coupon.save();
  return coupon;
};

// Delete a coupon by ID
const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  return { message: `Coupon- ${id} deleted successfully` };
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
