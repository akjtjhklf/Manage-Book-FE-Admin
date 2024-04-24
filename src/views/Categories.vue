<script setup>
import { ref, onMounted, watchEffect, defineEmits, watch, nextTick } from 'vue';
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/vue/20/solid'
import { useStore } from 'vuex';
const store = useStore();
watchEffect(async () => {
    await store.dispatch('fetchUser');
});
const signOut = () => {
    store.dispatch('signOut');
    router.push("/")
}
const showInfo = ref("books");
const mobileFiltersOpen = ref(false)
</script>

<template>
    <main class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
        <section aria-labelledby="products-heading" class="pb-24 pt-6">
            <div class="flex items-baseline justify-between border-b-2 border-gray-200 py-6 px-16">
                <form class="py-16 sm:py-2 my-auto border-black border px-3 rounded-full text-lg">
                    <select v-model="showInfo"
                        class="block w-full h-full pl-3 pr-10 py-2 lg:text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="books" class="text-lg">Quản lý sách</option>
                        <option value="readers" class="text-lg">Quản lý đọc giả</option>
                        <option value="staffs" class="text-lg">Quản lý nhân viên</option>
                        <option value="publishers" class="text-lg">Quản lý nhà xuất bản, tác giả</option>
                        <option value="tracks" class="text-lg">Quản lý sách được mượn</option>
                    </select>
                </form>
                <div class="flex flex-row border border-black p-3 rounded-full">
                    <h3 v-if="store.state.user != null" class="text-lg tracking-tight text-gray-900 mx-4 my-auto">
                        Tên: {{
                            store.state.user.data.fullName }}</h3>
                    <h3 v-if="store.state.user != null" class="text-lg tracking-tight text-gray-900 mx-4 my-auto">
                        Chức vụ: {{ store.state.user.data.position }}</h3>
                    <div class="text-center ">
                        <button
                            class="p-3 border-2 border-gray-400 rounded-full text-lg hover:border-gray-400 ease-in-out duration-200 active:p-2 mx-4 my-auto" 
                            @click="signOut">Đăng xuất</button>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                <div class="lg:col-span-5">
                    <Books v-if="showInfo === 'books'" />
                    <Staffs v-if="showInfo === 'staffs'" />
                    <Readers v-if="showInfo === 'readers'" />
                    <Publishers v-if="showInfo === 'publishers'" />
                    <Tracks v-if="showInfo === 'tracks'" />
                </div>
            </div>
        </section>
    </main>
</template>
<script>
import Books from '@/views/Books.vue';
import Staffs from '@/views/Staffs.vue';
import Readers from '@/views/Readers.vue';
import Publishers from '@/views/Publishers.vue';
import Tracks from '@/views/Tracks.vue';
import router from '@/router';
</script>