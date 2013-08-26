TODO
================================================================================

backgroundColor -> background.color
border => meme chose

measuredOffset -> measuredOrigin ! bin non ça existe pu "origin"
absoluteOffset -> absoluteOrigin

animate should take:
 - object
  {property: [from, to], property: to}
 - function
 - key value

unit system
 "50%"
 "50% of offset.x"

Think about the "content" property

class content ?
      Content ?

    offset.x
    offset.y
    size.x
    size.y
    layout()
    orientation
    alignment.x
    alignment.y

class Alignment ?
class Direction ?

class Transform

    convert() ?
    matrix() ?

- __absoluteOffset calculated when measuredOffset changes

- Finish matrix transform - Add Shearing

- Transform - Add Origin

- Improve performance for object.set and object.get methods

- Notify property change listeners for non-writable properties

- Draw view shadow

- Improve drawing algorithm on canvas

- ResponsiveLayout

- View addGestureRecogniser

- GestureRecogniser

- Fork ZyngaScroller, make it packageable

- Controls
    - Button
    - NavigationBar
    - TabBar

- Label

- TextView

- ScrollView
    - directions

- Direction object

- Image
- ImageMap

- ViewStyle

- Controller

- Canvas

- Touch class has an absolutePosition and relativePosition target
    - method to calculate position relative to a view

- Think about view controller transition / view transition

- When a view adds or remove a child, also pass the owner to the event

- Integrate prime

- Detect if the layout has to be entirely recalculated

- Add a center property to the Position class.

- Any call to the render loop should be cancelled when beginTransition starts

- Find a better way to share if a view is being transitioned


Done
================================================================================

- Rename LinearLayout to Flexible Layout
- X Think about naming layout content and Layout to somethingelse
- Add a private variable in the view class to detect if the measuredOffset and measuredSize were set

- WTF:
            var root = new boxspring.view.Window()
            root.layout = new LinearLayout()
            root.orientation = 'vertical'
            root.size.x = 'auto'
            root.size.y = 'auto' // AUTO ?