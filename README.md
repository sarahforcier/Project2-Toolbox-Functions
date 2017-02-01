# [Project2: Toolbox Functions]

## Color
interpolate (power 2) color from black to selected color based on which layer the feather belongs to

## Orientation
The length of the feathers are calculated by two trig functions to achieve the decrease in length in the middle of the wing. The thickness of the feather is decreased with a small bias to the tip of the wing. 

## Scale
The feathers are distributed along the wing with a stronger bias towards the end. The rotation of the feathers are also increased along the curve with a strong bias towards the tip in order to achieve the "flick" at the end. The shorter feathers are thicker (based on layers)

## Distribution
The parameters are the tesselation number, representing the number of feathers along the curve. The number of layers is obvious.   

## Wind
The feathers flutter/rotate based on the angle of the force (cosine) and the magnitude of the force. 

## Motion
The wing flaps with a magnitude of the motion parameter and speed. The curvature affects the overall curve of the wing but changing the control points of the curve. 

