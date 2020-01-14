import React, { useContext } from 'react';
import { Segment, Image, Item, Header, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../app/stores/rootStore';

const activityImageStyle = {
  filter: 'brightness(35%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ActivityDetailedHeader: React.FC<{ act: IActivity }> = ({ act }) => {
  const rootStore = useContext(RootStoreContext);
  const { attendActivity, unattendActivity, submitting } = rootStore.activityStore;
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        <Image
          src={`/assets/images/categoryImages/${act.category}.jpg`}
          style={activityImageStyle}
          fluid
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={act.title}
                  style={{ color: 'white' }}
                />
                <p>{format(act.date, 'eeee do MMMM')}</p>
                <p>
                  Hosted by <strong>Bob</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {act.isHost ? (
          <Button
            as={Link}
            to={`/editactivity/${act.id}`}
            color="orange"
            floated="right"
          >
            {' '}
            Manage Event{' '}
          </Button>
        ) : act.isGoing ? (
          <Button loading={submitting} onClick={unattendActivity}>Cancel attendance</Button>
        ) : (
          <Button loading={submitting} onClick={attendActivity} color="teal">Join Activity</Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
