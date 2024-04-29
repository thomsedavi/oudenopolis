import { useState } from 'react';
import { Element, ElementName } from './elements';

export default function Game(): JSX.Element {
  const [showGrid, setShowGrid] = useState<boolean>(true); 
  const [focus, setFocus] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [selected, setSelected] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [grid, setGrid] = useState<{ [id: string]: {elements: {id: Element, version: number}[], assets: {id: Element, time: number}[]}; }>({
    '0 0': {elements: [{id: Element.Road, version: 1}], assets: [{id: Element.Seaport, time: 30}]},
    '1 0': {elements: [{id: Element.Road, version: 1}, {id: Element.Seaport, version: 1}], assets: [{id: Element.Seaport, time: 15}]}
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

    if (id === Element.Road && selected.x <= 1) {
      const neighbourCoords: {x: number, y: number}[] = [
        {x: selected.x - 1, y: selected.y},
        {x: selected.x, y: selected.y + 1},
        {x: selected.x + 1, y: selected.y},
        {x: selected.x, y: selected.y - 1}
      ];

      let match = false;

      neighbourCoords.forEach((neighbour: {x: number, y: number}) => {
        if (grid[`${neighbour.x} ${neighbour.y}`]?.elements.find(element => element.id === Element.Road) !== undefined) {
          match = true;
        }
      });

      return match;
    }

    if (id === Element.Seaport && selected.x === 1 && has(Element.Road, selected.x, selected.y)) {
      return true;
    }

    if (id === Element.WoodWarehouse) {
      if (cell !== undefined && cell.assets.find(asset => asset.id === Element.Seaport && asset.time <= 15) !== undefined) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  const add = (id: Element) => {
    if (!canAdd(id))
      return;

    const prevGrid = { ...grid };
    const prevCell = prevGrid[`${selected.x} ${selected.y}`] ? { ...prevGrid[`${selected.x} ${selected.y}`] } : {elements: [], assets: []};

    prevGrid[`${selected.x} ${selected.y}`] = { ...prevCell, elements: [...prevCell.elements, {id: id, version: 1}]};

    recalculate(prevGrid);
  }

  const recalculate = (grid: { [id: string]: {elements: {id: Element, version: number}[], assets: {id: Element, time: number}[]}; }): void => {
    const assets: {[id: string]: {id: Element, time: number}[]} = {};

    Object.entries(grid).forEach(cell => {
      cell[1].assets = [];

      if (cell[1].elements.find(element => element.id === Element.Seaport)) {
        const visited: {[id: string]: {time: number, visited: boolean}} = {};

        if (cell[1].elements.find(element => element.id === Element.Road)) {
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

              if (neighbourCell.elements.find(thing => thing.id === Element.Road)){
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

          myAssets.push({id: Element.Seaport, time: visit[1].time});

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
    const layers: [number, JSX.Element][] = [];

    if (x > 1) {
      layers.push([0, <path key={`water(${x} ${y})`} d="M 360 0 L 720 180 L 360 360 L 0 180 Z" fill="lightgray" />]);
    } else if (x === 1) {
      layers.push([120, <path key={`water(${x} ${y})`} d="M 600 120 L 720 180 L 360 360 L 240 300 Z" fill="lightgray" />]);
    }

    const cell = grid[`${x} ${y}`];

    if (cell !== undefined) {
      if (cell.elements.find(element => element.id === Element.Road)) {
        if (x === 1) {
          layers.push([85, <path key={`${Element.Road}1(${x} ${y})`} d="M 190 85 L 360 170 L 530 85" stroke="black" fill="none" />]);
          layers.push([95, <path key={`${Element.Road}2(${x} ${y})`} d="M 550 95 L 190 275" stroke="black" fill="none" />]);
          layers.push([95, <path key={`${Element.Road}3(${x} ${y})`} d="M 170 265 L 340 180 L 170 95" stroke="black" fill="none" />]);
        } else {
          layers.push([85, <path key={`${Element.Road}1(${x} ${y})`} d="M 190 85 L 360 170 L 530 85" stroke="black" fill="none" />]);
          layers.push([95, <path key={`${Element.Road}2(${x} ${y})`} d="M 550 95 L 380 180 L 550 265" stroke="black" fill="none" />]);
          layers.push([190, <path key={`${Element.Road}3(${x} ${y})`} d="M 530 275 L 360 190 L 190 275" stroke="black" fill="none" />]);
          layers.push([95, <path key={`${Element.Road}4(${x} ${y})`} d="M 170 265 L 340 180 L 170 95" stroke="black" fill="none" />]);
        }
      }

      if (cell.elements.find(element => element.id === Element.Seaport)) {
        layers.push([150, <path key={`${Element.Seaport}(${x} ${y})`} d="M 540 150 L 600 180 L 570 195 L 510 165 Z" fill="black" />])
      }

      if (cell.elements.find(element => element.id === Element.WoodWarehouse)) {
        layers.push([150, <path key={`${Element.WoodWarehouse}(${x} ${y})`} d="M 440 110 L 480 130 L 480 170 L 440 190 L 400 170 L 400 130 Z" fill="darkgray" />])
      }
    }

    return (
      <>
        {layers.sort((a, b) => a[0] - b[0]).map(element => element[1])}
        <path d="M 360 0 L 720 180 L 360 360 L 0 180 Z" fill="transparent" cursor="pointer" onClick={() => setSelected({x: x, y: y})} />
        {x === selected.x && y === selected.y && <path d="M 360 5 L 710 180 L 360 355 L 10 180 Z" fill="none" stroke="darkgray" strokeWidth="10" />}
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
          <g transform="translate(1080 -180)">
            {drawCell(focus.x - 1, focus.y - 3)}
          </g>
          <g transform="translate(360 -180)">
            {drawCell(focus.x - 2, focus.y - 2)}
          </g>
          <g transform="translate(720 0)">
            {drawCell(focus.x - 1, focus.y - 2)}
          </g>
          <g transform="translate(1080 180)">
            {drawCell(focus.x, focus.y - 2)}
          </g>
          <g transform="translate(-360 -180)">
            {drawCell(focus.x - 3, focus.y - 1)}
          </g>
          <g transform="translate(0 0)">
            {drawCell(focus.x - 2, focus.y - 1)}
          </g>
          <g transform="translate(360 180)">
            {drawCell(focus.x - 1, focus.y - 1)}
          </g>
          <g transform="translate(720 360)">
            {drawCell(focus.x, focus.y - 1)}
          </g>
          <g transform="translate(1080 540)">
            {drawCell(focus.x + 1, focus.y - 1)}
          </g>
          <g transform="translate(-360 180)">
            {drawCell(focus.x - 2, focus.y)}
          </g>
          <g transform="translate(0 360)">
            {drawCell(focus.x - 1, focus.y)}
          </g>
          <g transform="translate(360 540)">
            {drawCell(focus.x, focus.y)}
          </g>
          <g transform="translate(720 720)">
            {drawCell(focus.x + 1, focus.y)}
          </g>
          <g transform="translate(1080 900)">
            {drawCell(focus.x + 2, focus.y)}
          </g>
          <g transform="translate(-360 540)">
            {drawCell(focus.x - 1, focus.y + 1)}
          </g>
          <g transform="translate(0 720)">
            {drawCell(focus.x, focus.y + 1)}
          </g>
          <g transform="translate(360 900)">
            {drawCell(focus.x + 1, focus.y + 1)}
          </g>
          <g transform="translate(720 1080)">
            {drawCell(focus.x + 2, focus.y + 1)}
          </g>
          <g transform="translate(1080 1260)">
            {drawCell(focus.x + 3, focus.y + 1)}
          </g>
          <g transform="translate(-360 900)">
            {drawCell(focus.x, focus.y + 2)}
          </g>
          <g transform="translate(0 1080)">
            {drawCell(focus.x + 1, focus.y + 2)}
          </g>
          <g transform="translate(360 1260)">
            {drawCell(focus.x + 2, focus.y + 2)}
          </g>
          <g transform="translate(-360 1260)">
            {drawCell(focus.x + 1, focus.y + 3)}
          </g>
          {showGrid && <>
            <line x1="1080" y1="0" x2="1440" y2="180" stroke="black" />
            <line x1="360" y1="0" x2="1440" y2="540" stroke="black" />
            <line x1="0" y1="180" x2="1440" y2="900" stroke="black" />
            <line x1="0" y1="540" x2="1440" y2="1260" stroke="black" />
            <line x1="0" y1="900" x2="1080" y2="1440" stroke="black" />
            <line x1="0" y1="1260" x2="360" y2="1440" stroke="black" />
            <line x1="360" y1="0" x2="0" y2="180" stroke="black" />
            <line x1="1080" y1="0" x2="0" y2="540" stroke="black" />
            <line x1="1440" y1="180" x2="0" y2="900" stroke="black" />
            <line x1="1440" y1="540" x2="0" y2="1260" stroke="black" />
            <line x1="1440" y1="900" x2="360" y2="1440" stroke="black" />
            <line x1="1440" y1="1260" x2="1080" y2="1440" stroke="black" />
          </>}
        </svg>
      </div>
      <button onClick={() => add(Element.Road)} disabled={!canAdd(Element.Road)}>Add Road</button>
      <button onClick={() => add(Element.Seaport)} disabled={!canAdd(Element.Seaport)}>Add Seaport</button>
      <button onClick={() => add(Element.WoodWarehouse)} disabled={!canAdd(Element.WoodWarehouse)}>Add Wood Warehouse</button>
      {grid[`${selected.x} ${selected.y}`] && grid[`${selected.x} ${selected.y}`].assets.map((asset, index) => 
        <div key={`asset${index}`}>{ElementName(asset.id)}: {asset.time}</div>
      )}
    </>
  )
}
