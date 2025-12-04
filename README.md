# Election Verification Site (EVS)

This is a JS client, dedicated to display events from the DBB and track and validate votes.

See also the DEV-GUIDELINES.md file for more details about the application structure.

## Production

To build the application for production, run the following command:

```bash
yarn build
```

Then serve the resulting `dist` folder in a static file server such as NGINX.

## Environment

To configure the client before building it, you can set the following environment variables:

| Name | Default | Description | 
| ---- | ------- | ----------- |
| VITE_LOGO_URL | https://bit.ly/3Ft20ez | Fully qualified URL of your logo. |
| VITE_DBB_URL | http://dbb:3003 | Fully qualified URL to the Digital Ballot Box. |
| VITE_CONFERENCE_URL | http://conference:3016 | Fully qualified URL to the Conference Service. |
| VITE_CONTACT_URL | http://google.com | Fully qualified URL to the contact page. |
