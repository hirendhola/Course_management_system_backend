const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://hirendhola:kV3x1tGiHKyeM0y0@codex.mrdvtif.mongodb.net/03_mongo_practice');

// Define schemas
const AdminSchema = new mongoose.Schema({
    userName: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageLink: String,
    price: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}