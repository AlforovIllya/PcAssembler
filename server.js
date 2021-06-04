"use strict ";


const jsdom = require("jsdom");
const got = require('got');

const { JSDOM } = jsdom;

"use strict"
const fs = require('fs');
const ERRORS = require('errors');
const HTTPS = require('https');


// code 600 - database connection error
ERRORS.create({
    code: 600,
    name: 'DB_CONNECTION',
    defaultMessage: 'An error occured when connecting to database'
});

// code 601 - query execution error
ERRORS.create({
    code: 601,
    name: 'QUERY_EXECUTE',
    defaultMessage: 'An error occured during the query execution'
});

// mongo
const MONGO_CLIENT = require("mongodb").MongoClient;
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017';
const CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// express
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port=1337;


app.listen(port,function(){
    console.log("Server running on port %s...",port);
});



// middleware
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

app.use("/", function(req, res, next) {
    console.log(">_ " + req.method + ": " + req.originalUrl);
    if (Object.keys(req.query).length != 0)
        console.log("Parametri GET: " + JSON.stringify(req.query));
    if (Object.keys(req.body).length != 0)
        console.log("Parametri BODY: " + JSON.stringify(req.body));
    next();
});

app.use("/", express.static('./static'));




//get CPU
app.get("/getCpuIntel", function(req, res){
    var order = 0;
    var DataArray = [];
    var strPrice = [];
    var supPrice = [];
    var itemImg= [];

    var vetDiv = [];

    //Range of Price
    let MAXprice = req.query.CPUprice;

    let MINprice = MAXprice - (MAXprice*20)/100;

    if(MINprice<=30){
        MINprice=30;
        MAXprice=40;
    }
    if(MAXprice>=2500){
        MINprice=2000;
        order=2;
    }
    
  
    //CPU Intel
    console.log("https://www.newegg.com/p/pl?N=100007671%20601351801%20601298157%20601304866%20600565702%20600535697%20600436886%20600217725%20600095610%20600005864%20600005862&PageSize=96&LeftPriceRange="+MINprice+"+"+MAXprice+"&Order="+order);
    const apiUrl = "https://www.newegg.com/p/pl?N=100007671%20601351801%20601298157%20601304866%20600565702%20600535697%20600436886%20600217725%20600095610%20600005864%20600005862&PageSize=96&LeftPriceRange="+MINprice+"+"+MAXprice+"&Order="+order;
    got(apiUrl).then(response => {
        //console.log(response);
        const dom = new JSDOM( response.body );     
 
   
        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {
            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });
            
            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var name;
                var heat;
                var frequency;
                var socket;
                var cores;
                var str = item1.innerHTML;

                link = item1.href;

                str.search("-Cor");
                num = str.search("-Cor");
                
                //Take cores
                if(str[num-1]=='l' || str[num-1]=='d'){
                    cores= str.substring(num-4, num+5);
                    //take Name
                    name = str.substring(0, num-4)
                    
                }
                else{
                    cores= str.substring(num-2, num+5);
                    //take Name
                    name = str.substring(0, num-2)
                }
                
                
                //frequency
                num=str.search("GHz");
                if(str[num-5]=='e'){
                    frequency = str.substring(num-4, num)
                }
                else
                frequency = str.substring(num-5, num);


                //Heat
                num=str.search("W");
                heat=str.substring(num-3, num)


                //Socket
                num=str.search("LGA");
                if(num>0){
                    socket=str.substring(num+3, num+8);
                }
                else{
                    socket="undefined"
                }
                



                DataArray.push({"link":link, "name":name, "cores":cores, "frequency":frequency, "heat":heat, "socket":socket});
                
            });
            
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                
                
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            //get img
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });
        });

        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["price"]=strPrice[i] + supPrice[i];
            DataArray[i]["img"]=itemImg[i];
        }
        res.send({"data":DataArray, "div":vetDiv});
        
      }).catch(err => {
        console.log(err);
    });   
})

