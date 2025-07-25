const MongoClient = require("mongoose");

const LocationSchema = MongoClient.Schema({
    departmentName: String,
    sousDepartments: [String],
    mentors:[{
        mentorId : {
            type : String,
            unique : true
        } ,
        mentorFullName : String, // mentor FullName
        menteeCount : Number,
        fields : [String]
    }],
});

const LocationModel = MongoClient.model("LocationModel", LocationSchema, "locations");

const createLocation = async (locationData) => {
    try {
        const newLocation = new LocationModel(locationData);
        const savedLocation = await newLocation.save();
        return savedLocation;
    } catch (error) {
        error.statusCode = 400;
        error.message = "Could not create the location.";
        throw error;
    }
};

const getAllLocations = async (projection) => {
    try {
        const locations = await LocationModel.find({}, {
            '_id': 0,
            ...projection
        });
        return locations;
    } catch (error) {
        error.statusCode = 500;
        error.message = "Could not retrieve locations.";
        throw error;
    }
};

const getLocationByDepartmentName = async (departmentName, projection) => {
    try {
        const location = await LocationModel.findOne(
            { departmentName: departmentName },
            projection || {}
        );
        if (!location) {
            const error = new Error("Location not found.");
            error.statusCode = 404;
            throw error;
        }
        return location;
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "Could not retrieve the location.";
        }
        throw error;
    }
};

const getLocationById = async (id) => {
    try {
        const location = await LocationModel.findById(id);
        if (!location) {
            const error = new Error("Location not found.");
            error.statusCode = 404;
            throw error;
        }
        return location;
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "Could not retrieve the location.";
        }
        throw error;
    }
};

const addMentorToLocation = async (departmentName, mentorData) => {
    try {
        const updatedLocation = await LocationModel.findOneAndUpdate(
            { departmentName },
            { $push: { mentors: mentorData } },
            { new: true, runValidators: true }
        )
        if (!updatedLocation) {
            const error = new Error("Location not found.")
            error.statusCode = 404
            throw error
        }
        return updatedLocation
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
            error.message = "Could not add mentor to the location."
        }
        throw error
    }
}

const getLocationsByQuery = async (query, projection) => {
    try {
        const locations = await LocationModel.find(query, projection || {});
        return locations;
    } catch (error) {
        error.statusCode = 500;
        error.message = "Could not retrieve locations by query.";
        throw error;
    }
};

const deleteLocation = async (id) => {
    try {
        const deletedLocation = await LocationModel.findByIdAndDelete(id);
        if (!deletedLocation) {
            const error = new Error("Location not found.");
            error.statusCode = 404;
            throw error;
        }
        return deletedLocation;
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "Could not delete the location.";
        }
        throw error;
    }
};

const deleteMentorFromLocation = async (mentorId) => {
    try {
        const updatedLocation = await LocationModel.findOneAndUpdate(
            { 'mentors.mentorId': mentorId },
            { $pull: { mentors: { mentorId } } },
            { new: true, runValidators: true }
        )
        if (!updatedLocation) {
            const error = new Error("Location not found or mentor does not exist.")
            error.statusCode = 404
            throw error
        }
        return updatedLocation
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
            error.message = "Could not delete mentor from the location."
        }
        throw error
    }
}

module.exports = {
    deleteMentorFromLocation,
    createLocation,
    getAllLocations,
    getLocationById,
    getLocationByDepartmentName,
    addMentorToLocation,
    deleteLocation,
    getLocationsByQuery
};