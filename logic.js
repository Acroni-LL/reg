/*
 * @Author: luoli
 * @Date: 2022-11-17 16:29:41
 * @LastEditors: luoli
 * @LastEditTime: 2022-11-18 19:09:09
 * @FilePath: \reg\logic.js
 * @Description:
 *
 */

/**
 * @description: 判断是否存在
 * @param {*} all
 * @param {*} part
 * @return {*}
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

function sealGroupLegal() {
  /* 添加印鉴组合，印鉴组合合法性判断
   * 1. 最小值，最大值，组合串不允许为空
   * 2. 最小值< =最大值
   * 3. 组合串的合法性，组合串包含数字/逗号/加号/冒号（暂不）
   * 4. 印鉴编号要存在
   * 5. 金额范围不允许重复
   * 6. 特殊需求：金额区间包含0-*(暂不)
   * */
  const reg = /[^0-9:]/g;
  const reg1 = /^\d+([+]\d+)*(;\d+([+]\d+)*)*$/; //1+2;3+4
  // const reg2 = /^\{\d+(,\d+)+\}:(\d+)((([+]\{\d+(,\d+)+\}:(\d+))*)|([+]\d+))$/;
  const reg2 = /^(\d[+])*\{\d+(,\d+)+\}:(\d+)((([+]\{\d+(,\d+)+\}:(\d+))*)(([+]\d+)*))*$/; //{1,2}:1  {1,2}:1+5  {1,2}:1+{3,4}:1 {1,2}:1+{3,4}:1+5
  // reg3  // 1+{2,3}:1+{4,5}:1;1+{2,3}:2  1+{2,3}:1+{4,5}:1;1   1+{2,3}:1+{4,5}:1;1+1
  // * 原有正则reg3没法匹配该情况（组{2,2}:1 和 1+1 可以同时存在，可以只存在一个，可以都不存在）的时候，单独的分号；会被正确匹配
  // 所以分成两个正则
  // ;后面是普通组合 {2,3}:1+1+{4,5}:1;1+1+2
  const reg3_1 =
    /(\d[+])*\{\d+(,\d+)+\}:(\d+)((([+]\{\d+(,\d+)+\}:(\d+))*)(([+]\d+)*))*(\;\d+([+]\d+)*)+/;
  //  ;后面是组 {2,3}:1+1+{4,5}:1;{2,3}:1+1 1+{2,3}:1;1+{2,3}:1+{2,3}:1+1
  const reg3_2 =
    /(\d[+])*\{\d+(,\d+)+\}:(\d+)((([+]\{\d+(,\d+)+\}:(\d+))*)(([+]\d+)*))*(\;(\d[+])*(\{\d(,\d)+\}:\d)+)+([+]\{\d+(,\d)+\}:\d+)*([+]\d+)*/;
  let allSealNum = [];
  let setSealNum = [];
  let setSealLength = []; // 组的的n {1,2}:n
  allSealNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let isC = true; //印章是否存在
  if (sealGroup) {
    if (reg1.test(sealGroup)) {
      console.log('reg1');
      //1+2;3+4
      const arr1 = sealGroup.split(';');
      arr1.map((item) => {
        setSealNum = setSealNum.concat(item.split('+'));
      });
      //判断印章是否存在
      isC = isContain(allSealNum, setSealNum);
    } else if (reg2.test(sealGroup)) {
      console.log('reg2');
      const sealReg = /\{(.+?)\}/g;
      //{1,2}:1+{3,4}:1
      const sealArr = sealGroup.match(sealReg);
      const sealLength = sealGroup.split('+');
      //印鉴个数
      sealLength.map((item) => {
        const lengthArr = item.split(':');
        setSealLength.push(lengthArr[1]);
      });
      //组数，
      console.log('setSealLength', setSealLength);
      console.log(sealArr);
      sealArr.map((item, i) => {
        const s = item.substring(1, item.length - 1);
        console.log('s', s);
        setSealNum = setSealNum.concat(s.split(','));
        console.log('setSealNum', setSealNum);
        if (isC && s.split(',').length < setSealLength[i]) {
          isC = false;
        }
      });
      setSealNum.forEach((item) => {
        if (setSealNum.indexOf(item) !== setSealNum.lastIndexOf(item)) {
          isC = false;
        }
      });
      if (isC) {
        //判断印章是否存在
        isC = isContain(allSealNum, setSealNum);
      }
    } else if (reg3_1.test(sealGroup)) {
      console.log('reg3_1');
      const sealReg = /\{(.+?)\}/g;
      //{1,2}:1+{3,4}:1
      const sealArr = sealGroup.match(sealReg);
      const sealLength = sealGroup.split('+');
      //印鉴个数
      sealLength.map((item) => {
        const lengthArr = item.split(':');
        setSealLength.push(lengthArr[1]);
      });
      //组数，
      console.log(sealArr);
      sealArr.map((item, i) => {
        const s = item.substring(1, item.length - 1);
        console.log('s', s);
        setSealNum = setSealNum.concat(s.split(','));
        console.log('setSealNum', setSealNum);
        if (isC && s.split(',').length < setSealLength[i]) {
          isC = false;
        }
      });
      setSealNum.forEach((item) => {
        if (setSealNum.indexOf(item) !== setSealNum.lastIndexOf(item)) {
          isC = false;
        }
      });
      if (isC) {
        isC = isContain(allSealNum, setSealNum);
      }
    } else if (reg3_2.test(sealGroup)) {
      console.log('reg3_2');
      const sealReg = /\{(.+?)\}/g;
      //{1,2}:1+{3,4}:1
      const sealArr = sealGroup.match(sealReg); //印鉴组  ['{2,1}','{3,4}']
      const sealLength = sealGroup.split('+'); //印鉴个数 [ '1', '{2,3}:1;1', '{2,3}:1', '{2,3}:1', '1' ]
      sealLength.map((item) => {
        const lengthArr = item.split(':');
        setSealLength.push(lengthArr[1]);
      });
      sealArr.map((item, i) => {
        const s = item.substring(1, item.length - 1);
        console.log('s', s);
        setSealNum = setSealNum.concat(s.split(','));
        console.log('setSealNum', setSealNum);
        if (isC && s.split(',').length < setSealLength[i]) {
          isC = false;
        }
      });
      setSealNum.forEach((item) => {
        if (setSealNum.indexOf(item) !== setSealNum.lastIndexOf(item)) {
          isC = false;
        }
      });
      if (isC) {
        //判断印章是否存在
        isC = isContain(allSealNum, setSealNum);
      }
    }
    console.log('error5判断', allSealNum, setSealNum);
    console.log('error6判断', reg1.test(sealGroup), reg2.test(sealGroup));
    if (!isC) {
      console.log('请检查印鉴组合中印章编号');
    } else if (
      !(
        reg1.test(sealGroup) ||
        reg2.test(sealGroup) ||
        reg3_1.test(sealGroup) ||
        reg3_2.test(sealGroup)
      )
    ) {
      console.log('error6');
      console.log('请检查印鉴组合内容是否符合规则');
    } else {
      console.log('success');
    }
  } else {
    console.log('请填写印鉴组合');
  }
}