//Motherboard Intel
app.get("/getMotherboardIntel", function(req, res){
    var order=0;
    var DataArray = [];
   
    var strPrice = [];
    var supPrice = [];
    var itemImg = [];
    var vetInerfice = [];
    var vetMemStandart = [];
    var vetMemorySlots = [];
    var vetDiv = [];

    //Range of Price
    let MAXprice = req.query.MBprice;

    let MINprice = MAXprice - (MAXprice*20)/100;
 
    if(MINprice<=50){
        MINprice=50;
        MAXprice=70;
    }

    if(MAXprice>=1200){
        MINprice=1000;
        order=2;
    }
    console.log("https://www.newegg.com/p/pl?N=100007627%20601352138%20601299335%20600567584%20600007888%20600093976%20600438202%20601304476%20600007887%20600238945%20600533617%20601361697%20601361694&PageSize=96&LeftPriceRange="+MINprice+"+"+MAXprice)
    const apiUrl = "https://www.newegg.com/p/pl?N=100007627%20601352138%20601299335%20600567584%20600007888%20600093976%20600438202%20601304476%20600007887%20600238945%20600533617%20601361697%20601361694&PageSize=96&LeftPriceRange="+MINprice+"+"+MAXprice+"&Order="+order;
    got(apiUrl).then(response => {

        const dom = new JSDOM( response.body );     

        var i =0;
        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {
            
            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });

            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var name;
                var socket;
                var formFactor;
                var str = item1.innerHTML;
                str.search("-Cor");
                num = str.search("-Cor");
                
                //item link
                link = item1.href;
                

                //Socket
                num=str.search("LGA");
                if(num>0){
                    socket=str.substring(num+3, num+8);
                }
                else{
                    socket="undefined"
                }
                
                //Take Name
                name = str.substring(0, num);

                //form-factor
                if(str.search("ITX")>0){
                    formFactor="ITX";
                }
                else if(str.search("ATX")){
                    formFactor="ATX";
                }
                else{
                    formFactor="undefined";
                }
                

                DataArray.push({"link":link, "name":name, "socket":socket, "formFactor": formFactor});
                
            });

            
           
            dom.window.document.querySelectorAll(".item-features").forEach(item => {
                var container = item.querySelectorAll("li");
                var memOk=false;
                var interfaceOk = false;
                var memSlotsOk = false;
                for(var i = 0; i<container.length;i++){
                    


                    str = container[i].innerHTML;
                    
                    if(str.search("Memory Standard:")>=0){
                        str=str.split("</strong>");
                        vetMemStandart.push(str[1]);
                        memOk=true;
                    }

                    str = container[i].innerHTML;
                    if(str.search("PCI")>=0){
                        str=str.split("</strong>");
                        vetInerfice.push(str[0].slice(8, str[0].length-1));
                        interfaceOk=true;
                    }
    

                    str = container[i].innerHTML;
                    if(str.search("Number of Memory Slots:")>=0){
                        str=str.split("</strong>");
                        vetMemorySlots.push(str[1]);
                        memSlotsOk=true;
                    }
                    
                }
                if(memOk==false){
                    vetMemStandart.push("undefined");
                }
                if(interfaceOk==false){
                    vetInerfice.push("undefined");
                }
                if(memSlotsOk==false)
                    vetMemorySlots.push("undefined");
            });
            

            
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                
                
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });
        });

        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["img"]=itemImg[i];
            DataArray[i]["memoryStandart"]=vetMemStandart[i];
            DataArray[i]["memorySlots"]=vetMemorySlots[i];
            DataArray[i]["interface"]=vetInerfice[i];
            
            DataArray[i]["price"]=strPrice[i] + supPrice[i];

        }
        res.send({"data":DataArray, "div":vetDiv});
    

        
      }).catch(err => {
        console.log(err);
    });   
})

 
/*
//Get Max Pages
got("https://www.newegg.com/Desktop-Graphics-Cards/SubCategory/ID-48/Page-1?Tid=7709&PageSize=96").then(response => {
    const dom = new JSDOM( response.body );   
    dom.window.document.querySelectorAll(".list-tool-pagination-text").forEach(item =>{
        item.querySelectorAll("strong").forEach(item =>{
            str=item.innerHTML;
            str=str.split("<!-- -->");
            maxPages=str[2];
            currentPage=str[0]; 
        })
    })
    return maxPages;
})*/

