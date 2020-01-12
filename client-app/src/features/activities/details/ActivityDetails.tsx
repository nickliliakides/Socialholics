import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import Load from '../../../app/layout/Loader';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match
}) => {
  const rootStore = useContext(RootStoreContext);
  const { selectedActivity, loadActivity, loading } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  if (loading || !selectedActivity)
    return <Load content="Loading content..." />;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityDetailedHeader act={selectedActivity} />
        <ActivityDetailedInfo act={selectedActivity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
