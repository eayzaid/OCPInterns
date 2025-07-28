const express = require("express");
const locationCollectionManager = require("../DatabasesHandlers/LocationsHandler");
const {
  authenticateToken,
} = require("../Authentification/UserAuthentification");

const router = express.Router();
router.use(authenticateToken);

router.use((req, res, next) => {
  if (!["admin", "recruiter"].includes(req.role)) {
    console.log(req.role);
    res.status(401).json({
      error: "Client is not allowed the access the requested resources",
    });
  }
  next();
});

router.get("/view" ,async (req , res , next) =>{
  try{
    const locations = await locationCollectionManager.getAllLocations();
    res.status(200).json(locations)
  }catch(error){
    next(error);
  }
})

// Admin-only middleware for CRUD operations
const adminOnly = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      error: "Only administrators can perform this action",
    });
  }
  next();
};

// Create a new location/department
router.post("/create", adminOnly, async (req, res, next) => {
  try {
    const { departmentName, sousDepartments } = req.body;
    
    if (!departmentName) {
      const error = new Error("Department name is required");
      error.statusCode = 400;
      throw error;
    }

    const locationData = {
      departmentName,
      sousDepartments: sousDepartments || [],
      mentors: []
    };

    const newLocation = await locationCollectionManager.createLocation(locationData);
    res.status(201).json({
      message: "Location created successfully",
      location: {
        _id: newLocation._id,
        departmentName: newLocation.departmentName,
        sousDepartments: newLocation.sousDepartments,
        mentors: newLocation.mentors || [],
        createdAt: newLocation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update an existing location/department
router.put("/:departmentName", adminOnly, async (req, res, next) => {
  try {
    const { departmentName: currentDepartmentName } = req.params;
    const { departmentName, sousDepartments } = req.body;
    
    if (!currentDepartmentName) {
      const error = new Error("Department name is required");
      error.statusCode = 400;
      throw error;
    }

    // Check if location exists
    await locationCollectionManager.getLocationByDepartmentName(currentDepartmentName);
    
    const updateData = {};
    if (departmentName && departmentName !== currentDepartmentName) {
      updateData.departmentName = departmentName;
    }
    if (sousDepartments !== undefined) {
      updateData.sousDepartments = sousDepartments;
    }

    await locationCollectionManager.updateLocation(currentDepartmentName, updateData);
    
    const updatedLocation = await locationCollectionManager.getLocationByDepartmentName(
      departmentName || currentDepartmentName
    );

    res.status(200).json({
      message: "Location updated successfully",
      location: {
        _id: updatedLocation._id,
        departmentName: updatedLocation.departmentName,
        sousDepartments: updatedLocation.sousDepartments,
        mentors: updatedLocation.mentors || [],
        createdAt: updatedLocation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a location/department
router.delete("/:departmentName", adminOnly, async (req, res, next) => {
  try {
    const { departmentName } = req.params;
    
    if (!departmentName) {
      const error = new Error("Department name is required");
      error.statusCode = 400;
      throw error;
    }

    const location = await locationCollectionManager.getLocationByDepartmentName(departmentName);
    
    if (location.mentors && location.mentors.length > 0) {
      const error = new Error("Cannot delete department with assigned mentors. Please reassign mentors first.");
      error.statusCode = 400;
      throw error;
    }

    await locationCollectionManager.deleteLocationByDepartmentName(departmentName);
    
    res.status(200).json({
      message: "Location deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Get specific location by department name
router.get("/:departmentName", async (req, res, next) => {
  try {
    const { departmentName } = req.params;
    
    const location = await locationCollectionManager.getLocationByDepartmentName(departmentName);
    
    const formattedLocation = {
      _id: location._id,
      departmentName: location.departmentName,
      sousDepartments: location.sousDepartments || [],
      mentorCount: location.mentors ? location.mentors.length : 0,
      mentors: location.mentors || [],
      createdAt: location.createdAt
    };
    
    res.status(200).json({
      location: formattedLocation
    });
  } catch (error) {
    next(error);
  }
});

// Get all locations/departments with filtering
router.get("/", async (req, res, next) => {
  try {
    const queryParams = {
      departmentName: req.query.departmentName,
      subDepartment: req.query.subDepartment,
    };

    const projection = {
      departmentName : 1,
      sousDepartments : 1 ,
      mentors : 1
    }

    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    // Use searchLocations if we have query parameters, otherwise get all
    let locations;
    if (Object.keys(queryParams).length > 0) {
      locations = await locationCollectionManager.searchLocations(queryParams , projection);
    } else {
      locations = await locationCollectionManager.getAllLocations();
    }
    
    // Format response
    const formattedLocations = locations.map(location => ({
      _id: location._id,
      departmentName: location.departmentName,
      sousDepartments: location.sousDepartments || [],
      mentorCount: location.mentors ? location.mentors.length : 0,
    }));
    
    res.status(200).json({
      locations: formattedLocations,
      count: formattedLocations.length
    });
  } catch (error) {
    next(error);
  }
});

//view only the name of departments
router.get("/departments", async (req, res, next) => {
  try {
    const projection = { departmentName: 1, _id: 0 };
    const locations = await locationCollectionManager.searchLocations({}, projection);
    const departmentNames = locations.map(location => location.departmentName);
    res.status(200).json(departmentNames);
  } catch (error) {
    next(error);
  }
});

router.get("/mentors", async (req, res, next) => {
  try {
    const { department, field, fullName } = req.query;
    
    // Build query object for searching mentors
    const queryParams = {};
    const projection = {
      departmentName: 1,
      mentors: 1,
      _id: 0,
    };

    // If department is specified, search by department
    if (department) {
      queryParams.departmentName = department;
    }

    // Search for mentors with specific field or name
    if (field) {
      queryParams["mentors.fields"] = field;
    }
    
    if (fullName) {
      queryParams.mentorName = fullName; // Use our mentorName search
    }

    let locations = await locationCollectionManager.searchLocations(queryParams, projection);
    
    // If searching by field or fullName, flatten the results
    if (field || fullName) {
      const mentors = locations
        .map((department) =>
          department.mentors
            .filter((mentor) => {
              if (field && fullName) {
                return mentor.fields?.includes(field) && mentor.mentorFullName === fullName;
              } else if (field) {
                return mentor.fields?.includes(field);
              } else if (fullName) {
                return mentor.mentorFullName === fullName;
              }
              return true;
            })
            .map((mentor) => ({
              departmentName: department.departmentName,
              ...mentor,
            }))
        )
        .reduce((acc, curr) => [...acc, ...curr], []);
      
      res.status(200).json(mentors);
    } else {
      // Return all locations/departments
      res.status(200).json(locations);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
