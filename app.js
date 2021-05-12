import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import * as dat from "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js";

import { TimelineMax } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js";
let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch{
  constructor(selector){
    this.scene = new THREE.Scene();


    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer:true,
      alpha:true,
    });
    this.renderer.autoClear = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );

    this.camera.position.set(0,0,2);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();


    this.setupResize();
    this.tabEvents();

    this.addObjects();
    this.resize();
    this.render();
    this.mouseMove();
  }

  settings(){
    let that = this;
    this.settings ={
      time:0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'time', 0, 100, 0.01)
  }

  setupResize(){
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  addObjects(){
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions:{
        derivatives: "#extension GL_OES_standart_derivatives : enable"
      },
      side:THREE.DoubleSide,
      uniforms:{
        time:{type:"f", value:0},
        uMouse:{type:"v2", value: new THREE.Vector2(0,0)},
        resolution:{type:"v4", value:new THREE.Vector4()},
        uvRate1:{
          value:new THREE.Vector2(1,1)
        }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest:false,
      depthWrite:false,
    });

      this.geometry = new THREE.BufferGeometry();

      let num = 20000;
      console.log(num);

      let positions = new Float32Array(num*3);
      let angle = new Float32Array(num);
      let life = new Float32Array(num);
      let offset = new Float32Array(num);

      for(let i = 0; i < num; i++){
        positions.set([
          Math.random()*0.1,
          Math.random() *0.1 - 1.5,
          Math.random()*0.1],
        3*i
      );

      angle.set(
        [Math.random()*Math.PI*2],
      i
    );

    life.set([4 + Math.random()*10],
    i
  );

      offset.set([1000 * Math.random()],
      i
    );

      }

      this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.geometry.setAttribute('angle', new THREE.BufferAttribute(angle, 1));
      this.geometry.setAttribute('life', new THREE.BufferAttribute(life, 1));
      this.geometry.setAttribute('offset', new THREE.BufferAttribute(offset, 1));

      this.dots = new THREE.Points(this.geometry, this.material);
      this.scene.add(this.dots);

      this.clearPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(7,7),
        new THREE.MeshBasicMaterial({
          transparent:true,
          color:0x0F0032,
          opacity:0.035,
        })
      )

      this.scene.add(this.clearPlane);
  }



  mouseMove(){
    let self = this;
    function onMouseMove( event ){

      self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      self.mouse.y = (event.clientY / window.innerHeight) * 2 + 1;

      self.raycaster.setFromCamera(self.mouse,self.camera);

      let intersects = self.raycaster.intersectObjects([self.clearPlane]);

      if (intersects[0]) {
        let p = intersects[0].point;
        self.material.uniforms.uMouse.value = new THREE.Vector2(p.x, p.y);
      }
    }
    window.addEventListener( 'mousemove', onMouseMove, false );
  }



  tabEvents(){
    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden){
        this.stop()
      } else {
        this.play();
      }
    });
  }

  stop(){
    this.paused = true;
  }

  play(){
    this.paused = false;
  }

  render(){
    if(this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}


new Sketch("container");
