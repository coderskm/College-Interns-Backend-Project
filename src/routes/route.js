const express = require('express')
const router = express.Router()
const { createCollege,createInterns,getCollegeDetails} = require("../controllers/commonController");

router.post("/colleges", createCollege);
router.post("/interns", createInterns);
router.get("/collegeDetails", getCollegeDetails);

module.exports = router;