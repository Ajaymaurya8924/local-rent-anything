// Responcibility
//     1. request recieve karna 
//     2. Responce bhejna

const getHealth=(req,res)=>{
     res.status(200).json({
        message:"server running sucessfully"
    })
}

module.exports={getHealth}