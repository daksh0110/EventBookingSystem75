import bcrypt from "bcrypt"

const saltRounds = 10;
export const encryption= async (password:string):Promise<string>=> {
    try {
    const hashpassword = await  bcrypt.hash(password, saltRounds) ;
    return hashpassword;
    
    } catch(e){
        throw new Error('Error encrypting the password');
    }
    
}
export const decryption= async (password:string,encryptedpassword:string):Promise<boolean>=> {
    try {
       const check=await bcrypt.compare(password, encryptedpassword);
       return check
    
    } catch(e){
        throw new Error('password is not correct');
    }
    
}