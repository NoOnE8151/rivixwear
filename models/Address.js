import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  addresses: {
    phone: {
      type: Number,
      required: true,
      minlength: 10,
      maxlength: 10
    },
    address: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
      match: /^[1-9][0-9]{5}$/,
    },
  },
});

export default  mongoose.models.Address || mongoose.model("Address", addressSchema);