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

        for (const contact of emergencyContact) {
          console.log("contact", contact)
          const { name, relationship, phoneNumber } = contact
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
    updateEmployeeDetails: async (_, args, context) => {

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

        if (!findEmployee) {
          return {
            code: 400,
            success: false,
            message: "EMployee not found",

          }
        }

        const employeeId = findEmployee.dataValues.id;

        let updateEmployee = {};

        const { managerId, employeeType, salary, dateOfJoining, department, position } = employeeJobDetails;

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
        for (const contactDetails of emergencyContact) {
          const { id, name, relationship, phoneNumber } = contactDetails;

          let updateEmergencyDetails = {};
          const employeeContact = await emergencyContactDetails.findOne({
            where: {
              id: id,
              employeeId: employeeId
            }
          })

          if (!employeeContact) {
            return {
              code: 400,
              success: false,
              message: "EmergencyContact not found",

            }
          }
          if (name) updateEmergencyDetails.name = name;

          if (relationship) updateEmergencyDetails.relationship = relationship;

          if (phoneNumber) updateEmergencyDetails.phoneNumber = phoneNumber;

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
    deleteEmployee: async (_, args, context) => {
      const { emp_Id } = args;
      try {

        const findEmployee = await employeeDetails.findOne({
          where: {
            Emp_id: emp_Id
          }
        });

        if (!findEmployee) {
          return {
            code: 400,
            success: false,
            message: "Employee not found",
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

  },
  Query: {

    employees: async (_, args, context) => {
      const { page, perPage } = args;

      try {

        const totalCount = await employeeDetails.count();

        let pageNumber = page || 1;
        let pagePerLimit = perPage || 10;

        if (pageNumber <= 0) {
          pageNumber = 1;
        }

        const maxPage = Math.ceil(totalCount / pagePerLimit);

        if (pageNumber > maxPage) {
          pageNumber = maxPage;
        }

        const skipPage = (pageNumber - 1) * pagePerLimit;

        const getAllData = await employeeDetails.findAll({
          offset: skipPage,
          limit: pagePerLimit,
        });

      let storeemployeeDetails = [];

      if (getAllData && getAllData.length > 0) {
        // Mapping through each employee
        storeemployeeDetails = await Promise.all(getAllData.map(async (emp) => {
          const {
            id, Emp_id, firstName, lastName, email, phoneNumber, skills,
            street, city, state, postalCode, country,
            managerId, employmentType, salary, dateOfJoining, department, position
          } = emp.dataValues;
  
          // Fetching emergency contacts for the employee

          const parsedSkills = JSON.parse(skills);

          const emergencyContact = await emergencyContactDetails.findAll({
            where: { employeeId: id },
          });
  
          // Constructing the employee details with emergency contacts
          return {
            id,
            Emp_id,
            firstName,
            lastName,
            email,
            phoneNumber,
            skills: parsedSkills,
            address: {
              street,
              city,
              state,
              postalCode,
              country
            },
            employeeJobDetails: {
              managerId,
              employmentType,
              salary,
              dateOfJoining,
              department,
              position
            },
            emergencyContact // Attach emergency contacts here
          };
        }));
      }
  
      console.log("storeemployeeDetails:", storeemployeeDetails);
  
      return storeemployeeDetails;


      } catch (e) {

        return {
          employee: [],
        };
      }
    }


  }
};

export default employeeResolver;
