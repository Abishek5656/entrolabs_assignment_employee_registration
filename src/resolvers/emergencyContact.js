// import { Sequelize } from "sequelize";
// import dbConnection from "../db/index.js";
// import employeeDetails from "../resolvers/employee.js";

// const emergencyContactDetails = dbConnection.define(
//     'emergencyContact',
//     {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         employeeId: {
//             type:Sequelize.STRING,
//             allowNull: false,
//             references: {
//                 model: employeeDetails, // Referring to the employee model
//                 key: ' Emp_id'
//             },
//             onDelete: 'CASCADE' // Ensures deletion of related contacts when an employee is deleted
//         },
//         name: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         relationship: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         phoneNumber: {
//             type: Sequelize.STRING,
//             allowNull: false
//         }
//     },
//     {
//         freezeTableName: true,
//         timestamps: false // No timestamps for emergency contacts
//     }
// );

// export default emergencyContactDetails;

// emergencyContact.js
import { Sequelize } from "sequelize";
import dbConnection from "../db/index.js";
import employeeDetails from "./employee.js"; // Ensure the path is correct

const emergencyContactDetails = dbConnection.define(
    'emergencyContact',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employeeId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: employeeDetails, // Referring to the employee model
                key: 'id' // Corrected key reference without extra space
            },
            onDelete: 'CASCADE' // Ensures deletion of related contacts when an employee is deleted
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        relationship: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false // No timestamps for emergency contacts
    }
);

export default emergencyContactDetails;

