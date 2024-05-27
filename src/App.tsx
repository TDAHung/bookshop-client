import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import { gql, useQuery } from '@apollo/client';
import { Loading } from './components/Loading';

function App() {
  const [count, setCount] = useState(0);
  const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  function DisplayLocations() {
    if (error) return <p>Error : {error.message}</p>;

    return data.locations.map(({ id, name, description, photo }: { id: any, name: any, description: any, photo: any }) => (
      <div key={id}>
        <h3>{name}</h3>
        <img width="400" height="250" alt="location-reference" src={`${photo}`} />
        <br />
        <b>About this location:</b>
        <p>{description}</p>
        <br />
      </div>
    ));
  }

  return (
    loading ? <Loading /> : <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className='text-3xl font-bold underline'>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <DisplayLocations />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
