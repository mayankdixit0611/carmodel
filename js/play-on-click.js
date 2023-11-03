/* global AFRAME */
AFRAME.registerComponent('play-on-click', {
    init: function () {
        this.el.addEventListener('click', onclick);
        this.onClick = this.onClick.bind(this);
    },
    play: function () {
        window.addEventListener('click', this.onClick);
    },
    pause: function () {
        window.removeEventListener('click', this.onClick);
    },
    onClick: function (evt) {
        console.log('chandan');
        var videoEl = this.el.getAttribute('material').src;
        if (!videoEl) { return; }
        this.el.object3D.visible = true;
        videoEl.play();
    }
});