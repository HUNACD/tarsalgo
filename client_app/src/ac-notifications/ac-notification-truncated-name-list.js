import '../../../../@polymer/polymer/polymer.js';

export const YpTruncatedNameList = {
  truncateNameList: function (nameString) {
    if (nameString) {
      //console.log("String in: "+nameString);
      var array = nameString.split(',');
      //console.log("String array length: "+array.length);
      var stringOut;
      if (array.length>2) {
 //       console.log("Array too long");
        var newArray = array.splice(0, 2);
//        console.log("New array length: "+newArray.length);
        stringOut = newArray.join(', ');
        var reminderCount = array.length;
        stringOut += " +";
        stringOut += reminderCount;
      } else {
        stringOut = array.join(', ');
      }
//        console.log("String out: "+stringOut);
      return stringOut;
    } else {
      return "";
    }
  }
};
