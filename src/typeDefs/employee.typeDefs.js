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
    id:ID
    employeeId:ID
    name: String             
    relationship: String      
    phoneNumber: String 
}

type CreateEmployeeResponse {
  code: Int
  success: Boolean
  message: String
}


type UpdateEmployeeDetailsResponse {
 code: Int
  success: Boolean
  message: String 
}

type DeleteEmployeeResponse {
    code: Int
  success: Boolean
  message: String
}

type getAllEmployeeDetailsResponse {
    id: ID
    Emp_id: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    address: Address
    emergencyContact: [EmergencyContact]
    employeeJobDetails: EmployeeJobDetails
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
    id:ID
    employeeId:ID
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

input UpdateEmployeeDetailsInput {
    id:ID
    Emp_id: String
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    skills: [String]
    address: AddressInput
    emergencyContact: [EmergencyContactInput]
    employeeJobDetails:EmployeeJobDetailsInput
}

type Mutation {
    createEmployee(input: CreateEmployeeInput): CreateEmployeeResponse
    updateEmployeeDetails(input: UpdateEmployeeDetailsInput): UpdateEmployeeDetailsResponse
    deleteEmployee(emp_Id: String):DeleteEmployeeResponse
}

type Query {
    employees(page: Int, perPage:Int ): [getAllEmployeeDetailsResponse]
}
`;

export default employeeTypeDef;
