function Gallery(gallery) {
  //console&&console.log("Gallery - Constructor");

  var itemsList   = gallery.find("ul");
      btnNext     = gallery.find(".next");
      btnPrevious = gallery.find(".previous");

  //PUBLIC
  var public = {
    //public vars
    id:                   null,

    params: {
      offset:             null,
      totalItems:         null, 
      itemWidth:          null,
      totalWidth:         null,
      visibleWidth:       null,
      stopPosition:       null
    },
    

    //public methods
    init: function() {
      //console&&console.log("Gallery - init()");

      this.id                    = gallery.attr("id");
      this.params.totalItems     = itemsList.find("li").length; 

      //IE & FF Load the image before the script
      if (itemsList.find("li").first().find("img").outerWidth(true)) {
        loadCompleteHandler({data:{params:this.params}})
      } else {
        //Add and event listener for webkit
        itemsList.find("li").first().find("img").load({params:this.params},loadCompleteHandler);
      }
            
      btnNext.click(this.params, next);
      btnPrevious.click(this.params, previous);

      /*
      console&&console.log(this.id + " - init");
      console&&console.log(itemsList.attr("class"))
      console&&console.log(btnNext.attr("class"))
      console&&console.log(btnPrevious.attr("class"))
      */
    }
  }

  //PRIVATE
  var loadCompleteHandler = function(event) {
    //console&&console.log("Gallery - loadCompleteHandler()");
    event.data.params.offset          = parseInt(itemsList.find("li").last().css("margin-right"));
    event.data.params.itemWidth       = itemsList.find("li").first().outerWidth(true);
    event.data.params.totalWidth      = event.data.params.itemWidth * event.data.params.totalItems;
    event.data.params.visibleWidth    = gallery.find(".items").width();
    event.data.params.stopPosition    = (event.data.params.visibleWidth - event.data.params.totalWidth + event.data.params.offset);

    /*
    Sets the width of the UL. It would be better to use 
    "display: inline-block" or even set this with css
    and not have to set here, but IE sucks. And this is 
    easier than the alternatives.
    */
    itemsList.width(1000000);

    /*
    console&&console.log("itemsList.width(): " + itemsList.width());
    console&&console.log("itemsList.height(): " + itemsList.height());
    console&&console.log("totalItems: "    + event.data.params.totalItems);
    console&&console.log("itemWidth: "     + event.data.params.itemWidth);
    console&&console.log("totalWidth: "    + event.data.params.totalWidth);
    console&&console.log("visibleWidth: "  + event.data.params.visibleWidth);
    console&&console.log("stopPosition: "  + event.data.params.stopPosition);
    */
  }

  var next = function(params) {
    //console&&console.log("Gallery - next()");
    if(itemsList.position().left > params.data.stopPosition && !itemsList.is(":animated")){
      var animateTo;
      var nextPosition = itemsList.position().left - params.data.itemWidth;

      if (nextPosition < params.data.stopPosition) {
        animateTo = params.data.stopPosition;
      } else {
        animateTo = nextPosition;
      }
      itemsList.animate({left : animateTo + "px"});
    }
    return false;
  }

  var previous = function(params) {
    //console&&console.log("Gallery - previous()");
    if(itemsList.position().left < 0 && !itemsList.is(":animated")){
      var animateTo;

      //Scrolls back to beginning
      //var nextPosition = itemsList.position().left + params.data.totalWidth;

      //Scrolls back 1 * itemWidth
      var nextPosition = itemsList.position().left + params.data.itemWidth;

      if (nextPosition > 0) {
        animateTo = 0;
      } else {
        animateTo = nextPosition;
      }
      itemsList.animate({left : animateTo + "px"});

    }
    return false;
  }

  //Make public available
  return public;
}