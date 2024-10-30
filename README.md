
# 📎 LinkBin: Self-hosted URL Shortener and Pastebin

Welcome to **LinkBin**! This project provides a self-hosted solution for managing shortened URLs and a pastebin for sharing text snippets. Built with Next.js and NextUI, LinkBin is designed for users who value privacy and control over their data by hosting their own URL shortening and pastebin services.

---

## 🌟 Features

- 🔗 **URL Shortening**: Easily shorten long URLs and share them.
- 📄 **Pastebin**: Save and share text snippets with ease.
- 🛡️ **Self-hosting**: Full control over data privacy and configuration.
- 💻 **Responsive UI**: Built with NextUI, offering a seamless and aesthetic experience across devices.

---

## 📑 Table of Contents

1. [⚙️ Technologies Used](#technologies-used)
2. [📁 Project Structure](#project-structure)
3. [🚀 Installation](#installation)
4. [🔧 Configuration](#configuration)
5. [📖 Usage](#usage)
6. [📌 API Endpoints](#api-endpoints)
7. [🧪 Testing](#testing)
8. [🐳 Docker Support](#docker-support)

---

## ⚙️ Technologies Used

LinkBin leverages the following technologies:

- **Next.js** - Framework for server-rendered React applications.
- **NextUI** - UI components for a clean, responsive design.
- **Prisma** - Database ORM for seamless interactions with the backend.
- **Jest** - Testing framework for comprehensive test coverage.
- **Docker** - Containerized deployment for easy setup and scaling.
- **Tailwind CSS** - Utility-first CSS framework for styling.

---

## 📁 Project Structure

- **pages/**: Contains all route pages and endpoints.
- **components/**: Houses reusable components like forms and UI elements.
- **tests/**: All Jest tests for the application, including unit and integration tests.
- **Dockerfile**: Instructions to build the Docker image.
- **docker-compose.yml**: Configuration to deploy the project with Docker Compose.

---

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AlexArtaud-Dev/LinkBin.git
   cd LinkBin
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables** (see [🔧 Configuration](#configuration)).

4. **Run the application**:

   ```bash
   npm run dev
   ```

---

## 🔧 Configuration

Create a `.env` file at the project root with the following environment variables:

```plaintext
DATABASE_URL=<Your Database URL>
PURGE_PERIOD=<Any number of days>
CLEANER_API_KEY=<Any secret key>
```

Adjust the values to suit your setup. This file ensures that sensitive data is not hard-coded into the project.

---

## 📖 Usage

After starting the server, navigate to `http://localhost:3000` to access LinkBin. Here’s a breakdown of main pages:

- **Home Page**: Overview and access to the main features.
- **URL Shortener**: Enter a URL to generate a shortened link.
- **Pastebin**: Input and save text snippets.

---

## 📌 API Endpoints

LinkBin provides a REST API for interacting with the application programmatically:

- **POST /api/shorten**: Creates a shortened URL.
- **POST /api/paste**: Saves a text snippet in the pastebin.

---

## 🧪 Testing

LinkBin includes comprehensive tests using Jest. To run the tests, use:

```bash
npm run test
```

This covers unit and integration tests, including `shorten.test.ts` and `paste.test.ts` files for URL and pastebin functionalities.

---

## ⚙️ Production Testing

LinkBin includes a command to execute in order :
* Lint `npm run lint`
* Test `npm run test`
* Build `npm run build`
* Start `npm run start`

This command is the following :

```bash
npm run production
```

This allows you to test the application in production mode before deploying it.

---

## 🐳 Docker Support

LinkBin can be containerized for easy deployment:

1. **Build the Docker image**:

   ```bash
   docker build -t linkbin .
   ```

2. **Run Docker Compose**:

   ```bash
   docker-compose up
   ```

Docker Compose will start the application along with any dependencies defined in `docker-compose.yml`.

---

## 🐳 Self-hosting

`docker-compose.yml`

```yaml
version: '3.8'

services:
  app:
    container_name: app
    image: izoniks/linkbin:latest
    ports:
      - '3232:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:postgres@db:5432/linkbindb?schema=public
      PURGE_PERIOD: 30
      CLEANER_API_KEY: <Any secret key>
      CLEANER_API_URL: http://localhost:3000/api/jobs/cleaner
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14
    container_name: db
    # ports: Uncomment this line if you want to expose the database to the host machine
    #   - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: linkbindb
    volumes:
      - db_data_prod:/var/lib/postgresql/data
    restart: unless-stopped

  # Cleaner service to remove expired links, without this service expired links will not be removed
  cleaner:
    container_name: cleaner
    image: izoniks/linkbin-cleaner:latest
    environment:
      CLEANER_API_URL: http://app:3000/api/jobs/cleaner
      CLEANER_API_KEY: <Any secret key (same as app)>
    depends_on:
      - db
      - app
    restart: unless-stopped

volumes:
  db_data_prod:
```



## 📄 License

LinkBin is open-source and available under the [MIT License](LICENSE).
