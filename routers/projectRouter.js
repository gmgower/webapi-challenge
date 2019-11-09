const express = require('express');

const projectDB = require('../data/helpers/projectModel.js');
const actionDB = require('../data/helpers/actionModel.js');

const router = express.Router();

//  POST /projects
router.post('/', validateProject, (req, res) => {
    const projectInfo = req.body;
    // const {name, description} = req.body

    // if(!name || !description) {
    //     res.status(400).json({error: "Please provide name and description for the project."})
    // } else {
        projectDB.insert(projectInfo)
        .then(response => {
            res.status(201).json({success: response})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "There was an error while saving the post to the database."})
        })
    // }
});

// GET /projects
router.get('/', (req, res) => {
    projectDB
    .get()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        res
        .status(500)
        .json({error: 'The project information could not be retrieved.', err})
    });
});

// GET /projects/id
router.get('/:id', validateProjectId, (req, res) => {
    const {id} = req.params;

    projectDB.get(id)
        .then(response => {
            console.log('project', response)
            if(response) {
                res.status(200).json({success: response})
            } else {
                res.status(404).json({ success: false, message: `The project with specified ID ${id} does not exist.`})
            }
        })
        .catch(err => {
            res.status(500).json({err: `The project information could not be retrieved.`, err})
        })
})

// GET /projects/id/actions
router.get('/:id/actions', validateProjectId, (req, res) => {
    const {id} = req.params;

    projectDB.getProjectActions(id)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({message: 'The project information could not be retrieved.',error})
        })
})

// PUT /projects/id
router.put('/:id', validateProject, validateProjectId, (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    console.log(changes)
    console.log(id)
    projectDB.update(id, changes)
        .then(response => {
            if(response) {
                res.status(200).json(response);
            } else {
                res.status(404).json({ message: 'The project could not be found.'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error updating the project.' })
        })
})

// DELETE /projects/id
router.delete('/:id', validateProjectId, (req, res) => {
    const {id} = req.params;
    projectDB
        .remove(id)
        .then(() => res.status(204).end())
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: `The project with the specified ID ${id} does not exist.`})
        } )
})

// custom middleware
function validateProjectId(req, res, next) {
    const {id} = req.params;

    projectDB.get(Number(id))
        .then(response => {
            if(response) {
                res.project = response
                next();
            } else {
                res.status(400).json({ message: "The project could not be found."})
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Cannot retrieve project.", error})
        })
}

function validateProject(req, res, next) {
    const {name, description} = req.body

    if(!name || !description) {
        res.status(400).json({ message: "Please provide name and description for the project."})
    }
    next()

}


module.exports = router;
