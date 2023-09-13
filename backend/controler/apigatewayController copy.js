const AWS = require('aws-sdk');
const db = require("../models");
// const UsagePlan = db.usagePlan;
// const ApiKey = db.apiKey;

// Set up the credentials for the source profile
const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;
AWS.config.update({ region: 'eu-west-1' }); // Replace with your region

// Function to assume role and get temporary credentials
const assumeRoleAndGetCredentials = (callback) => {
  const sts = new AWS.STS();
  const roleToAssume = {
    RoleArn: 'arn:aws:iam::560385710611:role/cross-account-global-support', // Replace with the ARN of the role you want to assume
    RoleSessionName: 'cross-account-global-support', // Replace with a suitable session name
  };

  sts.assumeRole(roleToAssume, (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Return the temporary credentials from the assumed role
    callback(null, {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken
    });
  });
};

exports.getUsagePlan = (req, res) => {
  assumeRoleAndGetCredentials((err, credentials) => {
    if (err) {
      console.log('Error assuming role:', err);
      res.status(500).send('Error assuming role');
      return;
    }
    var attempts = 0;
    AWS.config.update(credentials);

    const apigateway = new AWS.APIGateway();
    const usagePlanId = 'wf7f2k'; // Replace with your usage plan ID

    apigateway.getUsagePlan({ usagePlanId }, (err, usagePlanData) => {
      if (err) {
        console.log('Error retrieving usage plan:', err);
        res.status(500).send('Error retrieving usage plan');
      } else {
        res.json(usagePlanData);
      }
    });
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.getUsage = (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send('Expected an array in the request body');
    }

    const results = [];
    const errors = [];

    const processItem = async (item, callback) => {
      const apikey = item.apikey;
      const usagePlanId = item.usagePlanId;

      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];

      const params = {
        usagePlanId: usagePlanId,
        keyId: apikey,
        startDate: startDate,
        endDate: endDate,
        limit: 1000
      };

      const apigateway = createApiGateway();
      apigateway.getUsage(params, (err, usageData) => {
        if (err) {
          console.log('Error retrieving usage data:', err.message);
          errors.push({ apikey, error: err.message });
          // Introduce a delay before retrying
          setTimeout(callback, 1000);
        } else {
          const usagePlanItems = usageData.items[params.keyId];
          results.push({ apikey, data: usagePlanItems });
          callback();
        }
      });
    };

    let index = 0;
    const processNext = async () => {
      if (index < req.body.length) {
        await processItem(req.body[index], processNext);
        index++;
        // Introduce a delay between each request
        await delay(500);
      } else {
        // All items processed
        res.json({ results, errors });
      }
    };

    processNext();

  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.getApiKeys = (req, res) => {
  assumeRoleAndGetCredentials((err, credentials) => {
    if (err) {
      console.log('Error assuming role:', err);
      res.status(500).send('Error assuming role');
      return;
    }

    AWS.config.update(credentials);

    const apigateway = new AWS.APIGateway();

    apigateway.getApiKeys({}, (err, apiKeysData) => {
      if (err) {
        console.log('Error retrieving API keys:', err);
        res.status(500).send('Error retrieving API keys');
      }
      else {
        console.log(apiKeysData.items);
        res.json(apiKeysData.items);
      }

    });
  });
};