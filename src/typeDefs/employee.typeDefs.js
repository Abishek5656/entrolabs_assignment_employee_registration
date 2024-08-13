const employeeTypeDef = `#graphql 
type Employee {
    id: ID
    Emp_id: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    employeeDetails:EmployeeJobDetails
    address: Address
    emergencyContact: [EmergencyContact]
    createdAt: String
    updatedAt: String
}

type EmployeeJobDetails {
    managerId: ID
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
    name: String             
    relationship: String      
    phoneNumber: String 
}

type CreateEmployeeResponse {
  code: Int
  success: Boolean
  message: String
}


input AddressInput {
    street: String
    city: String
    state: String
    postalCode: String
    country: String
}


input CreateEmployeeInput {                         
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    address: AddressInput
    emergencyContact: [EmergencyContactInput]
    employeeJobDetails:EmployeeJobDetailsInput
}

input EmergencyContactInput {
    name: String
    relationship: String
    phoneNumber: String
}

input EmployeeJobDetailsInput {
    managerId: ID
    employeeType: String
    salary: Float
    dateOfJoining: String
    department: String
    position: String
}

type Mutation {
    createEmployee(input: CreateEmployeeInput): CreateEmployeeResponse
}

type Query {
    employee: String
}
`;

export default employeeTypeDef;
