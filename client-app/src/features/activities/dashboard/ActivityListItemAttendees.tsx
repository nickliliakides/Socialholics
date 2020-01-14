import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps {
  attendees: IAttendee[];
}

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((a, i) => (
        <List.Item key={i}>
          <Popup
            header={a.username}
            trigger={
              <Image
                size="mini"
                circular
                src={a.image || '/assets/images/user.png'}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
