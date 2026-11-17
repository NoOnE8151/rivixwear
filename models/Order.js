import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{10}$/,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    apartment: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{6}$/,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },
  },
  {
    _id: false,
  },
);

const returnRequestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "not_requested",
        "requested",
        "approved",
        "rejected",
        "received",
        "completed",
      ],
      default: "not_requested",
    },

    reasonCategory: {
      type: String,
      default: "",
      trim: true,
    },

    reasonDetails: {
      type: String,
      default: "",
      trim: true,
    },

    requestedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // Admin-controlled resolution
    resolutionType: {
      type: String,
      enum: ["refund", "exchange"],
      default: null,
    },

    resolutionStatus: {
      type: String,
      enum: ["not_started", "pending", "processing", "completed"],
      default: "not_started",
    },

    resolutionAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    resolutionReference: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },

    resolutionNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // Reverse pickup information
    pickupStatus: {
      type: String,
      enum: ["not_scheduled", "scheduled", "picked_up"],
      default: "not_scheduled",
    },

    pickupCourier: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    pickupTrackingNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },

    pickupScheduledAt: {
      type: Date,
      default: null,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },

    receivedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  variantId: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL", "XXL"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },

  // Each product has its own return lifecycle.
  returnRequest: {
    type: returnRequestSchema,
    default: () => ({}),
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    // Email provided by the customer during checkout.
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    products: [orderProductSchema],

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "accepted",
        "fulfilled",
        "cancelled",
        "returning",
        "returned",
      ],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "prepaid"],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: false,
    },
        fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
