import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Server is Healthy and running with no errors on port : ${PORT}`);
});

app.listen(PORT , () => {
    console.log(`Server is running on port : ${PORT}`);
});