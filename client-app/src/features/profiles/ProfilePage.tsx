import React, { useContext, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import Load from '../../app/layout/Loader';
import { observer } from 'mobx-react-lite';

interface RouteParams {
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, loadingProfile, profile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  if(loadingProfile) return <Load content='Loading profile ...' />

  return (
    <div>
      <ProfileHeader profile={profile!} />
      <ProfileContent />
    </div>
  );
};

export default observer(ProfilePage);
