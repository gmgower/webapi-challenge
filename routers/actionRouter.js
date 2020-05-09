const express = require('express');

const actionDB = require("../data/helpers/actionModel.js")
const projectDB = require('../data/helpers/projectModel.js');

const router = express.Router();

// POST /actions/projects/:id
router.post("/projects/:id", validateAction, (req,res) => {
    const {id} = req.params;
    const {description,notes} = req.body;
    const {body} = req;

    if(description && notes) {
        body.project_id = id;
        actionDB
        .insert(body)
        .then(response => {
            res.status(201).json(response)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({error: "The action information could not be retrieved"})
        })
    }
    else {
        res.status(400).json({error: "Missing description notes or description"})
    }
})

// POST /actions
// router.post('/', validateAction, (req ,res) => {
//     const actionInfo = req.body;
//     actionsDb.insert(actionInfo)
//         .then(response => {
//             res.status(201).json(response)
//         })
//         .catch(error => {
//             res.status(500).json({ message: 'Could not create action'})
//         })
// })

// GET /actions -
router.get('/', (req, res) => {
    actionDB
    .get()
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "The action could not be retrieved."})
    })
})

// GET /actions/id -
router.get('/:id', validateActionId, (req, res) => {
    const {id} = req.params;

    actionDB.get(id)
        .then(response => {
            res.status(200).json({success: response})
        })
        .catch(error => {
            res.status(500).json({ error: "The actions information could not be retrieved."})
        })
}) 

// GET /actions/projects/:id
// router.get("/projects/:id", (req,res) => {
//     const {id} = req.params;
//     projectDB
//     .getProjectActions(id)
//     .then(response => {
//         res.status(200).json(response)
//     })
//     .catch(error => {
//         console.log(error);
//         res.status(500).json({error: "The actions information could not be retrieved."})
//     })
// })

// get action by id
router.get("/:id",validateActionId,(req,res) => {
    res.status(200).json(req.response)
})

// PUT /actions/id -
router.put('/:id', validateAction, validateActionId, (req, res) => {
    const {id} = req.params
    const actionInfo = req.body
    actionDB.update(id, actionInfo)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({ error: 'Error updating the actions.'})
        })
})


// DELETE /actions/id
router.delete('/:id', validateActionId, (req, res) => {
    const {id} = req.params;
    actionDB
    .remove(id)
        .then(() => res.status(200).end())
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: `The project with the specified ID ${id} does not exist.`})
        })
})

// middleware
function validateActionId(req, res, next) {
    const {id} = req.params.id

    actionDB.get(Number(id))
        .then(response => {
            if(response) {
                req.action = response;
                next();
            } else {
                res.status(400).json({ message :`The action with the specified ID ${id} does not exist.` })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "The action information could not be retrieved.", error})
        })
}

function validateAction(req, res, next) {
    
    if(!req.body.description || req.body.description.length > 128) {
        res.status(400).json({ message: 'Missing description data or description is over 128 character'})
    }
    else if(!req.body.notes) {
        res.status(400).json({ message: 'Missing notes data'})
    }
    projectDB.get(Number(req.body.project_id))
        .then(response => {
            if(response) {
                next()
            }
            else {
                res.stats(404).json({ message: 'No project with given Id'})
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Could not get project'})
        })
};

module.exports = router;