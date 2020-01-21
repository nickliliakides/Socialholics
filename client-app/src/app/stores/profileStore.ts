import { RootStore } from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import { IProfile, IPhoto } from '../models/profile';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore{
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loadingMain = false;


  @computed get isCurrentUser() {
    if(this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction('getting the profile', () => {
        this.profile = profile;
        this.loadingProfile = false;
      })
    } catch (error) {
      runInAction('Error getting the profile', () => {
        this.loadingProfile = false;
      })
      console.log(error);
    }
  }

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction('Uploading image', () => {
        if(this.profile) {
          this.profile.photos.push(photo);
          if(photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      })
    } catch (error) {
      toast.error('Problrem uploading photo');
      runInAction('Error uploading image', () => {
        this.uploadingPhoto = false;
      })
    }
  }

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loadingMain = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction('Setting main photo', () => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(p => p.isMain)!.isMain = false;
        this.profile!.photos.filter(p => p.id === photo.id)![0].isMain = true;
        this.profile!.image = photo.url;
        this.loadingMain = false;
      })
    } catch (error) {
      toast.error('Problrem setting main photo');
      runInAction('Problrem setting main photo', () => {
        this.uploadingPhoto = false;
      })
    }
  }

  @action deletePhoto = async (photo: IPhoto) => {
    this.loadingMain = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction('Deleting photo', () => {
        this.profile!.photos = this.profile!.photos.filter(p => p.id !== photo.id);
        this.loadingMain = false;
      })
    } catch (error) {
      toast.error('Problrem deleting photo');
      runInAction('Problrem deleting photo', () => {
        this.loadingMain = false;
      })
    }
  }
}
   