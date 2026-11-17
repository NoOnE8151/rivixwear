import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    addresses: [
      {
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
          maxlength: 254,
          match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },

        phone: {
          type: String,
          required: true,
          minlength: 10,
          maxlength: 10,
          match: /^[0-9]{10}$/,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },

        apartment: {
          type: String,
          trim: true,
          default: "",
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        pincode: {
          type: String,
          required: true,
          minlength: 6,
          maxlength: 6,
          match: /^[1-9][0-9]{5}$/,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);