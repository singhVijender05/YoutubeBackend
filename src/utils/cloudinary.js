import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});


const uploadOnCloudinary = async(url)=>{
    try{
      if(!url) return null
      const response= await cloudinary.uploader.upload(url,{
        resource_type:'auto',
      })
      console.log('file uploaded on cloudinary!')
      console.log(response.url)
      return response
    }
    catch(error){
        fs.unlinkSync(url)
        return null
    }
}

export {uploadOnCloudinary }