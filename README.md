# Activity Management System v1.0

Author: *[Obet Palmares](https://github.com/devulogi)*

---

### INTRODUCTION

This is a simple activity management system that let users create, edit, and delete activities and
activity types, manage activity timeslots, users, and generate reports based on the activity. Additionally, users are
able to register for activities and view the status of their registration.

This web application is built using the [Express](https://expressjs.com/) framework for Node.js and
the [MongoDB](https://www.mongodb.com/) database.

### FUNCTIONALITIES:

#### 1. USER MANAGEMENT

- [x] User registration with roles (admin, user, participant)
- [x] Login & Logout
- [ ] View all users
- [ ] View all admins
- [ ] View all non-admins
- [ ] View all users that are not admins
- [ ] View all users that are admins
- [ ] View all users that are not banned
- [ ] View all users that are banned
- [ ] Ban a user
- [ ] Unban a user
- [ ] Promote a user to admin
- [ ] Demote an admin to user

#### 2. ACTIVITY MANAGEMENT

- [ ] Create a new activity
- [ ] Edit an existing activity
- [ ] Delete an existing activity
- [ ] Register for an activity
- [ ] View registration status
- [ ] View all activities

#### 3. MANAGE ACTIVITY TYPES

- [ ] Create a new activity type
- [ ] Edit an existing activity type
- [ ] Delete an existing activity type
- [ ] View all activity types

#### 3. MANAGE ACTIVITY ATTENDANCE

- [ ] View all participants of an activity
- [ ] View all participants of an activity that are not banned
- [ ] View all participants of an activity that are banned
- [ ] Ban a participant of an activity
- [ ] Unban a participant of an activity

### COMMIT GUIDELINES

> Commit message lines will be cropped at 100 characters.

- **feat**: *A new feature.*
- **fix**: *A bug fix.*
- **docs**: *Documentation only changes.*
- **style**: *Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).*
- **refactor**: *A code change that neither fixes a bug nor adds a feature.*
- **perf**: *A code change that improves performance.*
- **test**: *Adding missing tests.*
- **chore**: *Changes to the build process or auxiliary tools and libraries such as documentation generation.*
- **revert**: *Reverts a previous commit.*

Example:

```bash
git commit -m "feat: add new feature"
```
