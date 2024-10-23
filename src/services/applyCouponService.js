const Coupon = require("../models/couponModel");
const { calculateDiscount } = require("../utils/discountCalculationUtil");
const { NotFoundError, BadRequestError } = require("../utils/errorUtil");

// Get applicable coupons for the cart
const getApplicableCoupons = async (cartItems) => {
  const coupons = await Coupon.find(); // Retrieve all available coupons
  let applicableCoupons = [];
  // Check which coupons apply to the cart
  coupons.forEach((coupon) => {
    if (coupon.isApplicable(cartItems)) {
      const discount = calculateDiscount(cartItems, coupon);
      applicableCoupons.push({ coupon, discount });
    }
  });

  return applicableCoupons;
};

// Apply a specific coupon to the cart
const applyCouponToCart = async (couponId, cartItems) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  if (!coupon.isApplicable(cartItems)) {
    throw new BadRequestError("Coupon is not applicable to this cart");
  }

  const updatedCart = coupon.applyToCart(cartItems); // Method in Coupon model
  return updatedCart;
};

module.exports = {
  getApplicableCoupons,
  applyCouponToCart,
};
