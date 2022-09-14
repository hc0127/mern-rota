const express = require("express");
const router = express.Router();

const Nurse = require('../models/nurse.model');
const Patient = require('../models/patient.model');

router.route("/assign").post(async function(req,res){
    const assign = req.body;
    let updateAssignNurse = [];
    let updateAssignAllNurse = [];

    assign.assignData.map((value,index) =>{
        if(value.nurse_id != 'NA' && value.hour != 'NA'){
            updateAssignAllNurse.push({
                date:value.date,
                rotation:value.rotation,
                patient_id:assign.patient_id,
                duty_start:value.duty_start,
                duty_end:value.duty_end,
                hour:value.hour
            });

            if(updateAssignNurse[value.nurse_id] === undefined){
                updateAssignNurse[value.nurse_id] = [{
                    date:value.date,
                    rotation:value.rotation,
                    patient_id:assign.patient_id,
                    duty_start:value.duty_start,
                    duty_end:value.duty_end,
                    hour:value.hour
                 }];
            }else{
                updateAssignNurse[value.nurse_id] = [...updateAssignNurse[value.nurse_id],{
                date:value.date,
                rotation:value.rotation,
                patient_id:assign.patient_id,
                duty_start:value.duty_start,
                duty_end:value.duty_end,
                hour:value.hour
                }];
            }
        }
    });
    
    let step = function(){
        return new Promise(function(resolve){
            let flag = 0;

            let month = assign.year+'-'+(assign.month<10?+'0'+String(assign.month):assign.month);
            var regexp = new RegExp(month+"/s+");
            console.log(assign.patient_id,month);
           
            Nurse.updateMany({"rota.patient_id":assign.patient_id},
                {"$pull":{rota:{patient_id:assign.patient_id ,date:{$regex:"/^s"+month+"/"}}}}
                ,function(err,data){
                    console.log(err,data);
                    resolve();
            });
            
            // let length = Object.keys(updateAssignAllNurse).length;
            // for(let _id in updateAssignNurse){
            //     for(let rotaData of updateAssignNurse[_id]){
            //         Nurse.updateOne({_id:_id},
            //             {"$pull":{"rota":{date:rotaData.date}}},{new:true,upsert:true}
            //             ,function(err,data){
            //                 console.log(err,data);
            //                 console.log('c',flag,length);
            //                 flag++;
            //                 if(flag == length){
            //                     resolve();
            //                 }
            //         });
            //     }
            // }
        }).then(function(){
                return new Promise(function(resolve){
                    let flag = 0;
        
                let length = Object.keys(updateAssignNurse).length;
                for(let _id in updateAssignNurse){
                        Nurse.findByIdAndUpdate(_id,
                    {"$push":{"rota": {$each:updateAssignNurse[_id]}}},{new:true,upsert:true}
                    ,function(err,data){
                        console.log('d');
                        flag++;
                        if(flag == length){
                            resolve();
                        }
                    });
                }
            }).then(function(){
                Nurse.find({},function(err,nurses){
                    res.send({NurseDatas:nurses});
                    console.log('e');
                });
            });
        });
    }
    step();
});
router.route("/report").post(function(req,res){
    const data = req.body;
    Nurse.findOneAndUpdate(
        {_id: data._id},
        {$set: {"rota.$[el].hour": data.hour,"rota.$[el].service":data.service } },
        { 
          arrayFilters: [{ "el.date": data.date }],
          new: true
        },function(err,data){
            if(!err){
                res.send(data);
            }
        }
    );
});
router.route("/delete").post(function(req,res){
    const data = req.body;
    Nurse.findOneAndUpdate({
        "_id": data._id
      },
      {
        "$pull": {
          "rota": {
            "date":data.date
          }
        }
      },{new:true,upsert:true},function(err,data){
        if(!err){
            res.send(data);
        }
      }
    )
});

module.exports = router;