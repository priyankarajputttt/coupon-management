const Coupon = require("../models/couponModel");

// Middleware to check if the coupon is expired
const checkCouponExpiration = async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Coupon not found",
    });
  }

  if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Coupon has expired",
    });
  }

  req.coupon = coupon;
  next();
};

module.exports = checkCouponExpiration;
