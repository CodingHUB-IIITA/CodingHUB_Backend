const Topic =require("../models/topic");
const createTopic = (req, res) => {
    const { name, description, ladder, blog ,code } = req.body;

    // Check if name and description are provided
    if (!name || !description) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    // Create a new Topic object with provided fields
    var newTopic = new Topic({
        name: name,
        description: description,
        ladder: ladder,
        blog: blog,
        code: code
    });

    // Save the new topic to the database
    newTopic.save()
    .then((topic) => {
        if (!topic) {
            return res.status(400).json({
                error: "Topic not saved"
            });
        } else {
            console.log("Topic saved successfully");
            res.json(topic);
        }
    })
    .catch((err) => {
        return res.status(500).json({
            error: "Internal server error"
        });
    });
};
const getTopicById=(req,res,next,id)=>{
Topic.findById(id)
.then((topic,err)=>{
    if(err){
        res.status(404).json({
            success:false,
            data:"Internal Sever error",
            message:"Errror found"
        })
    }
    else{
        req.topicdata=topic;
        next();
    }
}).catch((err) => {
    res.status(400).json({ errors: err.errors });
});
}
const updateTopic=async(req,res)=>{
    const {updatedTopic}=req.body;
    const topicdata=req.topicdata;
    Topic.findByIdAndUpdate(req.topicdata._id,{
        name: updatedTopic.name,
        description: updatedTopic.description,
        blog:updatedTopic.blog,
        code:updatedTopic.code,
        ladder:updatedTopic.ladder,
    },
    {new:true,})
    .then((updatedTopic,err)=>{
        if(err){
            res.status(404).json({
                success:false,data:"Topic Not updated",message:err.message
            })
        }
        res.json({updatedTopic,topicdata});
    }).catch((err) => {
        res.status(400).json({ errors: err.errors });
    });
}
const deleteTopic=(req,res)=>{
    const deletion=req.topicdata;
    Topic.deleteOne(deletion)
    .then((topic,err)=>{
        if(err){
            return res.status(404).json({error:"Failed to delete"});
        }
        else{
           return res.json({message:"Deleted Successfully",deleted: deletion})
        }
    }).catch((err) => {
        res.status(400).json({ errors: err.errors });
    });
}
const searchTopic=(req,res)=>{
const {name,description,ladder,blog}=req.body;
const qu={};
if(name){
    qu.name=name;
}
if(description){
    qu.description=description;
}
if(ladder){
    qu.ladder=ladder;
}
if(blog){
    qu.blog=blog;
}
Topic.find(qu)
.sort({updatedAt:-1})
.then((topic,err)=>{
    if(!topic || err){
        res.status(404).json({success:false,data:"tag not found",message:err.message});
    }
    else{
        // console.log(topic.name);
        console.log("Found topic");
        res.json(topic);
    }
}).catch((err) => {
    res.status(400).json({ errors: err.errors });
});
}
module.exports={createTopic,updateTopic,deleteTopic,getTopicById,searchTopic};