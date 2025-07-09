const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userInfoSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase : true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase : true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const CandidateModel = mongoose.model('CandidateModel' , userInfoSchema , 'candidates');
const RecruiterModel = mongoose.model('RecruiterModel' , userInfoSchema , 'recruiters');
const MentorModel = mongoose.model('MentorModel' , userInfoSchema , 'mentors');
const AdminModel = mongoose.model('AdminModel' , userInfoSchema , 'admins');

async function addUser ( user ){
    try{
        const response = await user.save();
        if(!response || !result.acknowledged ) throw new Error ("Something went wrong when trying inserting the document");
    }
    catch( err ){
        throw err ;
    }
}

module.exports = { CandidateModel , RecruiterModel , MentorModel , AdminModel }; 