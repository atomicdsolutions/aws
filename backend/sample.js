const express = require('express');
const aws = require('./apigatewayRouter');
const cors = require('cors');
const app = express();
const port = 3000;

app.use('/api', aws);
app.use(cors());
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});





// const express = require('express');
// const AWS = require('aws-sdk');

// const app = express();
// const port = 3000;

// // Function to assume role and get temporary credentials
// const assumeRoleAndGetCredentials = (callback) => {
//   const sts = new AWS.STS();
//   const roleToAssume = {
//     RoleArn: 'arn:aws:iam::560385710611:role/cross-account-global-support', // Replace with the ARN of the role you want to assume
//     RoleSessionName: 'cross-account-global-support', // Replace with a suitable session name
//   };

//   sts.assumeRole(roleToAssume, (err, data) => {
//     if (err) {
//       callback(err, null);
//       return;
//     }

//     // Return the temporary credentials from the assumed role
//     callback(null, {
//       accessKeyId: data.Credentials.AccessKeyId,
//       secretAccessKey: data.Credentials.SecretAccessKey,
//       sessionToken: data.Credentials.SessionToken,
//       region: 'us-west-2', // Replace with your desired region
//     });
//   });
// };

// app.get('/get-usage-plan', (req, res) => {
//   assumeRoleAndGetCredentials((err, credentials) => {
//     if (err) {
//       console.log('Error assuming role:', err);
//       res.status(500).send('Error assuming role');
//       return;
//     }

//     AWS.config.update(credentials);

//     const apigateway = new AWS.APIGateway();
//     const usagePlanId = 'wf7f2k'; // Replace with your usage plan ID

//     apigateway.getUsagePlan({ usagePlanId }, (err, usagePlanData) => {
//       if (err) {
//         console.log('Error retrieving usage plan:', err);
//         res.status(500).send('Error retrieving usage plan');
//       } else {
//         res.json(usagePlanData);
//       }
//     });
//   });
// });

// app.get('/get-usage', (req, res) => {
//   assumeRoleAndGetCredentials((err, credentials) => {
//     if (err) {
//       console.log('Error assuming role:', err);
//       res.status(500).send('Error assuming role');
//       return;
//     }

//     AWS.config.update(credentials);

//     const apigateway = new AWS.APIGateway();
//     const params = {
//       usagePlanId: 'wf7f2k', // Replace with your usage plan ID
//       keyId: 'c8vhmtdfo4', // Replace with your API key ID
//       startDate: '2023-08-01', // Replace with the start date
//       endDate: '2023-08-01', // Replace with the end date
//     };

//     apigateway.getUsage(params, (err, usageData) => {
//       if (err) {
//         console.log('Error retrieving usage data:', err);
//         res.status(500).send('Error retrieving usage data');
//       } else {
//         res.json(usageData);
//       }
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
const AWS = require('aws-sdk');

// Set up the credentials for the source profile
const credentials = new AWS.SharedIniFileCredentials({ profile: 'pb-aws-global-support' });
AWS.config.credentials = credentials;
AWS.config.update({ region: 'eu-west-1' }); // Replace with your region

// Assume the role
const sts = new AWS.STS();
const roleToAssume = {
  RoleArn: 'arn:aws:iam::560385710611:role/cross-account-global-support', // Replace with the ARN of the role you want to assume
  RoleSessionName: 'cross-account-global-support', // Replace with a suitable session name
};

sts.assumeRole(roleToAssume, (err, data) => {
  if (err) {
    console.log('Error assuming role:', err);
    return;
  }

  // Use the temporary credentials from the assumed role
  AWS.config.update({
    accessKeyId: data.Credentials.AccessKeyId,
    secretAccessKey: data.Credentials.SecretAccessKey,
    sessionToken: data.Credentials.SessionToken,
  });

  const apigateway = new AWS.APIGateway();

  // Replace with your usage plan ID
  const usagePlanId = 'wf7f2k';

  apigateway.getUsagePlan({ usagePlanId }, (err, usagePlanData) => {
    if (err) {
      console.log('Error retrieving usage plan:', err);
    } else {
      console.log('Usage plan:', usagePlanData);
    }
  });
});
