# CUSTOM FORMS (React + Typescript + Vite + Redux)

## Project Purpose

Since Google Forms could not meet specific requirements, this customized form platform was developed. It not only offers various question types but also allows users to design and fill out forms flexibly. More importantly, users can complete forms without needing a Google account. This platform aims to provide more options and help manage requirements more precisely.

## Target Users

- For users who have a need for customized forms

## Demo & Related Links

- For project demo, please visit [here](https://customform-frontend.vercel.app/)

- For backend introduction, please visit [here](https://github.com/tonia83731/customform-backend)

- For backend API documents, please visit [here](https://github.com/tonia83731/customform-backend-docs/tree/main)

## User Stories

**USERS** (Required to Login)

- User could browse forms they own
- User can add, update or delete forms
- When entering a form, users could choose whether to include Sections and can assign different titles and descriptions to each Section
- When entering a form, user can add, update or delete questions. User could apply additional settings based on question type
- When a form include 1 or more questions, users could preview the form
- When a form include 1 or more questions, users could published the form
- After the form is published, the form will received a link: Users could view all reply data and export all to excel

**PUBLICS**

- The public could view a published form and filled in all question type
- The public could share form through copy link or from different social media

## Project Roles

- Full stack developer: Provide API based on the requirements and visualized the result by developing an app

## Challenges

- Problems: The Preview page and Response page share the same component. How can we distinguish between the two pages (including API calls and special object displays)?
  - Solution: Use the mode prop to determine the difference between the pages and consider the following conditions:
    1. The Preview page is a protected route, meaning only logged-in users can view it. Therefore, users without permission to view the form should not be able to access it.
    2. The Response page needs to check if the form is published. If it is not published, a prompt message will appear, guiding the user to the appropriate page.

## Tools

- react @18.3.1
- react-router @7.1.5
- react-redux @9.2.0
- react-datepicker @8.0.0
- react-export-table-to-excel @1.0.6
- react-icons @5.4.0
- react-select @5.10.0
- react-share @5.2.0
- dayjs @1.11.13
- axios @1.7.9
- tailwindcss @4.0.3
- typescript @5.6.2
- eslint @9.17.0

## Further Development

- Add more customized options, include images, color selections, fonts, etc.
- Add more question type:
  - Consider Slider questions, drag/drop questions
  - Consider File upload questions
- Create Setting sections for each form:
  - Provide payment gateways (link or api)
  - Provide Email notifications when someone submit the response
  - Allowed user to set form visibility duration, e.g. the form is visible for 3 days and will automatically close afterward
- Data-driven Form Content: Visualize and output the data based on user responses
- Auto Save Form: Enable auto-saving so users can continue filling out the form from where they left off upon returning

## Project Setup

```sh
git clone https://github.com/tonia83731/customform-frontend.git
```

```sh
npm install
```

```sh
npm run dev
```
