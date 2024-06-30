const employeeTypeDef = `#graphql 

type Employee {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String!]
    createdAt: String
    updatedAt: String
}

type EmployeeJobDetails {
    managerId: ID
    emp_Id: String
    employeeType: String
    salary: Float
    dateOfJoining: String
    department: String
    position: String
}

type Address {
    street: String
    city: String
    state: String
    postalCode: String
    country: String
}

type EmergencyContact {
    emergencyContactName: String
    emergencyContactRelation: String
    emergencyContactNumber: String
}

input CreateEmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    skills: [String!]!
    address: AddressInput!
    emergencyContact: EmergencyContactInput!
    employeeJobDetails: EmployeeJobDetailsInput!
}
 
input UpdateEmployeeDetailsInput {
    emp_id: String!
    managerID: Int
}



input LoginEmployeeDetailsInput {
    emp_Id: String!
    email: String!
    phoneNumber: String!
}

input EmployeeInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String!]
}

input AddressInput {
    street: String
    city: String
    state: String
    postalCode: String
    country: String
}

input EmergencyContactInput {
    emergencyContactName: String
    emergencyContactRelation: String
    emergencyContactNumber: String
}

input EmployeeJobDetailsInput {
    emp_Id: String
    employeeType: String
    managerId: ID
    salary: Float
    dateOfJoining: String
    department: String
    position: String
}

type CreateEmployeeResponse {
  code: Int!
  success: Boolean!
  message: String!
}

type GetALLEmployeesResponse {
    code: Int!
    success: Boolean!
    message: String!
    employees: [Employee!]!
}

type GetEmployeeByIdResponse {
  code: Int!
  success: Boolean!
  message: String!
}

type UpdateEmployeeDetailsResponse {
  code: Int!
  success: Boolean!
  message: String!
}

type LoginEmployeeResponse {
  code: Int!
  success: Boolean!
  message: String!
}

type DeleteEmployeeDetailsResponse {
  code: Int!
  success: Boolean!
  message: String!
}

type Query {
    employees: GetALLEmployeesResponse!
    employee(emp_Id: String!): GetEmployeeByIdResponse!
}

type Mutation {
    createEmployee(input: CreateEmployeeInput): CreateEmployeeResponse!
    loginEmployee(input: LoginEmployeeDetailsInput): LoginEmployeeResponse!
   
  updateEmployeeDetails(input: UpdateEmployeeDetailsInput!): UpdateEmployeeDetailsResponse!

    deleteEmployeeDetails(emp_Id: String!): DeleteEmployeeDetailsResponse!
}
`;

export default employeeTypeDef;
