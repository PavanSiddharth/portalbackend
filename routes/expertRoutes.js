const express = require('express');

const { User, Slot} = require('../models');
const Expert  = require('../models/expertModel');
const { callbackPromise } = require('nodemailer/lib/shared');
const router = express.Router();

router.get('/getexperts', async (req, res) => {
    try {
        const experts = await User.find({type : "EXPERT"});
        res.json(experts);    
    } catch (error) {
        
    }    
});

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

router.post('/appointments', async (req, res) => {
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
        var appointments = []
        var user = []
        for(var i = 0; i< users.length ; i++){
            var currentUser = users[i]
            if(currentUser.paid.length > 0 && currentUser.paid.indexOf(req.body.expertID) != -1){
                const slot = await Slot.find({expertId:req.body.expertID, userId:currentUser._id})
                user.push(currentUser.name)
                user.push(currentUser.pic)

                appointments.push({slot,user})
            }
        }

        res.json(appointments)

    } catch (error) {
        console.log(error);
    }
})

router.post('/wishlist', async (req, res) => {
    try {

        console.log(req.body.expertId);
        console.log(req.body.userId);
        const wishlist1 = await User.findById(req.body.userId,
          ['wishlist']
        )
        let wishlist = wishlist1.wishlist;

        if(wishlist.indexOf(req.body.expertId) == -1){
            wishlist.push(req.body.expertId);
        }

        else
        {
            wishlist = wishlist.filter(wish => wish!=req.body.expertId);
        }
        
        const data = await User.findOneAndUpdate({_id: req.body.userId}, {wishlist:wishlist}, {
           new:true
        } 
          );  
          res.send(data);
         console.log(data)
            
    }
     catch (error) {
        console.log(error);
    }
})


router.post('/faved', async (req, res) => {
    try {
        console.log(req.body.userId);
        const wishlist1 = await User.findById(req.body.userId,
          ['wishlist']
        )
        const wishlist = wishlist1.wishlist;
          res.send(wishlist);
    }
     catch (error) {
        console.log(error);
    }
})



router.post('/ready', async (req, res) => {
    let arr =[];
    try {
        let i=0;
        const experts = await User.findById(req.body.userId, 
            ['bookedSlots']
        );
        experts.bookedSlots.map((expert)=>{
          i++;
        })
        const d = new Date();
        const date = d.toString().slice(0,15);
        const time = d.toTimeString().slice(0,5);
        console.log(date);
        console.log(time);
        console.log(experts.bookedSlots);
       experts.bookedSlots.map((expert,index,arr1) => {
            Slot.findOne({expertId:expert,userId:req.body.userId},function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                    console.log(result);
                  if(result!=null)
                  {
                    console.log(result.Date.toString().slice(0,15))
                    console.log(result.slot.slice(0,5));
                    console.log(result.slot.slice(6));
                    console.log(time>result.slot.slice(0,5))
                    console.log(time<result.slot.slice(6))
                    if(result.Date.toString().slice(0,15) === date && time>result.slot.slice(0,5) && time<result.slot.slice(6))
                    {
                        console.log("Yes");
                        arr.push({[result.expertId]:1})
                    }
                    else{
                        arr.push("Nothing")
                    }
                  }
                  else
                  {
                    arr.push("Nothing")
                  }
                  let arr2 = []
                  arr2 = myfun();
                  if(arr2!==undefined)
                  {
                  if(arr2.length===i)
                  {
                      console.log(arr2);
                      res.send(arr2)
                      return arr2;
                  }
                }
                  function myfun()
                  {                  
                   if(arr.length===i)
                      return arr;
                  else
                      setTimeout(myfun,10);
                }
                }
              }); 

        })
        }
 catch (error) {
        console.log(error);
    }

})




router.get('/profile', async (req, res) => {
    try {
        const expert = await User.findById(req.user._id, 
            ['type','pic', 'name', 'username', 'email', 'mobile', 'institution', 'branch', 'desc']
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