//get Graphics cards
app.get("/getGraphicsCards", function(req, res){
    var order=0;
    var DataArray = [];
    
    var strPrice = [];
    var supPrice = [];
    var itemImg = [];

    var vetDiv = [];

    var nextPage=1;


    //Range of Price
    let MAXprice = req.query.GCprice;

    let MINprice = MAXprice - (MAXprice*20)/100;
  
    if(MINprice<=50){
        MINprice=50;
        MAXprice=70;
    }

    if(MAXprice>=2500){
        MINprice=2000;
        order=2;
    }
    
    console.log("https://www.newegg.com/p/pl?PageSize=96&LeftPriceRange="+MINprice+"+"+MAXprice+"&N=100007709%204814%20601296706%20601350080%20601296709%20601296710");
    const apiUrl = "https://www.newegg.com/p/pl?PageSize=96&LeftPriceRange="+MINprice+"+"+MAXprice+"&N=100007709%204814%20601296706%20601350080%20601296709%20601296710&Order="+order;
    got(apiUrl).then(response => {

        const dom = new JSDOM( response.body );     
        
        var i =0;

        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {
            
            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });

            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var name;
                var memory;
                var str = item1.innerHTML;
                var interface;
                //item link
                link = item1.href;
                

                //Viedo Memory
                
                num=str.search("GB");
                if(num>0){
                    memory=str.substring(num-2, num);
                }
                else{
                    memory="undefined";
                }
                
                //Take Name
                name = str.substring(0, num-3);


                //Interface
                num=str.search("PCI");
                if(num>0){
                    interface =str.substring(num, num+19);
                }
                else{
                    interface = "undefined";
                }
                
                
                


                DataArray.push({"link":link, "name":name,"interface":interface, "videoMemory":memory});
                
            });

            
            
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                
                
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            
            
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });
        });

        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["img"]=itemImg[i];

            
            DataArray[i]["price"]=strPrice[i] + supPrice[i];

        }
        

        res.send({"data":DataArray, "div":vetDiv});
    

        
            
        
    })
        
    
})

