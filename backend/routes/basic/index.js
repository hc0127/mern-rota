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

    User.findOne({user:"admin@gmail.com",token:'dd'},function(err,data){
        console.log(data);
        if(data == null){
            User.createOne({user:"admin@gmail.com",password:'admin',token:'token123'},function(err,data){
                if(data.password == req.body.password){
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
                }else{
                    res.send({state:'wrong'});
                }
            });
        }else{
            if(data.password == req.body.password){
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
            }else{
                res.send({state:'wrong'});
            }    
        }
    });
});

module.exports = router;