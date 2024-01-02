const { Router } = require("express");
const router = Router();
const { Course, User } = require("../db");
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const isUserExists = await User.findOne({
            userName: username
        });
        if (isUserExists) {
            return res.status(409).json({
                error: "Username already exist"
            })
        }
        await User.create({
            userName: username,
            password: password
        })
        res.json({
            message: 'user created successfully'
        })
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        })
    }
});

router.use(userMiddleware)

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({
            courses: courses
        });
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        })
    }
});

router.post('/courses/:courseId', async (req, res) => {
    try {
        const courseID = req.params.courseId; // Correct param name
        const username = req.body.username;

        const isCourseExist = await Course.findOne({
            _id: courseID
        });

        if (!isCourseExist) {
            return res.status(409).json({
                error: "Course ID doesn't exist"
            });
        }

        const updatedUser = await User.updateOne(
            { userName: username },
            {
                $push: {
                    purchasedCourses: courseID
                }
            }
        );

        if (updatedUser.nModified === 0) {
            return res.status(404).json({
                error: "User not found or no modifications made"
            });
        }

        res.status(200).json({
            message: 'Course purchased successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });
    }
});

router.get('/purchasedCourses', async (req, res) => {
    try {
        const user = await User.findOne({
            userName: req.headers.username
        }).populate('purchasedCourses'); // Populate the referenced courses

        if (!user || !user.purchasedCourses || user.purchasedCourses.length === 0) {
            return res.status(200).json({
                message: "No purchased courses found for the user"
            });
        }

        res.json({
            courses: user.purchasedCourses
        });
    } catch (error) {
        res.status(500).json({
            error: "INTERNAL SERVER ERROR"
        });
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;
