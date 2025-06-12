
# Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It includes a full-stack authentication system with user signup, login, and password validation.

## Project Overview

This project demonstrates how to build a modern web application using Next.js, MongoDB, and React. It includes the following features:

- **Users Authentication**: Signup and login functionality with password hashing.
- **Form Validation**: Real-time validation for email, password, and username fields.
- **Toast Notifications**: Success and error messages using `react-hot-toast`.
- **GSAP Animations**: Smooth cursor animations using GSAP.
- **Responsive Design**: A clean and modern UI built with Tailwind CSS.

---

# Project Preview
 [AdvoKey](https://advo-key.vercel.app/) - A full-stack authentication system with user signup, login, and password validation.

## Features

- **Users Signup**:
  - Users can create an account by providing a username, email, and password.
  - Passwords are hashed using `bcryptjs` for security.
  - Real-time validation ensures strong passwords and valid email addresses.

- **Users Login**:
  - Users can log in with their email and password.
  - Invalid credentials are handled gracefully with error messages.

- **Toast Notifications**:
  - Success and error messages are displayed using `react-hot-toast`.

- **GSAP Animations**:
  - A custom animated cursor effect is implemented using GSAP.

- **Responsive Design**:
  - The UI is built with Tailwind CSS and is fully responsive.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add your MongoDB connection string:
     ```plaintext
     mongo_url=mongodb+srv://username:password@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Usage

### **Signup**
1. Navigate to the **Signup** page.
2. Enter your username, email, and password.
3. Click **Signup** to create an account.

### **Login**
1. Navigate to the **Login** page.
2. Enter your email and password.
3. Click **Login** to access your account.

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `mongo_url`: Your MongoDB connection string.
  Example:
  ```plaintext
  mongo_url=mongodb+srv://username:password@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
  ```

---

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### **Steps to Deploy**:
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account.
3. Click **New Project** and select your repository.
4. Add your environment variables in the Vercel dashboard.
5. Click **Deploy**.

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
