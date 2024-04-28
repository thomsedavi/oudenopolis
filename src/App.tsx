import { useState } from 'react';

export default function Game(): JSX.Element {
  const [showGrid, setShowGrid] = useState<boolean>(true); 
  const [focus, setFocus] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [selected, setSelected] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [grid, setGrid] = useState<{ [id: string]: {elements: {id: string, version: number}[], assets: {id: string, time: number}[]}; }>({
    '0 0': {elements: [{id: 'road', version: 1}], assets: [{id: 'harbour', time: 30}]},
    '1 0': {elements: [{id: 'road', version: 1}, {id: 'harbour', version: 1}], assets: [{id: 'harbour', time: 15}]}
  });

  const has = (id: string, x: number, y: number): boolean => {
    const cell = grid[`${selected.x} ${selected.y}`];

    if (cell === undefined) {
      return false;
    }

    if (cell.elements.find(element => element.id === id) !== undefined) {
      return true;
    }

    return false;
  }

  const canAdd = (id: string): boolean => {
    const cell = grid[`${selected.x} ${selected.y}`];

    if (cell !== undefined) {
      if (cell.elements.find(element => element.id === id) !== undefined) {
        return false;
      }
    }

    if (id === 'road' && selected.x <= 1) {
      const neighbourCoords: {x: number, y: number}[] = [
        {x: selected.x - 1, y: selected.y},
        {x: selected.x, y: selected.y + 1},
        {x: selected.x + 1, y: selected.y},
        {x: selected.x, y: selected.y - 1}
      ];

      let match = false;

      neighbourCoords.forEach((neighbour: {x: number, y: number}) => {
        if (grid[`${neighbour.x} ${neighbour.y}`]?.elements.find(element => element.id === 'road') !== undefined) {
          match = true;
        }
      });

      return match;
    }

    if (id === 'harbour' && selected.x === 1 && has('road', selected.x, selected.y)) {
      return true;
    }

    if (id === 'wood warehouse') {
      if (cell !== undefined && cell.assets.find(asset => asset.id === 'harbour' && asset.time <= 15) !== undefined) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  const add = (id: string) => {
    if (!canAdd(id))
      return;

    const prevGrid = { ...grid };
    const prevCell = prevGrid[`${selected.x} ${selected.y}`] ? { ...prevGrid[`${selected.x} ${selected.y}`] } : {elements: [], assets: []};

    prevGrid[`${selected.x} ${selected.y}`] = { ...prevCell, elements: [...prevCell.elements, {id: id, version: 1}]};

    recalculate(prevGrid);
  }

  const recalculate = (grid: { [id: string]: {elements: {id: string, version: number}[], assets: {id: string, time: number}[]}; }): void => {
    const assets: {[id: string]: {id: string, time: number}[]} = {};

    Object.entries(grid).forEach(cell => {
      cell[1].assets = [];

      if (cell[1].elements.find(element => element.id === 'harbour')) {
        const visited: {[id: string]: {time: number, visited: boolean}} = {};

        if (cell[1].elements.find(element => element.id === 'road')) {
          visited[cell[0]] = {time: 15, visited: false};
        }

        while (Object.values(visited).find(visitedCell => !visitedCell.visited) !== undefined) {
          const newVisited: {[id: string]: number} = {};

          Object.entries(visited).forEach(visitedCell => {
            const time = visitedCell[1].time;
            visitedCell[1].visited = true;

            const coords = visitedCell[0].split(' ').map(coord => Number(coord));
            const neighbourCoords: {x: number, y: number}[] = [
              {x: coords[0] - 1, y: coords[1]},
              {x: coords[0], y: coords[1] + 1},
              {x: coords[0] + 1, y: coords[1]},
              {x: coords[0], y: coords[1] - 1}
            ];

            neighbourCoords.forEach(coord => {
              const neighbourCell = grid[`${coord.x} ${coord.y}`] ? grid[`${coord.x} ${coord.y}`] : {elements: []}

              if (neighbourCell.elements.find(thing => thing.id === 'road')){
                const nextTime = time + 15;

                if (newVisited[`${coord.x} ${coord.y}`] === undefined) {
                  newVisited[`${coord.x} ${coord.y}`] = nextTime;
                } else if (nextTime < newVisited[`${coord.x} ${coord.y}`]) {
                  newVisited[`${coord.x} ${coord.y}`] = nextTime;
                }
              }
            })
          });

          Object.entries(newVisited).forEach(newVisit => {
            if (visited[newVisit[0]] === undefined) {
              visited[newVisit[0]] = {time: newVisit[1], visited: false};
            } else if (newVisit[1] < visited[newVisit[0]].time) {
              visited[newVisit[0]] = {time: newVisit[1], visited: false};
            }
          });
        }

        Object.entries(visited).forEach(visit => {
          var myAssets = assets[visit[0]] ? [...assets[visit[0]]] : []

          myAssets.push({id: 'harbour', time: visit[1].time});

          assets[visit[0]] = myAssets;
        });
      }
    });

    Object.entries(assets).forEach(asset => {
      if (grid[asset[0]] !== undefined) {
        asset[1].forEach(ting => {
          grid[asset[0]].assets.push(ting);
        })
      }
    });

    setGrid(grid);
  }

  const drawCell = (x: number, y: number): JSX.Element => {
    const layers: JSX.Element[] = [];

    if (x > 1) {
      layers.push(<rect key={`water(${x} ${y})`} x="0" y="0" width="360" height="360" fill="lightgray" />)
    } else if (x === 1) {
      layers.push(<rect key={`water(${x} ${y})`} x="240" y="0" width="120" height="360" fill="lightgray" />)
    }

    const cell = grid[`${x} ${y}`];

    if (cell !== undefined) {
      if (cell.elements.find(element => element.id === 'road')) {
        if (x === 1) {
          layers.push(<line key={`road1(${x} ${y})`} x1="220" y1="0" x2="220" y2="360" stroke="black" />)
          layers.push(<line key={`road2(${x} ${y})`} x1="240" y1="0" x2="240" y2="360" stroke="black" />)
          layers.push(<line key={`road3(${x} ${y})`} x1="0" y1="170" x2="240" y2="170" stroke="black" />)
          layers.push(<line key={`road4(${x} ${y})`} x1="0" y1="190" x2="240" y2="190" stroke="black" />)  
        } else {
          layers.push(<line key={`road1(${x} ${y})`} x1="170" y1="0" x2="170" y2="360" stroke="black" />)
          layers.push(<line key={`road2(${x} ${y})`} x1="190" y1="0" x2="190" y2="360" stroke="black" />)
          layers.push(<line key={`road3(${x} ${y})`} x1="0" y1="170" x2="360" y2="170" stroke="black" />)
          layers.push(<line key={`road4(${x} ${y})`} x1="0" y1="190" x2="360" y2="190" stroke="black" />)  
        }
      }

      if (cell.elements.find(element => element.id === 'harbour')) {
        layers.push(<rect key={`harbour(${x} ${y})`} x="240" y="80" width="40" height="20" fill="black" />)
      }

      if (cell.elements.find(element => element.id === 'wood warehouse')) {
        layers.push(<rect key={`woodwarehouse(${x} ${y})`} x="20" y="20" width="40" height="40" fill="darkgray" />)
      }
    }

    return (
      <>
        {layers}
        <rect x="0" y="0" width="360" height="360" fill="transparent" cursor="pointer" onClick={() => setSelected({x: x, y: y})} />
        {x === selected.x && y === selected.y && <rect x="5" y="5" width="350" height="350" fill="none" stroke="darkgray" strokeWidth="10" />}
      </>
    )
  }

  return (
    <>
      <button onClick={() => setFocus({...focus, y: focus.y - 1})}>↑</button>
      <button onClick={() => setFocus({...focus, x: focus.x - 1})}>←</button>
      <button onClick={() => setFocus({...focus, x: focus.x + 1})}>→</button>
      <button onClick={() => setFocus({...focus, y: focus.y + 1})}>↓</button>
      <button onClick={() => setFocus({x: 0, y: 0})}>Centre</button>
      <button onClick={() => setShowGrid(prevState => !prevState)}>Toggle Grid</button>
      <div style={{width: '24em'}}>

        <svg viewBox="0 0 1440 1440" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(-180 -180)">
            {drawCell(focus.x - 2, focus.y - 2)}
          </g>
          <g transform="translate(180 -180)">
            {drawCell(focus.x - 1, focus.y - 2)}
          </g>
          <g transform="translate(540 -180)">
            {drawCell(focus.x, focus.y - 2)}
          </g>
          <g transform="translate(900 -180)">
            {drawCell(focus.x + 1, focus.y - 2)}
          </g>
          <g transform="translate(1260 -180)">
            {drawCell(focus.x + 2, focus.y - 2)}
          </g>
          <g transform="translate(-180 180)">
            {drawCell(focus.x - 2, focus.y - 1)}
          </g>
          <g transform="translate(180 180)">
            {drawCell(focus.x - 1, focus.y - 1)}
          </g>
          <g transform="translate(540 180)">
            {drawCell(focus.x, focus.y - 1)}
          </g>
          <g transform="translate(900 180)">
            {drawCell(focus.x + 1, focus.y - 1)}
          </g>
          <g transform="translate(1260 180)">
            {drawCell(focus.x + 2, focus.y - 1)}
          </g>
          <g transform="translate(-180 540)">
            {drawCell(focus.x - 2, focus.y)}
          </g>
          <g transform="translate(180 540)">
            {drawCell(focus.x - 1, focus.y)}
          </g>
          <g transform="translate(540 540)">
            {drawCell(focus.x, focus.y)}
          </g>
          <g transform="translate(900 540)">
            {drawCell(focus.x + 1, focus.y)}
          </g>
          <g transform="translate(1260 540)">
            {drawCell(focus.x + 2, focus.y)}
          </g>
          <g transform="translate(-180 900)">
            {drawCell(focus.x - 2, focus.y + 1)}
          </g>
          <g transform="translate(180 900)">
            {drawCell(focus.x - 1, focus.y + 1)}
          </g>
          <g transform="translate(540 900)">
            {drawCell(focus.x, focus.y + 1)}
          </g>
          <g transform="translate(900 900)">
            {drawCell(focus.x + 1, focus.y + 1)}
          </g>
          <g transform="translate(1260 900)">
            {drawCell(focus.x + 2, focus.y + 1)}
          </g>
          <g transform="translate(-180 1260)">
            {drawCell(focus.x - 2, focus.y + 2)}
          </g>
          <g transform="translate(180 1260)">
            {drawCell(focus.x - 1, focus.y + 2)}
          </g>
          <g transform="translate(540 1260)">
            {drawCell(focus.x, focus.y + 2)}
          </g>
          <g transform="translate(900 1260)">
            {drawCell(focus.x + 1, focus.y + 2)}
          </g>
          <g transform="translate(1260 1260)">
            {drawCell(focus.x + 2, focus.y + 2)}
          </g>
          {showGrid && <>
            <line x1="180" y1="0" x2="180" y2="1440" stroke="black" />
            <line x1="540" y1="0" x2="540" y2="1440" stroke="black" />
            <line x1="900" y1="0" x2="900" y2="1440" stroke="black" />
            <line x1="1260" y1="0" x2="1260" y2="1440" stroke="black" />
            <line x1="0" y1="180" x2="1440" y2="180" stroke="black" />
            <line x1="0" y1="540" x2="1440" y2="540" stroke="black" />
            <line x1="0" y1="900" x2="1440" y2="900" stroke="black" />
            <line x1="0" y1="1260" x2="1440" y2="1260" stroke="black" />
          </>}
        </svg>
      </div>
      <button onClick={() => add('road')} disabled={!canAdd('road')}>Add Road</button>
      <button onClick={() => add('harbour')} disabled={!canAdd('harbour')}>Add Harbour</button>
      <button onClick={() => add('wood warehouse')} disabled={!canAdd('wood warehouse')}>Add Wood Warehouse</button>
      {grid[`${selected.x} ${selected.y}`] && grid[`${selected.x} ${selected.y}`].assets.map((asset, index) => 
        <div key={`asset${index}`}>{asset.id}: {asset.time}</div>
      )}
    </>
  )
}
