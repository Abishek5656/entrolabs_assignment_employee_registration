import { v4 as uuidv4 } from "uuid";
import { sendMailer } from "../utils/nodemail.js";
import jwt from 'jsonwebtoken';
import employeeDetails from "../resolvers/employee.js";
import emergencyContactDetails from "../resolvers/emergencyContact.js";
import dbConnection from "../db/index.js";
import { NUMBER, where } from "sequelize";

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
  },
  updateEmployeeDetails: async(_,args, context) => {

    const {
      Emp_id,
      firstName, lastName, email,
      skills, address, phoneNumber, emergencyContact,
      employeeJobDetails
    } = args.input;

    try {
      
      const findEmployee = await employeeDetails.findOne({
        where: {
          Emp_id
        }
      })
  
      if(!findEmployee) {
        return {
          code: 400,
          success: false,
          message: "EMployee not found",
          
        }
      }

      const employeeId = findEmployee.dataValues.id;
  
      let updateEmployee = {};

      const { managerId,employeeType,salary,dateOfJoining,department,position} = employeeJobDetails;
  
      // Update fields if they exist in the input
      if (firstName) updateEmployee.firstName = firstName;
      if (lastName) updateEmployee.lastName = lastName;
      if (email) updateEmployee.email = email;
      if (phoneNumber) updateEmployee.phoneNumber = phoneNumber;
  
      if (skills) updateEmployee.skills = skills;
      if (address) updateEmployee.address = address;
   
      if (managerId) updateEmployee.managerId = parseInt(managerId);
      if (employeeType) updateEmployee.employeeType = employeeType;
    if (salary) updateEmployee.salary = salary;

      await employeeDetails.update(updateEmployee, {
        where: { Emp_id }
      });
  for(const contactDetails of emergencyContact) {
    const { id,name, relationship, phoneNumber} = contactDetails;

    let updateEmergencyDetails = {};
    const employeeContact = await emergencyContactDetails.findOne({
     where: {
      id:id,
      employeeId: employeeId
     } 
    })

    if(!employeeContact) {
      return {
        code: 400,
        success: false,
        message: "EmergencyContact not found",
        
      }
    }
    if(name) updateEmergencyDetails.name = name;

    if(relationship) updateEmergencyDetails.relationship = relationship;

    if(phoneNumber) updateEmergencyDetails.phoneNumber = phoneNumber;

    await emergencyContactDetails.update(updateEmergencyDetails, {
      where: { id: id, employeeId: employeeId }
    });
    
  }
      return {
        code: 200,
        success: true,
        message: "Employee details updated successfully"
      };


    } catch (e) {

        if (e && e.original && e.original.sqlMessage) {
        return {
          code: 400,
          success: false,
          message: e.original.sqlMessage,
          
        };
      }
  
      return {
        code: 400,
        success: false,
        message: e.message,
      };
    }
   
  },
  deleteEmployee: async(_, args, context) => {
    const { emp_Id } = args;

    console.log("employeeId", emp_Id)


    try {
      
      const findEmployee = await employeeDetails.findOne({
        where: {
          Emp_id: emp_Id
        }
      });
  
      if(!findEmployee) {
        return { 
          code: 400,
            success: false,
            message: "EMployee not found",
        }
      }
  
      await employeeDetails.destroy({
        where: {
          Emp_id: emp_Id
        }
      });
  
      return {
        code: 200,
        success: true,
        message: "Employee deleted successfully",
      };
  
    } catch (e) {
      if (e && e.original && e.original.sqlMessage) {
        return {
          code: 400,
          success: false,
          message: e.original.sqlMessage,
          
        };
      }
  
      return {
        code: 400,
        success: false,
        message: e.message,
      };
    }


  
  }

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

  },
 Query: {

  employees: async (_, args, context) => {
    const { page, perPage } = args;
  
    try {
      // Get the total count of employees
      const totalCount = await employeeDetails.count();
      console.log("totalCount #$$-->", totalCount);
  
      // Set default values for pagination
      let pageNumber = page || 1;
      let pagePerLimit = perPage || 10;
  
      // Ensure the page number is at least 1
      if (pageNumber <= 0) {
        pageNumber = 1;
      }
  
      // Calculate the maximum page number based on total count
      const maxPage = Math.ceil(totalCount / pagePerLimit);
  
      // If the requested page number exceeds the maximum, adjust it
      if (pageNumber > maxPage) {
        pageNumber = maxPage;
      }
  
      // Calculate the offset for the query
      const skipPage = (pageNumber - 1) * pagePerLimit;
  
      // Retrieve the employee data with pagination
      const getAllData = await employeeDetails.findAll({
        offset: skipPage,
        limit: pagePerLimit,
      });
  
      console.log("getAllData !@@@-->", getAllData);
  
      // Fetch additional details for each employee
      if (getAllData && getAllData.length > 0) {
        const getAllEmployeeDetails = await Promise.all(
          getAllData.map(async (data) => {
            const { id, Emp_id } = data;
  
            // Fetch emergency contact details
            const getEmergencyContact = await emergencyContactDetails.findAll({
              where: { employeeId: Emp_id },
            });
  
            console.log("getEmergencyContact ###$$@@@@==>", getEmergencyContact);
            console.log("data", data);
  
            return {
              ...data.dataValues,
              emergencyContact: getEmergencyContact,
            };
          })
        );
  
        return {
          code: 200,
          success: true,
          message: "All employee data retrieved successfully",
          employee: getAllEmployeeDetails,
        };
      } else {
        return {
          code: 200,
          success: true,
          message: "No employee data found",
          employee: [],
        };
      }
    } catch (e) {
      console.error("Error:", e);
      if (e && e.original && e.original.sqlMessage) {
        return {
          code: 400,
          success: false,
          message: e.original.sqlMessage,
          employee: null,
        };
      }
  
      return {
        code: 400,
        success: false,
        message: e.message,
        employee: null,
      };
    }
  }
  

  // employees: async(_, args, context) => {


    // const { page, perPage } = args;

    // try {
      

    //   const totalCount = await employeeDetails.count();
    //   console.log("totalCount #$$-->", totalCount);
    
    //   let pageNumber = page || 1;
    //   let pagePerLimit = perPage || 10;

    //   if (page <= 0) {
    //     pageNumber = 1;
    //   }

    //   if (totalCount > 0) {
    //     const maxCount = totalCount - pageNumber * pagePerLimit;

    //     if (maxCount < 0) {
    //       pageNumber = Math.ceil(totalCount / pagePerLimit);
    //     }
    //   }

    //   const skipPage = (pageNumber - 1) * pagePerLimit;


    //   const getAllData = await employeeDetails.findAll({
    //     offset: skipPage || 0,
    //     limit: pagePerLimit || 10,
    //   });

    //   console.log("getAllData !@@@-->", getAllData)


    //   if(getAllData) {

    //     const getAllEmployeeDetails = getAllData.map(async (data) => { 

    //       const { id, Emp_id } = data;

    //       const getEmergencyContact = await emergencyContactDetails.findOne({
    //         id:id,
    //         employeeId: Emp_id
    //       })

    //       console.log("getEmergencyContact ###$$@@@@==>", getEmergencyContact)
    //       console.log("data", data);
    //       return {
    //         ...data.dataValues,

    //       }
    //     })
    //   }
    
    // } catch (e) {
    //   if (e && e.original && e.original.sqlMessage) {
    //     return {
    //       code: 400,
    //       success: false,
    //       message: e.original.sqlMessage,
          
    //     };
    //   }
  
    //   return {
    //     code: 400,
    //     success: false,
    //     message: e.message,
    //   };
  //   const { page, perPage } = args;

  //   try {
  //     // Get the total count of employees
  //     const totalCount = await employeeDetails.count();
  //     console.log("totalCount #$$-->", totalCount);
  
  //     // Set default values for pagination
  //     let pageNumber = page || 1;
  //     let pagePerLimit = perPage || 10;
  
  //     // Ensure the page number is at least 1
  //     if (pageNumber <= 0) {
  //       pageNumber = 1;
  //     }
  
  //     // Calculate the maximum page number based on total count
  //     const maxPage = Math.ceil(totalCount / pagePerLimit);
  
  //     // If the requested page number exceeds the maximum, adjust it
  //     if (pageNumber > maxPage) {
  //       pageNumber = maxPage;
  //     }
  
  //     // Calculate the offset for the query
  //     const skipPage = (pageNumber - 1) * pagePerLimit;
  
  //     // Retrieve the employee data with pagination
  //     const getAllData = await employeeDetails.findAll({
  //       offset: skipPage,
  //       limit: pagePerLimit,
  //     });
  
  //     console.log("getAllData !@@@-->", getAllData);
  
  //     // Fetch additional details for each employee
  //     if (getAllData && getAllData.length > 0) {
  //       const getAllEmployeeDetails = await Promise.all(
  //         getAllData.map(async (data) => {
  //           const { id, Emp_id } = data;
  
  //           // Fetch emergency contact details
  //           const getEmergencyContact = await emergencyContactDetails.findAll({
  //             where: { employeeId: Emp_id },
  //           });
  
  //           console.log("getEmergencyContact ###$$@@@@==>", getEmergencyContact);
  //           console.log("data", data);
  
  //           return {
  //             ...data.dataValues,
  //             emergencyContact: getEmergencyContact,
  //           };
  //         })
  //       );
  
  //       return {
  //         code: 200,
  //         success: true,
  //         message: "all employee data",
  //         employee:  getAllEmployeeDetails
  //       }
       
  //   } catch {
  //     if (e && e.original && e.original.sqlMessage) {
  //       return {
  //         code: 400,
  //         success: false,
  //         message: e.original.sqlMessage,
  //         employee: null
  //       };
  //     }
  //   }
  // }
  
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
