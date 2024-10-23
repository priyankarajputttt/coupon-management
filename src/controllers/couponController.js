const asyncHandler = require("express-async-handler");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");
const {
  getApplicableCoupons,
  applyCouponToCart,
} = require("../services/applyCouponService");

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Public
const createCouponController = asyncHandler(async (req, res) => {
  const { type, discountDetails, conditions, expirationDate } = req.body;
  const coupon = await createCoupon({
    type,
    discountDetails,
    conditions,
    expirationDate,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public
const getAllCouponsController = asyncHandler(async (req, res) => {
  const coupons = await getAllCoupons();
  res.status(200).json({
    success: true,
    coupons,
  });
});

// @desc    Get a specific coupon by ID
// @route   GET /api/coupons/:id
// @access  Public
const getCouponByIdController = asyncHandler(async (req, res) => {
  const coupon = await getCouponById(req.params.id);
  res.status(200).json({
    success: true,
    coupon,
  });
});

// @desc    Update a coupon by ID
// @route   PUT /api/coupons/:id
// @access  Public
const updateCouponController = asyncHandler(async (req, res) => {
  const { type, discountDetails, conditions, expirationDate } = req.body;
  const coupon = await updateCoupon(req.params.id, {
    type,
    discountDetails,
    conditions,
    expirationDate,
  });

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
});

// @desc    Delete a coupon by ID
// @route   DELETE /api/coupons/:id
// @access  Public
const deleteCouponController = asyncHandler(async (req, res) => {
  await deleteCoupon(req.params.id);
  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

// @desc    Get all applicable coupons for a cart
// @route   POST /api/applicable-coupons
// @access  Public
const getApplicableCouponsController = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  const applicableCoupons = await getApplicableCoupons(cartItems);

  res.status(200).json({
    success: true,
    applicableCoupons,
  });
});

// @desc    Apply a coupon to a cart
// @route   POST /api/apply-coupon/:id
// @access  Public
const applyCouponController = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  const updatedCart = await applyCouponToCart(req.params.id, cartItems);

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    updatedCart,
  });
});

module.exports = {
  createCouponController,
  getAllCouponsController,
  getCouponByIdController,
  updateCouponController,
  deleteCouponController,
  getApplicableCouponsController,
  applyCouponController,
};
