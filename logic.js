/*
 * @Author: luoli
 * @Date: 2022-11-17 16:29:41
 * @LastEditors: luoli
 * @LastEditTime: 2022-11-17 16:30:50
 * @FilePath: \reg\logic.js
 * @Description:
 *
 */
function isContain(all, part) {
  let isC = true;
  part.map((item) => {
    if (all.indexOf(item) < 0) {
      isC = false;
    }
  });
  return isC;
}
