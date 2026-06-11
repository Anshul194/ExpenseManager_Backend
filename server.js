import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// connect to database then start the express server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server started on port ${PORT}`);
    });
}).catch((err) => {
    console.log("db connection failed", err);
    process.exit(1);
});
