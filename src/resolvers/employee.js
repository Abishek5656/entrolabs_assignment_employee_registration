import { Sequelize } from "sequelize";
import dbConnection from "../db/index.js";

const employeeDetails = dbConnection.define(
    'employee',
    {
        Emp_id: {
            type: Sequelize.STRING
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        position: {
            type: Sequelize.STRING
        },
        department: {
            type: Sequelize.STRING
        },
        dateOfJoining: {
            type: Sequelize.STRING 
        },
        phoneNumber: {
            type: Sequelize.STRING
        },
        street: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        postalCode: {
            type: Sequelize.STRING 
        },
        country: {
            type: Sequelize.STRING 
        },
        salary: {
            type: Sequelize.INTEGER 
        },
        managerId: {
            type: Sequelize.INTEGER
        },
        employmentType: {
            type: Sequelize.STRING,
        },
        skills: {
            type: Sequelize.JSON, // Use Sequelize.JSON to store an array of skills
        },
    },
    {
        freezeTableName: true,
        timestamps: false

    }
);

export default employeeDetails;