//get memory
app.get("/getMemory", function(req, res){
    var order=0;
    var DataArray = [];
   
    var strPrice = [];
    var supPrice = [];
    var itemImg = [];
   
    var vetDiv = [];
    var nextPage=1;


    //Range of Price
    let MAXprice = req.query.MEMprice;

    let MINprice = MAXprice - (MAXprice*20)/100;
    
    if(MINprice<=20){
        MINprice=20;
        MAXprice=30;
    }
    
    if(MAXprice>=2000){
        MINprice=1500;
        order=2;
    }


    const apiUrl = "https://www.newegg.com/p/pl?LeftPriceRange="+MINprice+"+"+MAXprice+"&N=100007611%20601349177%20601349170%204814%20600551100%20600532698%20600551103%20600532699%20600536667%20600551113%20600532700%20600561673%20600561672%20600561671%20600561670%20601302872%20600521523&Order="+order+"&PageSize=96";
    got(apiUrl).then(response => {

        const dom = new JSDOM( response.body );     
        
        

        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {

            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });

            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var name;
                var memory;
                var str = item1.innerHTML;
                var pin;
                var speed;

                //item link
                link = item1.href;
                
                

                
                if(str.search("Pin")>0){
                    num = str.search("Pin")
                    pin=str.substring(num-4, num-1);

                    /*str = str.substring(num+8, num+24);
                    speed = str;*/
                    //console.log(str);
                }
                else{
                    pin="undefined";
                }

                //Speed
                if(str.search("DRAM")>0){
                    num = str.search("DRAM")
                    speed=str.substring(num+10, num+14);
                    if(isNaN(speed)){
                        if(str.search("DDR4")>0){
                            num = str.search("DDR4")
                            speed=str.substring(num+5, num+9);

                            if(isNaN(speed)){
                                if(str.search("MHz")){
                                    num = str.search("MHz")
                                    speed=str.substring(num-5, num-1);
                                }
                                else
                                pin="undefined";
                            }
                        }
                    }
                }
                else{
                    if(str.search("DDR4")>0){
                        num = str.search("DDR4")
                        speed=str.substring(num+5, num+9);
                    }else{
                        if(str.search("MHz")){
                            num = str.search("MHz")
                            speed=str.substring(num-5, num-1);
                        }
                        else
                        pin="undefined";
                    } 
                }
                
                
                


                str = item1.innerHTML;

                // Memory
                if(str.search("2 x ")>0){
                    //Take Name
                    num=str.search("2 x");
                    name = str.substring(0, num-2);

                    str = str.substring(num, num+8);
                    str=str.split("GB");
                    memory=str[0];
                    
                    

                }
                else if(str.search("4 x ")>0){
                    //Take Name
                    num=str.search("4 x");
                    name = str.substring(0, num-2);

                    str = str.substring(num, num+8);
                    str = str.split("GB");
                    memory=str[0];

                }
                else if(str.search("GB")>0){
                    num=str.search("GB");
                    memory=str.substring(num-2, num);
                    //Take Name
                    name = str.substring(0, num-2);

                }
                
                


                DataArray.push({"link":link, "name":name, "pin":pin, "totalMemory":memory, "speed":speed});
                
            });

            
            
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                
                
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            
            
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });
        });

        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["img"]=itemImg[i];

            
            DataArray[i]["price"]=strPrice[i] + supPrice[i];

        }
        
       
        res.send({"data":DataArray, "div":vetDiv});

        //console.log(strPrice.length);
        //console.log(vetMemStandart.length);
            
        
    })
        
    
})


app.get("/getCpuFan", function(req, res){
    var order=0;
    var vetDiv= [];
    var DataArray = [];

    var strPrice = [];
    var supPrice = [];
    var itemImg = [];
   

    let MAXprice = req.query.CpuFanPrice;

    let MINprice = MAXprice - (MAXprice*20)/100;

    if(MINprice<=20){
        MINprice=20;
        MAXprice=30;
    }
    
    if(MAXprice>=150){
        MINprice=100;
        order=2;
    }
    console.log("https://www.newegg.com/p/pl?N=100008000%20601346187%20601346192%20601354517%20601312603%20601312590%20601312596%20601312599%20601312594%20601312597%20601312625&PageSize=96&LeftPriceRange="+MINprice+"+" +MAXprice);
    const apiUrl = "https://www.newegg.com/p/pl?N=100008000%20601346187%20601346192%20601354517%20601312603%20601312590%20601312596%20601312599%20601312594%20601312597%20601312625&PageSize=96&LeftPriceRange="+MINprice+"+" +MAXprice+"&Order="+order;
    got(apiUrl).then(response => {

        const dom = new JSDOM( response.body );     
        
 

        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {
            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });
            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var str = item1.innerHTML;


                //item link
                link = item1.href;
                

                DataArray.push({"name":str, "link":link});
                
            });
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                    
                    
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            
            
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });

            
        });
        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["img"]=itemImg[i];

            
            DataArray[i]["price"]=strPrice[i] + supPrice[i];

        }

        res.send({"data":DataArray, "div":vetDiv});
        
        
    })
        
    
})

