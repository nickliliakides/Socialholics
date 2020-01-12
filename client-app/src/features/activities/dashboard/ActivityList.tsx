import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import ActivityListItem from './ActivityListItem';
import { format } from 'date-fns';

const ActivityList = () => {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([date, acts]) => (
        <Fragment key={date}>
          <Label size="large">{format(date, 'eeee do MMMM yyyy')}</Label>
          <Item.Group divided>
            {acts.map(act => (
              <ActivityListItem key={act.id} act={act} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
