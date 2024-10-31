import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss']
})
export class D3Component implements OnInit, AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;

  constructor() { }

  ngOnInit(): void {
    // L'inizializzazione di ThreeJS sarà spostata in ngAfterViewInit per garantire che il ViewChild sia pronto
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

  initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.nativeElement.clientWidth / this.container.nativeElement.clientHeight, 1, 20000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.nativeElement.clientWidth, this.container.nativeElement.clientHeight);
    this.renderer.setClearColor(0x87ceeb); // Imposta il colore di sfondo (es. azzurro cielo)
    this.container.nativeElement.appendChild(this.renderer.domElement);

    // Aggiungi una luce ambientale per una migliore illuminazione generale
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luce soffusa
    this.scene.add(ambientLight);

    // Aggiungi una luce direzionale per un'illuminazione più intensa da una direzione specifica
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('assets/modello3D/scene.gltf', (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
    }, undefined, (error) => {
      console.error(error);
    });

    // Posiziona la camera lontano dalla navicella per una vista d'insieme
    this.camera.position.set(0, 500, 1000); // Puoi regolare questi valori per ottenere l'angolo desiderato
    this.camera.lookAt(this.scene.position); // Assicura che la camera punti verso il centro della scena

    const animate = () => {
      requestAnimationFrame(animate);

      // Ruota il modello su se stesso
      if (this.model) {
        this.model.rotation.y += 0.002; // Velocità di rotazione, puoi regolarla
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}

