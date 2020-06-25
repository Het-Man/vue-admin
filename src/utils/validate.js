/* 
  过滤特殊字符
*/

export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

// 验证邮箱
export function validateEmail(value){
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  
  return !reg.test(value)
}

// 验证密码
export function  validatePass(value){
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
  return !reg.test(value)
}

// 验证 验证码
export function  VerificationCode(value){
  let reg = /^[a-z0-9]{6}$/
  return !reg.test(value)
}


export function formatDateTime(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};

// 时间戳转格式 xxxx-xx-xx xx:xx:xx
export function timestampToTime(timestamp) {
  let now = new Date(timestamp*1000);
  let year = now.getFullYear();    
  let month = now.getMonth()+1;    
  let date = now.getDate();    
  let hour = now.getHours(); 
  hour =  hour < 10 ? '0'+hour:hour;
  let minute = now.getMinutes();   
  minute =  minute < 10 ? '0'+minute:minute;
  let second = now.getSeconds(); 
  second =  second < 10 ? '0'+second:second;   
  return year+"-"+month+"-"+date+"   "+ hour + ":" + minute + ":" + second;
}


