function Gallery(gallery) {
  //console&&console.log("Gallery - Constructor");

  var itemsList     = gallery.find("ul"),
      btnNext       = gallery.find(".next"),
      btnPrevious   = gallery.find(".previous"),
      items         = itemsList.find("li"),
      galleryImage  = gallery.find(".galleryImage").find("img");
      
  //PUBLIC
  var public = {
    //public vars
    id:                   null,

    params: {
      offset:             0,
      totalItems:         0, 
      itemWidth:          0,
      totalWidth:         0,
      visibleWidth:       0,
      stopPosition:       0
    },
    

    //public methods
    init: function() {
      //console&&console.log("Gallery - init()");
      this.id                    = gallery.attr("id");
      this.params.totalItems     = items.length; 


      //IE & FF Load the image before the script
      if (items.first().find("img").outerWidth(true)) {
        loadCompleteHandler({data:{params:this.params}})
      } else {
        //Add and event listener for webkit
        items.first().find("img").load({params:this.params},loadCompleteHandler);
      }

      
      
      if (galleryImage.val() == "") {
        console.log("HERE");
        items.each(function(index){
          $(this).find("a").click(function(){
            var newImage = $(this).find("img").attr("data-medium");
            galleryImage.attr("src", newImage);
            //console.log($(this).find("img").attr("data-medium"));
            return false;
          });
        });
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
    event.data.params.offset          = parseInt(items.last().css("margin-right"));
    event.data.params.itemWidth       = items.first().outerWidth(true);

    items.each(function(index) {
      //console.log(scroller.attr("id") + " li width: " + $(this).outerWidth(true));
      event.data.params.totalWidth += $(this).outerWidth(true);
    });

    //event.data.params.totalWidth      = event.data.params.itemWidth * event.data.params.totalItems;
    event.data.params.visibleWidth    = gallery.find(".itemsContainer").width();
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