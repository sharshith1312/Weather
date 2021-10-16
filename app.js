const express=require("express");
const bodyParser=require("body-parser");
const app=express();

const axios = require('axios');
const mongoose=require("mongoose");
require("dotenv").config();
app.set("view engine","ejs")
mongoose.Promise=global.Promise;

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`,{ useNewUrlParser: true,useUnifiedTopology: true } );

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// MODELS
// ===========
const { Location }=require("./models/location");

// Routes
// ============
app.get('/',(req,res)=>{
    res.render("new");
})

app.post('/new',(req,res)=>{
    let location=req.body.location
    // console.log(location)
    getData(location).then((data)=>{
        console.log("After the promise")
        let new_location={
            "location_name":location,
            "location_details":data
        }
        // console.log(data)
        if(data[0].location){
            const loc=new Location(new_location);
            loc.save((err,doc)=>{
                if(err){
                    console.log(err)
                    return res.json({success:false,err})
                }
                res.status(200).json(data)
            })
        }
        else{
            res.json({
                success:false,
                message:"Please enter correct name"
            })
        }
        
        // res.send(data)
    })
    
})
app.get("/offline",(req,res)=>{
    res.render("offline");
})

app.post("/offline/",(req,res)=>{
    // var id=req.params.id;
    let loc=req.body.location
    Location.findOne({ 'location_name': loc },(err,doc)=>{
        if(err || !doc){
            console.log(err)
            return res.json({success:false,err})
        }else{
            res.status(200).send(doc.location_details)
        }
        
    })

})

const getData= async (location) => {
    
    let url=`http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${location}`;
    try {
        let output=[]
        const response = await axios.get(url)
        console.log(response.data);
        let data={
            "location":response.data.location,
            "current":response.data.current
        }
        output.push(data)
        return output
    } catch (error) {
        console.log(error.response.body);
    }
}

// getData("India").then((data)=>{
//     console.log("After the promise")
//     console.log(data)
// })

const port=process.env.PORT || 3002

app.listen(port,function(){
    console.log(`server is running at ${port}...`);
})
