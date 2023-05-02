import React, { useEffect, useRef, useState } from 'react';
import { Game, Types } from 'phaser';
import gameConfig from '../game';
import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import './App.scss';

const style = {
  padding: '80px',
};

interface State {
  graphs: Array<Graph>;
}

interface Graph {
  vertices: Array<Vertice>;
}

interface Vertice {
  name: String;
  aristas: Array<String>;
}

function App() {
  const parentEl = useRef<HTMLDivElement>(null);

  // Ratio = 3:2
  const [settings, setSettings] = useState({
    width: '1200px',
    height: '800px',
  });
  const [state, setState] = useState<State>({
    graphs: [],
  });
  const [game, setGame] = useState<any | undefined>();
  const [showState, setShowState] = useState<boolean>(false);

  useEffect(() => {
    function getPhaserGame(
      config: Types.Core.GameConfig,
      containerRef: React.RefObject<HTMLDivElement>,
    ): Game | undefined {
      if (containerRef.current) return new Game({ ...config, parent: containerRef.current });
    }

    setGame(getPhaserGame(gameConfig, parentEl));
  }, []);

  function addGraph() {
    if (game) {
      game.scene.keys.nodes.addGraph();
      setState({ graphs: game.scene.keys.nodes.state.graphs });
    }
  }

  function aristas(graph: { vertices: { aristas: any[] }[] }) {
    const aristas: Array<string> = [];

    graph.vertices.forEach((v: { aristas: any[] }) => {
      v.aristas.forEach((a: string) => {
        if (!aristas.includes(a)) aristas.push(a);
      });
    });

    return aristas;
  }

  function maxGrado(vertices: any[]) {
    let max = 0;
    for (let i = 0; i < vertices.length; i++) {
      if (vertices[i].aristas.length > max) max = vertices[i].aristas.length;
    }

    return max;
  }

  function sameGrado(vertices: any[]) {
    const grade = vertices[0].aristas.length;
    for (let i = 0; i < vertices.length; i++) {
      if (vertices[i].aristas.length !== grade) return false;
    }

    return true;
  }

  function graphsAreIsomorph() {
    if (state.graphs.length > 1) {
      for (let i = 1; i < state.graphs.length; i++) {
        const prev = state.graphs[i - 1];
        const cur = state.graphs[i];

        if (
          !(
            // Misma cantidad de vertices
            (
              prev.vertices.length === cur.vertices.length &&
              // Misma cantidad de aristas
              aristas(prev).length === aristas(cur).length &&
              // Mismo grado en los grafos
              maxGrado(prev.vertices) === maxGrado(cur.vertices) &&
              // Los grados son iguales
              sameGrado(prev.vertices) &&
              sameGrado(cur.vertices)
            )
          )
        ) {
          return false;
        }
      }
    }

    return true;
  }

  return (
    <div className="app isomorfos-container" style={style}>
      <div
        className="editor-container"
        style={{
          width: settings.width,
          height: settings.height,
        }}
      >
        <div ref={parentEl} className="editorElem" />
        <div className="ui-bar">
          <Button colorScheme="teal" size="md" onClick={addGraph}>
            Agregar Grafo
          </Button>
          <span>
            Son Isomorfos?{' '}
            {state.graphs.length > 1 && (
              <b className={graphsAreIsomorph() ? 'isoMorph' : 'no-isoMorph'}>{graphsAreIsomorph() ? 'Sí' : 'No'}</b>
            )}
          </span>
          <Button className="state-btn" variant="outline" size="sm" onClick={() => setShowState(!showState)}>
            {showState ? 'Ocultar estado' : 'Mostrar estado'}
          </Button>
        </div>
      </div>
      <div className={`state ${showState ? 'show' : 'hide'}`}>
        {state.graphs.map((graph, i) => (
          <div className="info" key={i}>
            <h6>Gráfo {i + 1}</h6>
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Vértice</Th>
                    <Th>Adyacencia</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {graph.vertices.map((v, j) => (
                    <Tr key={j}>
                      <Td>{v.name}</Td>
                      <Th>{v.aristas.length}</Th>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <div>
              Vértices: <b>{graph.vertices.length}</b>
            </div>
            <div>
              Aristas: <b>{aristas(graph).length}</b>
            </div>
            <div>
              Grado: <b>{maxGrado(graph.vertices)}</b>
            </div>
            <div>
              Los grados son equivalentes: <b>{sameGrado(graph.vertices) ? 'Sí' : 'No'}</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
