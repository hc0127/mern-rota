const express = require("express");
const router = express.Router();

const Nurse = require('../models/nurse.model');
const Patient = require('../models/patient.model');

router.route("/assign").post(async function(req,res){
    const assign = req.body;
    let updateAssignNurse = [];
    let updateAssignAllNurse = [];
    let updateAssignPatient = [];
    let upDates = [];

    assign.assignData.map((value,index) =>{
        if(value.nurse_id != 'NA' && value.hour != 'NA'){
            upDates.push(value.date);
            updateAssignPatient.push({
                date:value.date,
                nurse_id:value.nurse_id
            });

            updateAssignAllNurse.push({
                date:value.date,
                patient_id:assign.patient_id
            });

            if(updateAssignNurse[value.nurse_id] === undefined){
                updateAssignNurse[value.nurse_id] = [{
                    date:value.date,
                    patient_id:assign.patient_id,
                    duty_start:value.duty_start,
                    duty_end:value.duty_end,
                    hour:value.hour
                 }];
            }else{
                updateAssignNurse[value.nurse_id] = [...updateAssignNurse[value.nurse_id],{
                date:value.date,
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
            Patient.updateMany({},
                {"$pull":{"rota": {$in:updateAssignPatient}}},{new:true,upsert:true}
                ,function(err,data){
            });
            Patient.updateOne({_id:assign.patient_id},
                {"$pull":{"rota":{date:{$in:upDates}}}},{new:true,upsert:true}
                ,function(err,data){
            });
            
            let length = Object.keys(updateAssignAllNurse).length;
            for(let _id in updateAssignNurse){
                for(let rotaData of updateAssignNurse[_id]){
                    Nurse.updateOne({_id:_id},
                        {"$pull":{"rota":{date:rotaData.date}}},{new:true,upsert:true}
                        ,function(err,data){
                            console.log(err,data);
                            console.log('c',flag,length);
                            flag++;
                            if(flag == length){
                                resolve();
                            }
                    });
                }
            }
        }).then(function(){
                return new Promise(function(resolve){
                    let flag = 0;
                    Patient.findByIdAndUpdate(assign.patient_id,
                    {"$push":{"rota": {$each:updateAssignPatient}}},{new:true,upsert:true}
                    ,function(err,data){
                    });
        
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
                    Patient.find({},function(err,patient){
                        res.send({NurseDatas:nurses,PatientDatas:patient});
                        console.log('e');
                    });
                });
            });
        });
    }
    step();

    // async function remove(){
    //     Patient.updateMany({},
    //         {"$pull":{"rota": {$in:updateAssignPatient}}},{new:true,upsert:true}
    //         ,function(err,data){
    //             console.log('a');
    //     });
    //     Patient.updateOne({_id:assign.patient_id},
    //         {"$pull":{"rota": {$in:upDates}}},{new:true,upsert:true}
    //         ,function(err,data){
    //             console.log('b');
    //     });
        
    //     for(let _id in updateAssignNurse){
    //          Nurse.updateOne({_id:_id},
    //             {"$pull":{"rota": {$in:updateAssignNurse[_id]}}},{new:true,upsert:true}
    //             ,function(err,data){
    //                 console.log('c');
    //         });
    //     }
    // }
    
    // async function reset(){
    //      Patient.findByIdAndUpdate(assign.patient_id,
    //         {"$push":{"rota": {$each:updateAssignPatient}}},{new:true,upsert:true}
    //         ,function(err,data){
    //             console.log('aaa');
    //         });

    //     for(let _id in updateAssignNurse){
    //          Nurse.findByIdAndUpdate(_id,
    //         {"$push":{"rota": {$each:updateAssignNurse[_id]}}},{new:true,upsert:true}
    //         ,function(err,data){
    //             console.log('bbb');
    //         });
    //     }
    // }

    // async function send(){
    //     Nurse.find({},function(err,nurses){
    //         Patient.find({},function(err,patient){
    //             res.send({NurseDatas:nurses,PatientDatas:patient});
    //             console.log('e');
    //         });
    //     });
    // }

    // async function run(){
    //     await Promise.all([remove(), reset(), send()]);
    // }
    // run();

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