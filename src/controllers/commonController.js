const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number") return false;
  return true;
};

const isValidBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const createCollege = async (req, res) => {
  try {
    const collegeData = req.body;
    let urlRegex = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpeg|png|jpg)$/;
    let nameRegex = /^[A-Za-z_ ]+$/;

    if (!isValidBody(collegeData)) {
      return res.status(400).send({
        status: false,
        message: "Invalid College Details. Please enter college details",
      });
    }

    let { name, fullName, logoLink } = collegeData;
    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "college name is required" });
    }
    if (!isValid(fullName)) {
      return res
        .status(400)
        .send({ status: false, message: "college full name is required" });
    }
    if (!isValid(logoLink)) {
      return res
        .status(400)
        .send({ status: false, message: "link of college's logo is required" });
    }
    let uniqueName = await collegeModel.findOne({ name });
    if (uniqueName) {
      return res
        .status(400)
        .send({ status: false, message: "college name already exist" });
    }

    let uniqueFullName = await collegeModel.findOne({ fullName });
    if (uniqueFullName) {
      return res
        .status(400)
        .send({ status: false, message: "college full name already exist" });
    }
    if (!name.match(nameRegex)) {
      return res.status(400).send({
        status: false,
        message: "name is not legit. It should contain only alphabets",
      });
    }
    if (!fullName.match(nameRegex)) {
      return res.status(400).send({
        status: false,
        message: "full name is not legit. It should contain only alphabets",
      });
    }
    if (!logoLink.match(urlRegex)) {
      return res
        .status(400)
        .send({ status: false, message: "logo URL is not legit" });
    }

    let college = await collegeModel.create(collegeData);
    res.status(201).send(college);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const createInterns = async (req, res) => {
  try {
    let internData = req.body;
    let nameRegex = /^[a-zA-Z ]{2,20}$/;
    let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let mobileRegex = /^[6-9]\d{9}$/;

    if (!isValidBody(internData)) {
      return res.status(400).send({
        status: false,
        message:
          "Invalid Intern Details. Please enter intern details correctly",
      });
    }
    let { name, email, mobile, collegeName } = internData;
    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "intern's name is required" });
    }
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "intern's email is required" });
    }
    if (!isValid(mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "intern's mobile number is required" });
    }

    if (!isValid(collegeName)) {
      return res
        .status(400)
        .send({ status: false, message: "college name is not legit" });
    }
    if (!name.match(nameRegex)) {
      return res.status(400).send({
        status: false,
        message: "name is not legit. It should contain only alphabets",
      });
    }
    if (!email.match(emailRegex)) {
      return res
        .status(400)
        .send({ status: false, message: "email is not legit." });
    }
    if (!mobile.match(mobileRegex)) {
      return res.status(400).send({
        status: false,
        message: "not an indian mobile number or should be of 10 digits",
      });
    }

    let checkCollege = await collegeModel.findOne({ name: collegeName });
    if (!checkCollege) {
      return res
        .status(400)
        .send({ status: false, message: "college not found" });
    }
    if (checkCollege.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "college is deleted" });
    }

    let checkUniqueEmail = await internModel.findOne({ email });
    if (checkUniqueEmail) {
      return res
        .status(400)
        .send({ status: false, message: "email already in use" });
    }
    let checkUniqueMobile = await internModel.findOne({ mobile });
    if (checkUniqueMobile) {
      return res
        .status(400)
        .send({ status: false, message: "mobile number already in use" });
    }

    req.body.collegeId = checkCollege._id;

    const intern = await internModel.create(internData);
    res.status(201).send(intern);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const getCollegeDetails = async (req, res) => {
  try {
    let collegeName = req.query.collegeName;
    if (!collegeName) {
      return res
        .status(400)
        .send({ status: false, message: "college name not entered" });
    }

    let collegeDetail = await collegeModel.findOne({
      name: collegeName,
      isDeleted: false,
    });
    if (!collegeDetail) {
      return res.status(400).send({
        status: false,
        message: "enter valid college name as no such college found",
      });
    }
    let internDetails = await internModel
      .find({ collegeId: collegeDetail._id, isDeleted: false })
      .select({ _id: 1, name: 1, email: 1, mobile: 1 });

    if (internDetails.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "no interns found" });
    }

    let finalDetail = {};
    finalDetail.name = collegeDetail.name;
    finalDetail.fullName = collegeDetail.fullName;
    finalDetail.logoLink = collegeDetail.logoLink;
    finalDetail.interns = internDetails;
    
    res.status(200).send({ data: finalDetail });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createCollege, createInterns, getCollegeDetails };
