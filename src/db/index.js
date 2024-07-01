import mysql from 'mysql';

const connectDB = async () => {
    try {
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'emp_db'
        });

        // Connect to MySQL
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err.stack);
                return;
            }
            // Create tables if they don't exist
            const createTables = `
                CREATE TABLE IF NOT EXISTS Employee (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    Emp_id VARCHAR(16) NOT NULL UNIQUE,
                    firstName VARCHAR(50) NOT NULL,
                    lastName VARCHAR(50) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    position VARCHAR(100) NOT NULL,
                    department VARCHAR(100) NOT NULL,
                    dateOfJoining DATE NOT NULL,
                    phoneNumber VARCHAR(15) NOT NULL,
                    street VARCHAR(255) NOT NULL,
                    city VARCHAR(100) NOT NULL,
                    state VARCHAR(100) NOT NULL,
                    postalCode VARCHAR(20) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    salary DECIMAL(10, 2) NOT NULL,
                    managerId INT,
                    employmentType VARCHAR(50) NOT NULL,
                    skills JSON NOT NULL,
                    emergencyContactName VARCHAR(100) NOT NULL,
                    emergencyContactRelationship VARCHAR(50) NOT NULL,
                    emergencyContactPhoneNumber VARCHAR(15) NOT NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `;

            connection.query(createTables, (error, results, fields) => {
                if (error) {
                    console.error('Error creating tables:', error);
                }
            });
        });

        return connection; // Return the connection object

    } catch (error) {
        console.log("MySQL connection FAILED", error);
        process.exit(1);
    }
};

export default connectDB;
