const express = require("express");
const router = express.Router();

const Nurse = require('../../models/nurse.model');
const Patient = require('../../models/patient.model');
const Level = require('../../models/level.model');
const User = require('../../models/user.model');

router.route("/list").get(function(req,res){
    Nurse.find({},function(err,nurseData){
        if(!err){
            Patient.find({},function(err,patientData){
                if(!err){
                    Level.find({},function(err,levelData){
                        if(!err){
                            res.send({
                                state:'success',
                                nurse:nurseData,
                                patient:patientData,
                                level:levelData
                            });
                        }
                    });
                }
            });
        }
    });
});
router.route('/login').post(function(req,res){
    User.findOne({password:req.body.password},function(err,data){
        console.log(data.user);
        if(data.user == null){
            res.send({state:'wrong'});
        }else{
            Nurse.find({},function(err,nurseData){
                if(!err){
                    Patient.find({},function(err,patientData){
                        if(!err){
                            Level.find({},function(err,levelData){
                                if(!err){
                                    res.send({
                                        state:'success',
                                        token:data.token,
                                        nurse:nurseData,
                                        patient:patientData,
                                        level:levelData
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;