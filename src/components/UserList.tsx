import { SortBy, type User } from '../types.d'

interface Props {
  changingSort: (sort: SortBy) => void
  users: User[]
  showColors: boolean
  deleteUser: (email: string) => void
}

export function UsersList ({ changingSort, users, showColors, deleteUser }: Props) {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th onClick={() => { changingSort(SortBy.NAME) }}>Nombre</th>
          <th onClick={() => { changingSort(SortBy.LAST) }}>Apellido</th>
          <th onClick={() => { changingSort(SortBy.COUNTRY) }}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {
          users.map((user, index) => {
            const backgroundColor = index % 2 === 0 ? '#333' : '#555'
            const color = showColors ? backgroundColor : 'transparent'
            return (
              <tr key={user.email} style={{ backgroundColor: color }}>
                <td><img style={{ borderRadius: '50%' }} src={user.picture.thumbnail} alt={user.name.first} /></td>
                <td>{user.name.first}</td>
                <td>{user.name.last}</td>
                <td>{user.location.country}</td>
                <td><button onClick={() => { deleteUser(user.email) }}>Borrar</button></td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}
