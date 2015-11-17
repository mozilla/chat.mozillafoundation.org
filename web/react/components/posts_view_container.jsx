// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

const PostsView = require('./posts_view.jsx');
const LoadingScreen = require('./loading_screen.jsx');
const ChannelInviteModal = require('./channel_invite_modal.jsx');

const ChannelStore = require('../stores/channel_store.jsx');
const PostStore = require('../stores/post_store.jsx');

const Utils = require('../utils/utils.jsx');
const EventHelpers = require('../dispatcher/event_helpers.jsx');

const Constants = require('../utils/constants.jsx');

import {createChannelIntroMessage} from '../utils/channel_intro_mssages.jsx';

export default class PostsViewContainer extends React.Component {
    constructor() {
        super();

        this.onChannelChange = this.onChannelChange.bind(this);
        this.onChannelLeave = this.onChannelLeave.bind(this);
        this.onPostsChange = this.onPostsChange.bind(this);
        this.handlePostsViewScroll = this.handlePostsViewScroll.bind(this);
        this.loadMorePostsTop = this.loadMorePostsTop.bind(this);
        this.handlePostsViewJumpRequest = this.handlePostsViewJumpRequest.bind(this);

        const currentChannelId = ChannelStore.getCurrentId();
        const state = {
            scrollType: PostsView.SCROLL_TYPE_BOTTOM,
            scrollPost: null
        };
        if (currentChannelId) {
            Object.assign(state, {
                currentChannelIndex: 0,
                channels: [currentChannelId],
                postLists: [this.getChannelPosts(currentChannelId)],
                atTop: [PostStore.getVisibilityAtTop(currentChannelId)],
                atBottom: [PostStore.getVisibilityAtBottom(currentChannelId)]
            });
        } else {
            Object.assign(state, {
                currentChannelIndex: null,
                channels: [],
                postLists: [],
                atTop: [],
                atBottom: []
            });
        }

        state.showInviteModal = false;
        this.state = state;
    }
    componentDidMount() {
        ChannelStore.addChangeListener(this.onChannelChange);
        ChannelStore.addLeaveListener(this.onChannelLeave);
        PostStore.addChangeListener(this.onPostsChange);
        PostStore.addPostsViewJumpListener(this.handlePostsViewJumpRequest);
    }
    componentWillUnmount() {
        ChannelStore.removeChangeListener(this.onChannelChange);
        ChannelStore.removeLeaveListener(this.onChannelLeave);
        PostStore.removeChangeListener(this.onPostsChange);
        PostStore.removePostsViewJumpListener(this.handlePostsViewJumpRequest);
    }
    handlePostsViewJumpRequest(type, post) {
        switch (type) {
        case Constants.PostsViewJumpTypes.BOTTOM:
            this.setState({scrollType: PostsView.SCROLL_TYPE_BOTTOM});
            break;
        case Constants.PostsViewJumpTypes.POST:
            this.setState({
                scrollType: PostsView.SCROLL_TYPE_POST,
                scrollPost: post
            });
            break;
        case Constants.PostsViewJumpTypes.SCROLL_TYPE_SIDEBAR_OPEN:
            this.setState({scrollType: PostsView.SCROLL_TYPE_SIDEBAR_OPEN});
            break;
        }
    }
    onChannelChange() {
        const postLists = this.state.postLists.slice();
        const atTop = this.state.atTop.slice();
        const atBottom = this.state.atBottom.slice();
        const channels = this.state.channels.slice();
        const channelId = ChannelStore.getCurrentId();

        // Has the channel really changed?
        if (channelId === channels[this.state.currentChannelIndex]) {
            // Dirty hack
            this.forceUpdate();
            return;
        }

        let lastViewed = Number.MAX_VALUE;
        const member = ChannelStore.getMember(channelId);
        if (member != null) {
            lastViewed = member.last_viewed_at;
        }

        let newIndex = channels.indexOf(channelId);
        if (newIndex === -1) {
            newIndex = channels.length;
            channels.push(channelId);
            postLists[newIndex] = this.getChannelPosts(channelId);
            atTop[newIndex] = PostStore.getVisibilityAtTop(channelId);
            atBottom[newIndex] = PostStore.getVisibilityAtBottom(channelId);
        }
        this.setState({
            currentChannelIndex: newIndex,
            currentLastViewed: lastViewed,
            scrollType: PostsView.SCROLL_TYPE_NEW_MESSAGE,
            channels,
            postLists,
            atTop,
            atBottom});
    }
    onChannelLeave(id) {
        const postLists = this.state.postLists.slice();
        const channels = this.state.channels.slice();
        const atTop = this.state.atTop.slice();
        const atBottom = this.state.atBottom.slice();
        const index = channels.indexOf(id);
        if (index !== -1) {
            postLists.splice(index, 1);
            channels.splice(index, 1);
            atTop.splice(index, 1);
            atBottom.splice(index, 1);
        }
        this.setState({channels, postLists, atTop, atBottom});
    }
    onPostsChange() {
        const channels = this.state.channels;
        const postLists = this.state.postLists.slice();
        const atTop = this.state.atTop.slice();
        const atBottom = this.state.atBottom.slice();
        const currentChannelId = channels[this.state.currentChannelIndex];
        const newPostsView = this.getChannelPosts(currentChannelId);

        postLists[this.state.currentChannelIndex] = newPostsView;
        atTop[this.state.currentChannelIndex] = PostStore.getVisibilityAtTop(currentChannelId);
        atBottom[this.state.currentChannelIndex] = PostStore.getVisibilityAtBottom(currentChannelId);
        this.setState({postLists, atTop, atBottom});
    }
    getChannelPosts(id) {
        const postList = PostStore.getVisiblePosts(id);
        return postList;
    }
    loadMorePostsTop() {
        EventHelpers.emitLoadMorePostsTopEvent();
    }
    handlePostsViewScroll(atBottom) {
        if (atBottom) {
            this.setState({scrollType: PostsView.SCROLL_TYPE_BOTTOM});
        } else {
            this.setState({scrollType: PostsView.SCROLL_TYPE_FREE});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (Utils.areObjectsEqual(this.state, nextState)) {
            return false;
        }

        return true;
    }
    render() {
        const postLists = this.state.postLists;
        const channels = this.state.channels;
        const currentChannelId = channels[this.state.currentChannelIndex];
        const channel = ChannelStore.get(currentChannelId);

        const postListCtls = [];
        for (let i = 0; i < channels.length; i++) {
            const isActive = (channels[i] === currentChannelId);
            postListCtls.push(
                <PostsView
                    key={'postsviewkey' + i}
                    isActive={isActive}
                    postList={postLists[i]}
                    scrollType={this.state.scrollType}
                    scrollPostId={this.state.scrollPost}
                    postViewScrolled={this.handlePostsViewScroll}
                    loadMorePostsTopClicked={this.loadMorePostsTop}
                    loadMorePostsBottomClicked={this.loadMorePostsBottom}
                    showMoreMessagesTop={!this.state.atTop[this.state.currentChannelIndex]}
                    showMoreMessagesBottom={!this.state.atBottom[this.state.currentChannelIndex]}
                    introText={channel ? createChannelIntroMessage(channel, () => this.setState({showInviteModal: true})) : null}
                    messageSeparatorTime={this.state.currentLastViewed}
                />
            );
            if ((!postLists[i] || !channel) && isActive) {
                postListCtls.push(
                    <LoadingScreen
                        position='absolute'
                        key='loading'
                    />
                );
            }
        }

        return (
            <div id='post-list'>
                {postListCtls}
                <ChannelInviteModal
                    show={this.state.showInviteModal}
                    onModalDismissed={() => this.setState({showInviteModal: false})}
                />
            </div>
        );
    }
}
