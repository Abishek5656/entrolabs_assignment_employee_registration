import { v4 as uuidv4 } from "uuid";
import { sendMailer } from "../utils/nodemail.js";
import jwt from 'jsonwebtoken';
import employeeDetails from "../resolvers/employee.js";
import emergencyContactDetails from "../resolvers/emergencyContact.js";
import dbConnection from "../db/index.js";

const employeeResolver = {
  Mutation: {
  createEmployee: async (_, args, context) => {
    
    const {
      firstName, lastName, email,
      skills, address, phoneNumber, emergencyContact,
      employeeJobDetails
    } = args.input;
  
    // console.log("employeeJobDetails @@-->", employeeJobDetails);
    console.log("emergencyContact", emergencyContact);
  
    try {
     

      if (
        !firstName || !lastName || !email || !phoneNumber || !skills ||
        !address?.street || !address?.city || !address?.state || !address?.postalCode || !address?.country ||
        !emergencyContact?.length ||
        !employeeJobDetails?.employeeType || !employeeJobDetails?.salary ||
        !employeeJobDetails?.dateOfJoining || !employeeJobDetails?.department || !employeeJobDetails?.position
      ) {
        return {
          code: 400,
          success: false,
          message: "All fields are required for employee creation",
          token: null
        };
      }
  
      const empID = uuidv4().replace(/-/g, "").substr(0, 16);
      const employeeDetail = {
        Emp_id: empID,
        firstName,
        lastName,
        email,
        phoneNumber,
        position: employeeJobDetails?.position,
        department: employeeJobDetails?.department,
        dateOfJoining: employeeJobDetails?.dateOfJoining,
        street: address?.street,
        city: address?.city,
        state: address?.state,
        postalCode: address?.postalCode,
        country: address?.country,
        salary: employeeJobDetails?.salary,
        employmentType: employeeJobDetails?.employeeType,
        skills,
      };
  

      const employee = await employeeDetails.create(employeeDetail);
      console.log("employee @@@@-->", employee.dataValues.id)
  
  

      for (const contact of emergencyContact) {
        console.log("contact", contact)
        const { name, relationship, phoneNumber} = contact
        let emergencyContact1 = {
          employeeId: employee.dataValues.id,  
          name,       
          relationship,
          phoneNumber
        };

       const employeeContact = await emergencyContactDetails.create(emergencyContact1);

       console.log("employeeContact", employeeContact);
       
      }

      return {
        code: 200,
        success: true,
        message: "Employee created successfully",
        token: null  
      };
  
    } catch (e) {
  
      if (e && e.original && e.original.sqlMessage) {
        return {
          code: 400,
          success: false,
          message: e.original.sqlMessage,
          token: null
        };
      }
  
      return {
        code: 400,
        success: false,
        message: e.message,
        token: null
      };
    }
  }
  

// createEmployee: async (_, args, context) => {
//   const {
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       skills,
//       address,
//       emergencyContact,
//       employeeJobDetails,
//   } = args.input;

//   try {

//       if (
//           !firstName ||
//           !lastName ||
//           !email ||
//           !phoneNumber ||
//           !skills ||
//           !address?.street ||
//           !address?.city ||
//           !address?.state ||
//           !address?.postalCode ||
//           !address?.country ||
//           !emergencyContact?.length ||
//           !employeeJobDetails?.employeeType ||
//           !employeeJobDetails?.salary ||
//           !employeeJobDetails?.dateOfJoining ||
//           !employeeJobDetails?.department ||
//           !employeeJobDetails?.position
//       ) 
//       {
//           return {
//               code: 400,
//               success: false,
//               message: "All fields are required for employee creation",
//               employee: null,
//               employeeJobDetails: null,
//               address: null,
//               emergencyContact: null,
//           };
//       }

//       const empID = uuidv4().replace(/-/g, "").substr(0, 16);

//       // Insert into Employee table
//       const insertEmployeeQuery = `
//           INSERT INTO Employee (
//               Emp_id,
//               firstName,
//               lastName,
//               email,
//               position,
//               department,
//               dateOfJoining,
//               phoneNumber,
//               street,
//               city,
//               state,
//               postalCode,
//               country,
//               salary,
//               employmentType,
//               skills,
//               createdAt,
//               updatedAt
//           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//       `;

//       const employeeResult= await queryAsync(insertEmployeeQuery, [
//           empID,
//           firstName,
//           lastName,
//           email,
//           employeeJobDetails.position,
//           employeeJobDetails.department,
//           employeeJobDetails.dateOfJoining,
//           phoneNumber,
//           address.street,
//           address.city,
//           address.state,
//           address.postalCode,
//           address.country,
//           employeeJobDetails.salary,
//           employeeJobDetails.employeeType,
//           JSON.stringify(skills)
//       ]);

//       const employeeId = employeeResult.insertId;

//       const insertEmergencyContactQuery = `
//     INSERT INTO EmergencyContact (
//         employeeId,
//         name,
//         relationship,
//         phoneNumber
//     ) VALUES (?, ?, ?, ?)
// `;

// if (Array.isArray(emergencyContact) && emergencyContact.length > 0) {

//   console.log("emergencyContact inside the if",emergencyContact);
  
//     for (const contact of emergencyContact) {
//         await queryAsync(insertEmergencyContactQuery, [
//             employeeId, // Use the employeeId from the insert result
//             contact.emergencyContactName,
//             contact.emergencyContactRelation,
//             contact.emergencyContactNumber,
//         ]);
//     }
// } else {
//     console.error("Emergency contacts are not in the expected format or are empty.");
// }
//       return {
//           code: 201,
//           success: true,
//           message: "Employee created successfully",
//       };

//   } catch (err) {
//       console.error("Error creating employee:", err);

//       return {
//           code: err.extensions?.response?.status || 500,
//           success: false,
//           message: err.message || "Internal Server Error",
//       };
//   }
// },
//     loginEmployee: async (_, args, context) => {

//       const {  email, phoneNumber } = args.input;

//            console.log("email -->", email);
//            console.log("phoneNumber -->", phoneNumber);
           
          
//       try {
//         const searchQuery = `SELECT * FROM employee WHERE email = ?`;

//         const searchEmployee = await queryAsync(searchQuery, [email]);

//         console.log("searchEmployee @@###--->", searchEmployee)

//         const token = jwt.sign(
//           {
//             empId: searchEmployee[0].Emp_id,
//             empEmail: searchEmployee[0].email,
//             empPhoneNumber: searchEmployee[0].phoneNumber
//           },
//           process.env.JWT_TOKEN_SECRET,
//           { expiresIn: "30m" }
//         );

//         const refreshToken = jwt.sign(
//           {
//             empId: searchEmployee[0].Emp_id,
//             empEmail: searchEmployee[0].email,
//             empPhoneNumber: searchEmployee[0].phoneNumber
//           },
//           process.env.REFRESH_TOKEN_SECRET,
//           { expiresIn: "7d" }
//         );
      

//         if (!searchEmployee.length) {
//           // Assuming searchEmployee is an array
//           return {
//             code: 400,
//             success: false,
//             message: "Employee Not Found",
//             token: null,
//             refreshToken: null
//           };
//         }

//         // Process the found employee details as needed
//         return {
//           code: 200,
//           success: true,
//           message: "Employee found",
//           token: token,
//           refreshToken: refreshToken
//         };
//       } catch (err) {
//         console.error("Error searching employee:", err);
//         return {
//           code: 500,
//           success: false,
//           message: "Internal Server Error",
//           token: null,
//           refreshToken: null
//         };
//       }
//     },
//     updateEmployeeDetails: async (_, args, context) => {
//       const { emp } = context;
//       const empId = emp.empId;
  
//       // Destructure the input
//       const { firstName, lastName, email, phoneNumber, skills, address, emergencyContact, employeeJobDetails } = args.input;
  
//       // Prepare the fields to update
//       const fieldsToUpdate = [];
//       const valuesToUpdate = [];
  
//       if (firstName) {
//           fieldsToUpdate.push('firstName = ?');
//           valuesToUpdate.push(firstName);
//       }
//       if (lastName) {
//           fieldsToUpdate.push('lastName = ?');
//           valuesToUpdate.push(lastName);
//       }
//       if (email) {
//           fieldsToUpdate.push('email = ?');
//           valuesToUpdate.push(email);
//       }
//       if (phoneNumber) {
//           fieldsToUpdate.push('phoneNumber = ?');
//           valuesToUpdate.push(phoneNumber);
//       }
//       if (skills) {
//           fieldsToUpdate.push('skills = ?');
//           valuesToUpdate.push(JSON.stringify(skills));
//       }
//       if (address) {
//           fieldsToUpdate.push('street = ?, city = ?, state = ?, postalCode = ?, country = ?');
//           valuesToUpdate.push(address.street, address.city, address.state, address.postalCode, address.country);
//       }
//       if (employeeJobDetails) {
//           if (employeeJobDetails.position) {
//               fieldsToUpdate.push('position = ?');
//               valuesToUpdate.push(employeeJobDetails.position);
//           }
//           if (employeeJobDetails.department) {
//               fieldsToUpdate.push('department = ?');
//               valuesToUpdate.push(employeeJobDetails.department);
//           }
//           if (employeeJobDetails.salary) {
//               fieldsToUpdate.push('salary = ?');
//               valuesToUpdate.push(employeeJobDetails.salary);
//           }
//           if (employeeJobDetails.employeeType) {
//               fieldsToUpdate.push('employmentType = ?');
//               valuesToUpdate.push(employeeJobDetails.employeeType);
//           }
//           if (employeeJobDetails.dateOfJoining) {
//               fieldsToUpdate.push('dateOfJoining = ?');
//               valuesToUpdate.push(employeeJobDetails.dateOfJoining);
//           }
//           if (employeeJobDetails.managerId) {
//               fieldsToUpdate.push('managerId = ?');
//               valuesToUpdate.push(employeeJobDetails.managerId);
//           }
//       }
  
//       // Construct the SQL update query for Employee
//       if (fieldsToUpdate.length === 0) {
//           return {
//               code: 400,
//               success: false,
//               message: "No fields to update.",
//           };
//       }
  
//       const updateQuery = `UPDATE Employee SET ${fieldsToUpdate.join(', ')}, updatedAt = NOW() WHERE Emp_id = ?`;
//       valuesToUpdate.push(empId); // Add the employee ID to the end of the values
  
//       try {
//           const updateEmployee = await queryAsync(updateQuery, valuesToUpdate);
  
//           if (updateEmployee.affectedRows === 0) {
//               return {
//                   code: 404,
//                   success: false,
//                   message: "Employee not found",
//               };
//           }
  
//           // Handle emergency contact updates
//           if (emergencyContact && Array.isArray(emergencyContact) && emergencyContact.length > 0) {
//               // Retrieve the employee's ID from the Employee table
//               const employeeIdQuery = `SELECT id FROM Employee WHERE Emp_id = ?`;
//               const employeeIdResult = await queryAsync(employeeIdQuery, [empId]);
              
//               if (employeeIdResult.length === 0) {
//                   return {
//                       code: 404,
//                       success: false,
//                       message: "Employee ID not found",
//                   };
//               }
  
//               const employeeId = employeeIdResult[0].id;
  
//               for (const contact of emergencyContact) {
//                   const { emergencyContactName, emergencyContactRelation, emergencyContactNumber } = contact;
  
//                   const emergencyContactQuery = `INSERT INTO EmergencyContact (employeeId, name, relationship, phoneNumber) 
//                                                   VALUES (?, ?, ?, ?)
//                                                   ON DUPLICATE KEY UPDATE 
//                                                       relationship = ?, 
//                                                       phoneNumber = ?`;
  
//                   const emergencyContactValues = [
//                       employeeId, 
//                       emergencyContactName, 
//                       emergencyContactRelation, 
//                       emergencyContactNumber,
//                       emergencyContactRelation,
//                       emergencyContactNumber
//                   ];
  
//                   await queryAsync(emergencyContactQuery, emergencyContactValues);
//               }
//           }
  
//           return {
//               code: 200,
//               success: true,
//               message: "Employee details updated successfully",
//           };
//       } catch (err) {
//           console.error("Error updating employee:", err);
//           return {
//               code: err.extensions?.response?.status || 500,
//               success: false,
//               message: err.message || "Internal Server Error",
//           };
//       }
//   },
//     deleteEmployeeDetails: async (_, args, context) => {
//       const { emp  }  = context;
//       const empId = emp.empId;

//       try {
//         // Check if emp_Id is provided
//         if (!empId) {
//           return {
//             code: 400,
//             success: false,
//             message: "Employee ID is required",
//           };
//         }

//         const deleteQuery = `DELETE FROM employee WHERE Emp_id = ?`;

//         const deleteEmployee = await queryAsync(deleteQuery, [empId]);

//         if (deleteEmployee.affectedRows === 0) {
//           return {
//             code: 404,
//             success: false,
//             message: "Employee not found",
//           };
//         }

//         return {
//           code: 200,
//           success: true,
//           message: "Employee deleted successfully",
//         };
//       } catch (err) {
//         console.error("Error deleting employee:", err);

//         return {
//           code: err.extensions?.response?.status || 500,
//           success: false,
//           message: err.message || "Internal Server Error",
//         };
//       }
//     },


  },
 Query: {
  //   // employees: async (_, args, context) => {
  //   //   // const { currentPage } = args;
  //   //   // try {
  //   //   //   const countQuery = `SELECT COUNT(*) as totalRecords FROM employee`;
  //   //   //   const countResult = await queryAsync(countQuery);
  //   //   //   const Number_Of_Record = countResult[0].totalRecords;

  //   //   //   // Pagination calculations
  //   //   //   const records_per_page = 4;
  //   //   //   const pages = Math.ceil(Number_Of_Record / records_per_page);

  //   //   //   if (currentPage === 0) {
  //   //   //     const getAllRecordsQuery = `SELECT * FROM employee`;
  //   //   //     const getAllRecords = await queryAsync(getAllRecordsQuery);

  //   //   //     const employees = getAllRecords.map((emp) => ({
  //   //   //       firstName: emp.firstName,
  //   //   //       lastName: emp.lastName,
  //   //   //       email: emp.email,
  //   //   //       phoneNumber: emp.phoneNumber,
  //   //   //       skills: JSON.parse(emp.skills),
  //   //   //     }));

  //   //   //     return { employees };
  //   //   //   }
  //   //   //   const OFFSET = (currentPage - 1) * records_per_page;

  //   //   //   // Fetch the employees for the current page
  //   //   //   const getEmployeesQuery = `SELECT * FROM employee LIMIT ? OFFSET ?`;
  //   //   //   const getEmployees = await queryAsync(getEmployeesQuery, [
  //   //   //     records_per_page,
  //   //   //     OFFSET,
  //   //   //   ]);

  //   //   //   const employees = getEmployees.map((emp) => ({
  //   //   //     firstName: emp.firstName,
  //   //   //     lastName: emp.lastName,
  //   //   //     email: emp.email,
  //   //   //     phoneNumber: emp.phoneNumber,
  //   //   //     skills: JSON.parse(emp.skills),
  //   //   //   }));

  //   //   //   return {
  //   //   //     employees,
  //   //   //     records_per_page,
  //   //   //     pages,
  //   //   //     currentPage,
  //   //   //     totalRecords: Number_Of_Record,
  //   //   //   };
  //   //   // } catch (err) {
  //   //   //   console.log(err);
  //   //   //   return {
  //   //   //     records_per_page: null,
  //   //   //     pages: null,
  //   //   //     currentPage: null,
  //   //   //     totalRecords: null,
  //   //   //     employees: null,
  //   //   //   };
  //   //   // }

  //   //   const { currentPage } = args;

  //   //   try {
  //   //       const countQuery = `SELECT COUNT(*) as totalRecords FROM Employee`;
  //   //       const countResult = await queryAsync(countQuery);
  //   //       const totalRecords = countResult[0].totalRecords;
  
  //   //       const recordsPerPage = 4;
  //   //       const totalPages = Math.ceil(totalRecords / recordsPerPage);
  
  //   //       if (currentPage === 0) {
  //   //           const getAllRecordsQuery = `SELECT * FROM Employee`;
  //   //           const allRecords = await queryAsync(getAllRecordsQuery);
  //   //           // Fetch emergency contacts if necessary


  //   //           const employees = await Promise.all(allRecords.map(async (emp) => {


  //   //             console.log("employee  @@!!! -->",emp);
  //   //             console.log("employeeID@@## -->",emp.id);
                
                
  //   //               const emergencyContactsQuery = `SELECT * FROM EmergencyContact WHERE id = ?`;
  //   //               const emergencyContacts = await queryAsync(emergencyContactsQuery, [emp.id]);

  //   //             console.log("emergencyContacts@@##!!");
                
  //   //               return {
  //   //                   ...emp,
  //   //                   emergencyContact: emergencyContacts.map(ec => ({
  //   //                       emergencyContactName: ec.name,
  //   //                       emergencyContactRelation: ec.relationship,
  //   //                       emergencyContactNumber: ec.phoneNumber,
  //   //                   })),
  //   //               };
  //   //           }));
  
  //   //           return { employees, records_per_page: recordsPerPage, pages: totalPages, currentPage, totalRecords };
  //   //       }
  
  //   //       const offset = (currentPage - 1) * recordsPerPage;
  
  //   //       const getEmployeesQuery = `SELECT * FROM Employee LIMIT ? OFFSET ?`;
  //   //       const employeesResult = await queryAsync(getEmployeesQuery, [recordsPerPage, offset]);
  
  //   //       const employees = await Promise.all(employeesResult.map(async (emp) => {

  //   //         console.log("employees inside the promise all ---> ", emp)

  //   //         console.log("empid @@###<-->", emp.id);
            
  //   //           const emergencyContactsQuery = `SELECT * FROM EmergencyContact WHERE employeeId = ?`;
  //   //           const emergencyContacts = await queryAsync(emergencyContactsQuery, [emp.id]);
  //   //           return {
  //   //               ...emp,
  //   //               emergencyContact: emergencyContacts.map(ec => ({
  //   //                   emergencyContactName: ec.name,
  //   //                   emergencyContactRelation: ec.relationship,
  //   //                   emergencyContactNumber: ec.phoneNumber,
  //   //               })),
  //   //           };
  //   //       }));
  
  //   //       return {
  //   //           employees,
  //   //           records_per_page: recordsPerPage,
  //   //           pages: totalPages,
  //   //           currentPage,
  //   //           totalRecords,
  //   //       };
  //   //   } catch (err) {
  //   //       console.error("Error fetching employees:", err);
  //   //       return {
  //   //           records_per_page: null,
  //   //           pages: null,
  //   //           currentPage: null,
  //   //           totalRecords: null,
  //   //           employees: null,
  //   //       };
  //   //     }
  //   // },
  //   // employee: async (_, args, context) => {

  //   //   const { emp  }  = context;
  //   //   const empId = emp.empId;

  //   //   try {


  //   //     console.log("empId", empId)


  //   //     if (!empId) {
  //   //       return {
  //   //         code: 400,
  //   //         success: false,
  //   //         message: "Employee ID is required",
  //   //       };
  //   //     }

  //   //     const getByIdQuery = `SELECT * FROM employee WHERE Emp_id= ?`;

  //   //     const getEmployee = await queryAsync(getByIdQuery, [empId]);

  //   //     if (getEmployee.length === 0) {
  //   //       return {
  //   //         code: 404,
  //   //         success: false,
  //   //         message: "Employee not found",
  //   //       };
  //   //     }

  //   //     return {
  //   //       code: 200,
  //   //       success: true,
  //   //       message: "Employee retrieved successfully",
  //   //     };
  //   //   } catch (err) {
  //   //     return {
  //   //       code: err.extensions?.response?.status || 500,
  //   //       success: false,
  //   //       message: err.message || "Internal Server Error",
  //   //     };
  //   //   }
  //   },
  // },
}
};

export default employeeResolver;
