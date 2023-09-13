const db = require('../models');
const Client = db.client;
const logger = require('../middleware/logger'); // Adjust the path to where you saved logger.js

exports.addClient = async (req, res) => {
  try {
    console.log(req.body);
    // Validate request
    if (!req.body.name) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    const newclient = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      apikey: req.body.apikey,
      usagePlanId: req.body.usagePlanId
    }

    const client = await Client.create(newclient);
    res.status(201).json(client);
  } catch (error) {
    logger.error(`Error adding client: ${error.message}`);
    res.status(500).send('Error adding client');
  }
};


exports.updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    if (!clientId || !req.body) {
      res.status(400).send({ message: "Data to update can not be empty!" });
      return;
    }

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      apikey: req.body.apikey,
      usagePlanId: req.body.usagePlanId
    };
    const updatedClient = await Client.findByIdAndUpdate(clientId, updateData, { new: true });

    if (!updatedClient) {
      res.status(404).send({ message: `Cannot update client with id=${clientId}. Maybe client was not found!` });
    } else {
      res.status(200).json(updatedClient);
    }
  } catch (error) {
    logger.error(`Error updating client: ${error.message}`);
    res.status(500).send('Error updating client');
  }
};

// exports.updateClient = async (req, res) => {
//   try {
//     const client = await ClientService.updateClient(req.params.id, req.body);
//     res.status(200).json(client);
//   } catch (error) {
//     res.status(500).send('Error updating client');
//   }
// };

// exports.deleteClient = async (req, res) => {
//   try {
//     await ClientService.deleteClient(req.params.id);
//     res.status(200).send('Client deleted successfully');
//   } catch (error) {
//     res.status(500).send('Error deleting client');
//   }
// };

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).send('Error fetching clients');
  }
};