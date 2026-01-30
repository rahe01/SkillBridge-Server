import { Request, Response } from "express";
import { authServices } from "./auth.service";


const createUser = async (req: Request, res: Response) => {
  console.log("Request body:", req.body); 
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await authServices.createUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authServices.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};



const getMe = async(req:Request , res: Response) =>{
  try{
    const user = req.user;

    res.status(200).json({
      success:true,
      message:"Current user fetched successfully",
      data:user,
    })
  }catch(err:any){
    res.status(500).json({
      success:false,
      message:err.message,
    })
  }
}




export const authController = { createUser, loginUser , getMe};
