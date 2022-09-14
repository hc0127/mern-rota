const express = require("express");
const router = express.Router();

const Nurse = require('../models/nurse.model');
const Patient = require('../models/patient.model');

router.route("/assign").post(function(req,res){
    const assign = req.body;
    console.log('data',assign)
    Nurse.find({_id:assign.nurse_id,rota:{$elemMatch:{date:assign.date}}},function(err,existNurse){
        if(!err){
            console.log('a',existNurse.length);
            if(existNurse.length > 0){
                res.send({state:'exist',target:'nurse'});
            }else{
                Patient.find({_id:assign.patient_id,rota:{$elemMatch:{date:assign.date}}},function(err,existPatient){
                    if(!err){
                        console.log('b',existPatient.length);
                        if(existPatient.length > 0){
                            res.send({state:'exist',target:'patient'});
                        }else{
                            Nurse.findByIdAndUpdate(assign.nurse_id,{$push: {rota: {"date": assign.date,"patient_id":assign.patient_id}}},{new:true,upsert:true},function(err,data){
                                if(!err){
                                    console.log('c');
                                    res.send({state:'assign',data:data});
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});
router.route("/report").post(function(req,res){
    console.log(req.body);
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
    console.log(req.body);
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