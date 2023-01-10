import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

const STANDARD_ERROR = 'Sorry, this notification cannot be displayed.';

function commentData(notification) {
  return talkClient.type('comments').get(notification.source_id).then(comment => apiClient.type('users').get(comment.user_id).then(commentUser => ({ notification, data: { comment, commentUser }}))).catch(() => ({ error: STANDARD_ERROR }));
}

function requestData(notification) {
  return apiClient.type('projects').get(notification.project_id).then(project => ({ notification, data: { projectName: project.display_name }})).catch(() => ({ error: STANDARD_ERROR }));
}

function messageData(notification) {
  return talkClient.type('messages').get(notification.source_id, { include: 'conversation' }).then(message => apiClient.type('users').get(message.user_id).then(messageUser => message.get('conversation').then(conversation => ({ notification, data: { message, conversation, messageUser }})))).catch(() => ({ error: STANDARD_ERROR }));
}

function moderationData(notification) {
  return talkClient.type('moderations').get(notification.source_id).then((moderation) => {
    const comment = moderation.target || moderation.destroyed_target;
    const promises = moderation.reports.map(report => apiClient.type('users').get(report.user_id.toString(), { }).then((user) => {
        report.user = user; // eslint-disable-line
      return report;
    }));
    return apiClient.type('users').get(comment.user_id.toString()).then(commentUser => Promise.all(promises).then(reports => ({
      notification,
      data: {
        moderation, comment, commentUser, reports
      }
    })));
  }).catch(() => ({ error: STANDARD_ERROR }));
}

function discussionData(notification) {
  return talkClient.type('discussions').get(notification.source_id).then(discussion => talkClient.type('comments').get({ discussion_id: discussion.id, sort: 'created_at', page_size: 1 }).then(([comment]) => apiClient.type('users').get(comment.user_id).then(commentUser => ({ notification, data: { discussion, comment, commentUser }})))).catch(() => ({ error: STANDARD_ERROR }));
}

function getNotificationData(notifications) {
  const lookup = {
    Comment: commentData,
    DataRequest: requestData,
    Message: messageData,
    Moderation: moderationData,
    Discussion: discussionData
  };
  const notificationData = notifications.map(notification => lookup[notification.source_type].call(undefined, notification));

  return Promise.all(notificationData);
}

export default getNotificationData;
