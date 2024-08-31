import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    id: {
        type: String, // Assuming id is a string
        required: true,
        unique: true // Ensure uniqueness of id field
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of question field
    },
    contact: {
        type: String,
        default: ''
    },
    capacity: {
        type: String,
        default: '' // Optional answer field
    },
    price: {
        type: String,
        default: ''
    }
});

const Warehouse = mongoose.model('warehouse', warehouseSchema);

export default Warehouse;
