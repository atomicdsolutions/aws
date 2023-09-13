const express = require('express');
const router = express.Router();
const logger = require('../middleware/logger');

//AWS API GateWasy
const apigatewayController = require('../controler/apigateway.controller'); // Make sure this path is correct

router.post('/get-usage-plan', apigatewayController.getUsagePlan);

router.post('/get-usage', apigatewayController.getUsage);
// apigatewayController.getUsage);
router.post('/get-api-keys', apigatewayController.getApiKeys);

//Mongoose Database Data
const clients = require('../controler/clientControler'); // Make sure this path is correct

// router.post('/clients', clients.addClient);

router.post('/clients', async (req, res, next) => {
    try {
        const result = await clients.addClient(req, res);
        res.status(201).json(result);
    } catch (err) {
        logger.error(`Error adding Client: ${err.message}`);
        next(err);
    }
});
// router.put('/clients/:id', clients.updateClient);
// router.delete('/clients/:id', clients.deleteClient);
router.get('/clients', clients.getAllClients);

// Error handling middleware
router.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

module.exports = router;