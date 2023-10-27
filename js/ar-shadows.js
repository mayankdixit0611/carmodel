AFRAME.registerComponent("ar-shadows", {
  schema: { opacity: { default: 0.3 } },
  init: function () {
    this.el.sceneEl.addEventListener("enter-vr", (ev) => {
      this.wasVisible = this.el.getAttribute("visible");
      if (this.el.sceneEl.is("ar-mode")) {
        this.savedMaterial = this.el.object3D.children[0].material;
        this.el.object3D.children[0].material = new THREE.ShadowMaterial();
        this.el.object3D.children[0].material.opacity = this.data.opacity;
        this.el.setAttribute("visible", true);
      }
    });
    this.el.sceneEl.addEventListener("exit-vr", (ev) => {
      if (this.savedMaterial) {
        this.el.object3D.children[0].material = this.savedMaterial;
        this.savedMaterial = null;
      }
      if (!this.wasVisible) this.el.setAttribute("visible", false);
    });
  },
});
