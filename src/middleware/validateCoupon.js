const { check, validationResult } = require("express-validator");

// Middleware to validate coupon creation/update requests
const validateCoupon = [
  check("type")
    .notEmpty()
    .withMessage("Coupon type is required")
    .isIn(["cart-wise", "product-wise", "BxGy"])
    .withMessage("Invalid coupon type"),
  check("discountDetails")
    .notEmpty()
    .withMessage("Discount details are required"),
  check("conditions").notEmpty().withMessage("Conditions are required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateCoupon;
