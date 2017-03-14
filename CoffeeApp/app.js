var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
expressSanitizer=require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/restful_bean_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//scheam creation
var beanSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:String,
    created: {type: Date, default: Date.now}
});
var Bean = mongoose.model("Bean", beanSchema);

//restful routes
app.get("/", function(req,res){
    res.redirect("/beans");
});
app.get("/beans", function(req,res){
    Bean.find({}, function(err,beans){
        if(err){
           console.log(err);
        }else{
            res.render("index",{beans: beans});
        }
    });
});
//new route
app.get("/beans/new",function(req,res){
    res.render("new");
});

app.post("/beans", function(req,res){
    req.body.bean.body = req.sanitize(req.body.bean.body);
    Bean.create(req.body.bean, function(err, newBean){
        if(err){
            res.render("new");
        }else{
            res.redirect("/beans");
        }
    });
});
//show route
app.get("/beans/:id",function(req,res){
    Bean.findById(req.params.id, function(err, foundBean){
        if(err){
            res.redirect("/beans");
        }else{
            res.render("show", {bean: foundBean});
        }
    });
});
//edit route
app.get("/beans/:id/edit", function(req,res){
    Bean.findById(req.params.id, function(err, foundBean){
        if(err){
            res.redirect("/beans");
        }else{
            res.render("edit", {bean: foundBean});
        }
    });
  
});
//update route
app.put("/beans/:id", function(req,res){
    req.body.bean.body=req.sanitize(req.body.bean.body);
    Bean.findByIdAndUpdate(req.params.id,req.body.bean, function(err, updatedBean){
        if(err){
            res.redirect("/beans");
        }else{
            res.redirect("/beans/" + req.params.id);
        }
    });
});
//delete route
app.delete("/beans/:id", function(req,res){
    //destrpy blog
    Bean.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/beans");
        }else{
            res.redirect("/beans");
        }
    });
    //redirect
});






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Coffee is ready!");
});