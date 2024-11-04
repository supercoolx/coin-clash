export const shortenAddress = (
  address,
  length = 6,
  rightLength = length,
) =>
  [
    address.slice(0, length),
    rightLength > 0 ? address.slice(rightLength * -1) : '',
  ].join('...')