app.get("/getCase", function(req, res){
    var order=0;
    var vetDiv= [];
    var DataArray = [];
    var CompatibilityArray = [];

    var strPrice = [];
    var supPrice = [];
    var itemImg = [];
   

    let MAXprice = req.query.CasePrice;

    let MINprice = MAXprice - (MAXprice*10)/100;

    if(MINprice<=30){
        MINprice=30;
        MAXprice=40;
    }
    if(MAXprice>=1000){
        MINprice=500;
        order=2;
    }

    console.log("https://www.newegg.com/p/pl?LeftPriceRange="+MINprice+"+"+MAXprice+"&N=100007583%20600545969%20600546033%20601292092&PageSize=96");
    const apiUrl = "https://www.newegg.com/p/pl?LeftPriceRange="+MINprice+"+"+MAXprice+"&N=100007583%20600545969%20600546033%20601292092&PageSize=96&Order="+order;
    got(apiUrl).then(response => {

        const dom = new JSDOM( response.body );     
        
 

        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {
            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });
            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var str = item1.innerHTML;


                //item link
                link = item1.href;
                

                DataArray.push({"name":str, "link":link});
                
            });
            item.querySelectorAll(".item-features").forEach(item1 =>{
                var container = item1.querySelectorAll("li");
                var compOk=false;

                for(var i = 0; i<container.length;i++){
                    


                    str = container[i].innerHTML;
                    
                    if(str.search("Motherboard Compatibility:")>=0){
                        str=str.split("</strong>");
                        CompatibilityArray.push(str[1]);
                        compOk=true;
                    }
                    
                }
                if(compOk==false){
                    CompatibilityArray.push("undefined");
                }
                
                
            });
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                    
                    
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            
            
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });

            
        });
        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["img"]=itemImg[i];

            
            DataArray[i]["price"]=strPrice[i] + supPrice[i];

            DataArray[i]["Compatibility"] = CompatibilityArray[i];

        }
        
        
        res.send({"data":DataArray, "div":vetDiv});
        
        
    })
        
    
})

app.get("/getPowerSup", function(req, res){
    var order=0;
    var vetDiv= [];
    var DataArray = [];
  

    var strPrice = [];
    var supPrice = [];
    var itemImg = [];
   

    let MAXprice = req.query.PowerSupPrice;

    let MINprice = MAXprice - (MAXprice*10)/100;
    
    if(MINprice<=40){
        MINprice=40;
        MAXprice=60;
    }
    if(MAXprice>=600){
        MINprice=400;
        order=2;
    }

    console.log("https://www.newegg.com/p/pl?PageSize=96&N=100007657%204084%20600014006&Order="+order+"&LeftPriceRange="+MINprice+"+"+MAXprice);
    const apiUrl = "https://www.newegg.com/p/pl?PageSize=96&N=100007657%204084%20600014006&Order="+order+"&LeftPriceRange="+MINprice+"+"+MAXprice;
    got(apiUrl).then(response => {

        const dom = new JSDOM( response.body );     
        
 

        dom.window.document.querySelectorAll(".item-cells-wrap").forEach(item => {
            item.querySelectorAll(".item-cell").forEach(item1 =>{
                vetDiv.push(item1.innerHTML);
            });
            item.querySelectorAll(".item-title").forEach(item1 =>{
                var link;
                var str = item1.innerHTML;


                //item link
                link = item1.href;
                

                DataArray.push({"name":str, "link":link});
                
            });
            
            //Get Price
            item.querySelectorAll(".price-current ").forEach(item1 =>{
                    
                    
                if(item1.innerHTML.length!=0){
                    item1.querySelectorAll("strong").forEach(item2 =>{

                        str = item2.innerHTML;
                        strPrice.push(str);
        
                    });
                    
                    item1.querySelectorAll("sup").forEach(item2 =>{
        
                        str = item2.innerHTML;
                        supPrice.push(str);
        
                    });
                }
                else{
                    strPrice.push("undefained");
                    supPrice.push("undefained");
                }
                
                
            });
            
            
            item.querySelectorAll(".item-img").forEach(item1 =>{

                item1.querySelectorAll("img").forEach(item1 =>{
                    itemImg.push(item1.src);
                });
            });

            
        });
        for(var i = 0; i<DataArray.length; i++){
            DataArray[i]["img"]=itemImg[i];

            
            DataArray[i]["price"]=strPrice[i] + supPrice[i];

            

        }
        
        
        res.send({"data":DataArray, "div":vetDiv});
        
        
    })
        
    
})