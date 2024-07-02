import queryAsync from "../utils/queryAsync.js";
import { v4 as uuidv4 } from "uuid";
import { sendMailer } from "../utils/nodemail.js";

const employeeResolver = {
  Mutation: {
    createEmployee: async (_, args, context) => {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        skills,
        address,
        emergencyContact,
        employeeJobDetails,
      } = args.input;

      try {
        if (
          !firstName ||
          !lastName ||
          !email ||
          !phoneNumber ||
          !skills ||
          !address?.street ||
          !address?.city ||
          !address?.state ||
          !address?.postalCode ||
          !address?.country ||
          !emergencyContact?.emergencyContactName ||
          !emergencyContact?.emergencyContactRelation ||
          !emergencyContact?.emergencyContactNumber ||
          !employeeJobDetails?.employeeType ||
          !employeeJobDetails?.salary ||
          !employeeJobDetails?.dateOfJoining ||
          !employeeJobDetails?.department ||
          !employeeJobDetails?.position
        ) {
          return {
            code: 400,
            success: false,
            message: "All fields are required for employee creation",
            employee: null,
            employeeJobDetails: null,
            address: null,
            emergencyContact: null,
          };
        }

        const empID = uuidv4().replace(/-/g, "").substr(0, 16);

        const insertQuery = ` 
        INSERT INTO Employee (
  Emp_id,
  firstName,
  lastName,
  email,
  position,
  department,
  dateOfJoining,
  phoneNumber,
  street,
  city,
  state,
  postalCode,
  country,
  salary,
  employmentType,
  skills,
  emergencyContactName,
  emergencyContactRelationship,
  emergencyContactPhoneNumber,
  createdAt,
  updatedAt
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`;

        if (insertQuery) {
          await sendMailer(email,firstName);
        }

        // Extract address details
        const address_street = address?.street || null;
        const address_city = address?.city || null;
        const address_state = address?.state || null;
        const address_postalCode = address?.postalCode || null;
        const address_country = address?.country || null;

        // Extract emergency contact details
        const emergencyContact_name =
          emergencyContact?.emergencyContactName || null;
        const emergencyContact_relationship =
          emergencyContact?.emergencyContactRelation || null;
        const emergencyContact_phoneNumber =
          emergencyContact?.emergencyContactNumber || null;

        // Extract job details
        const position = employeeJobDetails?.position || null;
        const department = employeeJobDetails?.department || null;
        const dateOfJoining = employeeJobDetails?.dateOfJoining || null;
        const salary = employeeJobDetails?.salary || null;
        const employmentType = employeeJobDetails?.employeeType || null;

        const insertedEmployee = await queryAsync(insertQuery, [
          empID,
          firstName,
          lastName,
          email,
          position,
          department,
          dateOfJoining,
          phoneNumber,
          address_street,
          address_city,
          address_state,
          address_postalCode,
          address_country,
          salary,
          employmentType,
          JSON.stringify(skills),
          emergencyContact_name,
          emergencyContact_relationship,
          emergencyContact_phoneNumber,
        ]);

        // console.log("insertedEmployee Data");
        // console.log(insertedEmployee);

        return {
          code: 201,
          success: true,
          message: "Employee created successfully",
        };
      } catch (err) {
        console.error("Error creating employee:", err);

        return {
          code: err.extensions?.response?.status || 500,
          success: false,
          message: err.message || "Internal Server Error",
        };
      }
    },
    loginEmployee: async (_, args, context) => {
      const { emp_Id, email, phoneNumber } = args.input;

      try {
        const searchQuery = `SELECT * FROM employee WHERE Emp_id = ?`;

        const searchEmployee = await queryAsync(searchQuery, [emp_Id]);

        console.log("searchEmployee");
        console.log(searchEmployee);

        if (!searchEmployee.length) {
          // Assuming searchEmployee is an array
          return {
            code: 400,
            success: false,
            message: "Employee Not Found",
          };
        }

        // Process the found employee details as needed
        return {
          code: 200,
          success: true,
          message: "Employee found",
        };
      } catch (err) {
        console.error("Error searching employee:", err);
        return {
          code: 500,
          success: false,
          message: "Internal Server Error",
        };
      }
    },
    updateEmployeeDetails: async (_, args, context) => {
      const { emp_id, managerID } = args.input;

      try {
        console.log("inside the updateEmployeeDetails");
        console.log("emp_id");
        console.log(emp_id);
        console.log("manager");
        console.log(managerID);

        if (!emp_id) {
          return {
            code: 400,
            success: false,
            message: "Employee ID is required",
          };
        }

        const updateQuery = `UPDATE employee SET  managerID = ?,  updatedAt = NOW() 
      WHERE Emp_id = ?`;

        const updateValues = [managerID, emp_id];

        const updateEmployee = await queryAsync(updateQuery, updateValues);

        if (updateEmployee.affectedRows === 0) {
          return {
            code: 404,
            success: false,
            message: "Employee not found",
          };
        }

        return {
          code: 200,
          success: true,
          message: "Employee details updated successfully",
        };
      } catch (err) {
        return {
          code: err.extensions?.response?.status || 500,
          success: false,
          message: err.message || "Internal Server Error",
        };
      }
    },
    deleteEmployeeDetails: async (_, args, context) => {
      const { emp_Id } = args;

      try {
        // Check if emp_Id is provided
        if (!emp_Id) {
          return {
            code: 400,
            success: false,
            message: "Employee ID is required",
          };
        }

        const deleteQuery = `DELETE FROM employee WHERE Emp_id = ?`;

        const deleteEmployee = await queryAsync(deleteQuery, [emp_Id]);

        if (deleteEmployee.affectedRows === 0) {
          return {
            code: 404,
            success: false,
            message: "Employee not found",
          };
        }

        return {
          code: 200,
          success: true,
          message: "Employee deleted successfully",
        };
      } catch (err) {
        console.error("Error deleting employee:", err);

        return {
          code: err.extensions?.response?.status || 500,
          success: false,
          message: err.message || "Internal Server Error",
        };
      }
    },
  },
  Query: {
    employees: async (_, args, context) => {
      const { currentPage } = args;
      try {
        const countQuery = `SELECT COUNT(*) as totalRecords FROM employee`;
        const countResult = await queryAsync(countQuery);
        const Number_Of_Record = countResult[0].totalRecords;

        // Pagination calculations
        const records_per_page = 4;
        const pages = Math.ceil(Number_Of_Record / records_per_page);

        if (currentPage === 0) {
          const getAllRecordsQuery = `SELECT * FROM employee`;
          const getAllRecords = await queryAsync(getAllRecordsQuery);

          const employees = getAllRecords.map((emp) => ({
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            phoneNumber: emp.phoneNumber,
            skills: JSON.parse(emp.skills),
          }));

          return { employees };
        }
        const OFFSET = (currentPage - 1) * records_per_page;

        // Fetch the employees for the current page
        const getEmployeesQuery = `SELECT * FROM employee LIMIT ? OFFSET ?`;
        const getEmployees = await queryAsync(getEmployeesQuery, [
          records_per_page,
          OFFSET,
        ]);

        const employees = getEmployees.map((emp) => ({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phoneNumber: emp.phoneNumber,
          skills: JSON.parse(emp.skills),
        }));

        return {
          employees,
          records_per_page,
          pages,
          currentPage,
          totalRecords: Number_Of_Record,
        };
      } catch (err) {
        console.log(err);
        return {
          records_per_page: null,
          pages: null,
          currentPage: null,
          totalRecords: null,
          employees: null,
        };
      }
    },
    employee: async (_, args, context) => {
      try {
        const { emp_Id } = args;

        if (!emp_Id) {
          return {
            code: 400,
            success: false,
            message: "Employee ID is required",
          };
        }

        const getByIdQuery = `SELECT * FROM employee WHERE Emp_id= ?`;

        const getEmployee = await queryAsync(getByIdQuery, [emp_Id]);

        if (getEmployee.length === 0) {
          return {
            code: 404,
            success: false,
            message: "Employee not found",
          };
        }

        return {
          code: 200,
          success: true,
          message: "Employee retrieved successfully",
        };
      } catch (err) {
        return {
          code: err.extensions?.response?.status || 500,
          success: false,
          message: err.message || "Internal Server Error",
        };
      }
    },
  },
};

export default employeeResolver;
