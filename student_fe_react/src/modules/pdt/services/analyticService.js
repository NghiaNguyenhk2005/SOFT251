// src/services/analyticsService.js

// Student growth over 6 months (Oct–Mar)
export function getStudentGrowthData() {
  return [
    { month: "Oct", students: 120 },
    { month: "Nov", students: 180 },
    { month: "Dec", students: 260 },
    { month: "Jan", students: 340 },
    { month: "Feb", students: 420 },
    { month: "Mar", students: 500 },
  ];
}

// Faculty distribution (total ~500 students)
export function getFacultyData() {
  return [
    { name: "CS", value: 220 }, // Computer Science booming
    { name: "EE", value: 90 },  // Electrical Engineering struggling
    { name: "ME", value: 120 }, // Mechanical steady
    { name: "CE", value: 70 },  // Civil smaller
  ];
}

// Tutor distribution by subject
export function getTutorData() {
  return [
    { subject: "Math", tutors: 15 },
    { subject: "Physics", tutors: 9 },
    { subject: "CS", tutors: 18 },
    { subject: "EE", tutors: 7 }, // shortage here
    { subject: "ME", tutors: 12 },
    { subject: "CE", tutors: 10 },
  ];
}