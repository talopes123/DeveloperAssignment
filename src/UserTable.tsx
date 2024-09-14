import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { setUsers, setFilter } from './redux/userSlice';
import axios from 'axios';
import './UserTable.css';



const UserTable: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.user.users);
  const filters = useSelector((state: RootState) => state.user.filters);

  type SortConfig = {
    key: keyof typeof users[0];
    direction: 'asc' | 'desc';
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      dispatch(setUsers(response.data));
    };

    fetchUsers();
  }, [dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setFilter({ key: name, value }));
  };

  // Handle sorting when a column header is clicked
  const handleSort = (key: keyof typeof users[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];

    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    user.username.toLowerCase().includes(filters.username.toLowerCase()) &&
    user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
    user.phone.toLowerCase().includes(filters.phone.toLowerCase())
  );

  return (
    <div className="table-container">
      <h2>User Management Table</h2>

      {/* Search input fields */}
      <div className="filter-container">
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Search by Username"
          value={filters.username}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Search by Email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Search by Phone"
          value={filters.phone}
          onChange={handleFilterChange}
        />
      </div>

      {/* Render the filtered and sorted user table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('username')}>
              Username {sortConfig?.key === 'username' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {sortConfig?.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('phone')}>
              Phone {sortConfig?.key === 'phone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
            {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
          
