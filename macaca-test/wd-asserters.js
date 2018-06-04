
/**
 * asserters.isAllDisplayed
 *
 * @asserter
 */
var count = 0;

function isAllDisplayed(size) {
  return new Asserter(
  function(els,cb) {  
    els.isDisplayed(function(err, displayed) {
      // console.log(displayed);
      if(err) { return cb(err); }
      cb(null, displayed);
    });
    // count++;
    // console.log(count); 
    // if(count==size){
    //   count=0;
    //   cb(null,ture);
    // }else{
    //   cb(null,false);
    // }
  }
);
}

module.exports = {
  isAllDisplayed: isAllDisplayed
};
