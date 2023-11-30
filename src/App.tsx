import { useEffect, useRef, useState, useMemo } from 'react'
import './App.css'
import { UsersList } from './components/UserList'
import { type User } from './types.d'
import { SortBy } from './types.d'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  const [filterByCountry, setFilterByCountry] = useState('')

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const handleFilterByCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterByCountry(e.target.value)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
    setShowColors(false)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  const filteredUsers = useMemo(() => {
    return filterByCountry !== null && filterByCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterByCountry.toLowerCase())
      })
      : users
  }, [users, filterByCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) {
      return filteredUsers
    }

    if (sorting === SortBy.NAME) {
      return filteredUsers.toSorted((a, b) => {
        return a.name.first.localeCompare(b.name.first)
      })
    }

    if (sorting === SortBy.LAST) {
      return filteredUsers.toSorted((a, b) => {
        return a.name.last.localeCompare(b.name.last)
      })
    }

    if (sorting === SortBy.COUNTRY) {
      return filteredUsers.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    }
  }, [filteredUsers, sorting])

  const deleteUser = (email: string) => {
    const filteredUsers = users.filter((user) => {
      return user.email !== email
    })
    setUsers(filteredUsers)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(data => {
        setUsers(data.results)
        originalUsers.current = data.results
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <>
      <h1>Prueba técnica</h1>
      <header style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          { sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país' }
        </button>
        <button onClick={handleReset}>Resetear usuarios</button>
        <input onChange={handleFilterByCountry} value={filterByCountry} style={{ padding: '10px', borderRadius: '10px', border: 'none' }} type='text' placeholder='Venezuela...' />
      </header>
      <main>
        <UsersList changingSort={handleChangeSort} users={sortedUsers} showColors={showColors} deleteUser={deleteUser} />
      </main>
    </>
  )
}

export default App
