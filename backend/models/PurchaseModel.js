import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courses_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
