# Baton Rouge GA

This project is a web application built using React, Tailwind CSS, and Supabase for authentication. It serves as a platform for users to log in, sign up, and access personalized content.

## Features

- User authentication with Supabase
- Responsive design using Tailwind CSS
- Modular component structure

## Project Structure

```
batonrougega
├── src
│   ├── components
│   │   ├── Auth
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── Layout
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── common
│   │       └── Button.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   └── Dashboard.jsx
│   ├── hooks
│   │   └── useAuth.js
│   ├── services
│   │   └── supabase.js
│   ├── styles
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public
│   └── vite.svg
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd batonrougega
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.

5. Start the development server:
   ```
   npm run dev
   ```

## Usage

- Navigate to the home page to view the landing content.
- Use the login and signup components to authenticate users.
- Access the dashboard after successful login to view user-specific information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.