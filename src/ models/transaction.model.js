const mongoose = require('mongoose');



const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can either be Pending, Completed, Failed or Reversed"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount is required to create a transaction"],
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency Key is requred for creating a transation"],
        index: true,
        unique: true
    }
},{
    timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;