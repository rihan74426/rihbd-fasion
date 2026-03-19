// src/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    // Product snapshot
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true }, // the price actually charged (discountPrice if applicable)
    productImage: { type: String, required: true },

    // Selected size
    selectedSize: { type: String, default: null },

    // Customer
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    customerAddress: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    // Status
    status: {
      type: String,
      enum: ["PENDING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: { type: String, default: "CASH_ON_DELIVERY" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ customerPhone: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
