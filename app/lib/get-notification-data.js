import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

function commentData(notification) {
  return talkClient.type('comments').get(notification.source_id).then((comment) => {
    return { notification, data: { comment } };
  });
}

function requestData(notification) {
  return apiClient.type('projects').get(notification.project_id).then((project) => {
    return { notification, data: { projectName: project.display_name } };
  });
}

function messageData(notification) {
  return talkClient.type('messages').get(notification.source_id, { include: 'conversation' }).then((message) => {
    return apiClient.type('users').get(message.user_id).then((messageUser) => {
      return message.get('conversation').then((conversation) => {
        return { notification, data: { message, conversation, messageUser } };
      });
    });
  });
}

function moderationData(notification) {
  return talkClient.type('moderations').get(notification.source_id).then((moderation) => {
    const comment = moderation.target || moderation.destroyed_target;
    const promises = moderation.reports.map((report) => {
      return apiClient.type('users').get(report.user_id.toString(), { }).then((user) => {
        report.user = user;
        return report;
      });
    });
    return apiClient.type('users').get(comment.user_id.toString()).then((commentUser) => {
      return Promise.all(promises).then((reports) => {
        return { notification, data: { moderation, comment, commentUser, reports } };
      });
    });
  });
}

function discussionData(notification) {
  return talkClient.type('discussions').get(notification.source_id).then((discussion) => {
    return talkClient.type('comments').get({ discussion_id: discussion.id, sort: 'created_at', page_size: 1 }).then(([comment]) => {
      return { notification, data: { discussion, comment } };
    });
  });
}

function getNotificationData(notifications) {
  const lookup = {
    Comment: commentData,
    DataRequest: requestData,
    Message: messageData,
    Moderation: moderationData,
    Discussion: discussionData,
  };
  const notificationData = notifications.map((notification) => {
    return lookup[notification.source_type].call(undefined, notification);
  });

  return Promise.all(notificationData);
}

export default getNotificationData;
