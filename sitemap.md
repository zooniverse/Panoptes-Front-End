# Zooniverse sitemap

This is going to be a fairly detailed outline of what appears on which page of the site. I may have taken some liberties with how I expect some features to work. Open issues if you disagree, or just push your changes and see if anybody complains.

API requests' URLs are in `code` style. Client-facing, in-browser URLS are **bold**. Comments are in block quotes.

API URLs are currently idealized. Whatever works.

***

## Non-page components

### Site Header

Main navigation: "Home" (logo), "Projects", "Discussion", "About"

Requests `/me`, or whatever the route is to check current login.

* If no user is signed in, show "Sign in" and "Register" buttons to open the sign-in dialog.

* Unread messages count. Includes private messages and replied in threads you're watching. Polls/subscribes to `/messages?involved={current_user.login}&state=unread`. Links to **/messages**.

  Current user info (login, avatar). Links to **/settings**

  "Classify with {group.name}" Menu to show and change association to a group when classifying.

  > Checking for a logged-in user probably happens at a higher level; this'd just be the first place it's used.

### Sign-in dialog

Two tabs: "Register" and "Sign in"

Register with login, password, confirmed password, real name, agreement to privacy policy, consent to inform about new projects.

Sign in with login, password.

Third-party sign-in is off to the side, always present.

### Real-time notification area

Annoying little toaster-style things will pop up in the top-right corner when something happens. Maybe the unimportant ones dismiss themselves automatically. They're not persisted anywhere. This is probably where the inter-classification-interruptions happen.

E.x. "This project just got a bunch of data, we need your help!" or "We're going down for maintenance in one hour."

This probably polls/subscribes to something like `/notifications` for global notifications. Other notifications are triggered by user actions.

### Site footer

Social media links, privacy policy, contact link etc.

Change translation menu

***

## Home page

### /

The home page! Explain citizen science, what we do, why we do it, how you can help.

* ### /activity

  Recent activity timeline. Requests `/timeline_events`. Not sure how this list should be defined. Maybe things that involve more than a handful of people are added? New project launches, multi-comment discussions, etc.

  Signed-in users get more relevant info and a line showing where they last signed in so they'll know what's new. Probably dim everything after the "last sign in" point. Request becomes `/timeline_events?user={current_user.login}`.

> There are other static content pages I won't get into here. "About", "Education", "Publications", etc.

## Zooniverse-wide discussion

### /talk

List non-project-specific talk boards. Requests `/talk_boards`.

* ### /talk/:board_name

  List the threads on a board. Sticky ones on top. Requests `/talk_threads?board={board_name}`.

* ### /talk/:board_name/:thread_id

  List the posts in a thread. Requests `/talk_posts?thread={thread_id}`.

  * ### /talk/:board_name/:thread_id#post_id

    Jump straight to a post.

## Private messages

### /messages

A list of private conversations with other users, sorted newest-first. Requests `/messages?involved={current_user.login}&sort=newest`. Conversations with unread messages are highlighted somehow. Each is linked to `/users/:login/talk#{message_id}`, where private conversations take place.

***

## Current user's account settings

### /settings

General account settings (avatar, change password)

More tabs (down the side):

* ### /settings/profile

  Public profile information (real name, location, bio)

* ### /settings/projects

  List projects do you have special roles on

* ### /settings/groups

  List the groups you belong to

* ### /settings/notifications

  Email/notification settings for watched projects and Talk threads

## User profiles and private messages

### /users

List user currently online. Requests `/users?last_activity=600`, if we want a list of users who've done something in the past ten minutes. Link to their profiles.

Maybe there's some content here that's updated periodically: interviews, user-written articles?

### /users/:login

A user's profile. Requests `/users?login={user.login}`

More tabs (horizontally):

* ### /users/:login/collections

  A list of the user's favorites/collections. Requests `/collections?owner={user.login}`

* ### /users/:login/projects

  Any projects a user has a role in. Requests `/projects?team_includes={user.login}`

* ### /users/:login/talk

  Private messaging lives here. Requests `/messages?involved={current_user.login}+{user.login}`

## Group profiles

### /groups

### /groups/:name

***

## Project listings

### /projects

A list of "promoted" projects. Requests `/projects?state=promoted`

A list of categories for people who want to browse.

* ### /projects/:category

  A list of projects in a category. Requests `/projects?category={category}`. Maybe promoted projects are in a section at the top.

  Categories might be astronomy, biology, history, etc.

## An individual project

> I don't particularly like the slash between the owner and project, it doesn't mesh with the rest of the URL. Maybe we can try a colon?

### /projects/:owner_name/:project_name

Requests `/projects?owner={owner_name}&name={project_name}`. A high-level introduction to a project is on the first tab.

More tabs:

* ### /projects/:owner_name/:project_name/science

  A more detailed science case.

* ### /projects/:owner_name/:project_name/status

  Details about the project.

* ### /projects/:owner_name/:project_name/team

  List the user or group members that created the project as well as any moderators/privledged users.

* ### /projects/:owner_name/:project_name/classify

  The classification interface

  * ### /projects/:owner_name/:project_name/classify/:subject_id

    Classify a specific subject.This is probably only available to expert classifiers to create gold standard data.

## Project discussion

### /projects/:owner_name/:project_name/talk

List of recent/featured discussions on the project and its subjects

* ### /projects/:owner_name/:project_name/talk/:board_name

  List of threads on a board. Pinned threads on top.

* ### /projects/:owner_name/:project_name/talk/:board_name/:thread_id

  List of posts in a thread

  * ### /projects/:owner_name/:project_name/talk/:board_name/:thread_id#post_id

    For linking directly to a post.

## Subject page

### /projects/:owner_name/:project_name/subjects/:subject_id

Display the subject image(s) and list any available metadata (with a world/sky map if there are coordinates), users' short-ish comments on it, any other posts that reference it, and any user collections it appears in. Requests `/subjects/subject_id`.

Subjects are scoped to projects, so though a subject might exist twice in the system, the comments shown will be specific to the project. If there are other projects using the same subject, we should link to those here too.

## Collection page

### /collections/:user_login/:collection_name

View a set of subjects gallery-style, each linking to the collection-framed subject info page.

### /collections/:user_login/:collection_name/:subject_id

View a subject info in the context of a collection. This is probably exactly the same as the subject info page, but framed within a list with next/previous navigation. Think Flickr.

## Project building

### /my-projects

### /my-data
