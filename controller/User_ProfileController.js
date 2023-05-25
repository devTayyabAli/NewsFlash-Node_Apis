
const User_Registration_Form = require('../models/User_Registration_Form_Model')
const bcrypt = require('bcrypt');
const twilio = require('twilio');
const sendEmail = require('../sendEmail');

exports.create_user_profile = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const LogIn_data = await User_Registration_Form.find({
            email: email,
        })
        if (LogIn_data.length !== 0) {
            res.status(201).send({
                data: [],
                success: false,
                msg: " This Email Already Registor"
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password.toString(), salt);
            req.body.password = hash

            const data = new User_Registration_Form(req.body)
            console.log("Data", data);
            await data.save()
            res.status(201).send({
                data: data,
                success: true,
                msg: "Thank you for registration"
            })
        }

    } catch (e) {
        console.log(e);
    }
}


exports.User_Sign_in = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body

        // / Find the matching user in the database
        const user = await User_Registration_Form.findOne({
            email
        });
        console.log("user", user);
        if (!user) {
            // If user is not found, return error response
            return res.status(201).send({
                success: false,
                msg: "User not found."
            })

        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // If passwords don't match, return error response

            return res.status(201).send({
                success: false,
                msg: "Invalid password"
            })
        }

        res.status(200).send({
            data: user,
            success: true,
            msg: 'Login successful'
        })

    } catch (e) {
        console.log(e);
    }

}


exports.changePassword = async (req, res) => {
    try {
        const {
            email
        } = req.params;
        const {
            oldPassword,
            newPassword
        } = req.body;

        //find the user from database
        const user = await User_Registration_Form.findOne({
            email
        });
        console.log("user", user);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        //compare the old password with the one saved in database
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({
                message: 'Old password is incorrect'
            });
        }

        //generate new password hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        //update user with the new password hash
        await User_Registration_Form.updateOne({
            email: email
        }, {
            password: hash
        });

        return res.status(200).send({
            message: 'Password changed successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
};


exports.sendOTP = async (req, res) => {
    try {
        const {
            email,
            password,
            UserName
        } = req.body
        const LogIn_data = await User_Registration_Form.find({
            email: email,
        })
        if (LogIn_data.length !== 0) {
            res.status(201).send({
                data: [],
                success: false,
                msg: " This Email Already Registor"
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password.toString(), salt);
            req.body.password = hash
            const otp = Math.floor(100000 + Math.random() * 900000);

            const send_to = email;
            const sent_from = "mujigujjar125@gmail.com";
            const reply_to = email;
            const subject = "OTP Verification";
            const message = `
            <div style="font-size: .8rem; margin: 0 30px;background-color: #2d1567;
                color: #fff;padding:27px 0;
                text-align: center;">
            
                <h1>OTP Request</h1>
                        
                      </div>
                      <h3 style="text-align: center" > This is the one time code -  <strong>${otp} </strong>  </h3>
                `;
            await sendEmail(subject, message, send_to, sent_from, reply_to);
            req.body.otp = otp

            const data = new User_Registration_Form(req.body)
            console.log("Data", data);
            await data.save()
            res.status(201).send({
                data: data,
                success: true,
                msg: `Email has been sent to ${email}`
            })
        }

    } catch (error) {
        console.log("Error while sending mail from base .", error);
        res.send(error.message);
    }
}


exports.VarifyOTP = async (req, res) => {

    try {
        const { code, email } = req.body
        const data = await User_Registration_Form.find({
            email: email
        })
        if (!data) {
            res.send({
                success: false,
                msg: "OTP verification failed"
            })
        } else {

            const [{ otp }] = data
            console.log("Data", otp);
            if (otp == code) {

                res.send({
                    success: true,
                    msg: "OTP verification succeeded"
                })
            } else {
                res.send({
                    success: false,
                    msg: "OTP verification failed"
                })
            }
        }



    } catch (error) {
        console.log(error);
    }


}
