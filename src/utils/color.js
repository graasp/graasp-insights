const generateTextColorFromBackground = (rgb) =>
  rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 <= 186 ? 'white' : 'black';

module.exports = {
  generateTextColorFromBackground,
};
