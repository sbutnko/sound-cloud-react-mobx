import React, { useContext } from 'react';

import { AppContext } from '../../app-context';
import { User } from '../../models/user';
import DataGrid from '../DataGrid';
import DataLoader from '../DataLoader';

const UserTracks = ({ user }: { user: User }) => {
  const { api } = useContext(AppContext);

  return (
    <DataLoader
      url={api.endpoints.userTracks(user.id)}
      params={api.paginationParams}
      render={(props: any) => <DataGrid {...props} />}
    />
  );
};

export default UserTracks;
