'use strict'

let currentView = document.getElementById('About')
window.addEventListener('hashchange', handleHash)

handleHash()
function handleHash() {
	if (window.location.hash) {
		select(window.location.hash.slice(1), true)
	}
}

function select(originalViewName, calledFromHandleHash) {
	let viewName = originalViewName
	let scrollHeight = 0
	if (viewName == 'Landing') {
		viewName = 'About'
	} else if (originalViewName == 'About') {
		scrollHeight = 800;
	} 
	const newView = document.getElementById(viewName)
	currentView.style.display = 'none'
	newView.style.display = 'inherit'
	currentView = newView
	selectIteration = 0
	window.location.hash = originalViewName
	window.scrollTo(0, scrollHeight)
}

let ANIMATION_ENABLED = true
let PREVIOUS_TIME = Date.now()
const titleLogo = attachRenderer('titleLogo', 1, 38, 0)
const background = attachRenderer('backgroundAnimation', 0.75, 800, 2)

		

titleLogo.camera.position.z = 100
background.camera.position.z = 1000

renderFrame()


function animateFirstScene(elapsedTime) {
	const rotation = titleLogo.geometry.rotation
	rotation.x += 0.2 * elapsedTime
	rotation.y += 0.2 * elapsedTime
	rotation.z += 0.2 * elapsedTime
	titleLogo.renderer.render(titleLogo.scene, titleLogo.camera)
}

function animateSecondScene(elapsedTime) {
	const rotation = background.geometry.rotation
	rotation.x += 0.05 * elapsedTime
	rotation.y += 0.05 * elapsedTime
	rotation.z += 0.05 * elapsedTime
	background.renderer.render(background.scene, background.camera)
}

function renderFrame() {
	if (ANIMATION_ENABLED) requestAnimationFrame(renderFrame)
	const newTime = Date.now()
	const elapsedTime = (newTime - PREVIOUS_TIME) / 1000
	PREVIOUS_TIME = newTime
	animateFirstScene(elapsedTime)
	animateSecondScene(elapsedTime)
}

function attachRenderer(containerName, opacity, radius, detailLevel) {
	const element = document.getElementById(containerName)
	const renderer = new THREE.WebGLRenderer({'antialiasing': true})
	renderer.setSize(element.clientWidth, element.clientHeight)
	element.appendChild(renderer.domElement)
	renderer.domElement.style.display = 'inline-block'
	const w = element.clientWidth / 2
	const h = element.clientHeight / 2
	const camera = new THREE.OrthographicCamera(-1 * w, w, h, -1 * h) // look into setting near and far frustrum plane values
	const scene = new THREE.Scene()

	const dodecahedron = new THREE.DodecahedronGeometry(radius, detailLevel)
	const geometry = new THREE.EdgesGeometry(dodecahedron)
	const lineMaterial = new THREE.LineBasicMaterial({'color':0xffffff, 'linewidth':2})
	const wireFrame = new THREE.LineSegments(geometry, lineMaterial)

	const surfaceMaterial = new THREE.MeshBasicMaterial({'color': 0x000000, 'opacity': opacity, 'transparent': (opacity < 1)})
	wireFrame.add(new THREE.Mesh(dodecahedron, surfaceMaterial))

	wireFrame.rotation.x = Math.random()
	wireFrame.rotation.y = Math.random()
	wireFrame.rotation.z = Math.random()

	scene.add(wireFrame)

	window.addEventListener('resize', function() {
		const newW = element.clientWidth / 2
		const newH = element.clientHeight / 2
		camera.left = -1 * newW
		camera.right = newW
		camera.top = newH
		camera.bottom = -1 * newH
		camera.updateProjectionMatrix()
		renderer.setSize(element.clientWidth, element.clientHeight)
	})

	return ({
		'renderer': renderer,
		'scene': scene,
		'camera': camera,
		'geometry': wireFrame
	})
}

// THREE JS SOURCE BELOW
//___________________________________________________________________________________


