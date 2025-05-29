# FEUP Fire Department
Group T07G02, CG 2024/2025

## Project Description

This project presents an interactive 3D scene simulating a fire department environment. The scene features a panoramic sky, a grassy terrain, a detailed fire station building with a rooftop heliport, a controllable and animated helicopter, a lake, and a procedurally generated forest with trees of varying sizes, colors, and positions. 

The project applies computer graphics techniques learned throughout the course, including modeling, component animation, texture mapping, and the use of shaders for object visualization. User interaction is supported through keyboard controls and a graphical interface.

## Keyboard Controls

| Key         | Action                                                                 |
|-------------|------------------------------------------------------------------------|
| W           | Accelerate helicopter forward                                          |
| S           | Decelerate (brake) helicopter                                          |
| A           | Turn helicopter left                                                   |
| D           | Turn helicopter right                                                  |
| R           | Reset helicopter position and camera (to heliport, at rest)            |
| P           | Ascend helicopter (take off or rise from lake)                         |
| L           | If above the lake and the bucket is empty, lower the bucket into the lake. Otherwise (if the bucket has water or the helicopter is not above the lake), automatically fly and land at the heliport. |
| O           | Drop water on fire (when over fire with water in bucket)               |
| B           | Fill the bucket with water                                             |
| F           | Set a fire in the forest (max. 3)                                      |
| 0           | Switch to Default camera view                                          |
| 1           | Switch to First Person camera view                                     |
| 2           | Switch to Third Person camera view                                     |

## GUI Controls

- **Display Axis**: Toggle the display of the coordinate axis.
- **Display Forest**: Toggle the display of the forest.
- **Display Particles**: Toggle the display of fire particle effects.
- **Camera View**: Switch between Default, First Person, and Third Person camera perspectives.
- **Reset Camera**: Instantly reset the camera to its initial default position and orientation.
- **Reset Helicopter**: Instantly reset the helicopter to its initial position and state (same as R key).
- **Set a Fire**: Manually set a fire in the forest (same as F key).
- **Reset Fires**: Extinguish all fires in the forest.
- **Fill Bucket**: Instantly fill the helicopter's bucket with water (same as B key).
- **Speed Factor**: Adjust the sensitivity of helicopter acceleration and rotation (range: 0.1 to 3).
- **FPS Rate**: Set the simulation's frame rate (24, 30, 60, or 120 FPS).

## Demo
Click on the image to watch the demo 👇

[![](https://img.youtube.com/vi/ZjoBs6ck5fw/0.jpg)](https://youtu.be/ZjoBs6ck5fw)
