// ==================== 3D CAR VISUALIZATION WITH THREE.JS ====================

class Car3DScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf9fafb);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.5, 3);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        this.setupLighting();
        
        // Create 3D car model
        this.createCar();
        
        // Animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Point light
        const pointLight = new THREE.PointLight(0x2563EB, 0.5);
        pointLight.position.set(-5, 8, 5);
        this.scene.add(pointLight);
    }
    
    createCar() {
        this.carGroup = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 4.5);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2563EB,
            metalness: 0.7,
            roughness: 0.2
        });
        const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        carBody.position.y = 0.5;
        carBody.castShadow = true;
        carBody.receiveShadow = true;
        this.carGroup.add(carBody);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x1E40AF,
            metalness: 0.6,
            roughness: 0.3
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 1.6, -0.3);
        roof.castShadow = true;
        roof.receiveShadow = true;
        this.carGroup.add(roof);
        
        // Windows
        const windowGeometry = new THREE.BoxGeometry(1.6, 0.6, 1.2);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x87CEEB,
            metalness: 0,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        frontWindow.position.set(0, 1.4, 1);
        this.carGroup.add(frontWindow);
        
        const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        backWindow.position.set(0, 1.4, -1);
        this.carGroup.add(backWindow);
        
        // Wheels
        this.createWheels();
        
        this.scene.add(this.carGroup);
    }
    
    createWheels() {
        const wheelRadius = 0.4;
        const wheelThickness = 0.2;
        
        const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x1F2937,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const wheelPositions = [
            [-0.8, 0.4, 1.2],
            [0.8, 0.4, 1.2],
            [-0.8, 0.4, -1.2],
            [0.8, 0.4, -1.2]
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...pos);
            wheel.castShadow = true;
            wheel.receiveShadow = true;
            this.carGroup.add(wheel);
        });
        
        // Wheel rims
        const rimGeometry = new THREE.CylinderGeometry(wheelRadius * 0.7, wheelRadius * 0.7, wheelThickness + 0.1, 32);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            roughness: 0.1
        });
        
        wheelPositions.forEach(pos => {
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI / 2;
            rim.position.set(...pos);
            rim.position.z += 0.1;
            rim.castShadow = true;
            this.carGroup.add(rim);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate the car
        this.carGroup.rotation.y += 0.005;
        
        // Subtle floating animation
        this.carGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// ==================== SCENE MANAGEMENT ====================

class SceneManager {
    constructor() {
        this.scenes = new Map();
        this.activeScene = null;
    }
    
    addScene(name, scene) {
        this.scenes.set(name, scene);
    }
    
    getScene(name) {
        return this.scenes.get(name);
    }
    
    switchScene(name) {
        if (this.activeScene) {
            this.activeScene.dispose?.();
        }
        this.activeScene = this.getScene(name);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Car3DScene, SceneManager };
}
