// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

var AppDispatcher = require('../dispatcher/app_dispatcher.jsx');
var ChannelStore = require('../stores/channel_store.jsx');
var PostStore = require('../stores/post_store.jsx');
var Constants = require('../utils/constants.jsx');
var ActionTypes = Constants.ActionTypes;
var AsyncClient = require('../utils/async_client.jsx');
var Client = require('../utils/client.jsx');

export function emitChannelClickEvent(channel) {
    AsyncClient.getChannels();
    AsyncClient.getChannelExtraInfo();
    AsyncClient.updateLastViewedAt();
    AsyncClient.getPosts(channel.id);

    AppDispatcher.handleViewAction({
        type: ActionTypes.CLICK_CHANNEL,
        name: channel.name,
        id: channel.id
    });
}

export function emitPostFocusEvent(postId) {
    Client.getPostById(
        postId,
        (data) => {
            AppDispatcher.handleServerAction({
                type: ActionTypes.RECIEVED_FOCUSED_POST,
                postId,
                post_list: data
            });

            AsyncClient.getPostsBefore(postId, 0, Constants.POST_FOCUS_CONTEXT_RADIUS);
            AsyncClient.getPostsAfter(postId, 0, Constants.POST_FOCUS_CONTEXT_RADIUS);
        }
    );
}

export function emitLoadMorePostsTopEvent() {
    const currentChannelId = ChannelStore.getCurrentId();
    const earliestPostId = PostStore.getEarliestPost(currentChannelId).id;
    if (PostStore.requestVisibilityIncrease(currentChannelId, Constants.POST_CHUNK_SIZE)) {
        AsyncClient.getPostsBefore(earliestPostId, 0, Constants.POST_CHUNK_SIZE);
    }
}

export function emitLoadMorePostsBottomEvent() {
    const currentChannelId = ChannelStore.getCurrentId()
    const latestPostId = PostStore.getLatestPost(currentChannelId).id;
    AsyncClient.getPostsAfter(latestPostId, 0, Constants.POST_CHUNK_SIZE);
}

export function emitPostRecievedEvent(post) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.RECIEVED_POST,
        post
    });
}

export function emitUserPostedEvent(post) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.CREATE_POST,
        post
    });
}

export function emitPostDeletedEvent(post) {
    AppDispatcher.handleServerAction({
        type: ActionTypes.POST_DELETED,
        post
    });
}
