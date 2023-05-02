import { Scene, GameObjects, Cameras, Game } from 'phaser';

const NODE_COLOR = 0xff0011;

const NEW_NODE_COLOR = 0x326da8;

export class Nodes extends Scene {
  private camera!: Cameras.Scene2D.Camera;
  private pathHead!: GameObjects.Arc | null;
  private pathLine!: GameObjects.Line | GameObjects.Rectangle | null;
  private idCount!: number;
  private interface!: {
    placingNode: boolean;
    vertices: Array<any>;
    aristas: Array<any>;
    graphs: Array<any>;
  };

  public state!: {
    graphs: Array<any>;
    vertices: Array<any>;
  };

  public addGraph!: Function;

  constructor() {
    super('nodes');

    this.addGraph = function () {
      // Agregar grafo a la interface
      this.interface.vertices.forEach((v) => {
        v.fillColor = NEW_NODE_COLOR + ((this.state.graphs.length * 0x480000) % 0xffffff);
      });
      const graph = this.add.container(0, 0, [...this.interface.vertices, ...this.interface.aristas]);

      this.interface.vertices = [];
      this.interface.aristas = [];

      graph.on('drag', (pointer: any, dragX: number, dragY: number) => {
        graph.x = dragX;
        graph.y = dragY;
      });

      this.interface.graphs.push(graph);

      // Agregar grafo al estado
      this.state.graphs.push({
        vertices: this.state.vertices,
      });
      this.state.vertices = [];
      this.idCount = 0;
    };
  }

  spawnVertice() {
    if (!this.interface.placingNode) {
      // Agregar vertice en la interface
      const vertice = this.add
        .circle(this.input.activePointer.x, this.input.activePointer.y, 8, NODE_COLOR)
        .setInteractive()
        .setDataEnabled()
        .setName(`v${this.idCount}`)
        .on('pointerdown', () => {
          if (this.pathHead && this.pathLine) {
            this.snapArista(vertice);
          } else this.spawnArista(vertice);
        });
      this.add.text(this.input.activePointer.x + 3, this.input.activePointer.y + 7, `v${this.idCount}`);

      this.interface.vertices.push(vertice);

      // Agregar vertice en el estado
      this.state.vertices.push({
        name: `v${this.idCount}`,
        aristas: [],
      });
      this.idCount++;
    }

    this.interface.placingNode = true;
  }

  snapArista(vertice: GameObjects.Arc) {
    if (this.pathHead && this.pathLine) {
      // Snap arista a un vertice
      const origin = this.pathHead.getData('origin');
      let originX = origin.x;
      let originY = origin.y;

      vertice.setData(
        'connection',
        this.add
          .line(
            originX,
            originY,
            0,
            0,
            this.input.activePointer.x - originX,
            this.input.activePointer.y - originY,
            0x111111,
          )
          .setDepth(-1)
          .setOrigin(0, 0),
      );

      this.add.text(
        this.input.activePointer.x - (this.input.activePointer.x - originX) / 2,
        this.input.activePointer.y - (this.input.activePointer.y - originY) / 2,
        `e${this.idCount}`,
      );

      this.pathHead.destroy();
      this.pathLine.destroy();
      this.pathHead = null;
      this.pathLine = null;

      // Agregar arista al estado
      this.state.vertices.filter((v) => v.name === origin.name)[0].aristas.push(`e${this.idCount}`);
      this.state.vertices.filter((v) => v.name === vertice.name)[0].aristas.push(`e${this.idCount}`);
      this.idCount++;
    }
  }

  spawnArista(startNode: GameObjects.Arc) {
    // spawn a path head
    this.pathHead = this.add
      .circle(this.input.mousePointer.x, this.input.mousePointer.y, 2, 0x111111)
      .setDataEnabled()
      .setData('origin', startNode);

    // Crear un path que siga al path head
    this.pathLine = this.add.line(startNode.x, startNode.y, 0, 0, this.pathHead.x, this.pathHead.y, 0x111111);
  }

  updateAristaPathing() {
    if (this.pathHead && this.pathLine) {
      // Head
      this.pathHead.x = this.input.activePointer.x;
      this.pathHead.y = this.input.activePointer.y;

      // Line
      const origin = this.pathHead.getData('origin');
      let originX = origin.x;
      let originY = origin.y;

      const oldLine = this.pathLine;
      oldLine.destroy();

      this.pathLine = this.add
        .line(
          originX,
          originY,
          0,
          0,
          this.input.activePointer.x - originX,
          this.input.activePointer.y - originY,
          0x111111,
        )
        .setDepth(-1)
        .setOrigin(0, 0);
    }
  }

  init() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor('#24252A');

    this.interface = {
      vertices: [],
      aristas: [],
      graphs: [],

      placingNode: false,
    };

    this.state = {
      graphs: [],
      vertices: [],
    };
    this.idCount = 0;
  }

  create() {
    this.input.mouse.disableContextMenu();
  }

  update() {
    // Click izquierdo
    if (this.input.activePointer.rightButtonDown()) {
      this.spawnVertice();
    }

    // Click izquierdo liberando
    if (this.input.activePointer.rightButtonReleased()) {
      this.interface.placingNode = false;
    }

    this.updateAristaPathing();
  }
}
