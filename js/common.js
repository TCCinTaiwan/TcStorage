/**
* TcStorage共用JS函式
* @version 0.1.0
* @author TCC <john987john987@gmail.com>
* @date 2017-10-11
*
* @since 0.1.0 2017-10-11 TCC: 字串格式format"{0} is {1}"
*/
String.prototype.format = function() { // 字串格式化
    var formatted = this;
    for (var arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};