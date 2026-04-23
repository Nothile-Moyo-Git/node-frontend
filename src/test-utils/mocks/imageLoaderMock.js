/**
 * Date created: 23/04/2026
 *
 * Author: Nothile Moyo
 *
 * Description: Our mock image loading file
 */

module.exports = {
  loadImage: (fileName) => {
    // Simulate a failed load for invalid paths to trigger the catch block in tests
    if (fileName === "invalid.jpg") {
      throw new Error("Could not load image");
    }
    return "test-file-stub";
  },
};
