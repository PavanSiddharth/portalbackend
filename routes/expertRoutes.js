const express = require('express');

const { User, Slot} = require('../models');
const Expert  = require('../models/expertModel');
const router = express.Router();

router.get('/getexperts', async (req, res) => {
    try {
        const experts = await User.find({type : "EXPERT"});
        const output = {
            expertise : {},
            institution : {},
            exam : {},
        };

        console.log(output);

        for(let i=0; i<experts.length; i++) {
            const expert = experts[i];
            console.log(output.institution[expert.institution.split(',')[0]] === undefined);
            if (output.institution[expert.institution.split(',')[0]] === undefined) {
                output.institution[expert.institution.split(',')[0]] = [];
            }
            output.institution[expert.institution.split(',')[0]].push(expert);
            if (output.expertise[expert.branch] === undefined) {
                output.expertise[expert.branch] = [];
            }
            output.expertise[expert.branch].push(expert);
        }

        console.log(output);
        res.json(output);
    
    } catch (error) {
        
    }    

})

/*router.post('/edit', async (req, res) => {
    try {
        const updatedExpert = await User.findByIdAndUpdate(req.user._id,
            req.body
            )
        await updatedExpert.save();
        res.json(updatedExpert);
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})*/

router.get('/appointments', async (req, res) => {
    try {
        // const expert = await User.findById(req.user._id, ['bookedSlots']);
        // await expert.populate()
        // const { bookedSlots } = expert
        // const appointments = [];
        // for(let i=0; i<bookedSlots.length; i++) {
        //     const slot = await Slot.findById(bookedSlots[i]);
        //     const user = await User.findById(slot.userId, ['name', 'pic']);
        //     appointments.push({ slot, user});
        // }
        // res.json(appointments);
        const users = await User.find({type:"USER"})
        var listOfUsers = []
        var list = []
        for(var i = 0; i< users.length ; i++){
            var currentUser = users[i]
            if(currentUser.paid.length > 0 && currentUser.paid.indexOf(req.body.expertID) != -1){
                list.push(currentUser.name)
                list.push(currentUser.pic)
                listOfUsers.push(list)
            }
        }
        res.send({listOfUsers})

    } catch (error) {
        console.log(error);
    }
})

router.post('/wishlist', async (req, res) => {
    try {
        const wishlist = await User.findById(req.body.expertId,
          ['wishlist']
        );
        console.log("Wishlist is "+ !(wishlist.wishlist));
        
        const expert = await User.findOneAndUpdate({_id: req.body.expertId}, {wishlist:!(wishlist.wishlist)}, {
            new:true
        } 
          );  
        /*const expert = await User.findByIdAndUpdate(
            { _id:req.body.expertId },
            { wishlist:true },
            function(err, result) {
              if (err) {
                res.send(err);
              } else {
                res.send(result);
              }
            }
          );*/
          res.send(expert);
          console.log(expert)
            
    }
     catch (error) {
        console.log(error);
    }
})

router.get('/profile', async (req, res) => {
    try {
        const expert = await User.findById(req.user._id, 
            ['pic', 'name', 'username', 'email', 'mobile', 'institution', 'branch', 'desc']
        );
        const expert_data = await Expert.findOne({expertId:req.user._id},function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
            }
          }); 
        var expert1 = {expert : expert , expert_data:expert_data};
        console.log(expert1);
        res.json(expert1);
    } catch (error) {
        console.log(error);
    }
})


router.post('/edit', async (req, res) => {
    try {
        if(req.body.property=="name")
        {
        const expert = await User.findOneAndUpdate({_id: req.user._id}, {name:req.body.value}, {
            new:true
        } 
          );  
          res.send(expert);
          console.log(expert)
    }
      else if(req.body.property=="username")
      {
        const expert = await User.findOneAndUpdate({_id: req.user._id}, {username:req.body.value}, {
            new:true
        } 
          );  
          res.send(expert);
          console.log(expert)
    }
      else if(req.body.property=="email")
      {
        const expert = await User.findOneAndUpdate({_id: req.user._id}, {email:req.body.value}, {
            new:true
        } 
          );  
          res.send(expert);
          console.log(expert)
    }
      else if(req.body.property=="mobile")
      {
        const expert = await User.findOneAndUpdate({_id: req.user._id}, {mobile:req.body.value}, {
            new:true
        } 
          );  
          res.send(expert);
          console.log(expert)
    }
    
            
    }
     catch (error) {
        console.log(error);
    }
})


module.exports = router;