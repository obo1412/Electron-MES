export function timeFormmatter(currentTime) {
  // Time make to YYYY-MM-DD HH:mm:ss
  const offset = new Date().getTimezoneOffset() * 60000;
  let isoDate = new Date(currentTime - offset).toISOString();
  const resultArr = isoDate.split("T");
  let thisDate = resultArr[0];
  let thisTime = resultArr[1];
  thisTime = thisTime.substring(0, thisTime.indexOf("."));
  const result = thisDate + " " + thisTime;
  return result;
}

export async function bufferToString(data) {
  const result = (await data) instanceof Buffer ? data.toString("utf-8") : data;
  return result;
}
