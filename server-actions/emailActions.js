import nodemailer from "nodemailer"

export const sendEmail = async (receiver, subject, body, service= "Gmail")=>{
    try {
        const transporter = nodemailer.createTransport({
            service : service,
            auth : {
                user: process.env.EMAIL_ID,
                pass : process.env.EMAIL_PASSWORD,
            }
        })
        await transporter.sendMail({
            from: "",
            to : receiver,
            subject,
            html : body,
        })
        return {
            success: true,
            message: "Email Sent Sucessfully",
            data: { receiver },
          };
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Some error occurred, please try again.",
            data: {  },
          };
    }
}