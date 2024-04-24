<script setup>
import TracksService from '@/services/tracks.service';
import { message } from 'antd';
import { ref, watchEffect } from 'vue';
const products = ref([]);
const now = ref(new Date());
const showModal = ref(false);
const selectedproduct = ref(null);

watchEffect(async () => {
    // Check if filters is not null before making the API call
    {
        const allProducts = await TracksService.getAll();
        products.value = allProducts.data.map(product => {
            const date = new Date(product.borroweddate);
            const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
            return {
                id: product._id,
                reader: product.reader,
                book: product.book,
                borroweddate: formattedDate
            }
        });
    }
});

const totalPay = (product) => {
    const borrowedDate = new Date(product.borroweddate);
    if (isNaN(borrowedDate)) {
        return 'Invalid date';
    }
    const diffTime = Math.abs(now.value.getTime() - borrowedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * product.book.price;
};

const openModal = (product) => {
    selectedproduct.value = product;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const confirmReturn = async () => {
    await returnBook(selectedproduct.value);
    closeModal();
};

const returnBook = async (product) => {
    try {
        const res = await TracksService.delete(product.id);
        if (res.document.isSuccess == true) {
            const allProducts = await TracksService.getAll();
            products.value = allProducts.data.map(product => {
                const date = new Date(product.borroweddate);
                const formattedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
                return {
                    id: product._id,
                    reader: product.reader,
                    book: product.book,
                    borroweddate: formattedDate
                }
            });
            message.success(res.document.message)
        }
        else {
            message.error(res.document.message)
        }
    } catch (error) {
        console.error('Failed to return the book:', error);
    }
};
</script>

<template>
    <div class="mt-12 mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <div class="mt-6 border-t border-gray-300">
            <ul role="list">
                <li v-for="product in products" :key="product._id"
                    class="flex flex-col gap-x-6 py-5 px-12 my-10 bg-gray-200 shadow-2xl rounded-xl">
                    <div class="flex justify-between mb-4">
                        <div class="flex min-w-0 gap-x-4 my-3">
                            <img class="h-full w-full max-w-32 flex-none bg-gray-50 rounded-xl"
                                :src="product.book.bookPicture" alt="" />
                            <div class="min-w-0 flex-auto">
                                <p class="text-lg font-semibold leading-6 text-gray-900 mt-3">{{ product.book.name }}
                                </p>
                                <p class="text-lg font-semibold leading-6 text-gray-500 mt-3">Tác giả: {{
                                    product.book.author.name }}</p>
                                <p class="text-lg font-semibold leading-6 text-gray-500 mt-3">Người mượn: {{
                                    product.reader.firstName }} {{
                                        product.reader.lastName }}</p>
                                <p class="text-lg font-semibold leading-6 text-gray-500 mt-3">Địa chỉ: {{
                                    product.reader.address }}</p>
                                    <p class="text-lg font-semibold leading-6 text-gray-500 mt-3">Số điện thoại: {{
                                    product.reader.phone }}</p>
                            </div>
                        </div>
                        <div class="shrink-0 sm:flex sm:flex-col sm:items-end my-3 hidden lg:flex">
                            <p class="text-lg font-semibold leading-6 text-gray-900 mt-3">{{ product.book.price }}
                                VNĐ/Ngày</p>
                            <p v-if="product.borroweddate" class="mt-1 text-md leading-5 text-gray-500">
                                Rent at: <time :datetime="product.borroweddate">{{ product.borroweddate }}</time>
                            </p>
                        </div>
                    </div>
                    <div class="border-t-2 border-gray-400 text-right">
                        <p v-if="product.borroweddate" class="mt-1 text-md leading-5 text-gray-500">
                            Total: {{ totalPay(product) }} VND
                        </p>
                        <button type="button"
                            class="mt-3 px-5 py-3 rounded-md border-black border-2 ease-in-out duration-300 hover:border-rose-600 hover:bg-red-300"
                            @click="openModal(product)">Trả
                            sách</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">
                                Trả Sách
                            </h3>
                            <div class="mt-2">
                                <p class="text-md text-gray-700">
                                    Bạn có chắc chắn muốn trả lại sách "{{ selectedproduct.book.name }}" không? Tổng số
                                    tiền cần phải thanh
                                    toán là {{
                                        totalPay(selectedproduct) }} VND.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" class="px-4 py-2 bg-red-600 text-white rounded-md"
                        @click="confirmReturn">Xóa</button>
                    <button type="button" class="px-4 py-2 bg-gray-200 rounded-md" @click="closeModal">Hủy</button>
                </div>
            </div>
        </div>
    </div>
</template>
