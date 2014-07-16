# Zooniverse sitemap

_This is going to be a fairly detailed outline of what appears on which page of the site. I may have taken some liberties with how I expect some features to work. Open issues if you disagree, or just push your changes and see if anybody complains._

_The header/bullet levels of this file are confusing. Don't worry about keeping it terribly consistent._

## Non-page components

### Site Header

Main navigation: "Home" (logo), "Projects", "Discussion", "About"

If no user is signed in, show "Sign in" and "Register" buttons to open the sign-in dialog.

Unread messages count. Includes private messages and replied in threads you're watching.

Current user info (login, avatar, current group if they're classifying as part of a group

### Sign-in dialog

Two tabs: "Register" and "Sign in"

Register with login, password, confirmed password, real name, agreement to privacy policy, consent to inform about new projects

Sign in with login, password or third-party account

### Real-time notification area

Annoying little toaster-style things will pop up in the top-right corner when something happens. Maybe the unimportant ones dismiss themselves automatically. They're not persisted anywhere. This is probably where the inter-classification-interruptions happen.

E.x. "This project just got a bunch of data, we need your help!" or "We're going down for maintenance in one hour."

### Site footer

Social media links, privacy policy, contact link etc.

Change translation menu

## Home page

### /

The home page! Explain citizen science, what we do, why we do it, how you can help.

* ### /activity

  Recent activity timeline

  Signed-in users get more relevant info and a line showing where they last signed in so they'll know what's new. Probably dim everything after the "last sign in" point.

## Zooniverse-wide discussion

### /talk

* ### /talk/:board_name

* ### /talk/:board_name/:thread_name

  * #### /talk/:board_name/:thread_name#comment_id

## User account settings

### /settings

General account settings (avatar, change password)

More tabs (down the side):

* #### /settings/profile

  Public profile information (real name, location, bio)

* #### /settings/projects

  List projects do you have special roles on

* #### /settings/notifications

  Email/notification settings for watched projects and Talk threads

## User profiles

### /users

List of recently active/new/interesting users

List "Online now"

### /users/:login

A user's profile

More tabs (horizontally):

* #### /users/:login/collections

  A list of the user's favorites/collections

* #### /users/:login/projects

  Any projects a user has a role in

* #### /users/:login/talk

  Private messaging lives here.

## Group Profiles

### /groups

### /groups/:name

## Project listings

### /projects

A list of "promoted" projects.

A list of categories for people who want to browse.

* ### /projects/:category

  A list of projects in a category. Maybe promoted projects are in a section at the top.

  Categories might be astronomy, biology, history, etc.

* ### /project/:category?sort=:sort_param

    Sorts might be be newest, oldest, popular, struggling...

## An individual project

_I don't particularly like the slash between the owner and project, it doesn't mesh with the rest of the URL. Maybe we can try a colon?_

### /projects/:owner_name/:project_name

A high-level introduction to a project is on the first tab.

More tabs:

* #### /projects/:owner_name/:project_name/science

  A more detailed science case.

* #### /projects/:owner_name/:project_name/status

  Details about the project.

* #### /projects/:owner_name/:project_name/team

  List the user or group members that created the project as well as any moderators/privledged users.

* #### /projects/:owner_name/:project_name/classify

  The classification interface

  * #### /projects/:owner_name/:project_name/classify/:subject_id

    Classify a specific subject.This is probably only available to expert classifiers to create gold standard data.

## Project discussion

### /projects/:owner_name/:project_name/talk

List of recent/featured discussions on the project and its subjects

* ### /projects/:owner_name/:project_name/talk/:board_name

  List of threads on a board. Pinned threads on top.

* ### /projects/:owner_name/:project_name/talk/:board_name/:thread_name

  List of posts in a thread

  * #### /projects/:owner_name/:project_name/talk/:board_name/:thread_name#comment_id

    For linking directly to a comment.

## Subject info page

### /projects/:owner_name/:project_name/subjects/:subject_id

Display the subject image(s) and list any available metadata (world/sky map?), users' short-ish comments on it, any other posts that reference it, and any user collections it appears in.

Maybe include a "Reference in discussions as 50B4D455" note?

## Project building

### /my-projects

### /my-data
