const Degrees = [
    "High School Diploma",
    "Technical Baccalaureate",
    "Professional Baccalaureate",
    "DEUG (General University Studies Diploma)",
    "DEUST (Diploma of Scientific and Technical University Studies)",
    "DUT (University Technology Diploma)",
    "BTS (Higher Technician Certificate)",
    "Licence (Bachelor's Degree)",
    "Professional Licence",
    "Engineering Degree",
    "Master's Degree",
    "Specialized Master's Degree",
    "Doctorate (PhD)",
    "Medical Doctorate",
    "Pharmacy Doctorate",
    "Dental Surgery Doctorate",
    "DESA (Diploma of Higher Specialized Studies)",
    "DES (Diploma of Higher Studies)",
    "University Certificate"
];


const JobTypes = [
    "Full Time",
    "Part Time",
    "Internship",
    "Temporary",
    "Contract",
    "Freelance",
    "Volunteer"
];


const ProficiencyLanguageLevel = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper Intermediate",
    "Advanced",
    "Proficient",
    "Native"
];

const InternshipTypesFrancophone = [
    "Stage d'observation",
    "Stage d'initiation",
    "Stage pratique",
    "Stage de perfectionnement",
    "Stage de fin d'études",
    "Stage professionnel",
    "Stage en entreprise",
    "Stage académique"
];

const InternshipDurations = [
    "Less than 1 month",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "More than 1 year"
];
const OCPMajorFields = [
    "Mining Engineering",
    "Geology",
    "Chemical Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Industrial Engineering",
    "Process Engineering",
    "Environmental Science",
    "Information Technology",
    "Data Science",
    "Automation and Instrumentation",
    "Supply Chain Management",
    "AI",
    "Logistics",
    "Business Administration",
    "Finance",
    "Human Resources",
    "Health, Safety and Environment (HSE)",
    "Marketing and Communication",
    "Project Management",
    "Research and Development",
    "Agronomy",
    "Sustainability and Circular Economy"
];

const ApplicationStatus = [
    "pending",
    "accepted",
    "refused",
    "pfs" // pending file submission
]

module.exports = {
    ApplicationStatus,
    Degrees,
    JobTypes,
    ProficiencyLanguageLevel,
    InternshipTypesFrancophone,
    InternshipDurations,
    OCPMajorFields
};