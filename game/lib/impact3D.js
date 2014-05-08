
impact3D = {};
impact3D.models = impact3D.models || {};
impact3D.entities = impact3D.entities || {};
impact3D.player = impact3D.player || {};
impact3D.scene = null;
impact3D.updateCount = 0;

impact3D.init = function(scene) {
  console.log(" *** impact3D Init *** ");
  this.scene = scene;
  var newObject;

  for (var i = 0; i < ig.game.entities.length; i++) {
    var entity = ig.game.entities[i];

    if (this.models[entity.type]) {
      newObject = new THREE.Mesh( this.models[entity.type], new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:true}) );
    } else {
      newObject = new THREE.Mesh( new THREE.CubeGeometry(8,8,8), new THREE.MeshPhongMaterial({color:0xff00ff}) );
    }

    if (entity.type == 1) {
      this.player = newObject;
    }

    this.entities[entity.id] = newObject;

    this.scene.add(newObject);
  }
}

impact3D.addModel = function(geometry, type) {
  this.models[type] = geometry;
}