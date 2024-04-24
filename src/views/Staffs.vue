<script setup>
import { ref, watchEffect } from 'vue';
import StaffService from '@/services/staffs.service';
import { Dialog, DialogOverlay, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { message } from 'antd';

const products = ref([]);
const showModal = ref(false);
const confirmDeleteModal = ref(false);
const isEditing = ref(false);
const selectedProduct = ref(null);

watchEffect(async () => {
  const allProducts = await StaffService.getAll();
  products.value = allProducts.data.map(product => ({
    id: product._id,
    username: product.username,
    fullName: product.fullName,
    position: product.position,
    address: product.address,
    password: product.password,
    phone: product.phone,
  }));
});

const openModal = (product) => {
  selectedProduct.value = { ...product };
  isEditing.value = true;
  showModal.value = true;
};

const openAddModal = () => {
  selectedProduct.value = { username: '', fullName: '', position: '', address: '', password: '', phone: '' };
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
    const res = await StaffService.update(selectedProduct.value.id, selectedProduct.value);
    if (res.isSuccess == true) {

      const allProducts = await StaffService.getAll();
      products.value = allProducts.data.map(product => ({
        id: product._id,
        username: product.username,
        fullName: product.fullName,
        position: product.position,
        address: product.address,
        password: product.password,
        phone: product.phone,
      }));
      message.success(res.message)
      closeModal();
    } else {
      message.error(res.message)
    }
  } else {
    const res = await StaffService.signUp(selectedProduct.value);
    console.log(res)
    if (res.newUser.isSuccess == true) {
      const allProducts = await StaffService.getAll();
      products.value = allProducts.data.map(product => ({
        id: product._id,
        username: product.username,
        fullName: product.fullName,
        position: product.position,
        address: product.address,
        password: product.password,
        phone: product.phone,
      }));
      message.success(res.newUser.message)
      closeModal();
    } else {
      message.error(res.newUser.message)
    }
  }
  // Refresh the product list

};

const deleteProduct = async () => {
  await StaffService.delete(selectedProduct.value.id);
  // Refresh the product list
  const allProducts = await StaffService.getAll();
  products.value = allProducts.data.map(product => ({
    id: product._id,
    username: product.username,
    fullName: product.fullName,
    position: product.position,
    address: product.address,
    password: product.password,
    phone: product.phone,
  }));
  message.success("Delele successfully!")
  closeConfirmDeleteModal();
};
</script>

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
          class="group relative w-11/12 h-96 mx-auto bg-gray-200 p-6 rounded-2xl border border-gray-300 shadow-gray-400 shadow-xl">
          <div class="mt-4 text-left">
            <div>
              <h3 class="text-sm text-gray-500 text-center ">
                <span class="mt-1 text-xl font-semibold border-b-2 border-black text-gray-900">Tên người dùng: {{
                  product.username
                }}</span>
              </h3>
              <p class="mt-3 text-base text-gray-700 border-b-2 border-gray-300">Họ và tên: {{ product.fullName }}</p>
              <p class="mt-1 text-l font-semibold text-gray-900 italic border-b-2 border-gray-300">Chức vụ: {{
                product.position }}</p>
              <p class="mt-1 text-base text-gray-700 border-b-2 border-gray-300">Địa chỉ: {{ product.address }}</p>
              <p class="mt-3 text-base text-gray-700 border-b-2 border-gray-300">Mật khẩu: {{ product.password }}</p>
              <p class="mt-1 text-base text-gray-700 border-b-2 border-gray-300">Số điện thoại: {{ product.phone }}</p>
            </div>
            <div class="flex justify-around mt-4 absolute bottom-5 inset-x-0">
              <button class="p-3 mr-8" @click="openModal(product)"><i class="fa-solid fa-pen text-2xl w-6"></i></button>
              <button class="p-3 ml-8" @click="openConfirmDeleteModal(product)"><i
                  class="fa-solid fa-xmark text-2xl w-6"></i></button>
            </div>
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
                <label for="name" class="block text-sm font-medium text-gray-700">Họ và tên: </label>
                <input id="name" type="text" v-model="selectedProduct.fullName"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Tên người dùng: </label>
                <input id="name" type="text" v-model="selectedProduct.username"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Chức vụ: </label>
                <input id="address" type="text" v-model="selectedProduct.position"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Địa chỉ: </label>
                <input id="address" type="text" v-model="selectedProduct.address"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Mật khẩu: </label>
                <input id="address" type="text" v-model="selectedProduct.password"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Số điện thoại: </label>
                <input id="address" type="text" v-model="selectedProduct.phone"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-md"
                  @click="saveProduct">Lưu</button>
                <button type="button" class="px-4 py-2 bg-gray-200 rounded-md" @click="closeModal">Hủy</button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Confirm Delete Modal -->
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
              <p>Bạn có chắc chắn muốn xóa nhân viên này?</p>
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
