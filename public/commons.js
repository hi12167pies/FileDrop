// This file is used a lib file

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = bytes / Math.pow(k, i)
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`
}

function formatBits(bits, decimals = 2) {
  if (bits === 0) return '0 bps'

  const k = 1000;
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps']
  const i = Math.floor(Math.log(bits) / Math.log(k))

  const value = bits / Math.pow(k, i)
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`
}
