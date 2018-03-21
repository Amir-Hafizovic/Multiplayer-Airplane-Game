const randomColor = `0x${(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`;

const Colors = {
  airplane: randomColor,
  white: 0xe8e0e1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  water: 0x006457,
};

export default Colors;
