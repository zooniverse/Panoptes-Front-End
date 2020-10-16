# 1715 Labs PFE

This is a customised version of [zooniverse/Panoptes-Front-End](https://github.com/zooniverse/Panoptes-Front-End), designed to be used within an iFrame on a crowd provider platform like Clickworker or MTurk.

## Key differences between this and OG PFE

Not an exhaustive list, but the main points:

- There is a crowd manager class which detects which crowd provider it's running on, and hooks into the classification lifecycle to append the crowd provider's metadata (provided by query params to the iFrame), and submit a request to complete the task to the crowd provider.
- Session IDs are intentionally broken; Chrome has an issue with allowing scripts in iFrames to access `localStorage` in MTurk.
- The deploy process is now done through GitHub Actions, rather than run locally.
- Local config settings can be set with a `.env` file.
