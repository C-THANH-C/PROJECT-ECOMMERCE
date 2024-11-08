-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'store', 'user');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('processing', 'in_delivery', 'delivered', 'received', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_role" "Roles" NOT NULL DEFAULT 'user',
    "full_name" VARCHAR(255),
    "user_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_info" (
    "user_id" INTEGER NOT NULL,
    "user_image" TEXT[],
    "user_title" VARCHAR(255),
    "user_description" TEXT,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "user_info_pkey" PRIMARY KEY ("user_id","address_id")
);

-- CreateTable
CREATE TABLE "address" (
    "address_id" SERIAL NOT NULL,
    "country" VARCHAR(255),
    "city" VARCHAR(255),
    "province" VARCHAR(255),
    "district" VARCHAR(255),
    "wards" VARCHAR(255),
    "full_address" VARCHAR(255),

    CONSTRAINT "address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "store" (
    "store_id" SERIAL NOT NULL,
    "store_name" VARCHAR(255) NOT NULL,
    "store_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "store_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "store_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "store_info" (
    "store_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "store_image" TEXT[],
    "store_star" INTEGER,
    "store_delivery" JSONB,

    CONSTRAINT "store_info_pkey" PRIMARY KEY ("store_id","address_id")
);

-- CreateTable
CREATE TABLE "store_category" (
    "store_category_id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,
    "category_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_category_pkey" PRIMARY KEY ("store_category_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,
    "category_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" SERIAL NOT NULL,
    "store_category_id" INTEGER,
    "category_id" INTEGER,
    "product_name" VARCHAR(255) NOT NULL,
    "product_price" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_image" TEXT[],
    "product_attribute" JSONB,
    "product_description" TEXT,
    "product_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cart_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "item_price" INTEGER NOT NULL,
    "item_quantity" INTEGER NOT NULL,
    "item_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "item_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("cart_id","product_id")
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_status" "status" NOT NULL DEFAULT 'processing',
    "order_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "shipping" (
    "ship_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "address_id" INTEGER NOT NULL,
    "ship_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipping_pkey" PRIMARY KEY ("ship_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "comment_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "comment_list" (
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "comment_create" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_list_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "chat" (
    "chat_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "chat_create" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "store_store_name_key" ON "store"("store_name");

-- CreateIndex
CREATE UNIQUE INDEX "store_category_category_name_key" ON "store_category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "category_category_name_key" ON "category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "product_product_name_key" ON "product"("product_name");

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("address_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store_info" ADD CONSTRAINT "store_info_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("store_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store_info" ADD CONSTRAINT "store_info_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("address_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store_category" ADD CONSTRAINT "store_category_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("store_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_category_id_fkey" FOREIGN KEY ("store_category_id") REFERENCES "store_category"("store_category_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("address_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_list" ADD CONSTRAINT "comment_list_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("comment_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_list" ADD CONSTRAINT "comment_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_list" ADD CONSTRAINT "comment_list_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
