TODO
================================================================================

- ScheduleRedraw retoure dans la base background-url(:canvas)

- put @private @static at the end

- Rename LinearLayout to Flexible Layout
- Detect if the layout has to be entirely recalculated

- Add a center property to the Position class.

- Add a private variable in the view class to detect if the measuredOffset and measuredSize were set

- Any call to the render loop should be cancelled when beginTransition starts

- Find a better way to share if a view is being transitioned

- WTF:
            var root = new boxspring.view.Window()
            root.layout = new LinearLayout()
            root.orientation = 'vertical'
            root.size.x = 'auto'
            root.size.y = 'auto' // AUTO ?

Documentation
--------------------------------------------------------------------------------
 - Remove @super tag, add a @inherit tag over the inherit property
 - Fix comments in:

    /**
     * The animation that are running.
     * @method __animations
     * @private
     */
    __animations: null,

    /**
     * The area to redraw on the view.
     * @method __redrawArea
     * @private
     */
    __redrawArea: null,

    /**
     * Whether the view needs to be redrawn.
     * @method __needsRedraw
     * @private
     */
    __redrawScheduled: false,