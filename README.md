# How to run

This project enables push notifications using the **Web Push API** with a **Node.js backend** and **PostgreSQL database**.

### **Installation & Setup**

1. Clone the Repository
```sh
git clone git@github.com:Keith-Web3/service-worker-demo.git && cd service-worker-demo
```
2. Set up the backend
```sh
cd backend && npm install
```
3. Generate VAPID Keys
```sh
npx web-push generate-vapid-keys
```
4. Add the generated public and private keys to your env file.
```env
SW_PUBLIC_KEY=<your_public_key>
SW_PRIVATE_KEY=<your_private_key>
```
5. Configure the database
```env
POSTGRES_URI=postgres://username:password@host:port/dbname
```
6. Start up the backend
```sh
npm run dev
```
