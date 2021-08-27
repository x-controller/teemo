<template>
    <router-view v-slot="{ Component }">
        <component :is="Component"/>
    </router-view>
</template>

<script setup>
  import {reactive} from 'vue'
  import {useRouter} from 'vue-router'
</script>

<style>
</style>
