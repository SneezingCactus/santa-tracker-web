import Obj from '../index.js'
import LoaderManager from '../../../managers/LoaderManager.js'

// Config
import GLOBAL_CONFIG from '../../Scene/config.js'
import CONFIG from './config.js'

class Pyramid extends Obj {
  constructor(scene, world, material) {
    // Physics
    super(scene, world)

    // Props
    this.material = material
    this.selectable = CONFIG.SELECTABLE
    this.mass = CONFIG.MASS
    this.rotationY = CONFIG.ROTATION_Y
    this.size = CONFIG.SIZE
    this.name = CONFIG.NAME
    // this.normalMap = CONFIG.NORMAL_MAP
    this.obj = CONFIG.OBJ
    this.wrl = CONFIG.WRL
    this.scaleFactor = 1
  }

  init() {
    const { obj, normalMap } = LoaderManager.subjects[this.name]

    // Geometry
    this.geometry = obj.children[0].geometry
    // this.geometry.center()

    // Materials
    const defaultMaterial = new THREE.MeshToonMaterial({
      color: GLOBAL_CONFIG.COLORS.ICE,
      shininess: 345,
      normalMap,
    })
    defaultMaterial.needsUpdate = true

    this.setShape(defaultMaterial)
  }

  createShapes(scale = 1) {

    const pyramidGeo = this.getThreeGeo()
    const shape = this.getCannonShape(pyramidGeo)

    const offset = new CANNON.Vec3(-0.5, -0.5, -0.5)
    this.body.addShape(shape, offset)
  }

  getThreeGeo() {
    const geo = new THREE.Geometry()
    const vertices = this.getVertices()
    geo.vertices = vertices
    geo.faces = this.getFaces()
    geo.computeBoundingSphere()
    geo.computeFaceNormals()
    return geo
  }

  getVertices() {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(CONFIG.SIZE * this.scaleFactor, 0, 0),
      new THREE.Vector3(CONFIG.SIZE * this.scaleFactor, 0, CONFIG.SIZE * this.scaleFactor),
      new THREE.Vector3(0, 0, CONFIG.SIZE * this.scaleFactor),
      new THREE.Vector3(
        (CONFIG.SIZE / 2) * this.scaleFactor,
        CONFIG.SIZE * this.scaleFactor,
        (CONFIG.SIZE / 2) * this.scaleFactor
      )
    ]
  }

  getFaces() {
    return [
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(0, 2, 3),
      new THREE.Face3(1, 0, 4),
      new THREE.Face3(2, 1, 4),
      new THREE.Face3(3, 2, 4),
      new THREE.Face3(0, 3, 4)
    ]
  }

  getCannonShape(geometry) {
    const vertices = []
    const faces = []

    for (let i = 0; i < geometry.vertices.length; i++) {
      const v = geometry.vertices[i]
      vertices.push(new CANNON.Vec3(v.x, v.y, v.z))
    }

    for (let i = 0; i < geometry.faces.length; i++) {
      const f = geometry.faces[i]
      faces.push([f.a, f.b, f.c])
    }

    return new CANNON.ConvexPolyhedron(vertices, faces)
  }
}

export default Pyramid
