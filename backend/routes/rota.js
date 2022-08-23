const express = require("express");
const router = express.Router();

const Nurse = require('../models/nurse.model');
const Patient = require('../models/patient.model');

router.route("/assign").post(function(req,res){
    const assign = req.body;
    let updateAssignNurse = [];
    let updateAssignPatient = [];
    let upDates = [];
    assign.assignData.map((value,index) =>{
        if(value.nurse_id != 'NA' && value.hour != 'NA'){
            upDates.push(value.date);
            updateAssignPatient.push({
                date:value.date,
                nurse_id:value.nurse_id
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
    console.log(upDates);
    async function run(){
        Patient.findByIdAndUpdate(assign.patient_id,
            {"$set":{"rota": updateAssignPatient}},{new:true,upsert:true}
            ,function(err,data){
                console.log(data);
            });

        for(let _id in updateAssignNurse){
            Nurse.findByIdAndUpdate(_id,
            {"$set":{"rota": updateAssignNurse[_id]}},{new:true,upsert:true}
            ,function(err,data){
                console.log(data);
            });
        }
    }
    run().catch();
    
    Nurse.find({},function(err,nurses){
        Patient.findById(assign.patient_id,function(err,patient){
            res.send({NurseDatas:nurses,PatientData:patient});
        });
    });
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