// sealGroup = '1+1';
// sealGroup = '{2,3}:1+1+{2,5}:1;1+1+2';
// sealGroup = '1+{2,3}:1;1+{2,3}:1+{2,3}:1+1';
// sealGroup = '{1,2}:1+{3,4}:2';
// sealGroupLegal();

/**
 * 1、分号  1+{2,3}:1;{2,3}:1   是正确的，1+{2,3}:1+{2,3}:1 1+{1,2}:1   是错误的
 * 2、1+1   是错误的
 */

/**
 * @description:
 * @param {*} sealGroup
 * @return {*}
 */
function checkGroupInput(sealGroup) {
  if (!sealGroup) {
    sealGroup = this.sealGroup;
  }
  // 没有；直接判断合法性
  console.log('sealGroup', sealGroup);
  if (sealGroup.indexOf(';') == -1) {
    // 无或
    console.log('无或');
    return normalCheck(sealGroup);
  } else {
    // 有或
    let flag = void 0;
    console.log('有或');
    let sealGroups = [];
    sealGroups = sealGroup.split(';');
    console.log('sealGroups', sealGroups);
    if (normalCheck(sealGroups) == undefined) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * @description: 检查没有；的组合，只判断是否重复和存在，无法判断是否相同
 * @param {Array|String} sealGroups
 * @return {Boolean}
 */
function normalCheck(sealGroups) {
  let allSealNum = [];
  let setSealNum = [];
  let setSealLength = [];
  allSealNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  // 单个组合 '1+{2,3}:1'
  console.log('____', sealGroups);
  if (typeof sealGroups === 'string') {
    // 有组 1+{2,3}:1+4
    if (sealGroups.indexOf('{') > -1) {
      console.log('无或 有组');
      sealReg = /:\d+/g;
      setSealNum = sealGroups.replaceAll(sealReg, '').match(/\d+/g);
      console.log('setSealNum', setSealNum);
      if (setSealNum.length != new Set(setSealNum).size) {
        return false;
      } else {
        return isContain(allSealNum, setSealNum);
      }
      // 无组 1+2
    } else {
      console.log('无或 无组');
      setSealNum = sealGroups.split('+');
      // 是否重复
      if (setSealNum.length != new Set(setSealNum).size) {
        return false;
      } else {
        return isContain(allSealNum, setSealNum);
      }
    }
    // 多个组合 ['1+{2,3}:1','1+{3,4}:1']
  } else {
    console.log('有或', sealGroups.length, sealGroups, 'sealGroups');
    let flag = false;
    try {
      sealGroups.forEach((item, i) => {
        console.log(item);
        // TODO:
        // 有组 1+{2,3}:1+4
        if (item.indexOf('{') > -1) {
          console.log('有组');
          sealReg = /:\d+/g;
          setSealNum = item.replaceAll(sealReg, '').match(/\d+/g);
          if (setSealNum.length != new Set(setSealNum).size) {
            flag = false;
          } else {
            flag = isContain(allSealNum, setSealNum);
          }
          // flag = false;
          console.log('flag', flag);
          // 无组 1+2
        } else {
          console.log('无组');
          setSealNum = item.split('+');
          // 是否重复
          if (setSealNum.length != new Set(setSealNum).size) {
            flag = false;
          } else {
            flag = isContain(allSealNum, setSealNum);
          }
          console.log('无组', 'flag', flag);
        }
        // 有一次不符合就跳出
        if (!flag) {
          throw new Error();
        }
      });
    } catch (e) {
      return Boolean(e.message);
      // throw e;
    }
  }
}
// sealGroup = '5+{1,2}:1+7+{3,4}:1+9;1+2+3+4+{5,6}:1+{7,8}:2';
// sealGroup = '7+{1,2,3}:1+6+5';
// sealGroup = '1+2+3+4+5+1';
// sealGroup = '{2,1}:1;1+2+{5,3}:1+{6,7}:1;{2,3,4,5,6,7}:2';

// test eg
// 无或
// sealGroup = '1+1';
// sealGroup = '1';
// sealGroup = '{1,2,3,7,9}:1';
// sealGroup = '{1,2,1}:1';
sealGroup = '1+{2,3,4}:1';
// sealGroup = '1+{1,3}:1';
sealGroup = '{2,3}:1+1';
sealGroup = '{2,3}:1+2+3+4';
// // 有或
sealGroup = '1;1+2';
sealGroup = '1+1;1+2';
sealGroup = '1;1+1';
sealGroup = '1+2;1+3;1+2;1+2+3+5+6;1+2+3;1;2';
sealGroup = '1;3;4;5;6;7;7;8';
sealGroup = '1+{1,2,3,7,9}:1;1';
sealGroup = '{1,2,3,7,9}:1;{1,2}:1';
sealGroup = '{1,2}:1+3;{1,2}:1;2';
sealGroup = '1+{2,3,4,5,7}:1+6+8;1+{2,3,4,5}:3+6+7;1+2;1+{2,3}:1+{4,5,6}:1';
sealGroup = '1+{3,2}:1;1';
console.log(1, checkGroupInput(sealGroup));

// 有或 ，返回false 为不通过
// undefined 为通过

// 有或的时候，和无或返回不一致

// 无货
// true 为通过
// false 为不通过

//TODO:
//检查一下
// 1+2;1+{2,3}:1
