import {  mergeTypeDefs } from "@graphql-tools/merge";


import employeeTypeDef from "./employee.typeDefs.js";

const mergedTypeDefs = mergeTypeDefs([employeeTypeDef]);

export default  mergedTypeDefs;