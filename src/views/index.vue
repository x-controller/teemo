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
    import helper from '../helper'
    import {ethers} from 'ethers'

    const {ipcRenderer} = require('electron')
    import {reactive, ref, onMounted} from 'vue'

    let hecoProvider = ref({})

    const state = reactive({
        mdexRouterContract: {},
        dirList: [],
        form: {createDir: {name: ""}},
        show: {createDir: false},
        mdexRouterAddress: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
        hecoRpc: "https://http-mainnet.hecochain.com",
        hecoMdexFactoryAbi: require('../abi/mdex-factory.json'),
        hecoMdexRouterAbi: require('../abi/mdex-router.json'),
        hecoMdexHTSunAddress: "0xca1539b060a6663915c983ac14d2e52b7c0e8360",
        hecoWHT: "0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f"
    })


    // 同步mdex交易所的所有交易对
    const factoryPairs = async () => {
        const factoryAddress = await state.mdexRouterContract.factory()
        const factoryContract = new ethers.Contract(factoryAddress, state.hecoMdexFactoryAbi, hecoProvider)
        // const amount = await factoryContract.getAmountsOut(ethers.utils.parseUnits("50000000", 9), [state.hecoMdexHTSunAddress, state.hecoWHT])
        // console.log(ethers.utils.formatEther(amount[1]))
        // console.log(ethers.utils.formatUnits(amount[0], 9))
        let pairNum = await factoryContract.allPairsLength()
        pairNum = pairNum.toString() * 1
        for (let i = 0; i <= pairNum; i++) {
            const pair = await factoryContract.allPairs(i)
            await helper.baseFetchPost("home/mdex-pair-save", {
                index: i,
                address: pair
            })
            console.log(i, pair)
        }
    }

    const mdexGetAmountsOut = async () => {
        const amount = await state.mdexRouterContract.getAmountsOut(ethers.utils.parseUnits("50000000", 9), [state.hecoMdexHTSunAddress, state.hecoWHT])
        console.log(ethers.utils.formatEther(amount[1]))
        console.log(ethers.utils.formatUnits(amount[0], 9))
    }

    onMounted(async () => {

    })

    // 初始化mdex路由合约
    const initMdexContract = ()=>{
        hecoProvider = new ethers.providers.JsonRpcProvider("https://http-mainnet.hecochain.com")
        state.mdexRouterContract = new ethers.Contract(state.mdexRouterAddress, state.hecoMdexRouterAbi, hecoProvider)
    }

    // 测试设置与获取数据
    const testValueSetGet = ()=>{
        ipcRenderer.send("get-value", {name: 'dir'})
        ipcRenderer.on('reply-value', (event, data) => {
            state.dirList = data.value['dir'] || []
        })
    }

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