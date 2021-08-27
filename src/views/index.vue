<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>目录</span>
                <el-button class="button" @click="state.show.createDir=true">添加</el-button>
            </div>
        </template>
        <el-table border size="mini" :data="state.dirList">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column label="操作" v-slot={$index}>
                <el-button type="danger" @click="onDelete($index)">删除</el-button>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog title="添加目录" v-model="state.show.createDir">
        <el-form :model="state.form.createDir">
            <el-form-item label="名称">
                <el-input v-model="state.form.createDir.name"></el-input>
            </el-form-item>
            <el-button type="primary" @click="onCreateDir">确 定</el-button>
        </el-form>
    </el-dialog>

</template>

<script setup>
    const {ipcRenderer} = require('electron')
    import {reactive, onMounted} from 'vue'

    const state = reactive({
        dirList: [],
        form: {createDir: {name: ""}},
        show: {createDir: false}
    })

    onMounted(() => {
        ipcRenderer.send("get-value", {name: 'dir'})
        ipcRenderer.on('reply-value', (event, data) => {
            state.dirList = data.value['dir'] || []
        })
    })

    const onCreateDir = () => {
        const value = {
            name: state.form.createDir.name
        }
        ipcRenderer.send("unshift-value", {name: 'dir', value})
        ipcRenderer.send("get-value", {name: 'dir'})
        state.show.createDir = false
    }

    const onDelete = (index) => {
        state.dirList.splice(index, 1)
        ipcRenderer.send("splice-value", {name: 'dir', value: index})
    }
</script>

<style scoped>
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>