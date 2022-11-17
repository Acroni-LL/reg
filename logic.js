/*
 * @Author: luoli
 * @Date: 2022-11-17 16:29:41
 * @LastEditors: luoli
 * @LastEditTime: 2022-11-17 22:16:43
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
    /(\d[+])*\{\d+(,\d+)+\}:(\d+)((([+]\{\d+(,\d+)+\}:(\d+))*)(([+]\d+)*))*(\;\d+([+]\d+)+)+/;
  //  ;后面是组 {2,3}:1+1+{4,5}:1;{2,3}:1+1 1+{2,3}:1;1+{2,3}:1+{2,3}:1+1
  const reg3_2 =
    /(\d[+])*\{\d+(,\d+)+\}:(\d+)((([+]\{\d+(,\d+)+\}:(\d+))*)(([+]\d+)*))*(\;(\d[+])*(\{\d(,\d)+\}:\d)+)+([+]\{\d+(,\d)+\}:\d+)*([+]\d+)*/;
  let allSealNum = [];
  let setSealNum = [];
  let setSealLength = [];
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
      isC = this.isContain(allSealNum, setSealNum);
    } else if (reg2.test(sealGroup)) {
      console.log('reg2');
      const sealReg = /\{(.+?)\}/g;
      //{1,2}:1+{3,4}:1
      const sealArr = sealGroup.match(sealReg);
      const sealLength = sealGroup.split('+');
      sealLength.map((item) => {
        const lengthArr = item.split(':');
        setSealLength.push(lengthArr[1]);
      });
      sealArr.map((item, i) => {
        const s = item.substring(1, item.length - 1);
        setSealNum = setSealNum.concat(s.split(','));
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
        isC = this.isContain(allSealNum, setSealNum);
      }
    } else if (reg3_1.test(sealGroup)) {
      console.log('reg3_1');
    } else if (reg3_2.test(sealGroup)) {
      console.log('reg3_2');
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

sealGroup = '1+{2,3}:1;1+{2,3}:1+{2,3}:1+1';
sealGroupLegal();
