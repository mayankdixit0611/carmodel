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
        el.setAttribute('background', '');
        this.modelEl = this.el.querySelector('#modelEl');
        this.modelInteractable = false;
        this.activeHandEl = null;
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
        document.addEventListener('wheel', this.onMouseWheel);
        document.addEventListener('touchend', this.onTouchEnd);
        document.addEventListener('touchmove', this.onTouchMove);
        this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
        this.el.sceneEl.addEventListener('exit-vr', this.onExitVR);
        // this.modelEl.addEventListener('click', this.onModelClick);
        this.modelEl.addEventListener('model-loaded', this.onModelLoaded);
        this.containerEl.addEventListener('click', this.onModelClick);

    },

    onModelClick: function (evt) {
        console.log('gggggggthis');
        const raycasterEl = document.querySelector('[raycaster]');
        const intersections = raycasterEl.components.raycaster.intersections;
        if (intersections.length > 0) {
            const modelEl = document.querySelector('#modelEl');
            const doorName1 = 'PU_Rear_Door';
            const doorMesh = modelEl.getObject3D('mesh').children.find(mesh =>
                mesh.userData.name === doorName1
            );
            if (doorMesh) {
                doorMesh.rotation.set(0, 1, 0);
            }

            // if (clickedObject.getAttribute('class') === 'clickable') {
            //     const clickedMeshId = clickedObject.getAttribute('mesh-id');
            //     console.log('Clicked Mesh ID: ' + clickedMeshId);
            // }
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
            radius: 65
        });
        backgroundEl.setAttribute('material', {
            shader: 'background-gradient',
            colorTop: '#37383c',
            colorBottom: '#757575',
            side: 'back'
        });
        backgroundEl.setAttribute('hide-on-enter-ar', '');
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
        modelEl.setAttribute('animation-mixer', '');
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
        lightEl.setAttribute('position', '-2 4 2');
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
        this.containerEl.appendChild(lightEl);
        this.containerEl.appendChild(modelPivotEl);
        this.el.appendChild(containerEl);
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
        modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
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
        } else {
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
        let dY;
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

        // const modelEl = this.modelEl;
        // const modelMesh = modelEl.getObject3D('mesh');
        // modelMesh.traverse((node) => {
        //     if (node.isMesh) {
        //         node.addEventListener('click', this.onModelClick.bind(this));
        //     }
        // });

        // const doorName1 = 'SM_front_door.001';
        // const doorName2 = 'SM_front_door.002';
        // const doorName3 = 'SM_BAck_dooor.001';
        // const doorName4 = 'SM_BAck_dooor.002';



        // const doorMesh = this.findDoorMesh(doorName1);

        // if (doorMesh) {
        //     debugger;
        //     doorMesh.rotation.set(0, -1, 0);
        // }
    },
    findDoorMesh: function (doorName) {
        const modelEl = this.modelEl;

        const isFound = modelEl.getObject3D('mesh').children.find(mesh =>
            mesh.userData.name === doorName
        );
        return isFound;
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
        modelEl.object3D.scale.set(0.2, 0.2, 0.2);
        modelEl.object3D.rotation.set(0, 10, 0);
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