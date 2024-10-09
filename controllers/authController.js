import Usermodel from "../models/Usermodel.js"; // Ensure the case matches the export in your model file
import { hashPassword } from "./../helpers/authHelper.js"; // Ensure this function is implemented correctly

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validations
        if (!name) {
            return res.status(400).send({ error: "Name is Required" });
        }
        if (!email) {
            return res.status(400).send({ error: "Email is Required" });
        }
        if (!password) {
            return res.status(400).send({ error: "Password is Required" });
        }
        if (!phone) {
            return res.status(400).send({ error: "Phone no is Required" });
        }
        if (!address) {
            return res.status(400).send({ error: "Address is Required" });
        }

        // Check for existing user
        const existingUser = await Usermodel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Registered, please login",
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Save user
        const user = await new Usermodel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error: error.message || 'Unknown error' // Improved error handling
        });
    }
};
