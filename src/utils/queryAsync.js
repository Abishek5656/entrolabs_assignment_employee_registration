import connectDB from "../db/index.js";

const queryAsync = async (sql, values) => {
    try {
        const conn = await connectDB(); // Wait for connection to be established
        return new Promise((resolve, reject) => {
            conn.query(sql, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        throw new Error('Error connecting to database:', error);
    }
};

export default queryAsync;