# PROJECT ECOMMERCE 

Dự án tạo ra website thương mại điện tử với frontend được xây dựng bằng Next.js và backend được xây dựng bằng chủ đạo dùng NestJS ngoài ra có node js, express. Backend được chia thành các microservice để nâng cao khả năng mở rộng và dễ bảo trì.

## TÍNH NĂNG

- Xác thực và phân quyền người dùng
- Liệt kê và quản lý sản phẩm
- Giỏ hàng và quản lý đơn hàng
- Kiến trúc microservice để mở rộng



## CÔNG NGHỆ

**Client:** 
- Next.js
- Tailwind CSS
- Axios

**Server:** 
- NestJS
- PostgreSQL
- Prisma ORM
- Microservice với RabbitMQ
- Swagger để tài liệu API
- Redis cache
- Elasticsearch

## YÊU CẦU
 - Phiên bản node > 20
 - Trình cài đặt yarn
 - Docker: postgre, RabbitMQ, Redis, Elasticsearch

## CÀI ĐẶT DEPENDENCIES

Install server with nest js

```bash
  yarn nest new my-project
  cd my-project
```
Install prisma
```bash
  yarn add prisma @prisma/client

```

## Mô HÌNH ERD
- file [ecommerce.drawio](ecommerce.drawio.xml)

## TIẾN TRÌNH
1. Tạo database
- Prisma migrate
```bash
  yarn prisma init
```
- Sửa file .env
- Cập nhật file schema.prisma: tạo model users, product, store,....
- Dùng lệnh
```bash
  npx prisma migrate dev --name new_database_postgres
```

    