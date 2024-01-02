const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Course, Admin } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body
        const isAdminExists = await Admin.findOne({
            userName: username
        })
        if (isAdminExists) {
            return res.status(409).json({
                error: "User Already Exist"
            })
        }
        await Admin.create({
            userName: username ,
            password: password
        })
        res.json({
            message: 'Admin created successfully'
        })
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    try {
        const { title, description, price, imageLink } = req.body

        const newCourse = new Course({
            title, 
            description, 
            price, 
            imageLink
        });
        await newCourse.save()
        res.json({
            message: 'Course created successfully',
            courseId: newCourse._id
        });
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        })
    }
});

router.get('/courses',  adminMiddleware, async (req, res) => {
    try {
        const courses = await Course.find(); 
        res.status(200).json({
            courses: courses 
        });
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        })
    }
});

module.exports = router;