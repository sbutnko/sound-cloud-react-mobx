import React, {Component} from 'react';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import {CircularProgress} from 'material-ui/Progress';
import Text from 'material-ui/Text';
import './Playlist.less';
import DataGrid from '../components/DataGrid';
import {loadPlaylist} from '../api';
import {formatDuration, fromNow, getImageUrl} from '../utils';
import {IMAGE_SIZES} from '../constants';
import {Link} from "react-router";
import Error from '../components/Error';

@inject('sessionStore', 'viewStore', 'playerStore') @observer
export default class Playlist extends Component {
  @observable playlist;
  @observable isLoading;
  @observable error;

  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {user: nextUser, playlist: nextPlaylist} = nextProps.params;
    const {user, playlist} = this.props.params;

    if (nextUser !== user || nextPlaylist !== playlist) {
      this.loadData(nextProps);
    }
  }

  loadData({params: { user, playlist }, viewStore }) {
    this.isLoading = true;

    loadPlaylist(user, playlist)
      .then(playlist => {
        this.playlist = playlist;
        this.isLoading = false;
        viewStore.title = `${playlist.user.username} - ${playlist.title} (Playlist)`;
      })
      .catch(err => {
        this.error = 'Failed to load playlist';
        this.isLoading = false;
      });
  }

  render() {
    const { playlist, isLoading, error } = this;

    if (isLoading) {
      return <div className='loader-wrap'><CircularProgress /></div>;
    }

    if (error) {
      return <Error>{error}</Error>;
    }

    if (!playlist) {
      return null;
    }

    const { user } = playlist;

    return (
      <div>
        <div className='playlist-header'>
          <div className='container playlist-header__row'>
            <img src={getImageUrl(playlist.artwork_url, IMAGE_SIZES.t500x500)} alt="playlsit.title" width={250} height={250}/>
            <div className='playlist-header__details'>
              <Text type="subheading">Playlist</Text>
              <Text type='display1' gutterBottom>{playlist.title}</Text>
              <Text type="subheading" gutterBottom>by <Link to={`/users/${user.permalink}`} className='link link--blue'>{user.username}</Link></Text>
              <Text type='subheading'>
                {fromNow(playlist.created_at)} <span className='bullet'>&bull;</span>
                {playlist.track_count} tracks, &nbsp;
                {formatDuration(playlist.duration)} <span className='bullet'>&bull;</span>
                {playlist.genre}
              </Text>
            </div>
          </div>
        </div>

        <div className='container'>
          <DataGrid data={playlist.tracks} isLastPage={true} />
        </div>
      </div>
    );
  }
}
