export function updateCameraFromHelicopter(camera, helicopter, scaleFactor = 6 * 0.7) {
    const heliPos = helicopter.position;
    const heliOrientation = helicopter.orientation;
    const leanAngle = helicopter.leanAngle;

    // Calculate the scaled position of the helicopter in world coordinates
    const heliWorldPos = vec3.fromValues(
        heliPos[0] * scaleFactor,
        heliPos[1] * scaleFactor,
        heliPos[2] * scaleFactor
    );

    // Offset in helicopter local space (eye relative to origin)
    const localOffset = vec3.fromValues(0, 1.5, -1.5);
    vec3.scale(localOffset, localOffset, scaleFactor);

    // Forward offset for target
    const forwardOffset = vec3.fromValues(0, 0.8, -4);
    vec3.scale(forwardOffset, forwardOffset, scaleFactor);

    // Compute rotation components
    const leanCos = Math.cos(leanAngle);
    const leanSin = Math.sin(leanAngle);
    const oriCos = Math.cos(heliOrientation);
    const oriSin = Math.sin(heliOrientation);

    // Apply RotateX(leanAngle) to localOffset
    const Wx_offset = localOffset[0];
    const Wy_offset = localOffset[1] * leanCos - localOffset[2] * leanSin;
    const Wz_offset = localOffset[1] * leanSin + localOffset[2] * leanCos;

    // Then apply RotateY(orientation)
    const rotatedOffsetX = Wx_offset * oriCos + Wz_offset * oriSin;
    const rotatedOffsetY = Wy_offset;
    const rotatedOffsetZ = -Wx_offset * oriSin + Wz_offset * oriCos;
    const rotatedOffset = vec3.fromValues(rotatedOffsetX, rotatedOffsetY, rotatedOffsetZ);

    // Similarly for forwardOffset
    const Wx_forward = forwardOffset[0];
    const Wy_forward = forwardOffset[1] * leanCos - forwardOffset[2] * leanSin;
    const Wz_forward = forwardOffset[1] * leanSin + forwardOffset[2] * leanCos;

    const rotatedTargetOffsetX = Wx_forward * oriCos + Wz_forward * oriSin;
    const rotatedTargetOffsetY = Wy_forward;
    const rotatedTargetOffsetZ = -Wx_forward * oriSin + Wz_forward * oriCos;
    const rotatedTargetOffset = vec3.fromValues(rotatedTargetOffsetX, rotatedTargetOffsetY, rotatedTargetOffsetZ);

    // Final camera position and target
    const cameraPos = vec3.create();
    vec3.add(cameraPos, heliWorldPos, rotatedOffset);

    const target = vec3.create();
    vec3.add(target, heliWorldPos, rotatedTargetOffset);

    camera.setPosition(cameraPos);
    camera.setTarget(target);
}

export function updateCameraThirdPerson(camera, helicopter, scaleFactor = 6 * 0.7) {
    const heliPos = helicopter.position;
    const heliOrientation = helicopter.orientation;

    const heliWorldPos = vec3.fromValues(
        heliPos[0] * scaleFactor,
        heliPos[1] * scaleFactor,
        heliPos[2] * scaleFactor
    );

    const localOffset = vec3.fromValues(0, 5, 12);
    vec3.scale(localOffset, localOffset, scaleFactor);

    const oriCos = Math.cos(heliOrientation);
    const oriSin = Math.sin(heliOrientation);

    const rotatedOffsetX = localOffset[0] * oriCos + localOffset[2] * oriSin;
    const rotatedOffsetY = localOffset[1];
    const rotatedOffsetZ = -localOffset[0] * oriSin + localOffset[2] * oriCos;
    const rotatedOffset = vec3.fromValues(rotatedOffsetX, rotatedOffsetY, rotatedOffsetZ);

    const cameraPos = vec3.create();
    vec3.add(cameraPos, heliWorldPos, rotatedOffset);

    // Set the camera to look at the helicopter's position
    const target = vec3.clone(heliWorldPos);

    camera.setPosition(cameraPos);
    camera.setTarget(target);
}