  // -------------------------- Masonry Column Shift -------------------------- //
  
  // custom layout mode
  $.Isotope.prototype._masonryColumnShiftReset = function() {

    ////CENTER
    // layout-specific props
    this.masonry = {};
    // FIXME shouldn't have to call this again
    this._getCenteredMasonryColumns();
    var i = this.masonry.cols;
    this.masonry.colYs = [];
    while (i--) {
      this.masonry.colYs.push( 0 );
    }

    //Shift
    // layout-specific props
    var props = this.masonryColumnShift = {
      columnBricks: []
    };
    // FIXME shouldn't have to call this again
    this._getSegments();
    var i = this.masonry.cols;
    props.colYs = [];
    while (i--) {
      props.colYs.push( 0 );
      // push an array, for bricks in each column
      props.columnBricks.push([])
    }
  };
  
  $.Isotope.prototype._masonryColumnShiftLayout = function( $elems ) {
   
    var instance = this,
          props = instance.masonry;
      $elems.each(function(){
        var $this = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.columnWidth );
        colSpan = Math.min( colSpan, props.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, props.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.cols + 1 - colSpan,
              groupY = [],
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = props.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          instance._masonryPlaceBrick( $this, groupY );
        }
      });
 
  };


// worker method that places brick in the columnSet
    // with the the minY
    $.Isotope.prototype._masonryPlaceBrick = function( $brick, setY ) {
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var x = this.masonry.columnWidth * shortCol,
          y = minimumY;
      this._pushPosition( $brick, x, y );
      $.data( $brick[0], 'masonryColumnIndex', i );
      this.masonryColumnShift.columnBricks[i].push( $brick[0] );

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.masonry.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
        this.masonryColumnShift.colYs[ shortCol + i ] = setHeight;
      }

    };
  
 $.Isotope.prototype._masonryColumnShiftGetContainerSize = function() {
    //Shift
    var containerHeight = Math.max.apply( Math, this.masonryColumnShift.colYs );

    //Center
    var unusedCols = 0,
        i = this.masonry.cols;
    // count unused columns
    while ( --i ) {
      if ( this.masonry.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
 
    var containerWidth = (this.masonry.cols - unusedCols) * this.masonry.columnWidth;

    return { height: containerHeight, width: containerWidth };
  };




  $.Isotope.prototype._masonryColumnShiftResizeChanged = function() {
    //shift
    this._checkIfSegmentsChanged();

    //center
    var prevColCount = this.masonry.cols;
    // get updated colCount
    this._getCenteredMasonryColumns();
    return ( this.masonry.cols !== prevColCount );
    
  };
  
  $.Isotope.prototype.shiftColumnOfItem = function( itemElem, callback ) {
    
    var columnIndex = $.data( itemElem, 'masonryColumnIndex' );
    // don't proceed if no columnIndex
    if ( !isFinite(columnIndex) ) {
      return;
    }
    var props = this.masonryColumnShift;
    var columnBricks = props.columnBricks[ columnIndex ];
    var $brick;
    var x = props.columnWidth * columnIndex;
    var y = 0;
    for (var i=0, len = columnBricks.length; i < len; i++) {
      $brick = $( columnBricks[i] );
      this._pushPosition( $brick, x, y );
      y += $brick.outerHeight(true);
    }

    // set the size of the container
    if ( this.options.resizesContainer ) {
      var containerStyle = this._masonryColumnShiftGetContainerSize();
      containerStyle.height = Math.max( y, containerStyle.height );
      this.styleQueue.push({ $el: this.element, style: containerStyle });
    }

    this._processStyleQueue( $(columnBricks), callback )

  };

  $.Isotope.prototype._getCenteredMasonryColumns = function() {
    this.width = this.element.width();
    
    var parentWidth = this.element.parent().width();
    
                  // i.e. options.masonry && options.masonry.columnWidth
    var colW = this.options.masonry && this.options.masonry.columnWidth ||
                  // or use the size of the first item
                  this.$filteredAtoms.outerWidth(true) ||
                  // if there's no items, use size of container
                  parentWidth;
    
    var cols = Math.floor( parentWidth / colW );
    cols = Math.max( cols, 1 );

    // i.e. this.masonry.cols = ....
    this.masonry.cols = cols;
    // i.e. this.masonry.columnWidth = ...
    this.masonry.columnWidth = colW;
  };
