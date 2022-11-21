<template>
    欢迎你，管理员{{ username}}
</template>

<script setup>
import { ref ,onMounted} from 'vue'
import { useRoute } from 'vue-router';
const route=useRoute()

const  username = ref('')


const initInfo = () => {
    username.value= route.query.username
    console.log(route.query.username);
}

onMounted(() => {
    initInfo()
})
</script>