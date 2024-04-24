import { useState } from 'react';

export default function Game() {
  const [scream, setScream] = useState("aah!");

  return (
    <div onClick={() => setScream(`a${scream}`)}>{scream}</div>
  )
}
