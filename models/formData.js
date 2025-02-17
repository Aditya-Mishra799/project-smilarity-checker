import mongoose from "mongoose";

const formDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
    title: { 
      type: String, 
      required: true, 
    },
    currentPage: { 
      type: Number, 
      required: true, 
      default: -1
    },
    data: { 
      type: Object, 
      required: true, 
      default: {}, 
    }, 
    type: { 
      type: String, 
      enum: ["listing", "application", "feedback"], 
      required: true, 
    }, 
    isSubmitted: { 
      type: Boolean, 
      default: false, 
    }, 
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),  // delte after 2 days
    }, 
  },
  {
    timestamps: true, 
  }
);

formDataSchema.pre("save", async function (next){
  if(this.isSubmitted){
    await this.deleteOne()
  }else{
    this.expiresAt = new Date(Date.now() + 2*24*60*60*1000); // reset expiry
    return next();
  }
})

// Index to enforce TTL for cleanup
formDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create model
const FormData =
  mongoose.models.FormData || mongoose.model("FormData", formDataSchema);

export default FormData;
