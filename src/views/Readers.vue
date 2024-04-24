<script setup>
import { ref, watchEffect } from 'vue';
import ReaderService from '@/services/reader.service';
import { Dialog, DialogOverlay, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
const products = ref([]);
const selectedProduct = ref(null);
const isModalOpen = ref(false);
const confirmDeleteModal = ref(false);

watchEffect(async () => {
  // Check if filters is not null before making the API call
  {
    const allProducts = await ReaderService.getAll();
    products.value = allProducts.data.map(product => ({
      id: product._id,
      username: product.username,
      firstName: product.firstName,
      lastName: product.lastName,
      gender: product.gender,
      dob: product.dob,
      address: product.address,
      phone: product.phone,
    }));
  }
});

function openConfirmDeleteModal(product) {
  selectedProduct.value = product;
  confirmDeleteModal.value = true;
}

function closeConfirmDeleteModal() {
  confirmDeleteModal.value = false;
}

const deleteProduct = async () => {
  await ReaderService.delete(selectedProduct.value.id);
  // Refresh the product list
  const allProducts = await ReaderService.getAll();
  products.value = allProducts.data.map(product => ({
    id: product._id,
    username: product.username,
    firstName: product.firstName,
    lastName: product.lastName,
    gender: product.gender,
    dob: product.dob,
    address: product.address,
    phone: product.phone,
  }));
  closeConfirmDeleteModal();
};
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-10xl px-4 py-16 sm:px-6 sm:py-6 lg:max-w-10xl lg:px-8">
      <div class="mt-6 grid grid-cols-1 pl-auto gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
        <div v-for="product in products" :key="product.id"
          class="group relative mx-auto bg-gray-200 p-6 rounded-lg border-2 border-gray-500">
          <div class="mt-4 text-left">
            <div>
              <h3 class="text-sm text-gray-500 text-center">
                <span class="mt-1 text-xl font-semibold border-b-2 border-black text-gray-900">{{ product.username
                  }}</span>
              </h3>
              <p class="mt-6 text-base text-gray-700 border-b-2 border-gray-300">Họ và Tên: {{ product.firstName }} {{
                product.lastName }}</p>
              <p class="mt-1 text-l font-semibold text-gray-900 italic border-b-2 border-gray-300">Giới tính: {{
                product.gender }}</p>
              <p class="mt-1 text-base text-gray-70 border-b-2 border-gray-300">Địa chỉ: {{ product.address }}</p>
              <p class="mt-1 text-base text-gray-700 border-b-2 border-gray-300">Số điện thoại: {{ product.phone }}</p>
              <p class="mt-1 text-base text-gray-700 border-b-2 border-gray-300">Ngày sinh: {{ product.dob }}</p>
            </div>
            <div class="flex justify-around mt-4">
              <button class="p-2 border-2 border-gray-400 rounded-full" @click="openConfirmDeleteModal(product)"><i
                  class="fa-solid fa-trash text-xl w-6"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
              <p>Bạn có chắc chắc muốn xóa đọc giả này?</p>
              <div class="flex justify-end space-x-2">
                <button type="button" class="px-4 py-2 bg-red-600 text-white rounded-md"
                  @click="deleteProduct">Delete</button>
                <button type="button" class="px-4 py-2 bg-gray-200 rounded-md"
                  @click="closeConfirmDeleteModal">Cancel</button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
