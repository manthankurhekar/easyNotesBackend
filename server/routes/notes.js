const express = require('express');
const Note = require('../models/Notes');
const router = express.Router();
const {body, validationResult } = require('express-validator');

router.get('/fetchallnotes', require('../middlewares/decodeData'), async (req, res) => {
      try {
            const notes = await Note.find({user: req.user.id});
            res.send(notes);
      } catch (err) {
            console.log(err);
            res.send('fetchallnotes 12');
      }

});

router.post('/addnote', require('../middlewares/decodeData'), [
      body('title', 'Enter a valid title').isLength({ min: 3 }), 
      body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
            console.log('F');
            return res.status(400).json({ err: errors.array() });
      }

      const { title, description, tag } = req. body;
      const note = await Note.insertMany([{
            user: req.user.id,
            title: title, 
            description: description,
            tag: tag
      }]);

      res.json(note);
}); 

router.put('/updatenote/:id', require('../middlewares/decodeData'), async (req, res) => {
      
      const {title, description, tag} = req.body;
      let newNote = {};

      if(title) {
            newNote.title = title;
      }
      if(description) {
            newNote.description = description;
      }
      if(tag) {
            newNote.tag = tag;
      }

      const note = await Note.findOne({_id: req.params.id});
      console.log(note);
      if(!note) {
            res.send("note with your id doesn't exist");
      } else {
            if(note.user.toString() === req.user.id) {
                  const latestNote = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
                  res.json({note: latestNote});
            } else {
                  res.status(401).json({err: "You are not authorized to access this content!"});
            }
      }
});

router.delete('/deletenote/:id', require('../middlewares/decodeData'), async (req, res) => {

      const note = await Note.findOne({_id: req.params.id});
      console.log(note);
      if(!note) {
            res.send("note with your id doesn't exist");
      } else {
            if(note.user.toString() === req.user.id) {
                  const latestNote = await Note.findByIdAndDelete(req.params.id);
                  res.json({"message": "Note has been successfully deleted!"});
            } else {
                  res.status(401).json({err: "You are not authorized to access this content!"});
            }
      }
});

module.exports = router;