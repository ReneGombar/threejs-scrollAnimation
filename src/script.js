import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
/**Textures */
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load('textures/gradients/5a.jpg')
gradient.magFilter = THREE.NearestFilter
gradient.generateMipmaps = false


const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor').onChange(()=>{
    material.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**Objects */
const objectsDistance = 4

const material = new THREE.MeshToonMaterial({color:parameters.materialColor})
material.gradientMap = gradient

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4 ,16, 69),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2 , 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35 ,64, 16),
    material
)

mesh1.position.y = objectsDistance * 0
mesh2.position.y = objectsDistance * - 1
mesh3.position.y = objectsDistance * - 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]



/**Light */
const directionalLight = new THREE.DirectionalLight('#ffff00',1)
directionalLight.position.set (1,1,0)

scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
//create a group for camera
// the parallax is aplied to the cameraGroup 
// but the scroll is aplied to the camera within the cameraGroup

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//get scrollY value
let scrollY = window.scrollY

window.addEventListener('scroll',()=>{
    scrollY = window.scrollY
})

//Add parallax by reading the cursor position
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove',(event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
    
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    let deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //console.log(deltaTime)

    //Animate meshes
    for (const mesh of sectionMeshes){
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.08
    }

    //Animate camera based on scrollY value
    camera.position.y = - scrollY / sizes.height * objectsDistance
    //console.log(camera.position.y)
    //Animate camera to add parallax based on cursor X,Y values
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    // LERP adds smoothing to the parallax
    // LERP needs to be using deltaTime so it runs the same speed
    // regrdless of the diplay refresh frequency
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 5
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 5

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()