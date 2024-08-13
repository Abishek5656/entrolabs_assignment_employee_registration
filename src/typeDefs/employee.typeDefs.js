const employeeTypeDef = `#graphql 

type Employee {
    id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    createdAt: String
    updatedAt: String
}

type Employee1 {
    id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    address: Address 
  emergencyContact: [EmergencyContact]
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
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    address: AddressInput
    emergencyContact: [EmergencyContactInput]
    employeeJobDetails: EmployeeJobDetailsInput
}
 
input UpdateEmployeeDetailsInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    address: AddressInput
    emergencyContact: [EmergencyContactInput]
    employeeJobDetails: EmployeeJobDetailsInput
}


input LoginEmployeeDetailsInput {
    email: String
    phoneNumber: String
}

input EmployeeInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
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
  token: String
}

type GetALLEmployeesResponse {
    records_per_page: Int
    pages: Int
    currentPage: Int
    totalRecords: Int
   employees: [Employee1]
}

type GetEmployeeByIdResponse {
  code: Int
  success: Boolean
  message: String
}

type UpdateEmployeeDetailsResponse {
  code: Int
  success: Boolean
  message: String
}

type LoginEmployeeResponse {
  code: Int
  success: Boolean
  message: String
  token: String
  refreshToken: String
}

type DeleteEmployeeDetailsResponse {
  code: Int
  success: Boolean
  message: String
}

type Query {
    employees(currentPage: Int!): GetALLEmployeesResponse
    employee: GetEmployeeByIdResponse
}

type Mutation {
    createEmployee(input: CreateEmployeeInput): CreateEmployeeResponse
    loginEmployee(input: LoginEmployeeDetailsInput): LoginEmployeeResponse
   updateEmployeeDetails(input: UpdateEmployeeDetailsInput): UpdateEmployeeDetailsResponse!
    deleteEmployeeDetails: DeleteEmployeeDetailsResponse
}
`;

export default employeeTypeDef;
