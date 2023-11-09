AFRAME.registerComponent('model-viewer', {
    schema: {
        gltfModel: {
            default: ''
        },
        title: {
            default: ''
        }

    },
    init: function () {
        let el = this.el;
        el.setAttribute('renderer', {
            colorManagement: true
        });
        el.setAttribute('raycaster', {
            objects: '.raycastable'
        });
        el.setAttribute('cursor', {
            rayOrigin: 'mouse',
            fuse: false
        });
        el.setAttribute('webxr', {
            optionalFeatures: 'hit-test, local-floor, light-estimation, anchors'
        });
        this.isDoorOpen = false;
        this.currentDoorAction = null;
        el.setAttribute('background', '');
        const doorclickEl = this.doorclickEl = document.createElement('a-sphere');
        doorclickEl.setAttribute('radius', 0.1);
        doorclickEl.setAttribute('position', '0, 1, -1.0');
        doorclickEl.setAttribute('material', 'color: green');
        doorclickEl.setAttribute('id', 'doorclick');
        doorclickEl.classList.add('raycastable');
        const inteSphereEl = this.inteSphereEl = document.createElement('a-sphere');
        inteSphereEl.setAttribute('radius', 0.1);
        inteSphereEl.setAttribute('position', '0, 2, 0');
        inteSphereEl.setAttribute('material', 'color: blue');
        inteSphereEl.classList.add('raycastable');
        const headclickEl = this.headclickEl = document.createElement('a-sphere');
        headclickEl.setAttribute('radius', 0.1);
        headclickEl.setAttribute('position', '2.7, 1.2, -1.0');
        headclickEl.setAttribute('material', 'color: green');
        headclickEl.setAttribute('id', 'doorclick');
        headclickEl.classList.add('raycastable');
        this.modelEl = this.el.querySelector('#modelEl');
        this.onModelLoaded = this.onModelLoaded.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onThumbstickMoved = this.onThumbstickMoved.bind(this);
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);
        this.onMouseDownLaserHitPanel = this.onMouseDownLaserHitPanel.bind(this);
        this.onMouseUpLaserHitPanel = this.onMouseUpLaserHitPanel.bind(this);
        this.onOrientationChange = this.onOrientationChange.bind(this);
        this.initCameraRig();
        this.initEntities();
        this.initBackground();
        this.el.sceneEl.canvas.oncontextmenu = function (evt) {
            evt.preventDefault();
        }
            ;
        window.addEventListener('orientationchange', this.onOrientationChange);
        this.laserHitPanelEl.addEventListener('mousedown', this.onMouseDownLaserHitPanel);
        this.laserHitPanelEl.addEventListener('mouseup', this.onMouseUpLaserHitPanel);
        this.leftHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
        this.rightHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        doorclickEl.addEventListener('click', () => {
            if (this.isDoorOpen) {
                this.closeDoors();
            } else {
                this.openDoors();
            }
            this.isDoorOpen = !this.isDoorOpen;
        });
        headclickEl.addEventListener('click', () => {
            const modelEl = this.modelEl;
            // const fromRotation = modelEl.getAttribute('rotation');
            // const rotationsValue = fromRotation.y + 60;
            // const toRotation = `0 ${rotationsValue} 0`;
            // const animationDuration = 1000;

            // modelEl.setAttribute('animation__rotate', {
            //     property: 'rotation',
            //     to: toRotation,
            //     dur: animationDuration,
            //     easing: 'easeInOutQuad'
            // });
            const headlightEl = document.createElement('a-light');
            headlightEl.setAttribute('id', 'headlight');
            headlightEl.setAttribute('type', 'spot');
            headlightEl.setAttribute('color', '#efefef');
            headlightEl.setAttribute('position', '7 -2 8');
            headlightEl.setAttribute('intensity', '15');
            headlightEl.setAttribute('distance', '20');
            // headlightEl.setAttribute('rotation', '0 0 -180');

            // headlightEl.setAttribute('angle', '-180');s
            // headlightEl.setAttribute('target', '10 20');
            // headlightEl.setAttribute('penumbra', '1');
            // headlightEl.setAttribute('decay', '1');
            // headlightEl.setAttribute('target', '#chandan-camera');
            this.modelEl.appendChild(headlightEl);
            console.log(this.cameraEl);
            const camera = document.querySelector('a-camera');
            const camera2 = document.getElementsByClassName('a-camera');
            console.log(camera);
            console.log(camera2);
        });
        inteSphereEl.addEventListener('click', () => {
            console.log('test');
            this.goInterior();
        });
        this.modelEl.appendChild(doorclickEl);
        this.modelEl.appendChild(inteSphereEl);
        this.modelEl.appendChild(headclickEl);
        document.addEventListener('wheel', this.onMouseWheel);
        document.addEventListener('touchend', this.onTouchEnd);
        document.addEventListener('touchmove', this.onTouchMove);
        this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
        this.el.sceneEl.addEventListener('exit-vr', this.onExitVR);
        this.modelEl.addEventListener('model-loaded', this.onModelLoaded);

    },

    goInterior: function () {
        const openDoorsAndMoveCamera = () => {
            this.openDoors();

            setTimeout(() => {
                let cameraRigEl = this.cameraRigEl;
                const animationDuration = 1000;
                const interiorPosition = { x: 0, y: 0.5, z: 0 };

                cameraRigEl.setAttribute('animation__position', {
                    property: 'position',
                    to: interiorPosition,
                    dur: animationDuration,
                    easing: 'easeInOutQuad'
                });

                setTimeout(() => {
                    cameraRigEl.setAttribute('animation__rotation', {
                        property: 'rotation',
                        to: '0 96 0',
                        dur: animationDuration,
                        easing: 'easeInOutQuad'
                    });
                }, 1000);
            }, 2000);
        };

        openDoorsAndMoveCamera();
    },



    closeDoors: function () {
        const mixerComponent = modelEl.components['animation-mixer'];
        console.log('close');

        if (mixerComponent) {
            if (this.currentDoorAction) {
                this.currentDoorAction.stop();
            }

            const doorClosingAction = mixerComponent.mixer.clipAction('All_door_closing');
            doorClosingAction.setLoop(THREE.LoopOnce);
            doorClosingAction.clampWhenFinished = true;
            doorClosingAction.play();

            this.currentDoorAction = doorClosingAction;
        } else {
            console.error("Animation 'All_door_closing' not found or 'animation-mixer' component is missing.");
        }
    },

    openDoors: function () {
        const mixerComponent = modelEl.components['animation-mixer'];

        if (mixerComponent) {
            if (this.currentDoorAction) {
                this.currentDoorAction.stop();
            }

            const doorOpeningAction = mixerComponent.mixer.clipAction('All_doors_Opening');
            doorOpeningAction.play();
            doorOpeningAction.setLoop(THREE.LoopOnce);
            doorOpeningAction.clampWhenFinished = true;


            this.currentDoorAction = doorOpeningAction;
        } else {
            console.error("Animation 'All_door_opening' not found or 'animation-mixer' component is missing.");
        }
    },


    update: function () {

        if (!this.data.gltfModel) {
            return;
        }
        this.el.setAttribute('ar-hit-test', {
            target: '#modelEl',
            type: 'map'
        });
        this.modelEl.setAttribute('gltf-model', this.data.gltfModel);
    },
    initCameraRig: function () {
        let cameraRigEl = this.cameraRigEl = document.createElement('a-entity');
        let cameraEl = this.cameraEl = document.createElement('a-entity');
        cameraEl.setAttribute('class', 'chandan-camera');
        let rightHandEl = this.rightHandEl = document.createElement('a-entity');
        let leftHandEl = this.leftHandEl = document.createElement('a-entity');
        cameraEl.setAttribute('camera', {
            fov: 60
        });
        cameraEl.setAttribute('look-controls', {
            magicWindowTrackingEnabled: false,
            mouseEnabled: false,
            touchEnabled: false
        });
        rightHandEl.setAttribute('rotation', '0 90 0');
        rightHandEl.setAttribute('laser-controls', {
            hand: 'right'
        });
        rightHandEl.setAttribute('raycaster', {
            objects: '.raycastable'
        });
        rightHandEl.setAttribute('line', {
            color: '#118A7E'
        });
        leftHandEl.setAttribute('rotation', '0 90 0');
        leftHandEl.setAttribute('laser-controls', {
            hand: 'right'
        });
        leftHandEl.setAttribute('raycaster', {
            objects: '.raycastable'
        });
        leftHandEl.setAttribute('line', {
            color: '#118A7E'
        });
        cameraRigEl.appendChild(cameraEl);
        cameraRigEl.appendChild(rightHandEl);
        cameraRigEl.appendChild(leftHandEl);
        this.el.appendChild(cameraRigEl);
    },
    initBackground: function () {
        let backgroundEl = this.backgroundEl = document.querySelector('a-entity');
        backgroundEl.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 9
        });
        backgroundEl.setAttribute('material', {
            shader: 'flat',
            // colorTop: '#37383c',
            // colorBottom: '#757575',
            src: './images/sky.jpg',
            side: 'double',
            mipMap: false
        });
        //backgroundEl.setAttribute('hide-on-enter-ar', '');
    },
    initEntities: function () {
        let containerEl = this.containerEl = document.createElement('a-entity');
        let laserHitPanelEl = this.laserHitPanelEl = document.createElement('a-entity');
        let modelPivotEl = this.modelPivotEl = document.createElement('a-entity');
        let modelEl = this.modelEl = document.createElement('a-entity');
        let shadowEl = this.shadowEl = document.createElement('a-entity');
        let arShadowEl = this.arShadowEl = document.createElement('a-entity');
        let titleEl = this.titleEl = document.createElement('a-entity');
        let lightEl = this.lightEl = document.createElement('a-entity');
        let sceneLightEl = this.sceneLightEl = document.createElement('a-entity');
        sceneLightEl.setAttribute('light', {
            type: 'hemisphere',
            intensity: 1
        });
        sceneLightEl.setAttribute('hide-on-enter-ar', '');
        modelPivotEl.id = 'modelPivot';
        this.el.appendChild(sceneLightEl);
        laserHitPanelEl.id = 'laserHitPanel';
        laserHitPanelEl.setAttribute('position', '0 0 -10');
        laserHitPanelEl.setAttribute('geometry', 'primitive: plane; width: 30; height: 20');
        laserHitPanelEl.setAttribute('material', 'color: red');
        laserHitPanelEl.setAttribute('visible', 'false');
        laserHitPanelEl.classList.add('raycastable');
        this.containerEl.appendChild(laserHitPanelEl);
        modelEl.setAttribute('rotation', '0 -30 0');
        modelEl.setAttribute('animation-mixer', 'clip: stop');
        modelEl.setAttribute('shadow', 'cast: true; receive: false');
        modelEl.setAttribute('id', 'modelEl');
        modelPivotEl.appendChild(modelEl);
        shadowEl.setAttribute('rotation', '-90 -30 0');
        shadowEl.setAttribute('geometry', 'primitive: plane; width: 1.0; height: 1.0');
        shadowEl.setAttribute('material', 'src: #shadow; transparent: true; opacity: 0.40');
        shadowEl.setAttribute('hide-on-enter-ar', '');
        modelPivotEl.appendChild(shadowEl);
        arShadowEl.setAttribute('rotation', '-90 0 0');
        arShadowEl.setAttribute('geometry', 'primitive: plane; width: 30.0; height: 30.0');
        arShadowEl.setAttribute('shadow', 'receive: true');
        arShadowEl.setAttribute('ar-shadows', 'opacity: 0.2');
        arShadowEl.setAttribute('visible', 'false');
        this.el.addEventListener('ar-hit-test-select-start', function () {
            arShadowEl.object3D.visible = false;
        });
        this.el.addEventListener('ar-hit-test-select', function () {
            arShadowEl.object3D.visible = true;
        });
        modelPivotEl.appendChild(arShadowEl);
        titleEl.id = 'title';
        titleEl.setAttribute('text', 'value: ' + this.data.title + '; width: 6');
        titleEl.setAttribute('hide-on-enter-ar', '');
        titleEl.setAttribute('visible', 'false');
        this.containerEl.appendChild(titleEl);
        lightEl.id = 'light';
        lightEl.setAttribute('position', '2.970 4 -1');
        lightEl.setAttribute('light', {
            type: 'directional',
            castShadow: true,
            shadowMapHeight: 1024,
            shadowMapWidth: 1024,
            shadowCameraLeft: -7,
            shadowCameraRight: 5,
            shadowCameraBottom: -5,
            shadowCameraTop: 5,
            intensity: 0.5,
            target: 'modelPivot'
        });
        this.el.appendChild(containerEl);
        this.containerEl.appendChild(lightEl);
        this.containerEl.appendChild(modelPivotEl);

    },
    onThumbstickMoved: function (evt) {
        let modelPivotEl = this.modelPivotEl;
        let modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
        modelScale -= evt.detail.y / 20;
        modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
        modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
        this.modelScale = modelScale;
    },
    onMouseWheel: function (evt) {
        let modelPivotEl = this.modelPivotEl;
        let modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
        modelScale -= evt.deltaY / 100;
        modelScale = Math.min(Math.max(1, modelScale), 10.0);
        modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
        this.modelScale = modelScale;
    },
    onMouseDownLaserHitPanel: function (evt) {
        let cursorEl = evt.detail.cursorEl;
        let intersection = cursorEl.components.raycaster.getIntersection(this.laserHitPanelEl);
        if (!intersection) {
            return;
        }
        cursorEl.setAttribute('raycaster', 'lineColor', 'white');
        this.activeHandEl = cursorEl;
        this.oldHandX = undefined;
        this.oldHandY = undefined;
    },
    onMouseUpLaserHitPanel: function (evt) {
        let cursorEl = evt.detail.cursorEl;
        if (cursorEl === this.leftHandEl) {
            this.leftHandPressed = false;
        }
        if (cursorEl === this.rightHandEl) {
            this.rightHandPressed = false;
        }
        cursorEl.setAttribute('raycaster', 'lineColor', 'white');
        if (this.activeHandEl === cursorEl) {
            this.activeHandEl = undefined;
        }
    },
    onOrientationChange: function () {
        if (AFRAME.utils.device.isLandscape()) {
            this.cameraRigEl.object3D.position.z -= 1;
        } else {
            this.cameraRigEl.object3D.position.z += 1;
        }
    },
    tick: function () {
        let modelPivotEl = this.modelPivotEl;
        let intersection;
        let intersectionPosition;
        let laserHitPanelEl = this.laserHitPanelEl;
        let activeHandEl = this.activeHandEl;
        if (!this.el.sceneEl.is('vr-mode')) {
            return;
        }
        if (!activeHandEl) {
            return;
        }
        intersection = activeHandEl.components.raycaster.getIntersection(laserHitPanelEl);
        if (!intersection) {
            activeHandEl.setAttribute('raycaster', 'lineColor', 'white');
            return;
        }
        activeHandEl.setAttribute('raycaster', 'lineColor', '#007AFF');
        intersectionPosition = intersection.point;
        this.oldHandX = this.oldHandX || intersectionPosition.x;
        this.oldHandY = this.oldHandY || intersectionPosition.y;
        modelPivotEl.object3D.rotation.y -= (this.oldHandX - intersectionPosition.x) / 4;
        modelPivotEl.object3D.rotation.x += (this.oldHandY - intersectionPosition.y) / 4;
        this.oldHandX = intersectionPosition.x;
        this.oldHandY = intersectionPosition.y;
    },
    onEnterVR: function () {
        let cameraRigEl = this.cameraRigEl;
        this.cameraRigPosition = cameraRigEl.object3D.position.clone();
        this.cameraRigRotation = cameraRigEl.object3D.rotation.clone();
        if (!this.el.sceneEl.is('ar-mode')) {
            cameraRigEl.object3D.position.set(0, 0, 2);
        } else {
            cameraRigEl.object3D.position.set(0, 0, 0);
        }
    },
    onExitVR: function () {
        let cameraRigEl = this.cameraRigEl;
        cameraRigEl.object3D.position.copy(this.cameraRigPosition);
        cameraRigEl.object3D.rotation.copy(this.cameraRigRotation);
        cameraRigEl.object3D.rotation.set(0, 0, 0);
    },
    onTouchMove: function (evt) {
        if (evt.touches.length === 1) {
            this.onSingleTouchMove(evt);
        }
        if (evt.touches.length === 2) {
            this.onPinchMove(evt);
        }
    },
    onSingleTouchMove: function (evt) {
        let dX;
        let dY;
        let modelPivotEl = this.modelPivotEl;
        this.oldClientX = this.oldClientX || evt.touches[0].clientX;
        this.oldClientY = this.oldClientY || evt.touches[0].clientY;
        dX = this.oldClientX - evt.touches[0].clientX;
        dY = this.oldClientY - evt.touches[0].clientY;
        modelPivotEl.object3D.rotation.y -= dX / 200;
        this.oldClientX = evt.touches[0].clientX;
        modelPivotEl.object3D.rotation.x -= dY / 100;
        modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);
        this.oldClientY = evt.touches[0].clientY;
    },
    onPinchMove: function (evt) {
        let dX = evt.touches[0].clientX - evt.touches[1].clientX;
        let dY = evt.touches[0].clientY - evt.touches[1].clientY;
        let modelPivotEl = this.modelPivotEl;
        let distance = Math.sqrt(dX * dX + dY * dY);
        let oldDistance = this.oldDistance || distance;
        let distanceDifference = oldDistance - distance;
        let modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
        modelScale -= distanceDifference / 500;
        modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
        modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
        this.modelScale = modelScale;
        this.oldDistance = distance;
    },
    onTouchEnd: function (evt) {
        this.oldClientX = undefined;
        this.oldClientY = undefined;
        if (evt.touches.length < 2) {
            this.oldDistance = undefined;
        }
    },
    onMouseUp: function (evt) {
        this.leftRightButtonPressed = false;
        if (evt.buttons === undefined || evt.buttons !== 0) {
            return;
        }
        this.oldClientX = undefined;
        this.oldClientY = undefined;
    },
    onMouseMove: function (evt) {
        if (this.leftRightButtonPressed) {
            this.dragModel(evt);
        }
        else {
            this.rotateModel(evt);
        }
    },
    dragModel: function (evt) {
        let dX;
        let dY;
        let modelPivotEl = this.modelPivotEl;
        if (!this.oldClientX) {
            return;
        }
        dX = this.oldClientX - evt.clientX;
        dY = this.oldClientY - evt.clientY;
        modelPivotEl.object3D.position.y += dY / 200;
        modelPivotEl.object3D.position.x -= dX / 200;
        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;
    },
    rotateModel: function (evt) {
        let dX;
        let dY; // used for model rotation up and down
        let modelPivotEl = this.modelPivotEl;
        if (!this.oldClientX) {
            return;
        }
        dX = this.oldClientX - evt.clientX;
        dY = this.oldClientY - evt.clientY;
        modelPivotEl.object3D.rotation.y -= dX / 100;
        modelPivotEl.object3D.rotation.x -= dY / 200;
        modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);
        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;
    },
    onModelLoaded: function () {
        this.centerAndScaleModel();
        const intersection = modelEl.getObject3D('mesh');
        console.log('intersection:   ', intersection);
    },
    centerAndScaleModel: function () {
        let box;
        let size;
        let center;
        let scale;
        let modelEl = this.modelEl;
        let shadowEl = this.shadowEl;
        let titleEl = this.titleEl;
        let gltfObject = modelEl.getObject3D('mesh');
        modelEl.object3D.position.set(0, 0, 0);
        modelEl.object3D.scale.set(0.3, 0.3, 0.3);
        modelEl.object3D.rotation.set(0, 3.5, 0);
        this.cameraRigEl.object3D.position.z = 8.0;
        modelEl.object3D.updateMatrixWorld();
        box = new THREE.Box3().setFromObject(gltfObject);
        size = box.getSize(new THREE.Vector3());
        scale = 1.6 / size.y;
        scale = 2.0 / size.x < scale ? 2.0 / size.x : scale;
        scale = 2.0 / size.z < scale ? 2.0 / size.z : scale;
        modelEl.object3D.scale.set(scale, scale, scale);
        modelEl.object3D.updateMatrixWorld();
        box = new THREE.Box3().setFromObject(gltfObject);
        center = box.getCenter(new THREE.Vector3());
        size = box.getSize(new THREE.Vector3());
        shadowEl.object3D.scale.y = size.x;
        shadowEl.object3D.scale.x = size.y;
        shadowEl.object3D.position.y = -size.y / 2;
        shadowEl.object3D.position.z = -center.z;
        shadowEl.object3D.position.x = -center.x;
        titleEl.object3D.position.x = 2.2 - center.x;
        titleEl.object3D.position.y = size.y + 0.5;
        titleEl.object3D.position.z = -2;
        titleEl.object3D.visible = true;
        modelEl.object3D.position.x = -center.x;
        modelEl.object3D.position.y = -center.y;
        modelEl.object3D.position.z = -center.z;
        if (AFRAME.utils.device.isLandscape()) {
            this.cameraRigEl.object3D.position.z -= 1;
        }
    },
    onMouseDown: function (evt) {
        if (evt.buttons) {
            this.leftRightButtonPressed = evt.buttons === 3;
        }
        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;

    }
}





);


function forEachChildRecursive(object, callback) {
    // Perform the callback operation on the current object
    callback(object);
    // Check if the object has children
    if (object.children) {
        // Recursively iterate through each child
        for (let i = 0; i < object.children.length; i++) {
            forEachChildRecursive(object.children[i], callback);
        }
    }
};