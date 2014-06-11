Dialogs
=======

Hash        | Description
----------- | -----------
`#/sign-up` | Register a new account (user name, real name, password, "tell me about betas")
`#/sign-in` | Log in to your account (user name and password or other auth)

User account
============

Path                          | Description
----------------------------- | -----------
`/my/account`                 | General account settings (avatar, real name, change password)
`/my/account/#/profile`       | Public profile information (location, bio)
`/my/account/#/roles`         | List projects do you have special roles on
`/my/account/#/notifications` | Email/notification settings for watched projects and Talk threads

Group accounts
==============

Path                       | Description
-------------------------- | -----------
`/my/groups/#/create`      | Create a new group (group name, location)
`/my/groups`               | List groups you're a member of
`/my/groups/#/:group_name` | Edit a group (profile info, members); list projects, collections, subjects

Data
====

Path                               | Description
---------------------------------- | -----------
`/my/projects`                     | List of projects you own
`/my/projects/#/:project_id`       | Edit details about a project
`/my/collections`                  | List of collections you own
`/my/collections/#/:collection_id` | Collection details, list of subjects in a collection
`/my/subjects`                     | List of subjects you own (by collection, and leftovers by date?)
`/my/subjects/#/:subject_id`       | Edit details about a subject

Public user or group profiles
=============================

Path                                 | Description
------------------------------------ | -----------
`/people/#/:person_name`             | User or group profile
`/people/#/:person_name/projects`    | List a user's or group's projects
`/people/#/:person_name/collections` | List a user's collections
`/people/#/:person_name/activity`    | List a user's recent activity on Talk

Projects
========

Path                          | Description
----------------------------- | -----------
`/projects`                   | List of featured projects
`/projects/#/all`             | List of all projects
`/projects/#/:tag`            | List of projects by tag (category, beta-state, etc.)
`/projects/#/:owner/:project` | Do a project. NOTE: This is probably too much for the same page.

Talk
====

Path                                     | Description
---------------------------------------- | -----------
`/talk`                                  | List of a general talk boards
`/talk/:board`                           | List of threads in a board
`/talk/:board/:thread`                   | List of posts in a thread
`/talk/#/:owner/:project`                | List of a project's talk boards
`/talk/#/:owner/:project/:board`         | List of threads in a board
`/talk/#/:owner/:project/:board/:thread` | List of posts in a thread
