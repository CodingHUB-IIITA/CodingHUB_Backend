const Resource = require("../models/resources")

exports.createResource = (req, res) => {
    const {name,topics} = req.body;
    const newResource = new Resource({name:name,topics:topics});
    newResource.save().then((resp,err)=>{
        if(err){
            res.status(400).send(err);
        }
        else{
            res.json(resp)
        }
    }) 
}

exports.findResourceById = (req,res,next,id) => {
    Resource.findById(id)
  .then((resource,err)=>{
    if(err){
        res.json({
            success:false,
            data:"Internal Sever error",
            message:"Errror found"
        })
    }

    req.resource = resource;
    next();
  })
}

exports.FindAllResources = (req,res) =>{
    const id = req.body.id;
    Resource.find().populate("topics").then((resp,err)=>{
        if(err){
            res.status(400).send(err);
        }
        else{
            res.json(resp)
        }
    })
}

exports.updateResource = (req,res) => {
    const updateresource = req.body;
    const resource = req.resource;
    Resource.findByIdAndUpdate(req.resource._id,{
        name: updateresource.name,
    },
    {new:true,})
    .then((updateresource,err)=>{
        if(err){
            res.status(404).json({
                success:false,data:"Resource Not updated",message:err.message
            })
        }
        res.json({updateresource,resource});
    })
}

exports.deleteResource=(req,res)=>{
    const deletion = req.resource;
    Resource.deleteOne(deletion)
    .then((resource,err)=>{
        if(err){
            return res.status(404).json({error:"Failed to delete"});
        }
        else{
           return res.json({message:"Deleted Successfully",deleted: deletion})
        }
    })
}


// const updateTopic = (req, res) => {

// }