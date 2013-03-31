function Gallery(gallery) {
  // console.log("Gallery - Constructor");

  //PRIVATE VARS
  var itemsList     = gallery.find("ul"),
      btnNext       = gallery.find(".next"),
      btnPrevious   = gallery.find(".previous"),
      galleryImage  = gallery.find(".gallery_image").find("img"),

      items         = itemsList.find("li"),
      images        = [],
      loadedImages  = [],
      params        = {
                        offset:             0,
                        totalItems:         0, 
                        itemWidth:          0,
                        totalWidth:         0,
                        visibleWidth:       0,
                        stopPosition:       0
                      };
      
      
  //PUBLIC PROPERTIES
  var public = {
    //PUBLIC VARS
    id:                   null,

    
    //PUBLIC METHODS
    init: function() {
      // console.log("Gallery - init()");
      this.id                    = gallery.attr("id");


      /*
      Checks to see if images are fully loaded.
      If not add's an event listener and only 
      continues when all images have loaded.
      */
      items.find("img").each(function(index, params) {
        var image         = $(this);
        var imageComplete = image[0].complete;
        images.push(image);

        // console.log(image + ".complete: " + imageComplete);

        if (imageComplete) {
          // console.log("Image has already loaded with a width of: " + items.first().find("img").width());
          loadedImages.push(image);//loadCompleteHandler({data:{params:params}})
        } else {
          // console.log("Adding event listener");
          //image.load({params:params},loadCompleteHandler);
          image.load({params:params}, function(event){
            loadedImages.push(image);
            configure(params);
          });
        }
      })


      /*
      This is here to kick off configure() 
      incase case all the images have already 
      loaded via a fast connection or caching.
      */
      if (loadedImages.length == images.length) {
        configure(params);
      }
      

      /*
      This is only used if there is a galleryImage.
      If you don't want to use the galleryImage and
      just have a plain scroller remove the 
      "galleryImage" div from the html.
      */
      if (galleryImage.val() == "") {
        // console.log("'galleryImage' exists...");
        items.each(function(index){
          $(this).find("a").click(function(){
            var newImage = $(this).find("img").attr("data-medium");
            galleryImage.attr("src", newImage);
            return false;
          });
        });
      }


      /*
      Add back/next functionality
      */
      btnNext.click(params, next);
      btnPrevious.click(params, previous);
    }
  }

  //PRIVATE METHODS
  var configure = function() {
    // console.log("Gallery - loadCompleteHandler()");

    if (loadedImages.length == images.length) {
      // console.log("Configuring...");
      params.offset          = parseInt(items.last().css("margin-right"));
      params.itemWidth       = items.first().outerWidth(true); //Used in next()/previous()

      items.each(function(index) {
        params.totalWidth   += $(this).outerWidth(true);
      });

      params.visibleWidth    = gallery.find(".items_container").width();
      params.stopPosition    = params.visibleWidth - params.totalWidth + params.offset;

      
      /*
      Sets the width of the UL. It would be better to use 
      "display: inline-block" or even set this with css
      and not have to set here, but IE sucks. And this is 
      easier than the alternatives.
      */
      itemsList.width(1000000);

      // console.log("itemsList.width(): "  + itemsList.width());
      // console.log("itemsList.height(): " + itemsList.height());
      // console.log("totalItems: "         + items.length);
      // console.log("itemWidth: "          + params.itemWidth);
      // console.log("totalWidth: "         + params.totalWidth);
      // console.log("visibleWidth: "       + params.visibleWidth);
      // console.log("stopPosition: "       + params.stopPosition);
    }
  }

  var next = function(params) {
    // console.log("Gallery - next()");
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
    // console.log("Gallery - previous()");
    if(itemsList.position().left < 0 && !itemsList.is(":animated")){
      var animateTo;

      //Scrolls back to beginning
      //var nextPosition = itemsList.position().left + params.data.totalWidth;

      //Scrolls back -= itemWidth
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

  //RETURN PUBLIC PROPERTIES
  return public;
}