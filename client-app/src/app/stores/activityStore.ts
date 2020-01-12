import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';


export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable selectedActivity: IActivity | null = null;
  @observable loading = false;
  @observable submitting = false;
  @observable target = '';

  // Helper Method for activitiesByDate
  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort((a,b) => a.date.getTime() - b.date.getTime());
    return Object.entries(sortedActivities.reduce((acts, act) => {
      const date = act.date.toISOString().split('T')[0];
      acts[date] = acts[date] ? [...acts[date], act] : [act];
      return acts;
    },{} as {[key: string]: IActivity[]}));
  }

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  @action loadActivities = async () => {
    this.loading = true;
    try {
      const acts = await agent.Activities.list();
      runInAction('Loading activities', () => {
        acts.forEach(act => {
          act.date = new Date(act.date);
          this.activityRegistry.set(act.id, act);
        });
        this.loading = false;
      })
    } catch (error) {
      runInAction('Load activities error',() => {
        this.loading = false;
      })
      console.log(error);
    }
  };

  //helper method for loadActivity action
  getActivity = (id: string) => this.activityRegistry.get(id);

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if(activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loading = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('Loading activity', () => {
          activity.date = new Date(activity.date)
          this.selectedActivity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loading = false;
        })
        return activity;
      } catch (error) {
        runInAction('Load activity error',() => {
          this.loading = false;
        })
        console.log(error);
      }
    }
  };

  @action editActivity = async (act: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(act);
      runInAction('Editing activity', () => {
        this.activityRegistry.set(act.id, act);
        this.selectedActivity = act;
        this.submitting = false;
      })
      history.push(`/activities/${act.id}`)
    } catch (error) {
      runInAction('Edit activity error', () => {
        this.submitting = false;
      })
      toast.error('Problem submitting the form')
      console.log(error.response);
    }
  }

  @action createActivity = async (act: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(act);
      runInAction('Creating activity', () => {
        this.activityRegistry.set(act.id, act);
        this.selectedActivity = act;
        this.submitting = false;
      })
      history.push(`/activities/${act.id}`)
    } catch (error) {
      runInAction('Create activity error', () => {
        this.submitting = false;
      })
      toast.error('Problem submitting the form')
      console.log(error.response);
    }
  };

  @action deleteActivity = async (e: SyntheticEvent<HTMLButtonElement>, act: IActivity) => {
    if(window.confirm(`Are you sure that you want to delete ${act.title}?`)) {
      this.submitting = true;
      this.target = e.currentTarget.name;
      try {
        await agent.Activities.delete(act.id);
        runInAction('Deleting activity',() => {
          this.activityRegistry.delete(act.id);
          this.submitting = false;
          this.target = '';
        })
      } catch (error) {
        runInAction('Delete activity error',() => {
          this.submitting = false;
          this.target = '';
        })
        console.log(error);
      }
    }
  }

  @action deselectActivity = () => {
    this.selectedActivity = null;
  };
}