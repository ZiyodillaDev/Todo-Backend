const fs = require("fs"); //imported fs

// IO (Input Output) class
class Io {
  constructor(dir) {
    this.dir = dir;
  }

  // Read-file func created
  async read() { 
    const data = await fs.promises.readFile(this.dir, "utf-8");
    return data ? JSON.parse(data) : [];
  }

  // Write-file func created
  write(data) {  
    fs.promises.writeFile(this.dir, JSON.stringify(data, null, 2));
    return { success: true };
  }
}

// Exported
module.exports = Io;
