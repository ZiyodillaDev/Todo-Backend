// Parser func
const bodyParser = (request) => {

  // resolve and reject
  return new Promise((resolve, reject) => {

    // if data returns true
    try {
      request.on("data", (data) => {
        resolve(JSON.parse(data));
      });
    } catch (error) {
        
      // if  returns error
      reject(error);
    }
  });
};

// Export
module.exports = bodyParser;
