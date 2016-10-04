/**
 * Using Rails-like standard naming convention for endpoints.
 * POST     /api/proxies              ->  create
 */

'use strict';
const exec = require('child_process').exec;
const truffleProject = '/home/tkeber/workspace/meta-bc/truffle-project';


// create new proxy
export function create(req, res) {
  var userAccount = req.body.userAccount;
  console.log(`create proxy for ${userAccount}`);
  exec(`cd ${truffleProject}; ./scripts/buildProxy.sh ${userAccount}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send(error);
    } else {
      console.log(stdout);
      res.send(stdout);
    }
  });
}
