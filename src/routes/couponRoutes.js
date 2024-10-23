const express = require("express");
const router = express.Router();
const {
  createCouponController,
  getAllCouponsController,
  getCouponByIdController,
  updateCouponController,
  deleteCouponController,
  getApplicableCouponsController,
  applyCouponController,
} = require("../controllers/couponController");

const validateCoupon = require("../middleware/validateCoupon");
const checkCouponExpiration = require("../middleware/checkCouponExpiration");

// Coupon routes
router.post("/coupons", validateCoupon, createCouponController);
router.get("/coupons", getAllCouponsController);
router.get("/coupons/:id", checkCouponExpiration, getCouponByIdController);
router.put("/coupons/:id", validateCoupon, updateCouponController);
router.delete("/coupons/:id", deleteCouponController);

// Applying coupon
router.post("/applicable-coupons", getApplicableCouponsController);
router.post("/apply-coupon/:id", checkCouponExpiration, applyCouponController);

module.exports = router;
