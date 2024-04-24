<script setup>
import { ref, watchEffect } from 'vue';
import AuthorService from '@/services/publisher.service';
import { Dialog, DialogOverlay, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { message } from 'antd';

const products = ref([]);
const showModal = ref(false);
const confirmDeleteModal = ref(false);
const isEditing = ref(false);
const selectedProduct = ref(null);

watchEffect(async () => {
    const allProducts = await AuthorService.getAll();
    products.value = allProducts.data.map(product => ({
        id: product._id,
        name: product.name,
        address: product.address,
    }));
});

const openModal = (product) => {
    selectedProduct.value = { ...product };
    isEditing.value = true;
    showModal.value = true;
};

const openAddModal = () => {
    selectedProduct.value = { name: '', address: '' };
    isEditing.value = false;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const openConfirmDeleteModal = (product) => {
    selectedProduct.value = { ...product };
    confirmDeleteModal.value = true;
};

const closeConfirmDeleteModal = () => {
    confirmDeleteModal.value = false;
};

const saveProduct = async () => {
    if (isEditing.value) {
        const res = await AuthorService.update(selectedProduct.value.id, selectedProduct.value);
        console.log(res)
        if (res.isSuccess == true) {
            const allProducts = await AuthorService.getAll();
            products.value = allProducts.data.map(product => ({
                id: product._id,
                name: product.name,
                address: product.address,
            }));
            message.success(res.message)
            closeModal();
        } else {
            message.error(res.message)
        }
    } else {
        const res = await AuthorService.create(selectedProduct.value);
        console.log(res)
        if (res.document.isSuccess == true) {
            const allProducts = await AuthorService.getAll();
            products.value = allProducts.data.map(product => ({
                id: product._id,
                name: product.name,
                address: product.address,
            }));
            message.success(res.document.message)
            closeModal();
        } else {
            message.error(res.document.message)
        }
    }
    // Refresh the product list
};

const deleteProduct = async () => {
    await AuthorService.delete(selectedProduct.value.id);
    // Refresh the product list
    const allProducts = await AuthorService.getAll();
    products.value = allProducts.data.map(product => ({
        id: product._id,
        name: product.name,
        address: product.address,
    }));
    closeConfirmDeleteModal();
};
</script>

<!-- Add your template code here. Make sure to add the necessary buttons and modals to trigger the functions defined above. -->


<template>
    <div class="bg-white">
        <div class="mx-auto max-w-10xl px-4 py-16 sm:px-6 sm:py-6 lg:max-w-10xl lg:px-8">
            <div class="text-right mr-4">
                <button
                    class="group relative bg-transparent p-2 rounded-lg m-auto border-2 border-gray-500 w-15 h-15 ease-in-out duration-100"
                    @click="openAddModal"><i class="fa-solid fa-plus text-4xl text-gray-700 w-15 h-15"></i>
                </button>
            </div>
            <div class="mt-6 grid grid-cols-1 pl-auto gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-0 ">
                <div v-for="product in products" :key="product.id"
                    class="group relative w-11/12 mx-auto bg-gray-100 p-6 rounded-2xl border border-gray-300 shadow-gray-400 shadow-xl h-52">
                    <div class="mt-4 text-left">
                        <div>
                            <h3 class="text-sm text-gray-500 border-b-2 border-gray-400">
                                <span class="mt-1 text-lg font-semibold text-gray-900 italic">Tên tác giả: {{
                                    product.name }}</span>
                            </h3>
                            <p class="mt-4 text-l font-semibold text-gray-600 italic border-b-2 border-gray-300">
                                Quốc gia : {{ product.address }}</p>
                        </div>
                    </div>
                    <div class="flex justify-center mt-4 absolute bottom-2 inset-x-0 ">
                        <button class="p-3 mr-8" @click="openModal(product)"><i
                                class="fa-solid fa-pen text-2xl w-6"></i></button>
                        <button class="p-3 ml-8" @click="openConfirmDeleteModal(product)"><i
                                class="fa-solid fa-xmark text-2xl w-6"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Add/Edit Modal -->

    <TransitionRoot as="template" :show="showModal">
        <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeModal">
            <div class="flex items-center justify-center min-h-screen">
                <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95">
                    <DialogPanel class="bg-white rounded-lg p-6 max-w-md mx-auto z-10 w-96">
                        <form class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Tên tác giả</label>
                                <input id="name" type="text" v-model="selectedProduct.name"
                                    class="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2">
                            </div>
                            <div>
                                <label for="address" class="block text-sm font-medium text-gray-700">Quốc gia</label>
                                <input id="address" type="text" v-model="selectedProduct.address"
                                    class="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2">
                            </div>
                            <div class="flex justify-end space-x-2">
                                <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    @click="saveProduct">Lưu</button>
                                <button type="button" class="px-4 py-2 bg-gray-200 rounded-md"
                                    @click="closeModal">Hủy</button>
                            </div>
                        </form>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>

    <TransitionRoot as="template" :show="confirmDeleteModal">
        <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeConfirmDeleteModal">
            <div class="flex items-center justify-center min-h-screen">
                <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95">
                    <DialogPanel class="bg-white rounded-lg p-6 max-w-md mx-auto z-10">
                        <div class="space-y-4">
                            <h2 class="text-xl font-bold text-gray-900">Xác nhận xóa</h2>
                            <p>Bạn có chắc chắn muốn xóa tác giả này?</p>
                            <div class="flex justify-end space-x-2">
                                <button type="button" class="px-4 py-2 bg-red-600 text-white rounded-md"
                                    @click="deleteProduct">Xóa</button>
                                <button type="button" class="px-4 py-2 bg-gray-200 rounded-md"
                                    @click="closeConfirmDeleteModal">Hủy</button>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
