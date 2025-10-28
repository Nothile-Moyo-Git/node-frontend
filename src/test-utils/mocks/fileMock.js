const path = require("path");

module.exports = {
  process(_, filename) {
    const fileName = path.basename(filename);
    return `module.exports = "${fileName}";`;
  },
};
