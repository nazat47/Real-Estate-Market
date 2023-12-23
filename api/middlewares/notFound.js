const notFound=(req,res)=>{
    res.status(404).send("No Route found")
}
module.exports=notFound