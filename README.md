# 💬 Real-Time Chat Application

A modern, full-stack chat application built with Spring Boot and Angular, featuring real-time messaging, JWT authentication, and a responsive user interface.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based signup and login
- 🏠 **Room Management** - Create and join chat rooms
- ⚡ **Real-Time Messaging** - WebSocket-powered instant communication
- 🔍 **Room Search** - Find and join existing rooms
- 📱 **Responsive Design** - Works seamlessly across devices
- 🔔 **Toast Notifications** - User-friendly success/error messages
- ⏰ **Message Timestamps** - Formatted date and time display

## 🏗️ Architecture

### Backend
- **Framework**: Spring Boot 3.x
- **Location**: `Backend/ChatDemo/`
- **Key Technologies**:
  - Spring Security (JWT authentication)
  - Spring WebSocket (real-time messaging)
  - Spring Data JPA (database persistence)
  - Maven (dependency management)

### Frontend
- **Framework**: Angular 19+
- **Location**: `Frontend/chatroomClient/`
- **Key Technologies**:
  - Angular Router & Services
  - SweetAlert2 (notifications)
  - WebSocket client
  - Tailwind CSS (styling)

## 🛠️ Prerequisites

### Backend Requirements
- ☕ Java 17 or higher
- 📦 Maven 3.6+
- 🗄️ Database (MySQL, PostgreSQL, or H2)

### Frontend Requirements
- 🟢 Node.js 16+
- 📋 Angular CLI 19+

### General Requirements
- 🌐 Git
- 🔍 Modern web browser

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup

#### Configure Database
```bash
cd Backend/ChatDemo
cp src/main/resources/application.example.properties src/main/resources/application.properties
```

Update `application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/chatdb
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=your-secure-secret-key
```

#### Build and Run
```bash
mvn clean install
mvn spring-boot:run
```
🌐 Backend runs on: `http://localhost:9090`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd Frontend/chatroomClient
npm install
```

#### Configure Environment
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9090'
};
```

#### Start Development Server
```bash
ng serve
```
🌐 Frontend runs on: `http://localhost:4200`

## 📖 Usage Guide

### Getting Started
1. 📝 **Sign Up** - Create your account at `/signup`
2. 🔑 **Log In** - Authenticate at `/login`
3. 🏠 **Home Page** - Access the main dashboard

### Chat Features
1. ➕ **Create Room** - Click "Create Room" button (`/room/create`)
2. 🔍 **Find Rooms** - Use the search bar to discover rooms
3. 💬 **Start Chatting** - Join rooms and send real-time messages
4. 🔔 **Notifications** - Receive toast alerts for actions

## 🗂️ Project Structure

```
📦 Project Root
├── 📁 Backend/ChatDemo/
│   ├── 📁 src/main/java/com/chat/     # Core application logic
│   ├── 📁 src/main/resources/         # Configuration files
│   └── 📄 pom.xml                     # Maven configuration
│
└── 📁 Frontend/chatroomClient/
    ├── 📁 src/app/                    # Angular components & services
    ├── 📁 src/environments/           # Environment configs
    ├── 📄 angular.json                # Angular configuration
    └── 📄 package.json                # NPM dependencies
```

## 🔧 Key Components

### Backend Components
- **Controllers**: Handle HTTP requests and WebSocket connections
- **Services**: Business logic and data processing
- **Entities**: Database models
- **Security**: JWT authentication and CORS configuration

### Frontend Components
- **Components**: UI elements and pages
- **Services**: API communication and WebSocket handling
- **Guards**: Route protection
- **Pipes**: Data transformation

## 🛠️ Troubleshooting

### Common Issues

#### CORS Problems
✅ **Solution**: Verify `CORSConfig.java` allows `http://localhost:4200`

#### WebSocket Connection Failed
✅ **Solution**: Check WebSocket endpoint accessibility (`ws://localhost:9090/chat`)

#### Database Connection Error
✅ **Solution**: Validate `application.properties` database settings

#### Angular Build Issues
✅ **Solution**: 
```bash
npm cache clean --force
npm install
```

## 🚀 Production Deployment

### Security Checklist
- [ ] Use secure JWT secret key
- [ ] Configure HTTPS
- [ ] Update CORS settings for production domain
- [ ] Set up proper database credentials
- [ ] Enable production mode in Angular

### Environment Configuration
Update production environment files with actual API URLs and secure configurations.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

## 📋 Development Roadmap

- [ ] Private messaging
- [ ] File sharing
- [ ] Message reactions
- [ ] User profiles
- [ ] Room moderation
- [ ] Mobile app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Having issues? Here are some resources:

- 📚 Check the [Troubleshooting](#-troubleshooting) section
- 🐛 Open an [Issue](../../issues) for bugs
- 💡 Start a [Discussion](../../discussions) for questions

---

<div align="center">
  <p>Made with ❤️ by the development team</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>